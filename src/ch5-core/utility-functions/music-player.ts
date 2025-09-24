import { publishEvent, subscribeState } from "..";
import _ from 'lodash';
import { CommonEventRequest, CommonRequestForPopup, CommonRequestPropName, ErrorResponseObject, GetMenuRequest, GetMenuResponse, GetObjectsRequest, GetObjectsResponse, GetPropertiesSupportedRequest, GetPropertiesSupportedResponse, MyMpObject, Params, RegisterwithDeviceRequest, RegisterwithDeviceResponse } from "./commonInterface";

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

    public myMP: MyMpObject = {
        "tag": "",
        "source": 0,
        "connectionActive": false,
        "connectionIsDirect": false,
        "waitingForRegistration": false,

        "RegistrationId": 0,
        "ObjectsId": 0,
        "RegisterEventId": 0,
        "PropertiesSupportedId": 0,
        "MenuId": 0,
        "ActionsSupportedId": 0,
        "ProgressBarId": 0,
        "ElapsedSecId": 0,
        "TrackSecId": 0,
        "StreamStateId": 0,
        "TrackNumId": 0,
        "TrackCntId": 0,
        "PlayerStateId": 0,
        "PlayerIconId": 0,
        "PlayerNameId": 0,
        "PlayerIconURLId": 0,
        "AlbumArtId": 0,
        "AlbumArtUrlId": 0,
        "AlbumArtUrlNATId": 0,
        "StationNameId": 0,
        "AlbumId": 0,
        "GenreId": 0,
        "ArtistId": 0,
        "TitleId": 0,
        "TitleMenuId": 0,
        "RewindSpeedId": 0,
        "ProviderNameId": 0,
        "FfwdSpeedId": 0,
        "NextTitleId": 0,
        "ShuffleStateId": 0,
        "RepeatStateId": 0,
        "ItemCntId": 0,
        "SubtitleId": 0,
        "IsMenuAvailableId": 0,
        "ListSpecificFunctionsId": 0,
        "MaxReqItemsId": 0,
        "ItemDataId": 0,
        "ActionsAvailableId": 0,
        "ListChangedId": 0,
        "PlayId": 0,
        "PauseId": 0,
        "SeekId": 0,

        "instanceName": '',
        "menuInstanceName": '',
    };
    public nowPlayingData: any = {};
    public myMusicData: any = {};
    public tempNowPlayingData: any = {};
    public tempMyMusicData: any = {};
    public progressBarData: any = {};
    public tempProgressBarData: any = {};

    constructor() {
        subscribeState('b', 'receiveStateRefreshMediaPlayerResp', (value: any) => {
            console.log('receiveStateRefreshMediaPlayerResp: ' + value);
            if (value) {
                this.refreshMediaPlayer();
            }
        });

        subscribeState('b', 'receiveStateDeviceOfflineResp', (value: any) => {
            console.log('receiveStateDeviceOfflineResp: ' + value);
            if (value) {
                this.deviceIsOffline();
            } else {
                this.deviceIsOnline();
            }
        });

        subscribeState('s', 'receiveStateCRPCResp', (value: any) => {
            // On an update request, the control system will send that last serial data on the join, which
            // may be a partial message. We need to ignore that data.
            console.log('RPCIn from', value);
            if (value.length > 0) {

                const mpRPCPrefix = value.substring(0, 8).trim(); // First 8 bytes is the RPC prefix.
                console.log('Without prefix Data', value.substring(8));
                // Check byte 3 to determine if this is a single or partial message.
                // c = partial message
                // e = single or final message when a partial message was received.
                //console.log('------------', mpRPCPrefix[3], "*-" + this.mpRPCDataIn + "-*");
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
                            console.log('handle Error>', parsedData.error);
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
            // console.log('Register Device');
            this.registerWithDevice();
        }
    }

    private unregisterWithDevice() {

        // We need to unregister with both the Media Player instance
        // as well as the Media player Menu instance.

        if (this.myMP.instanceName && this.myMP.menuInstanceName) {
            //console.log('Deregister Device');
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
            this.myMusicData = {};
            this.nowPlayingData = {};
            this.progressBarData = {};
            publishEvent('o', 'myMusicData', this.myMusicData);
            publishEvent('o', 'nowPlayingData', this.nowPlayingData);
            publishEvent('o', 'progressBarData', this.progressBarData);
            this.myMP.instanceName = '';
            this.myMP.menuInstanceName = '';
        }
    }

    // Increment our message id. ToDo: Need a max value check and reset to 0.
    private getMessageId() {
        this.mpMsgId++;
        return this.mpMsgId;
    }

    private deviceIsOnline() {
        this.myMP.connectionActive = true;
    }

    private deviceIsOffline() {
        this.myMP.connectionActive = false; // ToDo: This needs work since a direct connection with the device does not have a join from the control system.
        this.myMP.connectionIsDirect = false;
        this.myMP.waitingForRegistration = false;
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
    private generateRPCPrefix(str: any) {
        const myPrefix = '2' + this.myMP.tag + 'e' + this.getStringLengthInHexFixed(str);
        return myPrefix;
    }

    // Get the CRPC JSON payload length in hex as a 4-byte string.
    private getStringLengthInHexFixed(str: any) {
        const hexLength = str.length.toString(16);
        return hexLength.padStart(4, '0');
    }

    private startRegistrationResendTimer() {
        this.resendRegistrationTimeId = setInterval(() => {
            console.log('Timer.......')
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
        // console.log('Data-->', data);
        const myObj = JSON.parse(data);
        if (myObj.hasOwnProperty("tag")) {
            // console.log('Found tag value: ' + this.myMP.tag);
            // ToDo: Need to check if the tag matches in case the device
            // is sending us the wrong data. The dealer could have the router
            // module in SIMPL incorrectly configured.
            this.myMP.tag = myObj.tag;
        }

        if (myObj.hasOwnProperty("src")) {
            // console.log('Found src value: ' + this.myMP.source);
            // If this is a different source, we need to refresh the media player.
            // This will also happen on an update request since no source value has been set yet.
            if (this.myMP.source != myObj.src) {
                //  console.log('Source has changed.');
                this.refreshMediaPlayer();
            }
            this.myMP.source = myObj.src;
        }
    }

    private processRegistrationResponse(regResponse: RegisterwithDeviceResponse) {

        // Make sure we have a result.
        if (regResponse.result) {
            // We have a response, so our connnecton is active.
            this.myMP.connectionActive = true;

            // What RPC version is this?
            if (regResponse.jsonrpc === '1.0') {
                //console.log('RPC version = 1.0.');
                /*   if (regResponse.result.connections) {
                      console.log('Found connections list.');
                      const myDirectConnectionInfo = regResponse.result.connections.cip;
                      console.log('myDirectConnectionInfo Ip: ' + myDirectConnectionInfo.ip);
                  } */
            } else {
                //console.log('RPC version = 2.0.');
                // Do we have the connection list?
                if (regResponse.result.connectionslist) {
                    // console.log('Found connections list.');
                    //const myDirectConnectionInfo: any = this.getDirectConnectionInfoFromArray(regResponse.result.connectionslist);
                    // console.log('myDirectConnectionInfo Ip: ' + myDirectConnectionInfo.ip);
                }
            }
            console.log('clear timer');
            clearInterval(this.resendRegistrationTimeId);
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
        console.log('instance', this.myMP.instancename);
        console.log('menuInstanceName', this.myMP.menuInstanceName);

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
        //console.log("MenuResponse---->", getMenuResponse);
        this.myMP.menuInstanceName = getMenuResponse.result.instanceName;
        console.log('menuInstanceName 2', this.myMP.menuInstanceName);

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
            console.log('start timer');
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
        if (!infiniteScroll) { this.itemValue = 1, this.tempMyMusicData['MenuData'] = [] };

        const count = (this.tempMyMusicData['ItemCnt'] < this.tempMyMusicData['MaxReqItems']) ? this.tempMyMusicData['ItemCnt'] :
            this.tempMyMusicData['MaxReqItems'];
        this.tempMyMusicData['ItemCnt'] = this.tempMyMusicData['ItemCnt'] - count;
        // console.log("ITEM DATA VALUES", this.itemValue, count)
        const myRPC: any = {
            params: { item: this.itemValue, count },//"item": //this.tempMyMusicData['Level']
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.menuInstanceName + '.GetData'

        };
        this.myMP.ItemDataId = myRPC.id; // Keep track of the message id.
        if (this.myMP.menuInstanceName) {
            this.sendRPCRequest(JSON.stringify(myRPC));
        }
        this.itemValue = this.itemValue + this.tempMyMusicData['MaxReqItems']
    }

    private sendRPCRequest(data: any) {
        console.log('CRPC send join:' + this.mpSigRPCOut + " " + data);

        let myPrefix = '';
        // Add prefix if the connection is not direct.
        if (!this.myMP.connectionIsDirect) {
            //console.log('Connection is not direct. Need to generate a JSON prefix.')
            myPrefix = this.generateRPCPrefix(data);
        }

        data = myPrefix + data;
        if (this.mpSigRPCOut) {
            publishEvent('s', this.mpSigRPCOut, data);
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
                    this.tempProgressBarData[item] = responseData.params?.parameters[item];
                } else {
                    this.tempNowPlayingData[item] = responseData.params?.parameters[item];
                }
            }
        } else if (menuInstanceMethod === responseData.method && responseData.params.ev === 'StateChanged' && responseData.params?.parameters) { // My music  statechanged 
            for (const item in responseData.params?.parameters) {
                this.tempMyMusicData[item] = responseData.params?.parameters[item];
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
                this.processRegistrationResponse(responseData);

                // If we are not using a direct connection yet, go ahead and get objects.
                if (!this.myMP.connectionIsDirect) {
                    // While objects are being returned, switch the connection to direct (if possible).
                    this.getObjects();
                }
            } else if (myMsgId == this.myMP.ObjectsId) {
                this.processGetObjectsResponse(responseData);
            } else if (myMsgId == this.myMP.PropertiesSupportedId) {
                this.processPropertiesSupportedResponse(responseData);
            } else if (myMsgId == this.myMP.MenuId) {
                this.processMenuResponse(responseData);
            } else if (myMsgId == this.myMP.ActionsSupportedId) {
                this.tempNowPlayingData['ActionsSupported'] = responseData.result.ActionsSupported;
            } else if (myMsgId == this.myMP.ActionsAvailableId) {
                this.tempNowPlayingData['ActionsAvailable'] = responseData.result.ActionsAvailable;
            } else if (myMsgId == this.myMP.RewindSpeedId) {
                this.tempNowPlayingData['RewindSpeed'] = responseData.result.RewindSpeed;
            } else if (myMsgId == this.myMP.FfwdSpeedId) {
                this.tempNowPlayingData['FfwdSpeed'] = responseData.result.FfwdSpeed;
            } else if (myMsgId == this.myMP.ProviderNameId) {
                this.tempNowPlayingData['ProviderName'] = responseData.result.ProviderName;
            } else if (myMsgId == this.myMP.PlayerStateId) {
                this.tempNowPlayingData['PlayerState'] = responseData.result.PlayerState;
            } else if (myMsgId == this.myMP.PlayerIconId) {
                this.tempNowPlayingData['PlayerIcon'] = responseData.result.PlayerIcon;
            } else if (myMsgId == this.myMP.PlayerIconURLId) {
                this.tempNowPlayingData['PlayerIconURL'] = responseData.result.PlayerIconURL;
            } else if (myMsgId == this.myMP.PlayerNameId) {
                this.tempNowPlayingData['PlayerName'] = responseData.result.PlayerName;
            } else if (myMsgId == this.myMP.StreamStateId) {
                this.tempProgressBarData['StreamState'] = responseData.result.StreamState;
            } else if (myMsgId == this.myMP.AlbumId) {
                this.tempNowPlayingData['Album'] = responseData.result.Album;
            } else if (myMsgId == this.myMP.AlbumArtId) {
                this.tempNowPlayingData['AlbumArt'] = responseData.result.AlbumArt;
            } else if (myMsgId == this.myMP.AlbumArtUrlId) {
                this.tempNowPlayingData['AlbumArtUrl'] = responseData.result.AlbumArtUrl;
            } else if (myMsgId == this.myMP.AlbumArtUrlNATId) {
                this.tempNowPlayingData['AlbumArtUrlNAT'] = responseData.result.AlbumArtUrlNAT;
            } else if (myMsgId == this.myMP.StationNameId) {
                this.tempNowPlayingData['StationName'] = responseData.result.StationName;
            } else if (myMsgId == this.myMP.GenreId) {
                this.tempNowPlayingData['Genre'] = responseData.result.Genre;
            } else if (myMsgId == this.myMP.ArtistId) {
                this.tempNowPlayingData['Artist'] = responseData.result.Artist;
            } else if (myMsgId == this.myMP.TitleId) {
                this.tempNowPlayingData['Title'] = responseData.result.Title;
            } else if (myMsgId == this.myMP.ProgressBarId) {
                this.tempProgressBarData['ProgressBar'] = responseData.result.ProgressBar;
            } else if (myMsgId == this.myMP.TrackNumId) {
                this.tempNowPlayingData['TrackNum'] = responseData.result.TrackNum;
            } else if (myMsgId == this.myMP.TrackCntId) {
                this.tempNowPlayingData['TrackCnt'] = responseData.result.TrackCnt;
            } else if (myMsgId == this.myMP.NextTitleId) {
                this.tempNowPlayingData['NextTitle'] = responseData.result.NextTitle;
            } else if (myMsgId == this.myMP.ShuffleStateId) {
                this.tempNowPlayingData['ShuffleState'] = responseData.result.ShuffleState;
            } else if (myMsgId == this.myMP.RepeatStateId) {
                this.tempNowPlayingData['RepeatState'] = responseData.result.RepeatState;
            } else if (myMsgId == this.myMP.ElapsedSecId) {
                this.tempProgressBarData['ElapsedSec'] = responseData.result.ElapsedSec;
            } else if (myMsgId == this.myMP.TrackSecId) {
                this.tempProgressBarData['TrackSec'] = responseData.result.TrackSec;
            } else if (myMsgId == this.myMP.TitleMenuId) { // Menu DFata
                this.tempMyMusicData['Title'] = responseData.result.Title;
            } else if (myMsgId == this.myMP.SubtitleId) {
                this.tempMyMusicData['Subtitle'] = responseData.result.Subtitle;
            } else if (myMsgId == this.myMP.ListSpecificFunctionsId) {
                this.tempMyMusicData['ListSpecificFunctions'] = responseData.result.ListSpecificFunctions;
            } else if (myMsgId == this.myMP.ItemCntId) {
                this.tempMyMusicData['ItemCnt'] = responseData.result.ItemCnt;
                this.getItemData();
            } else if (myMsgId == this.myMP.MaxReqItemsId) {
                this.tempMyMusicData['MaxReqItems'] = responseData.result.MaxReqItems;
            } else if (myMsgId == this.myMP.IsMenuAvailableId) {
                this.tempMyMusicData['IsMenuAvailable'] = responseData.result.IsMenuAvailable;
            } else if (myMsgId === this.myMP.ItemDataId) {
                this.tempMyMusicData['MenuData'] = [...this.tempMyMusicData['MenuData'], ...responseData.result];
            }
        }
        if (!(busyChanged && busyChanged['on'] === true)) {
            if (!_.isEqual(this.nowPlayingData, this.tempNowPlayingData)) {
                this.nowPlayingData = { ...this.tempNowPlayingData };
                publishEvent('o', 'nowPlayingData', this.nowPlayingData); // left section
            }
            if (!_.isEqual(this.myMusicData, this.tempMyMusicData)) {
                this.myMusicData = { ...this.tempMyMusicData };
                publishEvent('o', 'myMusicData', this.myMusicData); // right section
            }
            if (!_.isEqual(this.progressBarData, this.tempProgressBarData)) {
                this.progressBarData = { ...this.tempProgressBarData };
                publishEvent('o', 'progressBarData', this.progressBarData);
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

    public callTrackTime() {
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

    public updatedMenuData() {
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
}