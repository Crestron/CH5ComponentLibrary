import { publishEvent, subscribeState, unsubscribeState } from "../ch5-core";
import _ from 'lodash';
import { CommonEventRequest, CommonRequestForPopup, CommonRequestPropName, ErrorResponseObject, GetMenuRequest, GetObjectsRequest, GetObjectsResponse, GetPropertiesSupportedRequest, GetPropertiesSupportedResponse, MyMpObject, Params, RegisterwithDeviceRequest, RegisterwithDeviceResponse } from "./commonInterface";
import { encodeString } from "./ch5-media-player-common";
import { TCH5NowPlayingActions } from "./interfaces/t-ch5-media-player";
import { Ch5CommonLog } from "../ch5-common/ch5-common-log";

const MP_PROTOCOL_VERSION = '1.0';
const MP_JSONRPC_VERSION = '2.0';
const MP_DIRECT_CONNECTION_TYPE = 'cip-direct/json-rpc';
const MP_SOCKET_ACTION_CONNECT = 'connect';
const MP_SOCKET_ACTION_DISCONNECT = 'disconnect';
const MP_SOCKET_ACTION_CRPCDATA = 'crpcdata';
const MP_POPUP_TIMEOUT_SEC = 10000;
const MP_CHUNK_SIZE = 248;
const MP_PREFIX_LENGTH = 8;
const MP_EVENT_DELAY_MS = 50;
const MP_RETRY_INTERVAL_MS = 10000;
const MP_CH5_CLIENT_NAME = 'CH5_v2.15';

export class MusicPlayerLib {

    // Serial signals to the control system.
    private mpSigRPCOut: string = "";
    private mpRPCDataIn: string = '';
    private itemValue: number = 1; // Used in infinite scroll feature.
    private resendRegistrationTimeId: any = null;
    private tempResponse: any = "";
    private ignoreFirstData: boolean = false;// ignore first chunked data before register request sent

    private subReceiveStateRefreshMediaPlayerResp: any;
    private subReceiveStateDeviceOfflineResp: any;
    private subReceiveStateCRPCResp: any;
    private subReceiveStateMessageResp: any;
    private subSendEventCRPCJoinNo: any;
    private subControlSystemsOnlineFB: any;
    private naxDeviceOfflineFlag: boolean = false;
    private totalItemCountCheck: number = 0;
    private menuRefreshFlags = { titleChanged: false, levelChanged: false, itemCntChanged: false };
    private firstRegisterRequest: boolean = true; // flag to check whether direct connection is established, to avoid multiple popups in case of multiple registration response with direct connection info before establishing direct connection

    private subCsigSocketResponse: any;
    private subCsigSocketInboundMessage: any;
    private directConnectionFlag = false;

    // Generate a constant UUID once per application start.
    private generateStrongCustomId = (): string => {
        // // Generate timestamp component (base36 for compactness)
        // const timestamp = Date.now().toString(36);

        // // Generate random component (4 groups of 8 hex digits)
        // const random = Array.from({ length: 4 }, () =>
        //     Math.floor(Math.random() * 0xffffffff)
        //         .toString(16)
        //         .padStart(8, '0'),
        // ).join('-');

        // return `${timestamp}-${random}`;

        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    private myMP: MyMpObject = {
        "tag": "",
        "source": 0,
        "connectionActive": false,
        "directConnection": false,
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
    public lastPerformedAction: TCH5NowPlayingActions | null = null;

    private nowPlayingData: any = {
        'ActionsSupported': '', 'ActionsAvailable': '', 'RewindSpeed': '',
        'ProviderName': '', 'PlayerState': '', 'PlayerIcon': '', 'PlayerIconURL': '', 'PlayerName': '',
        'Album': '', 'AlbumArt': '', 'AlbumArtUrl': '', 'AlbumArtUrlNAT': '', 'StationName': '', 'Genre': '', 'Artist': '',
        'Title': '', 'TrackNum': '', 'TrackCnt': '', 'NextTitle': '', 'ShuffleState': '', 'RepeatState': '', 'Rating': {}, 'TextLines': []
    };

    private progressBarData: any = { 'StreamState': '', 'ProgressBar': '', 'ElapsedSec': '', 'TrackSec': '', 'PlayerState': '', 'FfwdSpeed': '' };

    private myMusicData: any = { 'Title': '', 'Subtitle': '', 'ListSpecificFunctions': '', 'ItemCnt': 0, 'MaxReqItems': '', 'IsMenuAvailable': '', 'Level': '' };

    private menuListData: any = { 'MenuData': [] };

    private pendingPropertyRequests: string[] = [];
    private currentPropertyRequestId: number | null = null;
    private nowPlayingEventRequests: string[] = [];
    private menuEventRequests: string[] = [];
    private menuPropertyRequests: string[] = [];

    constructor(public logger: Ch5CommonLog) { }

    private safeJsonParse(value: any): any | null {
        if (typeof value !== 'string' || value.length === 0) {
            return null;
        }
        try {
            return JSON.parse(value);
        } catch (e) {
            this.logger.log('JSON parse error', e);
            return null;
        }
    }

    public debounce = (func: any, wait: number) => {
        let timeout: any;
        return function executedFunction(...args: any[]) {
            const later = () => {
                window.clearTimeout(timeout);
                func(...args);
            };
            // if (timeout) {
            window.clearTimeout(timeout);
            // }
            timeout = window.setTimeout(later, wait);
        };
    };

    public subscribeLibrarySignals() {

        this.ignoreFirstData = false;// first time set to false, to ignore first data
        this.subReceiveStateRefreshMediaPlayerResp = subscribeState('b', 'digital_receiveStateRefreshMediaPlayerResp', (value: boolean) => {
            if (value) {
                const data = { 'userInputRequired': "", "text": "", "textForItems": [], "initialUserInput": "", "timeoutSec": MP_POPUP_TIMEOUT_SEC, "show": false }
                publishEvent('o', 'PopUpMessageData', data); //To close the popups whenever we are switching the player
                this.refreshMediaPlayer();
            }
        });

        this.subReceiveStateDeviceOfflineResp = subscribeState('b', 'digital_receiveStateDeviceOfflineResp', (value: boolean) => {
            this.myMP.connectionActive = !value;
            const data = { 'userInputRequired': "", "text": "No Communication. Please check power and connection.", "textForItems": [], "initialUserInput": "", "timeoutSec": MP_POPUP_TIMEOUT_SEC, "show": true, "donotcloseOnOutsideClick": true }
            this.logger.log('Nax device online:', value);
            if (value) {
                if (this.myMP.directConnection) {
                    const requestedData: any = {
                        "ver": MP_PROTOCOL_VERSION,
                        "action": MP_SOCKET_ACTION_DISCONNECT,
                        "currenttime": new Date().getTime()
                    }
                    clearInterval(this.resendRegistrationTimeId);
                    this.logger.log('Csig.socket.request for disconnect', requestedData);
                    publishEvent('o', "Csig.socket.request", requestedData);
                }
                this.naxDeviceOfflineFlag = true; // when device is offline
                this.clearAllDataObjects();
                this.resetMp();
            } else {
                data.text = "";
                data.show = false;
                const subreceiveStateMessageRespTemp = subscribeState('s', 'serial_receiveStateMessageResp', (value: any) => {
                    if (value.length > 0) {
                        this.clearAllDataObjects();
                        this.resetMp();
                        this.processMessage(value, true);
                        setTimeout(() => {
                            unsubscribeState('s', 'serial_receiveStateMessageResp', subreceiveStateMessageRespTemp);
                        }, 100);
                    }
                });
            }
            publishEvent('o', 'PopUpMessageData', data);
        });

        this.subscribeCRCPRespSignal();// we are making seperate function direct connection  

        //receiveStateMessageResp from CS (ver tag src)
        this.subReceiveStateMessageResp = subscribeState('s', 'serial_receiveStateMessageResp', (value: any) => {
            if (value.length > 0) {
                this.processMessage(value);
            }
        });

        //To get join name from the component
        this.subSendEventCRPCJoinNo = subscribeState('s', 'serial_sendEventCRPCJoinNo', (value: any) => {
            this.mpSigRPCOut = value;
        });

        this.subControlSystemsOnlineFB = subscribeState('b', 'Csig.All_Control_Systems_Online_fb', (value: boolean) => {
            if (value) {
                const subreceiveStateMessageRespTemp = subscribeState('s', 'serial_receiveStateMessageResp', (value: any) => {
                    if (value.length > 0) {
                        this.clearAllDataObjects();
                        this.resetMp();
                        this.processMessage(value, true);
                        setTimeout(() => {
                            unsubscribeState('s', 'serial_receiveStateMessageResp', subreceiveStateMessageRespTemp);
                        }, 100);
                    }
                });
            } else {
                // When DC is active and CS goes offline,We need to disconnect from the device if we have an active direct connection.   
                if (this.myMP.directConnection) {
                    const requestedData: any = {
                        "ver": MP_PROTOCOL_VERSION,
                        "action": MP_SOCKET_ACTION_DISCONNECT,
                        "currenttime": new Date().getTime()
                    }
                    clearInterval(this.resendRegistrationTimeId);
                    this.logger.log('Csig.socket.request for disconnect', requestedData);
                    publishEvent('o', "Csig.socket.request", requestedData);
                }
            }
        });
    }

    private subscribeCRCPRespSignal() {
        this.subReceiveStateCRPCResp = subscribeState('s', 'serial_receiveStateCRPCResp', (value: any) => {
            // On an update request, the control system will send that last serial data on the join, which
            // may be a partial message. We need to ignore that data.
            if ((value.length > 0) && !_.isEqual(this.tempResponse, value) && this.ignoreFirstData) {
                this.tempResponse = value;
                const mpRPCPrefix = value.substring(0, MP_PREFIX_LENGTH).trim(); // First 8 bytes is the RPC prefix.
                // Check byte 3 to determine if this is a single or partial message.
                // c = partial message
                // e = single or final message when a partial message was received.
                if (mpRPCPrefix[3] === 'c') {
                    this.mpRPCDataIn = this.mpRPCDataIn + value.substring(MP_PREFIX_LENGTH); // Gather the CRPC data.
                    // console.log('Found c in prefix.');
                } else if (mpRPCPrefix[3] === 'e') {
                    // console.log('Found e in prefix.');
                    if (this.mpRPCDataIn.trim() === '') {
                        this.mpRPCDataIn = value.substring(MP_PREFIX_LENGTH); // Gather the CRPC data.
                    } else {
                        this.mpRPCDataIn = this.mpRPCDataIn + value.substring(MP_PREFIX_LENGTH); // Gather the CRPC data.
                    }
                    this.tempResponse = '';

                    // check error
                    const parsedData = this.safeJsonParse(this.mpRPCDataIn);
                    if (parsedData) {
                        if (parsedData.error) {
                            this.handleError(parsedData.error);
                        } else {
                            this.processCRPCResponse(parsedData); // Process the entire payload then clear the var.
                        }
                    }

                    this.mpRPCDataIn = ''; // Clear the var now that we have the entire message.
                }
            }
        });
    }

    public subscribeCSIGSignals() {
        // Direct connection socket responses
        this.subCsigSocketResponse = subscribeState('o', 'Csig.socket.response', (response: any) => {
            this.logger.log('Csig.socket.response:', response);
            let responseData: any = {};
            if (typeof response === 'string') {
                responseData = this.safeJsonParse(response) || {};
            } else {
                responseData = response;
            }
            if (responseData.statusCode === 0 && responseData.status === "connecting") {
                this.logger.log("Direct connection in progress with Media Player device...");
                return;
            }
            if (responseData.statusCode === 0 && responseData.status === "connected") {
                this.myMP.directConnection = true;
                clearInterval(this.resendRegistrationTimeId);// to clear registerevent re-send timer once direct connection is established, as we will not be needing to re-send registration via join anymore
                this.logger.log("Direct connection established with Media Player device.");
                if (this.myMP.tag && this.myMP.source) {
                    this.directConnectionFlag = true;
                    unsubscribeState('s', 'serial_receiveStateCRPCResp', this.subReceiveStateCRPCResp); //unsubscribe from join-based CRPC response since we have established direct connection and we will be getting CRPC responses via socket
                    this.debouncedRegisterWithDevice();
                }
            } else if (responseData.statusCode === 0 && responseData.status === "disconnected") {
                this.myMP.directConnection = false;
                this.logger.log("Direct connection disconnected.", responseData);
            } else if ((responseData.statusCode === 1001) || (responseData.statusCode === 1002) || (responseData.statusCode === 1003)) {
                this.logger.log("Error 1001/1002/1003", responseData);
                const requestedData: any = {
                    "ver": MP_PROTOCOL_VERSION,
                    "action": MP_SOCKET_ACTION_DISCONNECT,
                    "currenttime": new Date().getTime()
                }
                clearInterval(this.resendRegistrationTimeId);
                this.logger.log('Csig.socket.request for disconnect', requestedData);
                publishEvent('o', "Csig.socket.request", requestedData);// on player change we have to disconnect direct connection and then establish new direct connection with new player.
                unsubscribeState('s', 'serial_receiveStateCRPCResp', this.subReceiveStateCRPCResp);
                this.subscribeCRCPRespSignal();
                this.debouncedRegisterWithDevice();
            } else {
                this.myMP.directConnection = false;
                this.logger.log('Unknown Error from direct connection', responseData.statusCode, responseData.status);
            }
        });

        this.subCsigSocketInboundMessage = subscribeState('o', 'Csig.socket.inboundmessage', (response: any) => {
            this.logger.log('Csig.socket.inboundmessage response:', response);
            if (!this.myMP.directConnection) { // if direct connection is not established, we should not process the message. This is a safety check since we should only be getting CRPC messages via this socket when we have established a direct connection.
                return;
            }

            let responseData: any = {};
            if (typeof response === 'string') {
                responseData = this.safeJsonParse(response) || {};
            } else {
                responseData = response;
            }
            if (responseData.action === MP_SOCKET_ACTION_CRPCDATA) {
                this.processCRPCResponse(responseData.payload);
            }
        });
    }

    private clearAllDataObjects() {
        if (this.resendRegistrationTimeId) {
            clearInterval(this.resendRegistrationTimeId);
            this.resendRegistrationTimeId = null;
        }
        this.myMusicPublishData = {};
        this.nowPlayingPublishData = {};
        this.progressBarPublishData = {};
        this.menuListPublishData = { 'MenuData': [] };
        this.itemValue = 1;
        this.totalItemCountCheck = 0;
        this.firstRegisterRequest = true;

        publishEvent('o', 'myMusicData', this.myMusicPublishData);
        publishEvent('o', 'nowPlayingData', this.nowPlayingPublishData);
        publishEvent('o', 'progressBarData', this.progressBarPublishData);
        publishEvent('o', 'menuListData', this.menuListPublishData);
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
        if (this.myMP.connectionActive && !this.naxDeviceOfflineFlag) {
            this.unregisterWithDevice();
        }
        // Register with the new device. ToDo: Add checks for online & tag values.
        if (this.myMP.tag && this.myMP.connectionActive && !this.naxDeviceOfflineFlag) {
            if (this.directConnectionFlag) {
                this.directConnectionFlag = false;
                this.subscribeCRCPRespSignal();
            }
            this.debouncedRegisterWithDevice();
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
        if (this.resendRegistrationTimeId) {
            clearInterval(this.resendRegistrationTimeId);
        }
        this.resendRegistrationTimeId = setInterval(() => {
            this.registerWithDevice();
        }, MP_RETRY_INTERVAL_MS);
    }

    // Process message data from the control system.
    // Note: On an update request from the control system, the last data to be sent
    // will be the message string.
    private processMessage(data: any, param: boolean = false) {
        const myObj = this.safeJsonParse(data);
        if (!myObj) {
            return;
        }
        if (myObj.hasOwnProperty("tag")) {
            // ToDo: Need to check if the tag matches in case the device
            // is sending us the wrong data. The dealer could have the router
            // module in SIMPL incorrectly configured.
            this.myMP.tag = myObj.tag;
        }

        if (myObj.hasOwnProperty("src")) {
            // If this is a different source, we need to refresh the media player.
            // This will also happen on an update request since no source value has been set yet.
            if (param) {
                // this is need only when CS comes online fromm offline state
                unsubscribeState('s', 'serial_receiveStateCRPCResp', this.subReceiveStateCRPCResp);
                this.subscribeCRCPRespSignal();
                this.debouncedRegisterWithDevice();
            } else if (this.myMP.source != myObj.src) {
                this.refreshMediaPlayer();
            }
            this.myMP.source = myObj.src;
        }
    }

    private processGetObjectsResponse(getObjectResponse: GetObjectsResponse) {
        const myInstances = getObjectResponse.result.objects.object;
        myInstances.forEach((item: any) => {
            // item.instancename = item.instancename ? item.instancename : item.instanceName
            if (item.interfaces.includes("IMediaPlayer")) {
                this.myMP.instanceName = item.instancename ? item.instancename : item.instanceName;
            }
            // else if (item.name === 'MediaPlayerMenu' || item.name === 'Menu') {
            //     this.myMP.menuInstanceName = item.instancename;
            // }
        });

        this.registerEvent();
        this.getMenu(this.myMP.instanceName);
    }

    private processPropertiesSupportedResponse(getPropertiesSupportedResponse: GetPropertiesSupportedResponse) {
        const properties = getPropertiesSupportedResponse.result.PropertiesSupported;
        this.pendingPropertyRequests = properties.filter((item: any) => item !== 'PropertiesSupported');
        this.sendNextPropertyRequest();
        this.naxDeviceOfflineFlag = false;
    }

    private sendNextPropertyRequest() {
        if (!this.myMP.instanceName) {
            return;
        }
        if (this.currentPropertyRequestId !== null) {
            return;
        }
        const nextProp = this.pendingPropertyRequests.shift();
        if (!nextProp) {
            return;
        }
        const myRPC: CommonRequestPropName = {
            params: { "propName": nextProp },
            jsonrpc: MP_JSONRPC_VERSION,
            id: this.generateUniqueMessageId(),
            method: this.myMP.instanceName + '.GetProperty'
        };
        this.myMP[nextProp + "Id"] = myRPC.id; // Keep track of the message id.
        this.currentPropertyRequestId = myRPC.id;
        this.sendRPCRequest(myRPC);// Send the message.
    }

    private registerForNowPlayingChangedEvent() {
        this.nowPlayingEventRequests = ['BusyChanged', 'StatusMsgChanged', 'StateChangedByBrowseContext', 'StateChanged'];
        this.sendNextNowPlayingEventRequest();
    }

    private sendNextNowPlayingEventRequest() {
        this.nowPlayingEventRequests.map((item: any) => {
            const myRPC: CommonEventRequest = {
                params: { "ev": item, "handle": "ch5" },
                jsonrpc: MP_JSONRPC_VERSION,
                id: this.generateUniqueMessageId(),
                method: this.myMP.instanceName + '.RegisterEvent'
            };
            this.myMP[item + 'Id'] = myRPC.id; // Keep track of the message id.
            setTimeout(() => {
                this.sendRPCRequest(myRPC); // Send the message.
            }, MP_EVENT_DELAY_MS);
        });
    }

    private registerForMenuChangedEvent() {
        this.menuEventRequests = ['Reset', 'BusyChanged', 'ClearChanged', 'ListChanged', 'StateChanged', 'StatusMsgMenuChanged'];
        this.sendNextMenuEventRequest();

        this.menuPropertyRequests = ['Version', 'MaxReqItems', 'Level', 'ItemCnt', 'Title', 'Subtitle', 'ListSpecificFunctions', 'IsMenuAvailable', 'StatusMsgMenu', 'Instance'];
        this.sendNextMenuPropertyRequest();
    }

    private sendNextMenuEventRequest() {
        this.menuEventRequests.map((item: any) => {
            const myRPC: CommonEventRequest = {
                params: { "ev": item, "handle": "ch5" },
                jsonrpc: MP_JSONRPC_VERSION,
                id: this.generateUniqueMessageId(),
                method: this.myMP.menuInstanceName + '.RegisterEvent'
            };
            if (item === 'Reset') {
                myRPC.params = null;
                myRPC.method = this.myMP.menuInstanceName + '.Reset'
            }
            setTimeout(() => {
                this.sendRPCRequest(myRPC);
            }, MP_EVENT_DELAY_MS);
        });
    }

    private sendNextMenuPropertyRequest() {
        this.menuPropertyRequests.map((item: any) => {
            const myRPC: CommonRequestPropName = {
                params: { "propName": item },
                jsonrpc: MP_JSONRPC_VERSION,
                id: this.generateUniqueMessageId(),
                method: this.myMP.menuInstanceName + '.GetProperty'
            };
            if (item === 'Title') {
                this.myMP[item + 'MenuId'] = myRPC.id;// Keep track of the message id.
            }
            setTimeout(() => {
                this.sendRPCRequest(myRPC);
            }, MP_EVENT_DELAY_MS);
        });
    }

    private unregisterWithDevice() {
        // We need to unregister with both the Media Player instance
        // as well as the Media player Menu instance.

        if (this.myMP.instanceName && this.myMP.menuInstanceName) {
            ['BusyChanged', 'StatusMsgChanged', 'StateChangedByBrowseContext', 'StateChanged'].forEach((item: any) => {
                const myRPC: CommonEventRequest = {
                    params: { "ev": item, "handle": "ch5" },
                    jsonrpc: MP_JSONRPC_VERSION,
                    id: this.generateUniqueMessageId(),
                    method: this.myMP.instanceName + '.DeregisterEvent'

                };
                setTimeout(() => {
                    this.sendRPCRequest(myRPC);
                }, MP_EVENT_DELAY_MS);
            });
            ['BusyChanged', 'ClearChanged', 'ListChanged', 'StateChanged', 'StatusMsgMenuChanged'].forEach((item: any) => {
                const myRPC: CommonEventRequest = {
                    params: { "ev": item, "handle": "ch5" },
                    jsonrpc: MP_JSONRPC_VERSION,
                    id: this.generateUniqueMessageId(),
                    method: this.myMP.menuInstanceName + '.DeregisterEvent'

                };
                setTimeout(() => {
                    this.sendRPCRequest(myRPC);
                }, MP_EVENT_DELAY_MS);
            });
            if (this.myMP.directConnection) {
                const requestedData: any = {
                    "ver": MP_PROTOCOL_VERSION,
                    "action": MP_SOCKET_ACTION_DISCONNECT,
                    "currenttime": new Date().getTime()
                }
                this.logger.log('Csig.socket.request disconnect', requestedData);
                publishEvent('o', "Csig.socket.request", requestedData);// on player change we have to disconnect direct connection and then establish new direct connection with new player.
            }

            this.clearAllDataObjects();
            this.resetMp();
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
            ver: MP_PROTOCOL_VERSION,
            maxPacketSize: 65535,
            type: 'symbol/json-rpc',
            format: 'JSON',
            name: MP_CH5_CLIENT_NAME, // ToDo: This should be dynamic based on the CH5 version.
        };

        const myRPC: RegisterwithDeviceRequest = {
            jsonrpc: MP_JSONRPC_VERSION,
            id: this.generateUniqueMessageId(),
            method: 'Crpc.Register',
            params: myRPCParams
        };

        this.myMP.RegistrationId = myRPC.id; // Keep track of the message id.
        this.ignoreFirstData = true;
        this.sendRPCRequest(myRPC);
        // Start the re-send time.
        if (!this.resendRegistrationTimeId) {
            this.startRegistrationResendTimer();
        }
    }

    private processRegistrationResponse(dataObj: RegisterwithDeviceResponse) {
        // Make sure we have a result.
        // When we perform the CS to Nax registration, the response data will contain Nax-related information, including IP, IP subnet, name, and other details, which we may use in the future if required.
        if (dataObj.result) {
            // We have a response, so our connnecton is active.
            this.myMP.connectionActive = true;
            let myDirectConnectionInfo: any = {};

            if (dataObj.result.ver == MP_PROTOCOL_VERSION && dataObj.result.connections) {
                myDirectConnectionInfo.ip = dataObj.result?.connections[MP_DIRECT_CONNECTION_TYPE]?.ip;
                myDirectConnectionInfo.port = dataObj.result?.connections[MP_DIRECT_CONNECTION_TYPE]?.port;
            }
            else if (dataObj.result?.connectionslist) {
                myDirectConnectionInfo = this.getDirectConnectionInfoFromArray(dataObj.result.connectionslist);
            }

            // create request objectfor direct connection
            const requestObject: any = {
                "ver": MP_PROTOCOL_VERSION,
                "action": MP_SOCKET_ACTION_CONNECT,
                "hostname": myDirectConnectionInfo.ip,
                "port": myDirectConnectionInfo.port,
                "currenttime": new Date().getTime()
            }

            if (this.firstRegisterRequest) {
                this.logger.log('Csig.socket.request for connect', requestObject);
                publishEvent('o', 'Csig.socket.request', requestObject);
                this.firstRegisterRequest = false;
            } else {
                clearInterval(this.resendRegistrationTimeId);
                this.getObjects();
            }
        }
    }

    private getDirectConnectionInfoFromArray(data: any) {
        // Data is an array of connections.
        const myConnectionData: any = {};
        myConnectionData.ip = '';
        myConnectionData.port = 0;
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            if (item.type == MP_DIRECT_CONNECTION_TYPE) {
                myConnectionData.ip = item.ip;
                myConnectionData.port = item.port;
            }
        }

        return myConnectionData;
    }

    private debouncedRegisterWithDevice = this.debounce(() => {
        this.registerWithDevice();
    }, MP_EVENT_DELAY_MS);

    // Get all of the media player objects from the device.
    // This is called after a successful registration with the device.
    private getObjects() {
        const myRPC: GetObjectsRequest = {
            jsonrpc: MP_JSONRPC_VERSION,
            id: this.generateUniqueMessageId(),
            method: 'Crpc.GetObjects'
        };
        this.myMP.ObjectsId = myRPC.id;// Keep track of the message id.
        this.sendRPCRequest(myRPC);// Send the message.
    }

    private registerEvent() {
        const myRPC: CommonEventRequest = {
            jsonrpc: MP_JSONRPC_VERSION,
            id: this.generateUniqueMessageId(),
            method: 'Crpc.RegisterEvent',
            params: { "ev": "ObjectDirectoryChanged", "handle": "ch5" },
        };
        this.sendRPCRequest(myRPC); // Send the message.
    }
    private getPropertiesSupported(instanceName: string) {
        const myRPC: GetPropertiesSupportedRequest = {
            params: { "propName": "PropertiesSupported" },
            jsonrpc: MP_JSONRPC_VERSION,
            id: this.generateUniqueMessageId(),
            method: instanceName + '.GetProperty'
        };
        this.myMP.PropertiesSupportedId = myRPC.id;// Keep track of the message id.
        this.sendRPCRequest(myRPC);
    }

    //Get the Menu (Should check an Autonomic device and see what data is returned) 
    private getMenu(instanceName: string) {
        const myRPC: GetMenuRequest = {
            params: { "uuid": this.generateStrongCustomId() },
            jsonrpc: MP_JSONRPC_VERSION,
            id: this.generateUniqueMessageId(),
            method: instanceName + '.GetMenu'
        };
        this.myMP.MenuId = myRPC.id;// Keep track of the message id.
        if (instanceName) {
            this.sendRPCRequest(myRPC);
        }
    }

    public getItemData(infiniteScroll = false) {
        if (!infiniteScroll) {
            this.itemValue = 1;
            this.menuListData['MenuData'] = [];
        }

        let itemCount = this.myMusicData['ItemCnt'];
        // Recheck why undefined
        let count = 0
        if (itemCount) {
            count = (itemCount < this.maxReqItems) ? itemCount : this.maxReqItems;
        }
        itemCount = itemCount - count;

        if (count > 0) {
            const myRPC: any = {
                params: { item: this.itemValue, count },
                jsonrpc: MP_JSONRPC_VERSION,
                id: this.generateUniqueMessageId(),
                method: this.myMP.menuInstanceName + '.GetData'
            };
            this.myMP.ItemDataId = myRPC.id; // Keep track of the message id.
            if (this.myMP.menuInstanceName) {
                this.sendRPCRequest(myRPC);
            }
            this.itemValue = this.itemValue + this.maxReqItems;
        } else { // whenever itemcount is 0, no need to do Api request, pass empty data. Same as VTpro
            this.menuListData['MenuData'] = [];
            this.menuListPublishData = { ...this.menuListData };
            publishEvent('o', 'menuListData', this.menuListPublishData);
        }
    }

    private sendRPCRequest(data: any) {
        let requestedData = '';
        data = JSON.stringify(data);
        if (this.myMP.directConnection) {
            const requestedData: any = {
                "ver": MP_PROTOCOL_VERSION,
                "action": MP_SOCKET_ACTION_CRPCDATA,
                "payload": data,
                "currenttime": new Date().getTime()
            }
            this.logger.log('Csig.socket.request for CRCP:', JSON.stringify(requestedData));
            publishEvent('o', "Csig.socket.request", requestedData);
        } else {
            let myPrefix = '';
            const numberOfChar = MP_CHUNK_SIZE;

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
    }

    // Process CRPC data from the control system.
    private processCRPCResponse(data: any) {
        const responseData = data;
        // Get the messge id.
        // This can be used to determine if a valid response was received
        // for a specific API call we just made.
        const myMsgId = responseData.id;

        if (this.currentPropertyRequestId === myMsgId) {
            this.currentPropertyRequestId = null;
            this.sendNextPropertyRequest();
        }

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
                if (item === 'ElapsedSec' || item === 'TrackSec' || item === 'StreamState' || item === 'ProgressBar' || item === 'FfwdSpeed') {
                    this.progressBarData[item] = responseData.params?.parameters[item];
                } else {
                    this.nowPlayingData[item] = responseData.params?.parameters[item];
                }
                if (item === 'PlayerState') {
                    this.progressBarData[item] = responseData.params?.parameters[item];
                }
            }
        } else if (menuInstanceMethod === responseData.method && responseData.params.ev === 'StateChanged' && responseData.params?.parameters) { // My music  statechanged 
            const params = responseData.params?.parameters;
            const titleChanged = params.hasOwnProperty('Title') && this.myMusicData['Title'] !== params['Title'];
            const levelChanged = params.hasOwnProperty('Level') && this.myMusicData['Level'] !== params['Level'];
            const itemCntChanged = params.hasOwnProperty('ItemCnt') && this.myMusicData['ItemCnt'] !== params['ItemCnt'];

            // Added a title check to handle multiple instance scenario. In the current instance the isItemCountNew value will be false, when there is any action in other instance, we need to get the updated menudata
            if (params.hasOwnProperty('Title')) {
                this.myMusicData['ItemCnt'] = params['ItemCnt'];
                this.updatedMenuData(); // we need to call only when statechanged event has parameters object include key has Title
            }

            for (const item in params) {
                if (this.myMusicData.hasOwnProperty(item)) {
                    this.myMusicData[item] = params[item];
                }
            }

            if (titleChanged) {
                this.menuRefreshFlags.titleChanged = true;
            }
            if (levelChanged) {
                this.menuRefreshFlags.levelChanged = true;
            }
            if (itemCntChanged) {
                this.menuRefreshFlags.itemCntChanged = true;
            }
            this.checkAndTriggerMenuRefresh();
        } else if ((playerInstanceMethod === responseData.method || menuInstanceMethod === responseData.method) &&
            (responseData?.params?.ev === 'StatusMsgMenuChanged' || responseData?.params?.ev === 'StatusMsgChanged' || responseData?.params?.ev === 'StatusMsgMenu') &&
            responseData.params?.parameters) { // My music and Now Playing  Popup data
            publishEvent('o', 'PopUpMessageData', responseData.params?.parameters ? responseData.params.parameters : {});
        } else if (myMsgId === this.myMP.PlayId || myMsgId === this.myMP.PauseId || myMsgId === this.myMP.SeekId) { // Play or pause clicked
            this.callTrackTime();
        } else {
            if (myMsgId == this.myMP.RegistrationId) {
                if (this.myMP.directConnection) {
                    clearInterval(this.resendRegistrationTimeId);
                    this.getObjects();
                } else {
                    if (this.isDesktopBrowser()) {
                        clearInterval(this.resendRegistrationTimeId);
                        this.getObjects(); // for non crestron devices 
                    } else {
                        this.processRegistrationResponse(responseData);
                    }
                }
                //this.myMP.connectionActive = true;
                // While objects are being returned, switch the connection to direct (if possible).
                //this.getObjects();
            } else if (myMsgId == this.myMP.ObjectsId) {
                this.processGetObjectsResponse(responseData);
            } else if (myMsgId == this.myMP.PropertiesSupportedId) {
                this.registerForNowPlayingChangedEvent();
                this.registerForMenuChangedEvent();
                this.processPropertiesSupportedResponse(responseData);
            } else if (myMsgId == this.myMP.MenuId) {
                this.myMP.menuInstanceName = responseData.result.instanceName;
                this.getPropertiesSupported(this.myMP.instanceName);
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
                    const previousTitle = this.myMusicData[responseKey];
                    this.myMusicData[responseKey] = responseValue;
                    if (previousTitle !== responseValue) {
                        this.menuRefreshFlags.titleChanged = true;
                        this.checkAndTriggerMenuRefresh();
                    }
                } else if (myMsgId === this.myMP.TitleId) { // we have two titles, to get only the player instance title we have this condition
                    this.nowPlayingData[responseKey] = responseValue;
                } else if ((responseKey !== "Title") && (this.nowPlayingData.hasOwnProperty(responseKey))) {
                    this.nowPlayingData[responseKey] = responseValue;
                } else if (this.progressBarData.hasOwnProperty(responseKey)) {
                    this.progressBarData[responseKey] = responseValue;
                } else if ((responseKey !== "Title") && this.myMusicData.hasOwnProperty(responseKey)) {
                    const previousValue = this.myMusicData[responseKey];
                    if (responseKey === 'ItemCnt') {
                        const numericResponseValue = typeof responseValue === 'number' ? responseValue : Number(responseValue);
                        if (!Number.isNaN(numericResponseValue)) {
                            this.myMusicData[responseKey] = numericResponseValue;
                            if (this.totalItemCountCheck !== numericResponseValue) {// to avoid multiple calls
                                this.totalItemCountCheck = numericResponseValue;
                                if (previousValue !== numericResponseValue) {
                                    this.menuRefreshFlags.itemCntChanged = true;
                                    this.checkAndTriggerMenuRefresh();
                                }
                            }
                        }
                    } else {
                        this.myMusicData[responseKey] = responseValue;
                    }
                    if (responseKey === 'Level' && previousValue !== responseValue) {
                        this.menuRefreshFlags.levelChanged = true;
                        this.checkAndTriggerMenuRefresh();
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
    public nowPlayingEvent(action: TCH5NowPlayingActions, time: number = 0) {
        this.lastPerformedAction = action;
        const myRPC: CommonEventRequest = {
            params: action === TCH5NowPlayingActions.Seek ? { 'time': time } : null,
            jsonrpc: MP_JSONRPC_VERSION,
            id: this.generateUniqueMessageId(),
            method: this.myMP.instanceName + '.' + action
        };
        this.myMP[action + 'Id'] = myRPC.id;
        this.sendRPCRequest(myRPC);
    }

    // MyMusic component action
    public myMusicEvent(action: string, itemIndex: number = 0) {
        this.totalItemCountCheck = 0;// to reset total item count check on any action
        this.lastPerformedAction = null;
        const param = itemIndex === 0 ? null : { 'item': itemIndex };
        const myRPC: CommonEventRequest = {
            params: param,
            jsonrpc: MP_JSONRPC_VERSION,
            id: this.generateUniqueMessageId(),
            method: this.myMP.menuInstanceName + '.' + action
        };
        this.sendRPCRequest(myRPC);
    }

    private callTrackTime() {
        ['ElapsedSec', 'TrackSec'].forEach((item: any) => {
            const myRPC: CommonRequestPropName = {
                params: { "propName": item },
                jsonrpc: MP_JSONRPC_VERSION,
                id: this.generateUniqueMessageId(),
                method: this.myMP.instanceName + '.GetProperty'
            };
            if (this.myMP.instanceName) {
                setTimeout(() => {
                    this.sendRPCRequest(myRPC);
                }, MP_EVENT_DELAY_MS);
            }
        });
    };

    private updatedMenuData() {
        ['ListSpecificFunctions', 'StatusMsgMenu', 'Instance', 'TransactionId', 'ItemCnt'].forEach((item: any) => {
            const myRPC: CommonRequestPropName = {
                params: { "propName": item },
                jsonrpc: MP_JSONRPC_VERSION,
                id: this.generateUniqueMessageId(),
                method: this.myMP.menuInstanceName + '.GetProperty'
            };
            if (this.myMP.menuInstanceName) {
                setTimeout(() => {
                    this.sendRPCRequest(myRPC);
                }, MP_EVENT_DELAY_MS);
            }
        });
        // this.getItemData();
    };

    private checkAndTriggerMenuRefresh() {
        if (this.menuRefreshFlags.titleChanged
            || this.menuRefreshFlags.levelChanged
            || this.menuRefreshFlags.itemCntChanged) {
            this.menuRefreshFlags = { titleChanged: false, levelChanged: false, itemCntChanged: false };
            this.getItemData();
        }
    }

    // Component level popup action
    public popUpAction(inputValue: string = "", id: number = 0) {
        this.lastPerformedAction = null;
        const myRPC: CommonRequestForPopup = {
            params: {
                "localExit": id < 0 ? true : false,
                "state": id < 0 ? 0 : 1,
                "id": id,
                "userInput": inputValue ? encodeString(inputValue) : ""
            },
            jsonrpc: MP_JSONRPC_VERSION,
            id: this.generateUniqueMessageId(),
            method: this.myMP.menuInstanceName + '.StatusMsgResponseMenu'
        };
        if (id === 999 && this.myMP.menuInstanceName) {    //this condition is for autonomic search popup
            const autonomicSearchRPC = {
                params: {
                    query: inputValue
                },
                jsonrpc: MP_JSONRPC_VERSION,
                id: this.generateUniqueMessageId(),
                method: this.myMP.menuInstanceName + '.Find'
            }
            this.sendRPCRequest(autonomicSearchRPC);
        } else {
            if (this.myMP.menuInstanceName) {
                this.sendRPCRequest(myRPC);// Send the message.
            }
        }
    };

    public unsubscribeLibrarySignals(clearObject: boolean = true) {
        if (this.resendRegistrationTimeId) {
            clearInterval(this.resendRegistrationTimeId);
            this.resendRegistrationTimeId = null;
        }
        unsubscribeState('b', 'digital_receiveStateRefreshMediaPlayerResp', this.subReceiveStateRefreshMediaPlayerResp);
        unsubscribeState('b', 'digital_receiveStateDeviceOfflineResp', this.subReceiveStateDeviceOfflineResp);
        unsubscribeState('s', 'serial_receiveStateCRPCResp', this.subReceiveStateCRPCResp);
        unsubscribeState('s', 'serial_receiveStateMessageResp', this.subReceiveStateMessageResp);
        unsubscribeState('s', 'serial_sendEventCRPCJoinNo', this.subSendEventCRPCJoinNo);
        unsubscribeState('b', 'Csig.All_Control_Systems_Online_fb', this.subControlSystemsOnlineFB);

        if (clearObject) {
            this.menuListPublishData = { 'MenuData': [] };
            this.nowPlayingPublishData = {};
            this.myMusicPublishData = {};
            this.progressBarPublishData = {};
            this.clearAllDataObjects();
            this.totalItemCountCheck = 0
            this.resetMp();
        }
    }

    public unsubscribeCSIGSignals() {
        unsubscribeState('o', 'Csig.socket.response', this.subCsigSocketResponse);
        unsubscribeState('o', 'Csig.socket.inboundmessage', this.subCsigSocketInboundMessage);
        this.myMP.directConnection = false;
    }


    public resetMp() {
        this.myMP = {
            "tag": "",
            "source": 0,
            "connectionActive": true,
            "directConnection": false,
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

        this.nowPlayingData = {
            'ActionsSupported': '', 'ActionsAvailable': '', 'RewindSpeed': '',
            'ProviderName': '', 'PlayerState': '', 'PlayerIcon': '', 'PlayerIconURL': '', 'PlayerName': '',
            'Album': '', 'AlbumArt': '', 'AlbumArtUrl': '', 'AlbumArtUrlNAT': '', 'StationName': '', 'Genre': '', 'Artist': '',
            'Title': '', 'TrackNum': '', 'TrackCnt': '', 'NextTitle': '', 'ShuffleState': '', 'RepeatState': '', 'Rating': {}, 'TextLines': []
        };

        this.progressBarData = { 'StreamState': '', 'ProgressBar': '', 'ElapsedSec': '', 'TrackSec': '', 'PlayerState': '', 'FfwdSpeed': '' };

        this.myMusicData = { 'Title': '', 'Subtitle': '', 'ListSpecificFunctions': '', 'ItemCnt': 0, 'MaxReqItems': '', 'IsMenuAvailable': '', 'Level': '' }

        this.menuListData = { 'MenuData': [] };
        this.totalItemCountCheck = 0;

        this.pendingPropertyRequests = [];
        this.currentPropertyRequestId = null;
    }

    private isDesktopBrowser(): boolean {
        try {
            const ua = navigator.userAgent || navigator.vendor || (window as any).opera || '';
            const vendor = (navigator as any).vendor || '';
            const platform = (navigator as any).platform || '';
            const maxTouchPoints = (navigator as any).maxTouchPoints || 0;

            // 1) Android (phones/tablets)
            if (/android/i.test(ua)) {
                this.logger.log('Running on Android');
                return false;
            }

            // 2) Classic iOS (iPhone, iPod, iPad < iPadOS 13)
            if (/iPhone|iPod|iPad/i.test(ua)) {
                this.logger.log('Running on iOS (classic UA match)');
                return false;
            }

            // 3) iPadOS 13+ (spoofs as Mac)
            // Heuristic: Mac platform + multiple touch points => iPadOS
            if (platform === 'MacIntel' && maxTouchPoints > 1) {
                this.logger.log('Running on iPadOS (MacIntel + touch)');
                return false;
            }

            // 4) Additional Apple mobile hint (rare edge cases)
            // Vendor Apple + Mobile Safari token but not Chrome-on-iOS (CriOS)
            const isAppleMobile =
                /Apple/i.test(vendor) &&
                /Safari/i.test(ua) &&
                !/CriOS/i.test(ua) &&
                /Mobile/i.test(ua);

            if (isAppleMobile) {
                this.logger.log('Running on iOS (vendor/mobile hint)');
                return false;
            }

            // Otherwise, treat as desktop/other
            this.logger.log('Running on Desktop or other OS');
            return true;
        } catch (e) {
            // Fail-safe: assume desktop if detection errors
            this.logger.log('Environment detection error, assuming Desktop:', e);
            return true;
        }
    }
}