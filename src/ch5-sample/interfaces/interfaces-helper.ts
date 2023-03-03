export interface ICh5VideoPublishEvent {
    action: string;
    id: number;
    credentials?: ICh5VideoCredentials;
    source?: ICh5VideoSource;
    location?: ICh5VideoLocation;
    alphablend?: boolean;
    starttime?: number;
    endtime?: number;
    timing?: string;
}

export interface ICh5VideoCredentials {
    userid: string;
    password: string;
}

export interface ICh5VideoSource {
    type: string;
    url: string;
}

export interface ICh5VideoLocation {
    top: number;
    left: number;
    width: number;
    height: number;
    z: number;
}

/**
 * Define the display sizes of the video.
 */
export type TDimension = {
    width: number;
    height: number;
}

/**
 * The Video response from the backend
 */

export type TVideoResponse = {
    currenttime: number;
    id: number;
    status: string;
    statusCode: number;
    location: TVideoLocationResponse;
}

export type TVideoLocationResponse = {
    height: number;
    left: number;
    top: number;
    width: number;
}

/**
 * Define the display sizes of the video.
 */
export type TPosDimension = {
    width: number;
    height: number;
    posX: number;
    posY: number;
}

export type IVideoElementDimensions = {
    offsetLeft: number;
    offsetTop: number;
    totalHeight: number;
    totalWidth: number;
}