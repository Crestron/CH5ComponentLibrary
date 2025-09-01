import { publishEvent, subscribeState } from "..";
import { CommonEventRequest, CommonRequestPropName, ErrorResponseObject, GetMenuRequest, GetMenuResponse, GetObjectsRequest, GetObjectsResponse, GetPropertiesSupportedRequest, GetPropertiesSupportedResponse, MyMpObject, Params, RegisterwithDeviceRequest, RegisterwithDeviceResponse } from "./commonInterface";

export class MusicPlayerLib {

    private static instance: MusicPlayerLib;

    /*  // Digital signals coming from the control system.
     private mpSigRefresh: string = '1';
     private mpSigOffline: string = '2';
     private mpSigUseMessage: string = '3';
     private mpSigCtrlSysOffline: string = '18495'; */

    // Serial signals from the control systrem.
    /*     private mpSigRPCIn: string = '1';
        private mpSigMessageIn: string = '2'; */

    // Serial signals to the control system.
    private mpSigRPCOut: string = "";
    /*  private mpSigMessageOut = 2; */

    private mpRPCPrefix: string = '';
    private mpRPCDataIn: string = '';



    private mpMsgId = 0; // Increment our message id. ToDo: Need a max value check and reset to 0.

    // Generate a constant UUID once per application start.
    private myMPUUID: string = crypto.randomUUID();

    private mpIgnoreCRPCIn: boolean = false;
    private itemCount: number = -1;
    private itemLevel: number = -1;

    public myMP: MyMpObject = {
        "tag": "",
        "source": 0,
        "connectionActive": false,
        "connectionIsDirect": false,
        "waitingForRegistration": false,
        "registrationMsgId": 0,
        "getObjectsMsgId": 0,
        "registerEventMsgId": 0,
        "getPropertiesSupportedMsgId": 0,
        "getMenuMsgId": 0,
        "getRegisterBusyChangedId": 0,
        "getRegisterStatusMsgChangedId": 0,
        "getRegisterStateChangedByBrowseContextId": 0,
        "getRegisterStateChangedId": 0,
        "getTextLinesId": 0,
        "getActionsSupportedId": 0,
        "getProgressBarId": 0,
        "getElapsedSecId": 0,
        "getTrackSecId": 0,
        "getStreamStateId": 0,
        "getTrackNumId": 0,
        "getTrackCntId": 0,
        "getPlayerStateId": 0,
        "getPlayerIconId": 0,
        "getPlayerNameId": 0,
        "getPlayerIconURLId": 0,
        "getMediaTypeId": 0,
        "getInstanceId": 0,
        "getAlbumArtId": 0,
        "getAlbumArtUrlId": 0,
        "getAlbumArtUrlNATId": 0,
        "getStationNameId": 0,
        "getAlbumId": 0,
        "getGenreId": 0,
        "getArtistId": 0,
        "getTitleId": 0,
        "getLanguageId": 0,
        "getRewindSpeedId": 0,
        "getProviderNameId": 0,
        "getFfwdSpeedId": 0,
        "getNextTitleId": 0,
        "getMediaReadyId": 0,
        "getShuffleStateId": 0,
        "getRepeatStateId": 0,
        "getStatusMsgId": 0,
        "getBusyId": 0,
        "getRatingId": 0,
        "getSelectedId": 0,
        "getVersionId": 0,
        "getMaxReqItems": 0,
        "getLevelId": 0,
        "getItemCntId": 0,
        "getSubtitleId": 0,
        "getIsMenuAvailableId": 0,
        "getStatusMsgMenuId": 0,
        "getListSpecificFunctionsId": 0,
        "getMaxReqItemsId": 0,
        "getItemDataId": 0,
        "getItemData2Id": 0,
        "getActionsAvailableId": 0,
        "getRegisterClearChangedId": 0,
        "getRegisterListChangedId": 0,
        "getRegisterStatusMsgMenuChangedId": 0,
        "resetId": 0,



        "instanceName": '',
        "menuInstanceName": '',
    };

    static getInstance() {
        console.log('getInstance');
        if (this.instance) {
            return this.instance;
        }
        this.instance = new MusicPlayerLib();
        return this.instance;
    }

    constructor() {

        //refreshMediaPlayer
        subscribeState('b', 'mpSigRefresh', (value: any) => {
            // console.log('mpSigRefresh: ' + value);
            if (value == 1) {
                this.refreshMediaPlayer();
            }
        });

        // device offline
        subscribeState('b', 'mpSigOffline', (value: any) => {
            // console.log('mpSigOffline: ' + value);
            if (value == 1) {
                this.deviceIsOffline();
            } else {
                this.deviceIsOnline();
            }
        });

        //digital message from CS
        subscribeState('b', 'mpSigUseMessage', (value: any) => {
            console.log('mpSigUseMessage: ' + value);
        });

        // Controle System status offline / online
        subscribeState('b', 'mpSigCtrlSysOffline', (value: any) => {
            // console.log('mpSigCtrlSysOffline: ' + value);
            if (value == 1) {
                console.log('Control system is offline.');
            } else {
                console.log('Control system is online.');
                this.mpIgnoreCRPCIn = true;
            }
        });

        // mpSigRPCIn from CS
        subscribeState('s', 'mpSigRPCIn', (value: any) => {
            // console.log('Partial Data from mpRPCDataIn: ' + value);
            // console.log('CRPC receive join:1' + value);


            // Check for length and if the data is a result of an update request.
            // On an update request, the control system will send that last serial data on the join, which
            // may be a partial message. We need to ignore that data.
            if (value.length > 0) {

                // If the update request has just come in, ignore the data.
                if (this.mpIgnoreCRPCIn) {
                    this.mpIgnoreCRPCIn = false;
                } else {
                    this.mpRPCPrefix = value.substring(0, 8); // First 8 bytes is the RPC prefix.
                    this.mpRPCDataIn = this.mpRPCDataIn + value.substring(8); // Gather the CRPC data.
                    // Check byte 3 to determine if this is a single or partial message.
                    // c = partial message
                    // e = single or final message when a partial message was received.
                    if (this.mpRPCPrefix[3] == 'c') {
                        console.log('Found c in prefix.');
                    } else if (this.mpRPCPrefix[3] == 'e') {
                        console.log('Found e in prefix.');
                        console.log('CRPC receive join:1  Full Response -> ' + this.mpRPCDataIn);

                        // check error
                        let errorData: any = ''
                        errorData = JSON.parse(this.mpRPCDataIn);
                        if (errorData.error) {
                            this.handleError(errorData.error);
                            this.mpRPCDataIn = '';
                            return;
                        }
                        this.processCRPCResponse(this.mpRPCDataIn); // Process the entire payload then clear the var.
                        this.mpRPCDataIn = ''; // Clear the var now that we have the entire message.
                    }
                }
            }
        });

        //mpSigMessageIn from CS (ver tag src)
        subscribeState('s', 'mpSigMessageIn', (value: any) => {
            // console.log('mpSigMessageIn: ' + value);
            if (value.length > 0) {
                this.processMessage(value);
            }
        });

        //To get join name from the app
        subscribeState('s', 'mpSigRPCOut', (value: any) => {
            // console.log('mpSigRPCOut', value);
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
        // console.log('***refreshMediaPlayer***');
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
        // console.log('***unregisterWithDevice***');

        // We need to unregister with both the Media Player instance
        // as well as the Media player Menu instance.

        // How do we need to unregister?
        if (!this.myMP.connectionIsDirect) {
            // Unregister the serial connection.
        } else {
            // Unregister the direct connection.
        }
    }

    // Increment our message id. ToDo: Need a max value check and reset to 0.
    private getMessageId() {
        this.mpMsgId++;
        return this.mpMsgId;
    }

    private deviceIsOnline() {
        // console.log('***deviceIsOnline***');
        this.myMP.connectionActive = true;
    }

    private deviceIsOffline() {
        // console.log('***deviceIsOffline***');
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

    // let resendRegistrationTimeId = '';
    private startRegistrationResendTimer() {
        //resendRegistrationTimeId = setTimeout(function, 30000);
    }



    // Process message data from the control system.
    // Note: On an update request from the control system, the last data to be sent
    // will be the message string.
    private processMessage(data: any) {
        // console.log('***processMessage***');

        const myObj = JSON.parse(data);
        if (myObj.hasOwnProperty("tag")) {
            console.log('Found tag value: ' + this.myMP.tag);
            // ToDo: Need to check if the tag matches in case the device
            // is sending us the wrong data. The dealer could have the router
            // module in SIMPL incorrectly configured.
            this.myMP.tag = myObj.tag;
        }

        if (myObj.hasOwnProperty("src")) {
            console.log('Found src value: ' + this.myMP.source);
            // If this is a different source, we need to refresh the media player.
            // This will also happen on an update request since no source value has been set yet.
            if (this.myMP.source != myObj.src) {
                console.log('Source has changed.');
                this.refreshMediaPlayer();
            }
            this.myMP.source = myObj.src;
        }
    }

    private processRegistrationResponse(regResponse: RegisterwithDeviceResponse) {
        // console.log('***processRegistrationResponse***');

        // Make sure we have a result.
        if (regResponse.result) {
            //console.log('Found result.');

            // We have a response, so our connnecton is active.
            this.myMP.connectionActive = true;

            // What RPC version is this?
            if (regResponse.jsonrpc == '1.0') {
                console.log('RPC version = 1.0.');
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
                    const myDirectConnectionInfo: any = this.getDirectConnectionInfoFromArray(regResponse.result.connectionslist);
                    console.log('myDirectConnectionInfo Ip: ' + myDirectConnectionInfo.ip);
                    //publishEvent('s', 'deviceRegistered', 'responseData')
                }
            }
        }
    }

    private processGetObjectsResponse(getObjectResponse: GetObjectsResponse) {
        // console.log('***processGetObjectsResponse***');
        // console.log('Process GetObjects Response data: ', getObjectResponse);

        // ToDo: Probably need some error handling in here.
        // This is pretty rough code.

        const myInstances = getObjectResponse.result.objects.object;
        myInstances.forEach((item: any) => {
            if (item.name == 'MediaPlayer') {
                this.myMP.instanceName = item.instancename
            }
            else if (item.name == 'MediaPlayerMenu') {
                this.myMP.menuInstanceName = item.instancename;
            }
        });

        this.registerEvent(); //3
        this.getPropertiesSupported(this.myMP.instanceName); //4
        this.getMenu(this.myMP.instanceName);// 5 method not found
        this.getRegisterBusyChnaged(this.myMP.instanceName); //6
        this.getRegisterStatusMsgChanged(this.myMP.instanceName); //7 
        this.getRegisterStateChangedByBrowseContext(this.myMP.instanceName); //8
        this.getRegisterStateChanged(this.myMP.instanceName); //9

        // console.log('Media player instance name:' + this.myMP.instanceName);
        // console.log('Media player menu instance name:' + this.myMP.menuInstanceName);
    }

    private processPropertiesSupportedResponse(getPropertiesSupportedResponse: GetPropertiesSupportedResponse) {
        console.log("---->", getPropertiesSupportedResponse);
        if (getPropertiesSupportedResponse.result.PropertiesSupported.includes('TextLines')) {
            this.getTextLines();
        }
        if (getPropertiesSupportedResponse.result.PropertiesSupported.includes('ActionsSupported')) {
            this.getActionsSupported();
        }
        if (getPropertiesSupportedResponse.result.PropertiesSupported.includes('ActionsAvailable')) {
            this.getActionsAvailable();
        }
        if (getPropertiesSupportedResponse.result.PropertiesSupported.includes('ProgressBar')) {
            this.getProgressBar();
        }
        if (getPropertiesSupportedResponse.result.PropertiesSupported.includes('ElapsedSec')) {
            this.getElapsedSec();
        }
        if (getPropertiesSupportedResponse.result.PropertiesSupported.includes('TrackSec')) {
            this.getTrackSec();
        }
        if (getPropertiesSupportedResponse.result.PropertiesSupported.includes('StreamState')) {
            this.getStreamState();
        }
        if (getPropertiesSupportedResponse.result.PropertiesSupported.includes('TrackNum')) {
            this.getTrackNum();
        }
        if (getPropertiesSupportedResponse.result.PropertiesSupported.includes('TrackCnt')) {
            this.getTrackCnt();
        }
        if (getPropertiesSupportedResponse.result.PropertiesSupported.includes('PlayerState')) {
            this.getPlayerState();
        }
        if (getPropertiesSupportedResponse.result.PropertiesSupported.includes('PlayerIcon')) {
            this.getPlayerIcon();
        }
        if (getPropertiesSupportedResponse.result.PropertiesSupported.includes('PlayerName')) {
            this.getPlayerName();
        }
        if (getPropertiesSupportedResponse.result.PropertiesSupported.includes('PlayerIconURL')) {
            this.getPlayerIconURL();
        }
        if (getPropertiesSupportedResponse.result.PropertiesSupported.includes('MediaType')) {
            this.getMediaType();
        }
        if (getPropertiesSupportedResponse.result.PropertiesSupported.includes('Instance')) {
            this.getInstance();
        }
        if (getPropertiesSupportedResponse.result.PropertiesSupported.includes('AlbumArt')) {
            this.getAlbumArt();
        }
        if (getPropertiesSupportedResponse.result.PropertiesSupported.includes('AlbumArtUrl')) {
            this.getAlbumArtUrl();
        }
        if (getPropertiesSupportedResponse.result.PropertiesSupported.includes('AlbumArtUrlNAT')) {
            this.getAlbumArtUrlNAT();
        }
        if (getPropertiesSupportedResponse.result.PropertiesSupported.includes('StationName')) {
            this.getStationName();
        }
        if (getPropertiesSupportedResponse.result.PropertiesSupported.includes('Album')) {
            this.getAlbum();
        }
        if (getPropertiesSupportedResponse.result.PropertiesSupported.includes('Genre')) {
            this.getGenre();
        }
        if (getPropertiesSupportedResponse.result.PropertiesSupported.includes('Artist')) {
            this.getArtist();
        }
        if (getPropertiesSupportedResponse.result.PropertiesSupported.includes('Title')) {
            this.getTitle(this.myMP.instanceName);
        }
        if (getPropertiesSupportedResponse.result.PropertiesSupported.includes('Language')) {
            this.getLanguage();
        }
        if (getPropertiesSupportedResponse.result.PropertiesSupported.includes('RewindSpeed')) {
            this.getRewindSpeed();
        }
        if (getPropertiesSupportedResponse.result.PropertiesSupported.includes('ProviderName')) {
            this.getProviderName();
        }
        if (getPropertiesSupportedResponse.result.PropertiesSupported.includes('FfwdSpeed')) {
            this.getFfwdSpeed();
        }
        if (getPropertiesSupportedResponse.result.PropertiesSupported.includes('NextTitle')) {
            this.getNextTitle();
        }
        if (getPropertiesSupportedResponse.result.PropertiesSupported.includes('MediaReady')) {
            this.getMediaReady();
        }
        if (getPropertiesSupportedResponse.result.PropertiesSupported.includes('ShuffleState')) {
            this.getShuffleState();
        }
        if (getPropertiesSupportedResponse.result.PropertiesSupported.includes('RepeatState')) {
            this.getRepeatState();
        }
        if (getPropertiesSupportedResponse.result.PropertiesSupported.includes('StatusMsg')) {
            this.getStatusMsg();
        }
        if (getPropertiesSupportedResponse.result.PropertiesSupported.includes('Busy')) {
            this.getBusy();
        }
        if (getPropertiesSupportedResponse.result.PropertiesSupported.includes('Rating')) {
            this.getRating();
        }
        if (getPropertiesSupportedResponse.result.PropertiesSupported.includes('SelectedId')) {
            this.getSelectedId();
        }
    }


    private processMenuResponse(getMenuResponse: GetMenuResponse) {
        console.log("---->", getMenuResponse);
        this.myMP.menuInstanceName = getMenuResponse.result.instanceName;
        this.getReset(this.myMP.menuInstanceName);
        this.getRegisterBusyChnaged(this.myMP.menuInstanceName);
        this.getRegisterClearChanged(this.myMP.menuInstanceName);
        this.getRegisterListChanged(this.myMP.menuInstanceName);
        this.getRegisterStateChanged(this.myMP.menuInstanceName);
        this.getRegisterStatusMsgMenuChanged(this.myMP.menuInstanceName);

        this.getVersion();
        this.getMaxReqItems();
        this.getLevel();
        this.getItemCnt();
        this.getTitle(this.myMP.menuInstanceName);
        this.getSubtitle();
        this.getListSpecificFunctions();
        this.getIsMenuAvailable();
        this.getStatusMsgMenu();
        this.getItemData();
    }

    private getDirectConnectionInfoFromArray(data: any) {
        //console.log('***getDirectConnectionInfoFromArray***');

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


    // Register with a media player device.
    // 1. The initial registration is always via serial join.
    // 2. As long as the device is still online, registration must continue to happen until successful registration.
    //    Note: Retry every 30 seconds for 5 min. Then once per minute.
    // 3. After successful registrcion via serial join, check if a direct connection to teh device can be made.
    private registerWithDevice() {
        console.log('***registerWithDevice***');

        // Params for registration
        const myRPCParams: Params = {
            encoding: 'UTF-8',
            uuid: this.myMPUUID,
            ver: '1.0',
            maxPacketSize: 65535,
            type: 'symbol/json-rpc',
            format: 'JSON',
            name: 'CH5_v2.15', // ToDo: This should be dynamic based on the CH5 version.
            jsonrpc: '3.0'
        };

        // Local object to help generate JSON
        const myRPC: RegisterwithDeviceRequest = {
            jsonrpc: '3.0',
            id: this.getMessageId(),
            method: 'Crpc.Register',
            params: myRPCParams
        };

        const myRPCJSON = JSON.stringify(myRPC);

        // console.log('JSON: ' + myRPCJSON);

        // Keep track of the message id.
        this.myMP.registrationMsgId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);

        // Start the re-send time.
        this.startRegistrationResendTimer();
    }

    // Get all of the media player objects from the device.
    // This is called after a successful registration with the device.
    private getObjects() {
        const myRPC: GetObjectsRequest = {
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: 'Crpc.GetObjects'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getObjectsMsgId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private registerEvent() {

        const myRPC: CommonEventRequest = {
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: 'Crpc.RegisterEvent',
            params: { "ev": "ObjectDirectoryChanged", "handle": "sg" },

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.registerEventMsgId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getPropertiesSupported(instanceName: string) {

        const myRPC: GetPropertiesSupportedRequest = {
            params: { "propName": "PropertiesSupported" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: instanceName + '.GetProperty'

        };
        const myRPCJSON = JSON.stringify(myRPC);
        // console.log('PropertiesSupported Req JSON: ' + myRPCJSON);

        // Keep track of the message id.
        this.myMP.getPropertiesSupportedMsgId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    //Get the Menu (Should check an Autonomic device and see what data is returned) 
    private getMenu(instanceName: string) {
        const myRPC: GetMenuRequest = {
            params: { "uuid": this.myMPUUID },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: instanceName + '.GetMenu'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getMenuMsgId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getRegisterBusyChnaged(instanceName: string) {
        const myRPC: CommonEventRequest = {
            params: { "ev": "BusyChanged", "handle": "sg" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: instanceName + '.RegisterEvent'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getRegisterBusyChangedId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getRegisterStatusMsgChanged(instanceName: string) {
        const myRPC: CommonEventRequest = {
            params: { "ev": "StatusMsgChanged", "handle": "sg" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: instanceName + '.RegisterEvent'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getRegisterStatusMsgChangedId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getRegisterStateChangedByBrowseContext(instanceName: string) {

        const myRPC: CommonEventRequest = {
            params: { "ev": "StateChangedByBrowseContext", "handle": "sg" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: instanceName + '.RegisterEvent'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getRegisterStateChangedByBrowseContextId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getRegisterStateChanged(instanceName: string) {

        const myRPC: CommonEventRequest = {
            params: { "ev": "StateChanged", "handle": "sg" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: instanceName + '.RegisterEvent'

        };
        const myRPCJSON = JSON.stringify(myRPC);
        // Keep track of the message id.
        this.myMP.getRegisterStateChangedId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }


    private getRegisterClearChanged(instanceName: string) {

        const myRPC: CommonEventRequest = {
            params: { "ev": "ClearChanged", "handle": "sg" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: instanceName + '.RegisterEvent'

        };
        const myRPCJSON = JSON.stringify(myRPC);
        // Keep track of the message id.
        this.myMP.getRegisterClearChangedId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getRegisterListChanged(instanceName: string) {

        const myRPC: CommonEventRequest = {
            params: { "ev": "ListChanged", "handle": "sg" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: instanceName + '.RegisterEvent'

        };
        const myRPCJSON = JSON.stringify(myRPC);
        // Keep track of the message id.
        this.myMP.getRegisterListChangedId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getRegisterStatusMsgMenuChanged(instanceName: string) {

        const myRPC: CommonEventRequest = {
            params: { "ev": "StatusMsgMenuChanged", "handle": "sg" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: instanceName + '.RegisterEvent'

        };
        const myRPCJSON = JSON.stringify(myRPC);
        // Keep track of the message id.
        this.myMP.getRegisterStatusMsgMenuChangedId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getReset(instanceName: string) {

        const myRPC: any = {
            params: null,
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: instanceName + '.Reset'

        };
        const myRPCJSON = JSON.stringify(myRPC);
        // Keep track of the message id.
        this.myMP.resetId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getTextLines() {

        const myRPC: CommonRequestPropName = {
            params: { "propName": "TextLines" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.instanceName + '.GetProperty'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getTextLinesId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getActionsSupported() {

        const myRPC: CommonRequestPropName = {
            params: { "propName": "ActionsSupported" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.instanceName + '.GetProperty'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getActionsSupportedId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getActionsAvailable() {

        const myRPC: CommonRequestPropName = {
            params: { "propName": "ActionsAvailable" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.instanceName + '.GetProperty'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getActionsAvailableId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getProgressBar() {

        const myRPC: CommonRequestPropName = {
            params: { "propName": "ProgressBar" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.instanceName + '.GetProperty'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getProgressBarId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getElapsedSec() {

        const myRPC: CommonRequestPropName = {
            params: { "propName": "ElapsedSec" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.instanceName + '.GetProperty'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getElapsedSecId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getTrackSec() {

        const myRPC: CommonRequestPropName = {
            params: { "propName": "TrackSec" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.instanceName + '.GetProperty'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getTrackSecId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getStreamState() {

        const myRPC: CommonRequestPropName = {
            params: { "propName": "StreamState" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.instanceName + '.GetProperty'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getStreamStateId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getTrackNum() {

        const myRPC: CommonRequestPropName = {
            params: { "propName": "TrackNum" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.instanceName + '.GetProperty'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getTrackNumId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getTrackCnt() {

        const myRPC: CommonRequestPropName = {
            params: { "propName": "TrackCnt" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.instanceName + '.GetProperty'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getTrackCntId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getPlayerState() {

        const myRPC: CommonRequestPropName = {
            params: { "propName": "PlayerState" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.instanceName + '.GetProperty'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getPlayerStateId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getPlayerIcon() {

        const myRPC: CommonRequestPropName = {
            params: { "propName": "PlayerIcon" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.instanceName + '.GetProperty'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getPlayerIconId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getPlayerName() {

        const myRPC: CommonRequestPropName = {
            params: { "propName": "PlayerName" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.instanceName + '.GetProperty'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getPlayerNameId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getPlayerIconURL() {

        const myRPC: CommonRequestPropName = {
            params: { "propName": "PlayerIconURL" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.instanceName + '.GetProperty'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getPlayerIconURLId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getMediaType() {

        const myRPC: CommonRequestPropName = {
            params: { "propName": "MediaType" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.instanceName + '.GetProperty'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getMediaTypeId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getInstance() {

        const myRPC: CommonRequestPropName = {
            params: { "propName": "Instance" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.instanceName + '.GetProperty'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getInstanceId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getAlbumArt() {

        const myRPC: CommonRequestPropName = {
            params: { "propName": "AlbumArt" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.instanceName + '.GetProperty'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getAlbumArtId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getAlbumArtUrl() {

        const myRPC: CommonRequestPropName = {
            params: { "propName": "AlbumArtUrl" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.instanceName + '.GetProperty'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getAlbumArtUrlId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getAlbumArtUrlNAT() {

        const myRPC: CommonRequestPropName = {
            params: { "propName": "AlbumArtUrlNAT" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.instanceName + '.GetProperty'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getAlbumArtUrlNATId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getStationName() {

        const myRPC: CommonRequestPropName = {
            params: { "propName": "StationName" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.instanceName + '.GetProperty'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getStationNameId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getAlbum() {

        const myRPC: CommonRequestPropName = {
            params: { "propName": "Album" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.instanceName + '.GetProperty'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getAlbumId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getGenre() {

        const myRPC: CommonRequestPropName = {
            params: { "propName": "Genre" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.instanceName + '.GetProperty'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getGenreId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getArtist() {

        const myRPC: CommonRequestPropName = {
            params: { "propName": "Artist" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.instanceName + '.GetProperty'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getArtistId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getTitle(instanceName: string) {

        const myRPC: CommonRequestPropName = {
            params: { "propName": "Title" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: instanceName + '.GetProperty'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getTitleId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getLanguage() {

        const myRPC: CommonRequestPropName = {
            params: { "propName": "Language" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.instanceName + '.GetProperty'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getLanguageId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getRewindSpeed() {

        const myRPC: CommonRequestPropName = {
            params: { "propName": "RewindSpeed" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.instanceName + '.GetProperty'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getRewindSpeedId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getProviderName() {

        const myRPC: CommonRequestPropName = {
            params: { "propName": "ProviderName" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.instanceName + '.GetProperty'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getProviderNameId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getFfwdSpeed() {

        const myRPC: CommonRequestPropName = {
            params: { "propName": "FfwdSpeed" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.instanceName + '.GetProperty'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getFfwdSpeedId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getNextTitle() {

        const myRPC: CommonRequestPropName = {
            params: { "propName": "NextTitle" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.instanceName + '.GetProperty'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getNextTitleId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getMediaReady() {

        const myRPC: CommonRequestPropName = {
            params: { "propName": "MediaReady" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.instanceName + '.GetProperty'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getMediaReadyId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getShuffleState() {

        const myRPC: CommonRequestPropName = {
            params: { "propName": "ShuffleState" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.instanceName + '.GetProperty'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getShuffleStateId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getRepeatState() {

        const myRPC: CommonRequestPropName = {
            params: { "propName": "RepeatState" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.instanceName + '.GetProperty'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getRepeatStateId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getStatusMsg() {

        const myRPC: CommonRequestPropName = {
            params: { "propName": "StatusMsg" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.instanceName + '.GetProperty'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getStatusMsgId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getBusy() {

        const myRPC: CommonRequestPropName = {
            params: { "propName": "Busy" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.instanceName + '.GetProperty'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getBusyId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getRating() {

        const myRPC: CommonRequestPropName = {
            params: { "propName": "Rating" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.instanceName + '.GetProperty'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getRatingId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getSelectedId() {

        const myRPC: CommonRequestPropName = {
            params: { "propName": "SelectedId" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.instanceName + '.GetProperty'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getSelectedId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getVersion() {
        const myRPC: CommonRequestPropName = {
            params: { "propName": "Version" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.menuInstanceName + '.GetProperty'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getVersionId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getMaxReqItems() {

        const myRPC: CommonRequestPropName = {
            params: { "propName": "MaxReqItems" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.menuInstanceName + '.GetProperty'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getMaxReqItemsId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getLevel() {

        const myRPC: CommonRequestPropName = {
            params: { "propName": "Level" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.menuInstanceName + '.GetProperty'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getLevelId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getItemCnt() {

        const myRPC: CommonRequestPropName = {
            params: { "propName": "ItemCnt" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.menuInstanceName + '.GetProperty'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getItemCntId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getSubtitle() {

        const myRPC: CommonRequestPropName = {
            params: { "propName": "Subtitle" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.menuInstanceName + '.GetProperty'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getSubtitleId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getListSpecificFunctions() {

        const myRPC: CommonRequestPropName = {
            params: { "propName": "ListSpecificFunctions" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.menuInstanceName + '.GetProperty'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getListSpecificFunctionsId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getIsMenuAvailable() {

        const myRPC: CommonRequestPropName = {
            params: { "propName": "IsMenuAvailable" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.menuInstanceName + '.GetProperty'

        };
        const myRPCJSON = JSON.stringify(myRPC);
        // console.log('GetMenu Req JSON: ' + myRPCJSON);

        // Keep track of the message id.
        this.myMP.getIsMenuAvailableId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }

    private getStatusMsgMenu() {

        const myRPC: CommonRequestPropName = {
            params: { "propName": "StatusMsgMenu" },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.menuInstanceName + '.GetProperty'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getStatusMsgMenuId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }


    private getItemData() {

        const myRPC: any = {
            params: { "count": this.itemCount, "item": this.itemLevel },
            jsonrpc: '2.0',
            id: this.getMessageId(),
            method: this.myMP.menuInstanceName + '.GetData'

        };
        const myRPCJSON = JSON.stringify(myRPC);

        // Keep track of the message id.
        this.myMP.getItemDataId = myRPC.id;

        // Send the message.
        this.sendRPCRequest(myRPCJSON);
    }











    private sendRPCRequest(data: any) {
        //console.log('***send RPCData Request***');
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
        /* console.log('***process CRPC Response***'); */
        const responseData = JSON.parse(data);

        // ToDO: Just because the message ID was found, doesn't mean
        /// there were no errors. Add error checking to the response
        // ID handler.

        // Get the messge id.
        // This can be used to determine if a valid response was received
        // for a specific API call we just made.
        const myMsgId = responseData.id;
        /* console.log('Message id: ' + myMsgId); */

        if (myMsgId == this.myMP.registrationMsgId) {
            console.log('Successful registration.');
            this.processRegistrationResponse(responseData);

            // If we are not using a direct connection yet, go ahead and get objects.
            if (!this.myMP.connectionIsDirect) {
                // While objects are being returned, switch the connection to direct (if possible).
                this.getObjects(); //2
            }
        } else if (myMsgId == this.myMP.getObjectsMsgId) {
            console.log('Successful get objects.');
            this.processGetObjectsResponse(responseData);
        } else if (myMsgId == this.myMP.getPropertiesSupportedMsgId) {
            console.log('Successful get PropertiesSupported.');
            this.processPropertiesSupportedResponse(responseData);
        } else if (myMsgId == this.myMP.getMenuMsgId) {
            console.log('Successful get Menus.');
            this.processMenuResponse(responseData);
        } else if (myMsgId == this.myMP.getTextLinesId) {
            console.log('Successful get TextLines->', responseData);
        } else if (myMsgId == this.myMP.getActionsSupportedId) {
            console.log('Successful get ActionsSupported->', responseData);
        } else if (myMsgId == this.myMP.getActionsAvailableId) {
            console.log('Successful get ActionsAvailable->', responseData);
        } else if (myMsgId == this.myMP.getProgressBarId) {
            console.log('Successful get getProgressBar->', responseData);
        } else if (myMsgId == this.myMP.getLevelId) {
            console.log('Successful get Level->', responseData);
            this.itemLevel = responseData.result.Level;
        } else if (myMsgId == this.myMP.getItemCntId) {
            this.itemCount = responseData.result.ItemCnt;
            console.log('Successful get item count->', responseData);
        }
        // Check if an error was returned?
    }


    // error-handler.ts
    private handleError(error: ErrorResponseObject) {
        console.info('Error Code:----  ', error.code);
        console.info('Error message:----  ', error.message);
        console.info('Error Data:----  ', error.data);
        return;
    }

}

export function getInstanceOfMP(): void {
    MusicPlayerLib.getInstance();
};