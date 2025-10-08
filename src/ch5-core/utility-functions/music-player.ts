import { publishEvent, subscribeState } from "..";
import _ from 'lodash';
import { CommonEventRequest, CommonRequestForPopup, CommonRequestPropName, ErrorResponseObject, GetMenuRequest, GetMenuResponse, GetObjectsRequest, GetObjectsResponse, GetPropertiesSupportedRequest, GetPropertiesSupportedResponse, MyMpObject, Params, RegisterwithDeviceRequest } from "./commonInterface";

export class MusicPlayerLib {

    // Serial signals to the control system.
    private mpSigRPCOut: string = "";
    private mpRPCDataIn: string = '';
    private menuStateChanged: any = {};
    private mpMsgId: number = 0; // Increment our message id. ToDo: Need a max value check and reset to 0.
    private itemValue: number = 1; // Used in infinite scroll feature.
    private resendRegistrationTimeId: any = '';

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
    public maxReqItems = 20;

    private nowPlayingData: any = {'ActionsSupported':'', 'ActionsAvailable':'', 'RewindSpeed':'',
        'FfwdSpeed':'', 'ProviderName':'', 'PlayerState':'', 'PlayerIcon':'', 'PlayerIconURL':'', 'PlayerName':'',
        'Album':'', 'AlbumArt':'', 'AlbumArtUrl':'', 'AlbumArtUrlNAT':'', 'StationName':'', 'Genre':'', 'Artist':'',
        'Title':'', 'TrackNum':'', 'TrackCnt':'', 'NextTitle':'', 'ShuffleState':'', 'RepeatState':''
    };

    private progressBarData: any = {'StreamState':'', 'ProgressBar':'', 'ElapsedSec':'', 'TrackSec':''};

    private myMusicData : any= {'Title': '', 'Subtitle': '', 'ListSpecificFunctions': '', 'ItemCnt':0, 'MaxReqItems': '', 'IsMenuAvailable': '', 'MenuData': []}

    constructor() {
        subscribeState('b', 'receiveStateRefreshMediaPlayerResp', (value: any) => {
            if (value) {
                this.refreshMediaPlayer();
            }
        });

        subscribeState('b', 'receiveStateDeviceOfflineResp', (value: any) => {
            if (value) {
                this.myMP.connectionActive = false;
            } else {
                this.myMP.connectionActive = true;
            }
        });

        subscribeState('s', 'receiveStateCRPCResp', (value: any) => {
            // On an update request, the control system will send that last serial data on the join, which
            // may be a partial message. We need to ignore that data.
            if (value.length > 0) {

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

                    // check error
                    let parsedData: any = '';
                    try {
                        parsedData = JSON.parse(this.mpRPCDataIn);
                        if (parsedData.error) {
                            console.log('handle Error >', parsedData.error);
                            this.handleError(parsedData.error);
                        } else {
                            this.processCRPCResponse(parsedData); // Process the entire payload then clear the var.
                        }

                    } catch (e) {
                        console.log("e", e);
                    }

                    this.mpRPCDataIn = ''; // Clear the var now that we have the entire message.
                }
            }
        });

        //receiveStateMessageResp from CS (ver tag src)
        subscribeState('s', 'receiveStateMessageResp', (value: any) => {
            console.log('Source and Tag value', value);
            if (value.length > 0) {
                this.processMessage(value);
            }
        });

        //To get join name from the component
        subscribeState('s', 'sendEventCRPCJoinNo', (value: any) => {
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

    private unregisterWithDevice() {

        // We need to unregister with both the Media Player instance
        // as well as the Media player Menu instance.

        if (this.myMP.instanceName && this.myMP.menuInstanceName) {
            ['BusyChanged', 'StatusMsgChanged', 'StateChangedByBrowseContext', 'StateChanged'].forEach((item: any) => {
                const myRPC: CommonEventRequest = {
                    params: { "ev": item, "handle": "sg" },
                    jsonrpc: '2.0',
                    id: this.getMessageId(),
                    method: this.myMP.instanceName + '.DeregisterEvent'

                };
                const myRPCJSON = JSON.stringify(myRPC);
                this.myMP[item + 'Id'] = myRPC.id;
                this.sendRPCRequest(myRPCJSON);
            });
            ['BusyChanged', 'ClearChanged', 'ListChanged', 'StateChanged', 'StatusMsgMenuChanged'].forEach((item: any) => {
                const myRPC: CommonEventRequest = {
                    params: { "ev": item, "handle": "sg" },
                    jsonrpc: '2.0',
                    id: this.getMessageId(),
                    method: this.myMP.menuInstanceName + '.DeregisterEvent'

                };
                const myRPCJSON = JSON.stringify(myRPC);
                this.myMP[item + 'Id'] = myRPC.id;
                this.sendRPCRequest(myRPCJSON);
            });
            this.myMusicPublishData = {};
            this.nowPlayingPublishData = {};
            this.progressBarPublishData = {};
            publishEvent('o', 'myMusicData', this.myMusicPublishData);
            publishEvent('o', 'nowPlayingData', this.nowPlayingPublishData);
            publishEvent('o', 'progressBarData', this.progressBarPublishData);
            this.myMP.instanceName = '';
            this.myMP.menuInstanceName = '';
        }
    }

    // Increment our message id. ToDo: Need a max value check and reset to 0.
    private getMessageId() {
        this.mpMsgId++;
        return this.mpMsgId;
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
        //resendRegistrationTimeId = setTimeout(function, 30000);
    }

    private getDirectConnectionInfoFromArray(data: any) {
        // Data is an array of connections.
        // ToDo: This is only for RPC v2.0 .. we need to handle RPC v.10 as well.
        const myConnectionData: any = new Object();
        myConnectionData.ip = '';
        myConnectionData.port = 0;

        let i, item;
        const count = data.length;
        for (i = 0; i < count; i++) {
            item = data[i];
            if (item.type == 'cip-direct/json-rpc') {
                myConnectionData.ip = item.ip;
                myConnectionData.port = item.port;
            }
        }
        return myConnectionData;
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
                //  console.log('Source has changed.');
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
        /*  console.log('instance', this.myMP.instancename);
         console.log('menuInstanceName', this.myMP.menuInstanceName); */

        this.registerEvent();
        this.getPropertiesSupported(this.myMP.instanceName);
        this.getMenu(this.myMP.instanceName);
        ['BusyChanged', 'StatusMsgChanged', 'StateChangedByBrowseContext', 'StateChanged'].forEach((item: any) => {
            const myRPC: CommonEventRequest = {
                params: { "ev": item, "handle": "sg" },
                jsonrpc: '2.0',
                id: this.getMessageId(),
                method: this.myMP.instanceName + '.RegisterEvent'

            };
            this.myMP[item + 'Id'] = myRPC.id;// Keep track of the message id.
            if (this.myMP.instanceName) {
                this.sendRPCRequest(JSON.stringify(myRPC));// Send the message.
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
                    id: this.getMessageId(),
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
                id: this.getMessageId(),
                method: this.myMP.menuInstanceName + '.RegisterEvent'
            };
            if (item === 'Reset') {
                myRPC.params = null;
                myRPC.method = this.myMP.menuInstanceName + '.Reset'
            };
            if (item === 'BusyChanged' || item === 'StateChanged') {
                this.myMP[item + 'MenuId'] = myRPC.id;// Keep track of the message id.
            } else {
                this.myMP[item + 'Id'] = myRPC.id;// Keep track of the message id.
            }
            if (this.myMP.menuInstanceName) {
                this.sendRPCRequest(JSON.stringify(myRPC));
            }
        });

        ['Version', 'MaxReqItems', 'Level', 'ItemCnt', 'Title', 'Subtitle', 'ListSpecificFunctions', 'IsMenuAvailable', 'StatusMsgMenu', 'Instance'].forEach((item: any) => {
            const myRPC: CommonRequestPropName = {
                params: { "propName": item },
                jsonrpc: '2.0',
                id: this.getMessageId(),
                method: this.myMP.menuInstanceName + '.GetProperty'
            };
            if (item === 'Title') {
                this.myMP[item + 'MenuId'] = myRPC.id;// Keep track of the message id.
            } else {
                this.myMP[item + 'Id'] = myRPC.id;// Keep track of the message id.
            }
            if (this.myMP.menuInstanceName) {
                this.sendRPCRequest(JSON.stringify(myRPC));
            }
        });
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
            ver: '1.0',
            maxPacketSize: 65535,
            type: 'symbol/json-rpc',
            format: 'JSON',
            name: 'CH5_v2.15', // ToDo: This should be dynamic based on the CH5 version.
            jsonrpc: '2.0'
        };

        const myRPC: RegisterwithDeviceRequest = {
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: 'Crpc.Register',
            params: myRPCParams
        };

        this.myMP.RegistrationId = myRPC.id;// Keep track of the message id.
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
            id: this.getMessageId(),
            method: 'Crpc.GetObjects'
        };
        this.myMP.ObjectsId = myRPC.id;// Keep track of the message id.
        this.sendRPCRequest(JSON.stringify(myRPC));// Send the message.
    }

    private registerEvent() {
        const myRPC: CommonEventRequest = {
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: 'Crpc.RegisterEvent',
            params: { "ev": "ObjectDirectoryChanged", "handle": "sg" },
        };
        this.myMP.RegisterEventId = myRPC.id; // Keep track of the message id.
        this.sendRPCRequest(JSON.stringify(myRPC)); // Send the message.
    }

    private getPropertiesSupported(instanceName: string) {
        const myRPC: GetPropertiesSupportedRequest = {
            params: { "propName": "PropertiesSupported" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
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
            id: this.getMessageId(),
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
            this.myMusicData['MenuData'] = [];
        }

        let itemCount = this.myMusicData['ItemCnt'];
        const count = (itemCount < this.maxReqItems) ? itemCount : this.maxReqItems;
        itemCount = itemCount - count;

        if (count > 0) {
            const myRPC: any = {
                params: { item: this.itemValue, count },
                jsonrpc: '2.0',
                id: this.getMessageId(),
                method: this.myMP.menuInstanceName + '.GetData'
            };
            this.myMP.ItemDataId = myRPC.id; // Keep track of the message id.
            if (this.myMP.menuInstanceName) {
                this.sendRPCRequest(JSON.stringify(myRPC));
            }
            this.itemValue = this.itemValue + this.maxReqItems;
        }
    }

    private sendRPCRequest(data: any) {

        let myPrefix = '';
        let temp = '';
        const numberOfChar = 100;
        // Add prefix if the connection is not direct.
        const chuncknCount = Math.ceil(data.length / numberOfChar);
        for (let i = 0; i < chuncknCount; i++) {
            if (i === (chuncknCount - 1)) {
                temp = data.substring(numberOfChar * i);
                myPrefix = this.generateRPCPrefixForFinalMessage(temp);
                temp = myPrefix + temp;
            } else {
                temp = data.substring((numberOfChar * i), (numberOfChar * i) + numberOfChar);
                myPrefix = this.generateRPCPrefixForPartialMessage(temp);
                temp = myPrefix + temp;
            }
            if (this.mpSigRPCOut) {
                console.log('CRPC send join:' + this.mpSigRPCOut + " " + temp);
                publishEvent('s', this.mpSigRPCOut, temp);
            }
        }
    }

    // Process CRPC data from the control system.
    private processCRPCResponse(data: any) {
        const responseData = data;
        // ToDO: Just because the message ID was found, doesn't mean
        /// there were no errors. Add error checking to the response
        // ID handler.

        // Get the messge id.
        // This can be used to determine if a valid response was received
        // for a specific API call we just made.
        const myMsgId = responseData.id;
        let busyChanged: any = {};
        /* console.log('Message id: ' + myMsgId); */
        const playerInstanceMethod = this.myMP?.instanceName + '.Event';
        const menuInstanceMethod = this.myMP?.menuInstanceName + '.Event';
        if ((playerInstanceMethod === responseData.method || menuInstanceMethod === responseData.method) && responseData.params.ev === 'BusyChanged' && responseData.params?.parameters) {// Busychanged event
            busyChanged = { 'timeoutSec': responseData.params?.parameters?.timeoutSec, 'on': responseData.params?.parameters?.on }
            publishEvent('o', 'busyChanged', busyChanged);
        } else if (playerInstanceMethod === responseData.method && responseData.params.ev === 'StateChanged' && responseData.params?.parameters) { // Now music statechanged 
            for (const item in responseData.params.parameters) {
                if (item === 'ElapsedSec' || item === 'TrackSec' || item === 'StreamState' || item === 'ProgressBar') {
                    this.progressBarData[item] = responseData.params?.parameters[item];
                } else {
                    this.nowPlayingData[item] = responseData.params?.parameters[item];
                }
            }
        } else if (menuInstanceMethod === responseData.method && responseData.params.ev === 'StateChanged' && responseData.params?.parameters) { // My music  statechanged 
            for (const item in responseData.params?.parameters) {
                this.myMusicData[item] = responseData.params?.parameters[item];
            }
            if (!_.isEqual(this.menuStateChanged, responseData.params?.parameters)) {
                this.menuStateChanged = responseData.params?.parameters;
                if (responseData.params?.parameters.hasOwnProperty('Title')) {
                    this.updatedMenuData(); // we need to call only when statechanged event has parameters object include key has Title
                }
            }
        } else if (menuInstanceMethod === responseData.method && responseData.params.ev === 'StatusMsgMenuChanged' && responseData.params?.parameters) { // My music  StatusMsgMenuChanged 
            publishEvent('o', 'StatusMsgMenuChanged', responseData.params?.parameters ? responseData.params.parameters : {});
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
                this.myMusicData['MenuData'] = [...this.myMusicData['MenuData'], ...responseData.result];
            } else if (responseData.result && Object.keys(responseData.result)?.length === 1) {
                const responseValue = Object.values(responseData.result)[0];
                const responseKey = Object.keys(responseData.result)[0];
                if (myMsgId === this.myMP.TitleMenuId) { // we have two titles, to get only the menu instance title we have this condition
                    this.myMusicData[responseKey] = responseValue;
                } else if (this.nowPlayingData.hasOwnProperty(responseKey)) {
                    this.nowPlayingData[responseKey] = responseValue;
                } else if (this.progressBarData.hasOwnProperty(responseKey)) {
                    this.progressBarData[responseKey] = responseValue;
                } else if (this.myMusicData.hasOwnProperty(responseKey)) {
                    this.myMusicData[responseKey] = responseValue;
                    if (responseKey === 'ItemCnt') {
                        this.getItemData();
                    }
                } 
            }            
        }
        if (!(busyChanged && busyChanged['on'] === true)) {
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
        console.info('Error Code:----  ', error.code);
        console.info('Error message:----  ', error.message);
        console.info('Error Data:----  ', error.data);
        return;
    }

    // NowPlaying component action
    public nowPlayingvent(action: string, time: string = '') {
        const myRPC: CommonEventRequest = {
            params: action === 'Seek' ? { 'time': time } : null,
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.instanceName + '.' + action
        };
        this.myMP[action + 'Id'] = myRPC.id;
        this.sendRPCRequest(JSON.stringify(myRPC));
    }

    // MyMusic component action
    public myMusicEvent(action: string, itemIndex: number = 0) {
        const param = itemIndex === 0 ? null : { 'item': itemIndex };
        const myRPC: CommonEventRequest = {
            params: param,
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.menuInstanceName + '.' + action
        };
        this.sendRPCRequest(JSON.stringify(myRPC));
    }

    private callTrackTime() {
        ['ElapsedSec', 'TrackSec'].forEach((item: any) => {
            const myRPC: CommonRequestPropName = {
                params: { "propName": item },
                jsonrpc: '2.0',
                id: this.getMessageId(),
                method: this.myMP.instanceName + '.GetProperty'
            };
            this.myMP[item + "Id"] = myRPC.id;
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
                id: this.getMessageId(),
                method: this.myMP.menuInstanceName + '.GetProperty'
            };
            this.myMP[item + "Id"] = myRPC.id;
            if (this.myMP.menuInstanceName) {
                this.sendRPCRequest(JSON.stringify(myRPC));// Send the message.
            }
        });
        this.getItemData();
    };

    // Component level popup action
    public popUpAction(inputValue: string = "", id: number = 0) {
        const myRPC: CommonRequestForPopup = {
            params: {
                "localExit": false,
                "state": 1,
                "id": id,
                "userInput": inputValue
            },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.menuInstanceName + '.StatusMsgResponseMenu'
        };
        if (this.myMP.menuInstanceName) {
            this.sendRPCRequest(JSON.stringify(myRPC));// Send the message.
        }
    };

    //To replace language specific charactars
    public replaceLanguageChars(textValue: string) {
        if (textValue === undefined || textValue === null || textValue === '') return '';
        return textValue.replace(/\/[^/]+/g, '').replace(/[^\u0020-\u007E]/g, '').replace(/\s{2,}/g, ' ').trim();
    }
}