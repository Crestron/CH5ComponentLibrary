// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { subscribeState, unsubscribeState, publishEvent } from "../ch5-core";
import { TSnapShotSignalName } from "../_interfaces/ch5-video/types";

export class Ch5VideoSnapshot {
    public isSnapShotLoading: boolean = false;
    public snapShotImage: any;
    private videoSnapShotUrl: string = '';
    private videoSnapShotUser: string = '';
    private videoSnapShotPass: string = '';
    private videoSnapShotRefreshRate: string = '';
    private url: string = '';
    private userId: string = '';
    private password: string = '';
    private refreshRate: number = 0;
    private snapShotTimer: any;
    private snapShotObj: TSnapShotSignalName;
    private videoImage = new Image();

    public constructor(snapShotObj: TSnapShotSignalName) {
        this.snapShotObj = snapShotObj;
        // console.log(JSON.stringify(this.snapShotObj));

        this.unSubscribeStates();
        this.setSnapShotData();
    }

    public startLoadingSnapShot() {
        this.isSnapShotLoading = true;
        this.snapShotTimer = setInterval(() => {
            if (this.userId && this.password && !this.url.indexOf("http")) {
                this.setSnapShotUrl();
            }
            if (this.snapShotObj.snapShotUrl !== "") {
                this.setSnapShot();
            }
        }, 1000 * this.refreshRate, 0);
    }

    public stopLoadingSnapShot() {
        this.isSnapShotLoading = false;
        this.snapShotImage = '';
        clearInterval(this.snapShotTimer);
    }

    /**
     * Read all the snapshot related information from the control system
     */
    public getAllSnapShotData() {
        console.log("GET index : " + this.snapShotObj.index);
        console.log("GET url : " + this.url);
        console.log("GET userId : " + this.userId);
        console.log("GET password : " + this.password);
        console.log("GET refreshRate : " + this.refreshRate);
    }

    /**
     * Check the snapshot url and append web protocol and credentials to it
     */
    private setSnapShotUrl() {
        let loginCredentials = "";
        loginCredentials = this.userId + ":" + this.password + "@";
        this.url = this.url.replace(/\:\/\//, "://" + loginCredentials);
        this.url = this.url.replace(/http:/i, "ch5-img-auth:");
        this.url = this.url.replace(/https:/i, "ch5-img-auths:");
    }

    /**
     * Load the snapshot once on CH5-video load`
     */
    private setSnapShot() {
        this.videoImage.onload = (ev: Event) => {
            // this.info("Snapshot Loaded: " + this.videoImage.src);
            console.log("Snapshot Loaded: " + this.videoImage.src);
            // console.log(JSON.stringify(this.videoImage));
            this.snapShotImage = this.videoImage;
        };
        this.videoImage.onerror = (ev: Event) => {
            // this.info("Error occurred while rendering the image " + this.videoImage.src);
            console.log("Error occurred while rendering the image " + this.videoImage.src);
            this.snapShotImage = '';
        }
        this.videoImage.src = this.url + "?" + new Date().getTime().toString();
    }

    private unSubscribeStates() {
        if (this.videoSnapShotUrl) {
            unsubscribeState('s', this.snapShotObj.snapShotUrl, this.videoSnapShotUrl);
        }
        if (this.videoSnapShotUser) {
            unsubscribeState('s', this.snapShotObj.snapShotUser, this.videoSnapShotUser);
        }
        if (this.videoSnapShotPass) {
            unsubscribeState('s', this.snapShotObj.snapShotPass, this.videoSnapShotPass);
        }
        if (this.videoSnapShotRefreshRate) {
            unsubscribeState('n', this.snapShotObj.snapShotRefreshRate, this.videoSnapShotRefreshRate);
        }
    }

    /**
     * Read all the snapshot related information from the control system
     */
    private setSnapShotData() {
        publishEvent('b', this.snapShotObj.index + "", true);
        publishEvent('b', this.snapShotObj.index + "", false);
        this.setSnapshotUrl(this.snapShotObj.snapShotUrl);
        this.setSnapshotUserId(this.snapShotObj.snapShotUser);
        this.setSnapshotPassword(this.snapShotObj.snapShotPass);
        this.setSnapshotRefreshRate(this.snapShotObj.snapShotRefreshRate);
    }

    private setSnapshotUrl(signalName: any) {
        this.videoSnapShotUrl = subscribeState('s', signalName, (resp: any) => {
            if (resp) {
                this.url = '';
                // console.log("RESP URL : " + resp);
                this.url = resp;
            }
        });
    }

    private setSnapshotUserId(signalName: any) {
        this.videoSnapShotUser = subscribeState('s', signalName, (resp: any) => {
            if (resp) {
                this.userId = '';
                // console.log("RESP UserId : " + resp);
                this.userId = resp;
            }
        });
    }

    private setSnapshotPassword(signalName: any) {
        this.videoSnapShotPass = subscribeState('s', signalName, (resp: any) => {
            if (resp) {
                this.password = '';
                // console.log("RESP Password : " + resp);
                this.password = resp;
            }
        });
    }

    private setSnapshotRefreshRate(signalName: any) {
        this.videoSnapShotRefreshRate = subscribeState('n', signalName, (resp: any) => {
            if (resp) {
                this.refreshRate = 0;
                // console.log("RESP RefreshRate : " + resp);
                this.refreshRate = resp;
            }
        });
    }
}