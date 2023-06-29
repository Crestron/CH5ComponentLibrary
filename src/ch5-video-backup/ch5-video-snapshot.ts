// // Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// // All rights reserved.
// // No part of this software may be reproduced in any form, machine
// // or natural, without the express written consent of Crestron Electronics.
// // Use of this source code is subject to the terms of the Crestron Software License Agreement
// // under which you licensed this source code.

// import { subscribeState, unsubscribeState } from "../ch5-core";
// import { TSnapShotSignalName } from "./interfaces/types";
// import { Ch5ImageUriModel } from "../ch5-image/ch5-image-uri-model";
// import _ from "lodash";
// import { TCh5ProcessUriParams } from "../ch5-common/interfaces";
// import { CH5VideoUtils } from "./ch5-video-utils";

// export class Ch5VideoSnapshot {
//     private snapShotImage: HTMLImageElement = {} as HTMLImageElement;
//     private isSnapShotLoading: boolean = false;
//     private protocol: string = '';
//     private videoSnapShotUrl: string = '';
//     private videoSnapShotUser: string = '';
//     private videoSnapShotPass: string = '';
//     private videoSnapShotRefreshRate: string = '';
//     private url: string = '';
//     private userId: string = '';
//     private password: string = '';
//     private refreshRate: number = -1;
//     private snapShotTimer: any;
//     private snapShotObj: TSnapShotSignalName;
//     private isSnapShotloaded: boolean = false;
//     private videoImage = new Image();

//     public constructor(snapShotObj: TSnapShotSignalName) {
//         this.videoImage.style.width = "100%";
//         this.videoImage.style.height = "100%";
//         this.videoImage.alt = "Video Snapshot";
//         this.snapShotObj = snapShotObj;
//         if (this.snapShotObj.isMultipleVideo) {
//             this.unSubscribeStates(); // Unsubscribe if it is already subscribed
//             this.setSnapShotData();
//         } else {
//             this.url = snapShotObj.snapShotUrl;
//             this.userId = snapShotObj.snapShotUser;
//             this.password = snapShotObj.snapShotPass;
//             this.refreshRate = parseInt(snapShotObj.snapShotRefreshRate, 0);
//         }
//     }

//     /**
//      * Start loading the snapshots with refresh rate
//      */
//     public startLoadingSnapShot() {
//         this.isSnapShotLoading = true;
//         // return if the snapshot url is empty
//         if (this.url === "" || this.refreshRate === -1) {
//             return;
//         }

//         // Check whether all the subscribed login 
//         // credentials received to process further
//         if (this.canProcessUri() && !this.url.startsWith("ch5-img")) {
//             const processUriParams: TCh5ProcessUriParams = {
//                 protocol: this.protocol,
//                 user: this.userId,
//                 password: this.password,
//                 url: this.url
//             }
//             this.processUri(processUriParams);
//         }

//         if (!!this.snapShotTimer) {
//             clearInterval(this.snapShotTimer);
//         }
//         this.setSnapShot();
//         this.snapShotTimer = window.setInterval(() => {
//             this.setSnapShot();
//         }, 1000 * this.refreshRate, 0);
//     }

//     /**
//      * Stop loading the snapshots and make the image empty
//      */
//     public stopLoadingSnapShot() {
//         this.isSnapShotLoading = false;
//         this.snapShotImage = {} as HTMLImageElement; // clear the image
//         this.isSnapShotloaded = false;
//         clearInterval(this.snapShotTimer);
//     }

//     /**
//      * Returns an image
//      * @returns {} loaded snapshot image or blank
//      */
//     public getSnapShot(): HTMLImageElement {
//         return this.snapShotImage;
//     }

//    /**
//     * Returns cached image src url
//     * @returns {} loaded snapshot image or blank
//     */
//     public getSnapShotUrl(): string {
//         return this.snapShotImage.src;
//     }

//     public getSnapShotStatus(): boolean {
//         return this.isSnapShotloaded;
//     }

//     /**
//      * Check the snapshot url and append web protocol and credentials to it
//      */
//     private processUri(processUriParams: TCh5ProcessUriParams): void | string {
//         // Assuming the video only plays on touch devices 
//         const { http, https } = { "http": "ch5-img-auth", "https": "ch5-img-auths" };

//         // sent to the uri model
//         const protocols = { http, https };

//         const uri = new Ch5ImageUriModel(
//             protocols,
//             processUriParams.user,
//             processUriParams.password,
//             processUriParams.url,
//         );

//         // check if the current uri contains authentication information
//         // and other details necessary for URI
//         if (!uri.isValidAuthenticationUri()) {
//             return;
//         }

//         // adding a '#' makes the request a new one, while not intrusing with the request
//         // this way, it won't be a "bad request" while making a new img request
//         this.url = uri.toString();
//         return;
//     }

//     private canProcessUri(): boolean {
//         if (_.isEmpty(this.password) || _.isEmpty(this.userId) || _.isEmpty(this.url)) {
//             return false;
//         }
//         return true;
//     }

//     /**
//      * Load the snapshot once on CH5-video load`
//      */
//     private setSnapShot() {
//         this.videoImage.onerror = () => {
//             this.snapShotImage = {} as HTMLImageElement;
//             this.isSnapShotloaded = false;
//             console.log("Video Tag Id: " + this.snapShotObj.videoTagId + ", snapshot failed to load.");
//         }

//         this.videoImage.onload = (ev: Event) => {
//             this.snapShotImage = this.videoImage;
//             this.isSnapShotloaded = true;
//         };
//         this.videoImage.src = this.url + '#' + CH5VideoUtils.rfc3339TimeStamp();
//     }

//     /**
//      * Unsubscribe existing signals
//      */
//     private unSubscribeStates() {
//         if (this.videoSnapShotUrl) {
//             unsubscribeState('s', this.snapShotObj.snapShotUrl, this.videoSnapShotUrl);
//         }
//         if (this.videoSnapShotUser) {
//             unsubscribeState('s', this.snapShotObj.snapShotUser, this.videoSnapShotUser);
//         }
//         if (this.videoSnapShotPass) {
//             unsubscribeState('s', this.snapShotObj.snapShotPass, this.videoSnapShotPass);
//         }
//         if (this.videoSnapShotRefreshRate) {
//             unsubscribeState('n', this.snapShotObj.snapShotRefreshRate, this.videoSnapShotRefreshRate);
//         }
//     }

//     /**
//      * Read all the snapshot related information from the control system
//      */
//     private setSnapShotData() {
//         this.setSnapshotUrl(this.snapShotObj.snapShotUrl);
//         this.setSnapshotUserId(this.snapShotObj.snapShotUser);
//         this.setSnapshotPassword(this.snapShotObj.snapShotPass);
//         this.setSnapshotRefreshRate(this.snapShotObj.snapShotRefreshRate);
//     }

//     /**
//      * Subscribe to the new signal name of the snapshot url
//      * @param signalName 
//      */
//     private setSnapshotUrl(signalName: any) {
//         this.videoSnapShotUrl = subscribeState('s', signalName, (resp: any) => {
//             if (resp) {
//                 this.url = resp;
//                 if (this.isSnapShotLoading) {
//                     this.startLoadingSnapShot();
//                 }
//             }
//         });
//     }

//     /**
//      * Subscribe to the new signal name of the snapshot userid
//      * @param signalName 
//      */
//     private setSnapshotUserId(signalName: any) {
//         this.videoSnapShotUser = subscribeState('s', signalName, (resp: any) => {
//             if (resp) {
//                 this.userId = resp;
//                 if (this.isSnapShotLoading) {
//                     this.startLoadingSnapShot();
//                 }
//             }
//         });
//     }

//     /**
//      * Subscribe to the new signal name of the snapshot password
//      * @param signalName 
//      */
//     private setSnapshotPassword(signalName: any) {
//         this.videoSnapShotPass = subscribeState('s', signalName, (resp: any) => {
//             if (resp) {
//                 this.password = resp;
//                 if (this.isSnapShotLoading) {
//                     this.startLoadingSnapShot();
//                 }
//             }
//         });
//     }

//     /**
//      * Subscribe to the new signal name of the snapshot refresh rate
//      * @param signalName 
//      */
//     private setSnapshotRefreshRate(signalName: any) {
//         this.videoSnapShotRefreshRate = subscribeState('n', signalName, (resp: any) => {
//             if (resp) {
//                 this.refreshRate = resp;
//                 if (this.isSnapShotLoading) {
//                     this.startLoadingSnapShot();
//                 }
//             }
//         });
//     }
// }
