import { publishEvent, subscribeState, unsubscribeState } from "../ch5-core";
import _ from 'lodash';
import { CommonEventRequest, CommonRequestForPopup, CommonRequestPropName, ErrorResponseObject, GetMenuRequest, GetMenuResponse, GetObjectsRequest, GetObjectsResponse, GetPropertiesSupportedRequest, GetPropertiesSupportedResponse, MyMpObject, Params, RegisterwithDeviceRequest } from "./commonInterface";
import { encodeString } from "./ch5-media-player-common";
import { TCH5NowPlayingActions } from "./interfaces/t-ch5-media-player";
import { Ch5CommonLog } from "../ch5-common/ch5-common-log";
// import { isSafariMobile } from "../ch5-core/utility-functions/is-safari-mobile";

export class MusicPlayerLib {

    // Serial signals to the control system.
    private mpSigRPCOut: string = "";
    private mpRPCDataIn: string = '';
    private itemValue: number = 1; // Used in infinite scroll feature.
    private resendRegistrationTimeId: any = '';
    private tempResponse: any = "";
    private ignoreFirstData: boolean = false;// ignore first chunked data before register request sent

    private subReceiveStateRefreshMediaPlayerResp: any;
    private subreceiveStateDeviceOfflineResp: any;
    private subreceiveStateCRPCResp: any;
    private subreceiveStateMessageResp: any;
    private subsendEventCRPCJoinNo: any;

    // Generate a constant UUID once per application start.
    private generateStrongCustomId = (): string => {
        // Generate timestamp component (base36 for compactness)
        const timestamp = Date.now().toString(36);

        // Generate random component (4 groups of 8 hex digits)
        const random = Array.from({ length: 4 }, () =>
            Math.floor(Math.random() * 0xffffffff)
                .toString(16)
                .padStart(8, '0'),
        ).join('-');

        return `${timestamp}-${random}`;
    };

    private myMP: MyMpObject = {
        "tag": "",
        "source": 0,
        "connectionActive": false,
        "RegistrationId": 0,
        "ObjectsId": 0,
        "PropertiesSupportedId": 0,
        "MenuId": 0,
        "TitleMenuId": 0,
        "TitleId": 0,
        "ItemDataId": 0,
        "PlayId": 0,
        "PauseId": 0,
        "SeekId": 0,
        "instanceName": '',
        "menuInstanceName": '',
    };
    private nowPlayingPublishData: any = {};
    private myMusicPublishData: any = {};
    private progressBarPublishData: any = {};
    private menuListPublishData: any = { 'MenuData': [] };
    public maxReqItems = 40;
    private isItemCountNew = true;
    public lastPerformedAction: TCH5NowPlayingActions | null = null;

    private nowPlayingData: any = {
        'ActionsSupported': '', 'ActionsAvailable': '', 'RewindSpeed': '',
        'FfwdSpeed': '', 'ProviderName': '', 'PlayerState': '', 'PlayerIcon': '', 'PlayerIconURL': '', 'PlayerName': '',
        'Album': '', 'AlbumArt': '', 'AlbumArtUrl': '', 'AlbumArtUrlNAT': '', 'StationName': '', 'Genre': '', 'Artist': '',
        'Title': '', 'TrackNum': '', 'TrackCnt': '', 'NextTitle': '', 'ShuffleState': '', 'RepeatState': '', 'Rating': {}
    };

    private progressBarData: any = { 'StreamState': '', 'ProgressBar': '', 'ElapsedSec': '', 'TrackSec': '' };

    private myMusicData: any = { 'Title': '', 'Subtitle': '', 'ListSpecificFunctions': '', 'ItemCnt': 0, 'MaxReqItems': '', 'IsMenuAvailable': '' };

    private menuListData: any = { 'MenuData': [] };

    constructor(public logger: Ch5CommonLog) { }

    public subscribeLibrarySignals() {

        this.ignoreFirstData = false;// first time set to false, to ignore first data
        this.subReceiveStateRefreshMediaPlayerResp = subscribeState('b', 'receiveStateRefreshMediaPlayerResp', (value: any) => {
            if (value) {
                this.refreshMediaPlayer();
            }
        });

        this.subreceiveStateDeviceOfflineResp = subscribeState('b', 'receiveStateDeviceOfflineResp', (value: any) => {
            this.myMP.connectionActive = !value;
            const data = { 'userInputRequired': "", "text": "No Communication. Please check power and connection.", "textForItems": [], "initialUserInput": "", "timeoutSec": 10000, "show": true }
            if (value) {
                this.unregisterWithDevice(true);
            } else {
                data.text = "";
                data.show = false;
                if (this.myMP.source && this.myMP.tag) {
                    this.registerWithDevice();
                }
            }
            publishEvent('o', 'PopUpMessageData', data);
        });

        this.subreceiveStateCRPCResp = subscribeState('s', 'receiveStateCRPCResp', (value: any) => {
            // On an update request, the control system will send that last serial data on the join, which
            // may be a partial message. We need to ignore that data.
            if ((value.length > 0) && !_.isEqual(this.tempResponse, value) && this.ignoreFirstData) {
                console.log('CRPC IN->', value);
                this.tempResponse = value;
                const mpRPCPrefix = value.substring(0, 8).trim(); // First 8 bytes is the RPC prefix.
                // Check byte 3 to determine if this is a single or partial message.
                // c = partial message
                // e = single or final message when a partial message was received.
                if (mpRPCPrefix[3] === 'c') {
                    this.mpRPCDataIn = this.mpRPCDataIn + value.substring(8); // Gather the CRPC data.
                    // console.log('Found c in prefix.');
                } else if (mpRPCPrefix[3] === 'e') {
                    // console.log('Found e in prefix.');
                    if (this.mpRPCDataIn.trim() === '') {
                        this.mpRPCDataIn = value.substring(8); // Gather the CRPC data.
                    } else {
                        this.mpRPCDataIn = this.mpRPCDataIn + value.substring(8); // Gather the CRPC data.
                    }
                    this.tempResponse = '';

                    // check error
                    let parsedData: any = '';
                    try {
                        parsedData = JSON.parse(this.mpRPCDataIn);
                        if (parsedData.error) {
                            //console.info('handle Error >', parsedData.error);
                            this.handleError(parsedData.error);
                        } else {
                            this.processCRPCResponse(parsedData); // Process the entire payload then clear the var.
                        }

                    } catch (e) {
                        this.logger.log("e", e);
                    }

                    this.mpRPCDataIn = ''; // Clear the var now that we have the entire message.
                }
            }
        });

        //receiveStateMessageResp from CS (ver tag src)
        this.subreceiveStateMessageResp = subscribeState('s', 'receiveStateMessageResp', (value: any) => {
            if (value.length > 0) {
                this.processMessage(value);
            }
        });

        //To get join name from the component
        this.subsendEventCRPCJoinNo = subscribeState('s', 'sendEventCRPCJoinNo', (value: any) => {
            this.mpSigRPCOut = value;
        });
    }

    // Refresh the media player.
    // This function will handle all aspects of refreshing the Media Player connection and will be called from
    // a couple of places.
    // 1. Unsuscribe from the existing device.
    // 2. Register with the new device as long as we have tag and src values from the message and the device is online.
    // 3. After the registration response, check the direct connect information to see if we can re-use our existing
    // direct-connection or we need to close the connection and open a new one.
    // 4. Need to continually register until a valid response as long as the device is still online.
    private refreshMediaPlayer() {
        // Do we have an active connection and need to unregister?
        if (this.myMP.connectionActive) {
            this.unregisterWithDevice();
        }
        // Register with the new device. ToDo: Add checks for online & tag values.
        if (this.myMP.tag && this.myMP.connectionActive) {
            this.registerWithDevice();
        }
    }

    private generateUniqueMessageId(): number {
        const timePart = new Date().getTime().toString().slice(-3); // Last 3 digits of timestamp
        const randomPart = Math.floor(Math.random() * 100).toString().padStart(3, '0'); // 3-digit random number
        return Number(`${timePart}${randomPart}`); // 6-digit number
    }

    // This function generates the RPC prefix for join-based CRPC communication.
    // Note: This prefix is NOT needed for direct communication with the device.
    // The prefix is an 8-byte ASCII prefix.
    // Byte 0: Version. Fixed at 2
    // Byte 1: Tag High Nibble
    // Byte 2: Tag Low Nibble
    // Byte 3: Continuation Flag if the message is > 1,000 bytes and needs to be broken up. c = multiple messages, e = single message
    // Byte 4: JSON payload length nibble 3
    // Byte 5: JSON payload length nibble 2
    // Byte 6: JSON payload length nibble 1
    // Byte 7: JSON payload length nibble 0 
    private generateRPCPrefixForFinalMessage(str: any) {
        const myPrefix = '2' + this.myMP.tag + 'e' + this.getStringLengthInHexFixed(str);
        return myPrefix;
    }
    private generateRPCPrefixForPartialMessage(str: any) {
        const myPrefix = '2' + this.myMP.tag + 'c' + this.getStringLengthInHexFixed(str);
        return myPrefix;
    }

    // Get the CRPC JSON payload length in hex as a 4-byte string.
    private getStringLengthInHexFixed(str: any) {
        const hexLength = str.length.toString(16);
        return hexLength.padStart(4, '0');
    }

    private startRegistrationResendTimer() {
        this.resendRegistrationTimeId = setInterval(() => {
            this.registerWithDevice();
        }, 10000);
    }

    // Process message data from the control system.
    // Note: On an update request from the control system, the last data to be sent
    // will be the message string.
    private processMessage(data: any) {
        const myObj = JSON.parse(data);
        if (myObj.hasOwnProperty("tag")) {
            // ToDo: Need to check if the tag matches in case the device
            // is sending us the wrong data. The dealer could have the router
            // module in SIMPL incorrectly configured.
            this.myMP.tag = myObj.tag;
        }

        if (myObj.hasOwnProperty("src")) {
            // If this is a different source, we need to refresh the media player.
            // This will also happen on an update request since no source value has been set yet.
            if (this.myMP.source != myObj.src) {
                this.refreshMediaPlayer();
            }
            this.myMP.source = myObj.src;
        }
    }

    private processGetObjectsResponse(getObjectResponse: GetObjectsResponse) {
        const myInstances = getObjectResponse.result.objects.object;
        myInstances.forEach((item: any) => {
            if (item.name === 'MediaPlayer') {
                this.myMP.instanceName = item.instancename
            }
            else if (item.name === 'MediaPlayerMenu') {
                this.myMP.menuInstanceName = item.instancename;
            }
        });

        this.registerEvent();
        this.getPropertiesSupported(this.myMP.instanceName);
        this.getMenu(this.myMP.instanceName);
        ['BusyChanged', 'StatusMsgChanged', 'StateChangedByBrowseContext', 'StateChanged'].forEach((item: any) => {
            const myRPC: CommonEventRequest = {
                params: { "ev": item, "handle": "sg" },
                jsonrpc: '2.0',
                id: this.generateUniqueMessageId(),
                method: this.myMP.instanceName + '.RegisterEvent'
            };
            this.myMP[item + 'Id'] = myRPC.id; // Keep track of the message id.
            if (this.myMP.instanceName) {
                this.sendRPCRequest(JSON.stringify(myRPC)); // Send the message.
            }
        });
    }

    private processPropertiesSupportedResponse(getPropertiesSupportedResponse: GetPropertiesSupportedResponse) {
        const properties = getPropertiesSupportedResponse.result.PropertiesSupported;
        properties.forEach((item: any) => {
            if (item !== 'PropertiesSupported') { // in response geetting one of item as "PropertiesSupported", to avoid loop adding this condtion
                const myRPC: CommonRequestPropName = {
                    params: { "propName": item },
                    jsonrpc: '2.0',
                    id: this.generateUniqueMessageId(),
                    method: this.myMP.instanceName + '.GetProperty'
                };
                this.myMP[item + "Id"] = myRPC.id; // Keep track of the message id.
                if (this.myMP.instanceName) {
                    this.sendRPCRequest(JSON.stringify(myRPC));// Send the message.
                }
            }
        });
    }

    private processMenuResponse(getMenuResponse: GetMenuResponse) {
        this.myMP.menuInstanceName = getMenuResponse.result.instanceName;

        ['Reset', 'BusyChanged', 'ClearChanged', 'ListChanged', 'StateChanged', 'StatusMsgMenuChanged'].forEach((item: any) => {
            const myRPC: CommonEventRequest = {
                params: { "ev": item, "handle": "sg" },
                jsonrpc: '2.0',
                id: this.generateUniqueMessageId(),
                method: this.myMP.menuInstanceName + '.RegisterEvent'
            };
            if (item === 'Reset') {
                myRPC.params = null;
                myRPC.method = this.myMP.menuInstanceName + '.Reset'
            };

            if (this.myMP.menuInstanceName) {
                this.sendRPCRequest(JSON.stringify(myRPC));
            }
        });

        ['Version', 'MaxReqItems', 'Level', 'ItemCnt', 'Title', 'Subtitle', 'ListSpecificFunctions', 'IsMenuAvailable', 'StatusMsgMenu', 'Instance'].forEach((item: any) => {
            const myRPC: CommonRequestPropName = {
                params: { "propName": item },
                jsonrpc: '2.0',
                id: this.generateUniqueMessageId(),
                method: this.myMP.menuInstanceName + '.GetProperty'
            };
            if (item === 'Title') {
                this.myMP[item + 'MenuId'] = myRPC.id;// Keep track of the message id.
            }
            if (this.myMP.menuInstanceName) {
                this.sendRPCRequest(JSON.stringify(myRPC));
            }
        });
    }

    private unregisterWithDevice(deviceOffLine: boolean = false) {
        // We need to unregister with both the Media Player instance
        // as well as the Media player Menu instance.

        if (this.myMP.instanceName && this.myMP.menuInstanceName) {
            ['BusyChanged', 'StatusMsgChanged', 'StateChangedByBrowseContext', 'StateChanged'].forEach((item: any) => {
                const myRPC: CommonEventRequest = {
                    params: { "ev": item, "handle": "sg" },
                    jsonrpc: '2.0',
                    id: this.generateUniqueMessageId(),
                    method: this.myMP.instanceName + '.DeregisterEvent'

                };
                this.sendRPCRequest(JSON.stringify(myRPC));
            });
            ['BusyChanged', 'ClearChanged', 'ListChanged', 'StateChanged', 'StatusMsgMenuChanged'].forEach((item: any) => {
                const myRPC: CommonEventRequest = {
                    params: { "ev": item, "handle": "sg" },
                    jsonrpc: '2.0',
                    id: this.generateUniqueMessageId(),
                    method: this.myMP.menuInstanceName + '.DeregisterEvent'

                };
                this.sendRPCRequest(JSON.stringify(myRPC));
            });

            this.myMusicPublishData = {};
            this.nowPlayingPublishData = {};
            this.progressBarPublishData = {};
            this.menuListPublishData = {};
            this.resendRegistrationTimeId = "";
            this.itemValue = 1;

            publishEvent('o', 'myMusicData', this.myMusicPublishData);
            publishEvent('o', 'nowPlayingData', this.nowPlayingPublishData);
            publishEvent('o', 'progressBarData', this.progressBarPublishData);
            publishEvent('o', 'menuListData', this.menuListPublishData);
            this.resetMp(deviceOffLine);
        }
    }

    // Register with a media player device.
    // 1. The initial registration is always via serial join.
    // 2. As long as the device is still online, registration must continue to happen until successful registration.
    //    Note: Retry every 30 seconds for 5 min. Then once per minute.
    // 3. After successful registrcion via serial join, check if a direct connection to teh device can be made.
    private registerWithDevice() {
        // Params for registration
        const myRPCParams: Params = {
            encoding: 'UTF-8',
            uuid: this.generateStrongCustomId(),
            ver: '2.0',
            maxPacketSize: 65535,
            type: 'symbol/json-rpc',
            format: 'JSON',
            name: 'CH5_v2.15', // ToDo: This should be dynamic based on the CH5 version.
            jsonrpc: '2.0'
        };

        const myRPC: RegisterwithDeviceRequest = {
            jsonrpc: '2.0',
            id: this.generateUniqueMessageId(),
            method: 'Crpc.Register',
            params: myRPCParams
        };

        this.myMP.RegistrationId = myRPC.id; // Keep track of the message id.
        this.ignoreFirstData = true;
        this.sendRPCRequest(JSON.stringify(myRPC));
        // Start the re-send time.
        if (!this.resendRegistrationTimeId) {
            this.startRegistrationResendTimer();
        }
    }

    // Get all of the media player objects from the device.
    // This is called after a successful registration with the device.
    private getObjects() {
        const myRPC: GetObjectsRequest = {
            jsonrpc: '2.0',
            id: this.generateUniqueMessageId(),
            method: 'Crpc.GetObjects'
        };
        this.myMP.ObjectsId = myRPC.id;// Keep track of the message id.
        this.sendRPCRequest(JSON.stringify(myRPC));// Send the message.
    }

    private registerEvent() {
        const myRPC: CommonEventRequest = {
            jsonrpc: '2.0',
            id: this.generateUniqueMessageId(),
            method: 'Crpc.RegisterEvent',
            params: { "ev": "ObjectDirectoryChanged", "handle": "sg" },
        };
        this.sendRPCRequest(JSON.stringify(myRPC)); // Send the message.
    }
    private getPropertiesSupported(instanceName: string) {
        const myRPC: GetPropertiesSupportedRequest = {
            params: { "propName": "PropertiesSupported" },
            jsonrpc: '2.0',
            id: this.generateUniqueMessageId(),
            method: instanceName + '.GetProperty'
        };
        this.myMP.PropertiesSupportedId = myRPC.id;// Keep track of the message id.
        this.sendRPCRequest(JSON.stringify(myRPC));
    }

    //Get the Menu (Should check an Autonomic device and see what data is returned) 
    private getMenu(instanceName: string) {
        const myRPC: GetMenuRequest = {
            params: { "uuid": this.generateStrongCustomId() },
            jsonrpc: '2.0',
            id: this.generateUniqueMessageId(),
            method: instanceName + '.GetMenu'
        };
        this.myMP.MenuId = myRPC.id;// Keep track of the message id.
        if (instanceName) {
            this.sendRPCRequest(JSON.stringify(myRPC));
        }
    }

    public getItemData(infiniteScroll = false) {
        if (!infiniteScroll) {
            this.itemValue = 1;
            this.menuListData['MenuData'] = [];
        }

        let itemCount = this.myMusicData['ItemCnt'];
        const count = (itemCount < this.maxReqItems) ? itemCount : this.maxReqItems;
        itemCount = itemCount - count;

        if (count > 0) {
            const myRPC: any = {
                params: { item: this.itemValue, count },
                jsonrpc: '2.0',
                id: this.generateUniqueMessageId(),
                method: this.myMP.menuInstanceName + '.GetData'
            };
            this.myMP.ItemDataId = myRPC.id; // Keep track of the message id.
            if (this.myMP.menuInstanceName) {
                this.sendRPCRequest(JSON.stringify(myRPC));
            }
            this.itemValue = this.itemValue + this.maxReqItems;
        } else { // whenever itemcount is 0, no need to do Api request, pass empty data. Same as VTpro
            this.menuListData['MenuData'] = [];
            this.menuListPublishData = { ...this.menuListData };
            publishEvent('o', 'menuListData', this.menuListPublishData);
        }
    }

    private sendRPCRequest(data: any) {
        let myPrefix = '';
        let requestedData = '';
        const numberOfChar = 100;

        /*  if (isSafariMobile()) {// for crestron one
             myPrefix = this.generateRPCPrefixForFinalMessage(data);
             requestedData = myPrefix + data;
             if (this.mpSigRPCOut) {
                 console.log('CRPC send join: ' + this.mpSigRPCOut + " " + requestedData);
                 publishEvent('s', this.mpSigRPCOut, requestedData);
             }
         } else { */
        // Add prefix if the connection is not direct.

        const chuncknCount = Math.ceil(data.length / numberOfChar);
        for (let i = 0; i < chuncknCount; i++) {
            if (i === (chuncknCount - 1)) {
                requestedData = data.substring(numberOfChar * i);
                myPrefix = this.generateRPCPrefixForFinalMessage(requestedData);
                requestedData = myPrefix + requestedData;
            } else {
                requestedData = data.substring((numberOfChar * i), (numberOfChar * i) + numberOfChar);
                myPrefix = this.generateRPCPrefixForPartialMessage(requestedData);
                requestedData = myPrefix + requestedData;
            }
            if (this.mpSigRPCOut) {
                this.logger.log('CRPC send join:' + this.mpSigRPCOut + " " + requestedData);
                publishEvent('s', this.mpSigRPCOut, requestedData);
            }
        }
    }

    // Process CRPC data from the control system.
    private processCRPCResponse(data: any) {
        const responseData = data;
        // Get the messge id.
        // This can be used to determine if a valid response was received
        // for a specific API call we just made.
        const myMsgId = responseData.id;
        let busyChanged: any = {};
        const playerInstanceMethod = this.myMP?.instanceName + '.Event'; // mediaplayer instance method event
        const menuInstanceMethod = this.myMP?.menuInstanceName + '.Event'; // mediaplayermenu instance method event

        if ((playerInstanceMethod === responseData.method || menuInstanceMethod === responseData.method)
            && responseData.params.ev === 'BusyChanged' && responseData.params?.parameters) {// Busychanged event
            busyChanged = { 'timeoutSec': responseData.params?.parameters?.timeoutSec, 'on': responseData.params?.parameters?.on };
            if (!this.lastPerformedAction) {
                publishEvent('o', 'busyChanged', busyChanged);
            }
        } else if (playerInstanceMethod === responseData.method && responseData.params.ev === 'StateChanged' && responseData.params?.parameters) { // Now music statechanged 
            for (const item in responseData.params.parameters) {
                if (item === 'ElapsedSec' || item === 'TrackSec' || item === 'StreamState' || item === 'ProgressBar') {
                    this.progressBarData[item] = responseData.params?.parameters[item];
                } else {
                    this.nowPlayingData[item] = responseData.params?.parameters[item];
                }
            }
        } else if (menuInstanceMethod === responseData.method && responseData.params.ev === 'StateChanged' && responseData.params?.parameters) { // My music  statechanged 
            // Added a title check to handle multiple instance scenario. In the current instance the isItemCountNew value will be false, when there is any action in other instance, we need to get the updated menudata
            if (responseData.params?.parameters.hasOwnProperty('Title') && (this.isItemCountNew || responseData.params?.parameters['Title'] !== this.myMusicData['Title'])) {
                this.isItemCountNew = false;
                this.myMusicData['ItemCnt'] = responseData.params?.parameters['ItemCnt'];
                this.updatedMenuData(); // we need to call only when statechanged event has parameters object include key has Title
            }
            for (const item in responseData.params?.parameters) {
                if (this.myMusicData.hasOwnProperty(item)) {
                    this.myMusicData[item] = responseData.params?.parameters[item];
                }
            }
        } else if ((playerInstanceMethod === responseData.method || menuInstanceMethod === responseData.method) &&
            (responseData?.params?.ev === 'StatusMsgMenuChanged' || responseData?.params?.ev === 'StatusMsgChanged') &&
            responseData.params?.parameters) { // My music and Now Playing  Popup data
            publishEvent('o', 'PopUpMessageData', responseData.params?.parameters ? responseData.params.parameters : {});
        } else if (myMsgId === this.myMP.PlayId || myMsgId === this.myMP.PauseId || myMsgId === this.myMP.SeekId) { // Play or pause clicked
            this.callTrackTime();
        } else {
            if (myMsgId == this.myMP.RegistrationId) {
                // When we perform the CS to Nax registration, the response data will contain Nax-related information, including IP, IP subnet, name, and other details, which we may use in the future if required.
                clearInterval(this.resendRegistrationTimeId);
                this.myMP.connectionActive = true;
                // While objects are being returned, switch the connection to direct (if possible).
                this.getObjects();
            } else if (myMsgId == this.myMP.ObjectsId) {
                this.processGetObjectsResponse(responseData);
            } else if (myMsgId == this.myMP.PropertiesSupportedId) {
                this.processPropertiesSupportedResponse(responseData);
            } else if (myMsgId == this.myMP.MenuId) {
                this.processMenuResponse(responseData);
            } else if (myMsgId === this.myMP.ItemDataId) {
                this.myMP.ItemDataId = 0;
                this.menuListData['MenuData'] = [...this.menuListData['MenuData'], ...responseData.result];
                if (!(busyChanged && busyChanged['on'] === true)) {
                    if (!_.isEqual(this.menuListPublishData, this.menuListData)) {
                        this.menuListPublishData = { ...this.menuListData };
                        publishEvent('o', 'menuListData', this.menuListPublishData);
                    }
                }
            } else if (responseData.result && Object.keys(responseData.result)?.length === 1) {
                const responseValue = Object.values(responseData.result)[0];
                const responseKey = Object.keys(responseData.result)[0];
                if (myMsgId === this.myMP.TitleMenuId) { // we have two titles, to get only the menu instance title we have this condition
                    this.myMP.TitleMenuId = 0;
                    this.myMusicData[responseKey] = responseValue;
                } else if (myMsgId === this.myMP.TitleId) { // we have two titles, to get only the player instance title we have this condition
                    this.myMP.TitleId = 0;
                    this.nowPlayingData[responseKey] = responseValue;
                } else if ((responseKey !== "Title") && (this.nowPlayingData.hasOwnProperty(responseKey))) {
                    this.nowPlayingData[responseKey] = responseValue;
                } else if (this.progressBarData.hasOwnProperty(responseKey)) {
                    this.progressBarData[responseKey] = responseValue;
                } else if ((responseKey !== "Title") && this.myMusicData.hasOwnProperty(responseKey)) {
                    this.myMusicData[responseKey] = responseValue;
                    if (responseKey === 'ItemCnt') {
                        this.isItemCountNew = true; // when we receive a new value in itemcnt we need to trigger the getItemData, so setting this flag as true
                        this.getItemData();
                    }
                }
            }
        }
        // Publishing response data to the respective components
        if (!(busyChanged && busyChanged['on'] === true)) {
            // TODO: remove isEqual if not required
            if (!_.isEqual(this.nowPlayingPublishData, this.nowPlayingData)) {
                this.nowPlayingPublishData = { ...this.nowPlayingData };
                publishEvent('o', 'nowPlayingData', this.nowPlayingPublishData); // left section
            }
            if (!_.isEqual(this.myMusicPublishData, this.myMusicData)) {
                this.myMusicPublishData = { ...this.myMusicData };
                publishEvent('o', 'myMusicData', this.myMusicPublishData); // right section
            }
            if (!_.isEqual(this.progressBarPublishData, this.progressBarData)) {
                this.progressBarPublishData = { ...this.progressBarData };
                publishEvent('o', 'progressBarData', this.progressBarPublishData);
            }
        }
    }

    // error-handler.ts
    private handleError(error: ErrorResponseObject) {
        this.logger.error('Error Code:----  ', error.code);
        this.logger.error('Error message:----  ', error.message);
        this.logger.error('Error Data:----  ', error.data);
        return;
    }

    // NowPlaying component action
    public nowPlayingvent(action: TCH5NowPlayingActions, time: string = '') {
        this.lastPerformedAction = action;
        const myRPC: CommonEventRequest = {
            params: action === TCH5NowPlayingActions.Seek ? { 'time': time } : null,
            jsonrpc: '2.0',
            id: this.generateUniqueMessageId(),
            method: this.myMP.instanceName + '.' + action
        };
        this.myMP[action + 'Id'] = myRPC.id;
        this.sendRPCRequest(JSON.stringify(myRPC));
    }

    // MyMusic component action
    public myMusicEvent(action: string, itemIndex: number = 0) {
        this.lastPerformedAction = null;
        const param = itemIndex === 0 ? null : { 'item': itemIndex };
        const myRPC: CommonEventRequest = {
            params: param,
            jsonrpc: '2.0',
            id: this.generateUniqueMessageId(),
            method: this.myMP.menuInstanceName + '.' + action
        };
        this.sendRPCRequest(JSON.stringify(myRPC));
        this.isItemCountNew = true;
    }

    private callTrackTime() {
        ['ElapsedSec', 'TrackSec'].forEach((item: any) => {
            const myRPC: CommonRequestPropName = {
                params: { "propName": item },
                jsonrpc: '2.0',
                id: this.generateUniqueMessageId(),
                method: this.myMP.instanceName + '.GetProperty'
            };
            if (this.myMP.instanceName) {
                this.sendRPCRequest(JSON.stringify(myRPC));
            }
        });
    };

    private updatedMenuData() {
        ['ListSpecificFunctions', 'StatusMsgMenu', 'Instance', 'TransactionId'].forEach((item: any) => {
            const myRPC: CommonRequestPropName = {
                params: { "propName": item },
                jsonrpc: '2.0',
                id: this.generateUniqueMessageId(),
                method: this.myMP.menuInstanceName + '.GetProperty'
            };
            if (this.myMP.menuInstanceName) {
                this.sendRPCRequest(JSON.stringify(myRPC));// Send the message.
            }
        });
        this.getItemData();
    };

    // Component level popup action
    public popUpAction(inputValue: string = "", id: number = 0) {
        this.lastPerformedAction = null;
        const myRPC: CommonRequestForPopup = {
            params: {
                "localExit": false,
                "state": 1,
                "id": id,
                "userInput": encodeString(inputValue)
            },
            jsonrpc: '2.0',
            id: this.generateUniqueMessageId(),
            method: this.myMP.menuInstanceName + '.StatusMsgResponseMenu'
        };
        if (this.myMP.menuInstanceName) {
            this.sendRPCRequest(JSON.stringify(myRPC));// Send the message.
        }
    };

    public unsubscribeLibrarySignals() {
        unsubscribeState('b', 'receiveStateRefreshMediaPlayerResp', this.subReceiveStateRefreshMediaPlayerResp);
        unsubscribeState('b', 'receiveStateDeviceOfflineResp', this.subreceiveStateDeviceOfflineResp);
        unsubscribeState('s', 'receiveStateCRPCResp', this.subreceiveStateCRPCResp);
        unsubscribeState('s', 'receiveStateMessageResp', this.subreceiveStateMessageResp);
        unsubscribeState('s', 'sendEventCRPCJoinNo', this.subsendEventCRPCJoinNo);
        this.menuListPublishData = { 'MenuData': [] };
        this.nowPlayingPublishData = {};
        this.myMusicPublishData = {};
        this.progressBarPublishData = {};
        this.resetMp();
    }

    public resetMp(param: boolean = false) {
        if (param) {
            this.myMP = {
                "tag": this.myMP.tag,
                "source": this.myMP.source,
                "connectionActive": false,
                "RegistrationId": 0,
                "ObjectsId": 0,
                "PropertiesSupportedId": 0,
                "MenuId": 0,
                "TitleMenuId": 0,
                "TitleId": 0,
                "ItemDataId": 0,
                "PlayId": 0,
                "PauseId": 0,
                "SeekId": 0,
                "instanceName": '',
                "menuInstanceName": '',
            };
        } else {
            this.myMP = {
                "tag": "",
                "source": 0,
                "connectionActive": true,
                "RegistrationId": 0,
                "ObjectsId": 0,
                "PropertiesSupportedId": 0,
                "MenuId": 0,
                "TitleMenuId": 0,
                "TitleId": 0,
                "ItemDataId": 0,
                "PlayId": 0,
                "PauseId": 0,
                "SeekId": 0,
                "instanceName": '',
                "menuInstanceName": '',
            };
        }


        this.nowPlayingData = {
            'ActionsSupported': '', 'ActionsAvailable': '', 'RewindSpeed': '',
            'FfwdSpeed': '', 'ProviderName': '', 'PlayerState': '', 'PlayerIcon': '', 'PlayerIconURL': '', 'PlayerName': '',
            'Album': '', 'AlbumArt': '', 'AlbumArtUrl': '', 'AlbumArtUrlNAT': '', 'StationName': '', 'Genre': '', 'Artist': '',
            'Title': '', 'TrackNum': '', 'TrackCnt': '', 'NextTitle': '', 'ShuffleState': '', 'RepeatState': '', 'Rating': {}
        };

        this.progressBarData = { 'StreamState': '', 'ProgressBar': '', 'ElapsedSec': '', 'TrackSec': '' };

        this.myMusicData = { 'Title': '', 'Subtitle': '', 'ListSpecificFunctions': '', 'ItemCnt': 0, 'MaxReqItems': '', 'IsMenuAvailable': '' }

        this.menuListData = { 'MenuData': [] };
    }
}