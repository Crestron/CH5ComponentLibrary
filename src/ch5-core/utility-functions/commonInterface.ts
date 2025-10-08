export interface MyMpObject {
    [key: string]: string | boolean | number;
    tag: string;
    source: number;
    connectionActive: boolean;
    RegistrationId: number;
    ObjectsId: number;
    PropertiesSupportedId: number;
    MenuId: number;
    TitleMenuId: number;
    ItemDataId: number;
    PlayId: number;
    PauseId: number;
    SeekId: number;
    instanceName: string;
    menuInstanceName: string;
}

export interface CommonRequest {
    jsonrpc: string;
    method: string;
    id: number;
}

export interface CommonEventRequest {
    jsonrpc: string;
    params: { ev: string, handle: string } | { 'item': number } | { 'time': string } | null;
    method: string;
    id: number
}

export interface CommonRequestPropName {
    jsonrpc: string;
    params: { propName: string };
    method: string;
    id: number
}
export interface CommonRequestForPopup {
    jsonrpc: string;
    params: {
        localExit: boolean,
        state: 1,
        id: number,
        userInput: string
    };
    method: string;
    id: number
}

export interface CommonResponseResult {
    jsonrpc: string;
    error: any;
    id: number;
}

// 1. Register with Device 

// REQUEST
export interface RegisterwithDeviceRequest extends CommonRequest {
    params: Params;
}

export interface Params {
    encoding: string;
    uuid: string;
    ver: string;
    maxPacketSize: number;
    type: string;
    format: string;
    name: string;
    jsonrpc: string;
}

// RESPONSE
export interface RegisterwithDeviceResponse extends CommonResponseResult {
    result: Result;
}

export interface Result {
    ver: string;
    name: string;
    uuid: string;
    connectionslist: ConnectionList[];
    maxPacketSize: number;
    encoding: string;
    format: string;
}

export interface ConnectionList {
    type: string;
    ip: string;
    subnet: string;
    port: number;
    slot: string;
    join: number;
}

// 2. Get Objects

// REQUEST
export interface GetObjectsRequest extends CommonRequest {
    // params: any;
}

// RESPONSE
export interface GetObjectsResponse extends CommonResponseResult {
    result: { objects: { object: GetObjectsResponseResult[] } };
}

export interface GetObjectsResponseResult {
    '@category': string;
    name: string;
    instancename: string;
    interfaces: [string];
    uuid: string;
}
// 4. Get PropertiesSupported 

// REQUEST
export interface GetPropertiesSupportedRequest extends CommonRequest {
    params: { propName: string };
}

// RESPONSE
export interface GetPropertiesSupportedResponse extends CommonResponseResult {
    result: { PropertiesSupported: [string] };
}

// 5. Get the Menu 

// REQUEST
export interface GetMenuRequest extends CommonRequest {
    params: { uuid: string }
}

// RESPONSE
export interface GetMenuResponse extends CommonResponseResult {
    result: { instanceName: string };
}

// Error Response Object
export interface ErrorResponseObject {
    "code": number,
    "message": string,
    "data": null
}