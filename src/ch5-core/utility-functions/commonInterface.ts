export interface MyMpObject {
    [key: string]: string | boolean | number;
    tag: string;
    source: number;
    connectionActive: boolean;
    connectionIsDirect: boolean;
    waitingForRegistration: boolean;

    RegistrationId: number;
    ObjectsId: number;
    RegisterEventId: number;
    PropertiesSupportedId: number;
    MenuId: number;
    BusyChangedId: number;
    BusyChangedMenuId: number;
    StatusMsgChangedId: number;
    StateChangedByBrowseContextId: number;
    StateChangedId: number;
    StateChangedMenuId: number;
    TextLinesId: number;
    ActionsSupportedId: number;
    ProgressBarId: number;
    ElapsedSecId: number;
    TrackSecId: number;
    StreamStateId: number;
    TrackNumId: number;
    TrackCntId: number;
    PlayerStateId: number;
    PlayerIconId: number;
    PlayerNameId: number;
    PlayerIconURLId: number;
    MediaTypeId: number;
    InstanceId: number;
    AlbumArtId: number;
    AlbumArtUrlId: number;
    AlbumArtUrlNATId: number;
    StationNameId: number;
    AlbumId: number;
    GenreId: number;
    ArtistId: number;
    TitleId: number;
    TitleMenuId: number;
    LanguageId: number;
    RewindSpeedId: number;
    ProviderNameId: number;
    FfwdSpeedId: number;
    NextTitleId: number;
    MediaReadyId: number;
    ShuffleStateId: number;
    RepeatStateId: number;
    StatusMsgId: number;
    BusyId: number;
    RatingId: number;
    SelectedId: number;
    VersionId: number;
    LevelId: number;
    ItemCntId: number;
    SubtitleId: number;
    IsMenuAvailableId: number;
    StatusMsgMenuId: number;
    ListSpecificFunctionsId: number;
    MaxReqItemsId: number;
    ItemDataId: number;
    ActionsAvailableId: number;
    ClearChangedId: number;
    ListChangedId: number;
    StatusMsgMenuChangedId: number;
    ResetId: number;
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

export interface CommonResponse {
    jsonrpc: string;
    result: string;
    error: any;
    id: number;
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

// 3. Register for ObjectDirectoryChanged Event 

// REQUEST
// CommonEventRequest

// RESPONSE
// CommonResponse

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

// 6. Register for the BusyChanged Event 

// REQUEST
// CommonEventRequest

// RESPONSE
// CommonResponse

// 7. Register for the StatusMsgChanged Event 

// REQUEST
// CommonEventRequest

// RESPONSE
// CommonResponse

// 8. Register for the StateChangedByBrowseContext Event 

// REQUEST
// CommonEventRequest

// RESPONSE
// CommonResponse

// 9. Register for the StateChanged Event 

// REQUEST
// CommonEventRequest

// RESPONSE
// CommonResponse

// 10. Get TextLines 

// REQUEST
// CommonRequestPropName

// RESPONSE

export interface GetTextLinesResponse extends CommonResponseResult {
    result: { TextLines: [string] };
}

// 11. Get ActionsSupported 

// REQUEST
// CommonRequestPropName

// RESPONSE
export interface GetActionsSupportedResponse extends CommonResponseResult {
    result: { ActionsSupported: [string] };
}

// 12. Get ActionsAvailable

// REQUEST
// CommonRequestPropName

// RESPONSE
export interface GetActionsSupportedResponse extends CommonResponseResult {
    result: { ActionsSupported: [string] };
}

// 13. Get ProgressBar 

// REQUEST
// CommonRequestPropName

// RESPONSE
export interface GetProgressBarResponse extends CommonResponseResult {
    result: { ProgressBar: boolean };
}

// 14. Get ElapsedSec 

// REQUEST
// CommonRequestPropName

// RESPONSE
export interface GetElapsedSecResponse extends CommonResponseResult {
    result: { ElapsedSec: number };
}

// 15. Get TrackSec  

// REQUEST
// CommonRequestPropName

// RESPONSE
export interface GetTrackSecResponse extends CommonResponseResult {
    result: { TrackSec: number };
}

// 16. Get StreamState  

// REQUEST
// CommonRequestPropName

// RESPONSE
export interface GetStreamStateResponse extends CommonResponseResult {
    result: { StreamState: string };
}

// 17. Get TrackNum  

// REQUEST
// CommonRequestPropName

// RESPONSE
export interface GetTrackNumResponse extends CommonResponseResult {
    result: { TrackNum: number };
}

// 18. Get TrackCnt  

// REQUEST
// CommonRequestPropName

// RESPONSE
export interface GetTrackCntResponse extends CommonResponseResult {
    result: { TrackCnt: number };
}

// 19. Get PlayState  

// REQUEST
// CommonRequestPropName

// RESPONSE
export interface GetPlayStateResponse extends CommonResponseResult {
    result: { PlayState: string };
}

// 20. Get PlayerIcon  

// REQUEST
// CommonRequestPropName

// RESPONSE
export interface GetPlayerIconResponse extends CommonResponseResult {
    result: { PlayerIcon: number };
}

// 21. Get PlayerName  

// REQUEST
// CommonRequestPropName

// RESPONSE
export interface GetPlayerNameResponse extends CommonResponseResult {
    result: { PlayerName: string };
}

// 22. Get PlayerIconURL  

// REQUEST
// CommonRequestPropName

// RESPONSE
export interface GetPlayerIconURLResponse extends CommonResponseResult {
    result: { PlayerIconURL: string };
}

// 23. Get MediaType  

// REQUEST
// CommonRequestPropName

// RESPONSE
export interface GetMediaTypeResponse extends CommonResponseResult {
    result: { MediaType: string };
}

// 24. Get Instance  

// REQUEST
// CommonRequestPropName

// RESPONSE
export interface GetInstanceResponse extends CommonResponseResult {
    result: { Instance: number };
}

// 25. Get AlbumArt  

// REQUEST
// CommonRequestPropName

// RESPONSE
export interface GetAlbumArtResponse extends CommonResponseResult {
    result: { AlbumArt: boolean };
}

// 26. Get AlbumArtUrl  

// REQUEST
// CommonRequestPropName

// RESPONSE
export interface GetAlbumArtUrlResponse extends CommonResponseResult {
    result: { AlbumArtUrl: string };
}

// 27. Get AlbumArtURLNAT  

// REQUEST
// CommonRequestPropName

// RESPONSE
export interface GetAlbumArtURLNATResponse extends CommonResponseResult {
    result: { AlbumArtURLNAT: string };
}

// 28. Get StationName  

// REQUEST
// CommonRequestPropName

// RESPONSE
export interface GetStationNameResponse extends CommonResponseResult {
    result: { StationName: string };
}

// 29. Get Album  

// REQUEST
// CommonRequestPropName

// RESPONSE
export interface GetAlbumResponse extends CommonResponseResult {
    result: { Album: string };
}

// 30. Get Genre  

// REQUEST
// CommonRequestPropName

// RESPONSE
export interface GetGenreResponse extends CommonResponseResult {
    result: { Genre: string };
}

// 31. Get Artist  

// REQUEST
// CommonRequestPropName

// RESPONSE
export interface GetArtistResponse extends CommonResponseResult {
    result: { Artist: string };
}

// 32. Get Title  

// REQUEST
// CommonRequestPropName

// RESPONSE
export interface GetTitleResponse extends CommonResponseResult {
    result: { Title: string };
}

// 33. Get Language  

// REQUEST
// CommonRequestPropName

// RESPONSE
export interface GetLanguageResponse extends CommonResponseResult {
    result: { Language: string };
}

// 34. Get RewindSpeed  

// REQUEST
// CommonRequestPropName

// RESPONSE
export interface GetRewindSpeedResponse extends CommonResponseResult {
    result: { RewindSpeed: string };
}

// 35. Get ProviderName  

// REQUEST
// CommonRequestPropName

// RESPONSE
export interface GetProviderNameResponse extends CommonResponseResult {
    result: { ProviderName: number };
}

// 36. Get FfwdSpeed  

// REQUEST
// CommonRequestPropName

// RESPONSE
export interface GetFfwdSpeedResponse extends CommonResponseResult {
    result: { FfwdSpeed: number };
}

// 37. Get NextTitle  

// REQUEST
// CommonRequestPropName

// RESPONSE
export interface GetNextTitleResponse extends CommonResponseResult {
    result: { NextTitle: string };
}

// 38. Get MediaReady  

// REQUEST
// CommonRequestPropName

// RESPONSE
export interface GetMediaReadyResponse extends CommonResponseResult {
    result: { MediaReady: boolean };
}

// 39. Get ShuffleState  

// REQUEST
// CommonRequestPropName

// RESPONSE
export interface GetShuffleStateResponse extends CommonResponseResult {
    result: { ShuffleState: number };
}

// 40. Get RepeatState  

// REQUEST
// CommonRequestPropName

// RESPONSE
export interface GetRepeatStateResponse extends CommonResponseResult {
    result: { RepeatState: number };
}

// 41. Get StatusMsg  

// REQUEST
// CommonRequestPropName

// RESPONSE
export interface GetStatusMsgResponse extends CommonResponseResult {
    result: { StatusMsg: StatusMsg };
}

export interface StatusMsg {
    text: string;
    timeoutSec: number;
    userInputRequired: string;
    initialUserInput: string;
    show: boolean;
    textForItems: [];
    localExit: boolean;
}

// 42. Get Busy  

// REQUEST
// CommonRequestPropName

// RESPONSE
export interface GetBusyResponse extends CommonResponseResult {
    result: { Busy: string };
}

export interface ResultBusy {
    on: boolean;
    timeoutSec: number;
}

// 43. Get Rating  

// REQUEST
// CommonRequestPropName

// RESPONSE
export interface GetRatingResponse extends CommonResponseResult {
    result: { Rating: string };
}

export interface ResultRating {
    current: number;
    max: number;
    system: number;
}

// 44. Get SelectedId  

// REQUEST
// CommonRequestPropName

// RESPONSE
export interface GetSelectedIdStateResponse extends CommonResponseResult {
    result: { SelectedId: string };
}









// 45. Error Response Object
export interface ErrorResponseObject {
    "code": number,
    "message": string,
    "data": null
}