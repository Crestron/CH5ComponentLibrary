// Copyright (C) 2022 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

export interface ICh5VideoBackground {
  action: string;
  id: string;
  top: number;
  left: number;
  width: number;
  height: number;
  image?: HTMLImageElement;
}

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

export type TSnapShotSignalName = {
    index: number;
    videoTagId: string;
    snapshotURL: string;
    snapshotRefreshRate: number;
    snapshotUser: string;
    snapshotPass: string;
    isMultipleVideo: boolean;
}

export type ITouchOrdinates = {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}

export type TVideoTouchManagerParams = {
    onTouchStartHandler: () => {}; // will be called within document.onTouchStart, defaults to an empty method
    onTouchMoveHandler: () => {}; // will be called within document.onTouchMove, defaults to an empty method
    onTouchEndHandler: () => {}; // will be called within document.onTouchEnd, defaults to an empty method
    onTouchCancelHandler: () => {}; // will be called within document.onTouchCancel, defaults to an empty method
    pollingDuration: number; // defaults to 300ms if not passed
    componentID: string; // * this is a mandatory field
}

export interface TMultiVideoSignalName {
    url: string;
    userId: string;
    password: string;
    sourceType: string;
    snapshotURL: string;
    snapshotUserId: string;
    snapshotPassword: string;
    snapshotRefreshRate: string;
}