// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { subscribeState, unsubscribeState, publishEvent } from "../ch5-core";
import { TSnapShotSignalName } from "../_interfaces/ch5-video/types";
import { TCh5ProcessUriParams } from "../_interfaces/ch5-common/types/t-ch5-process-uri-params";
import { Ch5Common } from "../ch5-common/ch5-common";

export class Ch5VideoSnapshot extends Ch5Common {
    public isSnapShotLoading: boolean = false;
    public snapShotImage: any;
    private protocol: string = '';
    private videoSnapShotUrl: string = '';
    private videoSnapShotUser: string = '';
    private videoSnapShotPass: string = '';
    private videoSnapShotRefreshRate: string = '';
    private url: string = '';
    private userId: string = '';
    private password: string = '';
    private refreshRate: number = 0;
    private snapShotTimer: number | undefined = undefined;
    private snapShotObj: TSnapShotSignalName;
    private videoImage = new Image();

    public constructor(snapShotObj: TSnapShotSignalName) {
        super();
        this.snapShotObj = snapShotObj;
        this.unSubscribeStates();
        this.setSnapShotData();
    }

    public startLoadingSnapShot() {
        this.isSnapShotLoading = true;
        if (!!this.snapShotTimer) {
            window.clearInterval(this.snapShotTimer);
        }
        if (this.refreshRate !== 0) {
            this.snapShotTimer = window.setInterval(() => {
                if (this.userId && this.password && !this.url.indexOf("http")) {
                    this.processUri();
                }
                if (this.snapShotObj.snapShotUrl !== "") {
                    this.setSnapShot();
                }
            }, 1000 * this.refreshRate, 0);
        }
      
    }

    public stopLoadingSnapShot() {
        this.isSnapShotLoading = false;
        this.snapShotImage = '';
        clearInterval(this.snapShotTimer);
    }

    /**
     * Check the snapshot url and append web protocol and credentials to it
     */
    public processUri(): void {
        const processUriPrams: TCh5ProcessUriParams = {
            protocol: this.protocol,
            user: this.userId,
            password: this.password,
            url: this.url
        };
        
        const getImageUrl = super.processUri(processUriPrams);
        if (!!getImageUrl) {
            this.url = getImageUrl;
        }
    }

    /**
     * Load the snapshot once on CH5-video load`
     */
    private setSnapShot() {
        this.videoImage.onload = (ev: Event) => {
            this.snapShotImage = this.videoImage;
        };
        this.videoImage.onerror = (ev: Event) => {
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
        this.setSnapshotUrl(this.snapShotObj.snapShotUrl);
        this.setSnapshotUserId(this.snapShotObj.snapShotUser);
        this.setSnapshotPassword(this.snapShotObj.snapShotPass);
        this.setSnapshotRefreshRate(this.snapShotObj.snapShotRefreshRate);
    }

    private setSnapshotUrl(signalName: any) {
        this.videoSnapShotUrl = subscribeState('s', signalName, (resp: any) => {
            if (resp) {
                this.url = '';
                this.url = resp;
            }
        });
    }

    private setSnapshotUserId(signalName: any) {
        this.videoSnapShotUser = subscribeState('s', signalName, (resp: any) => {
            if (resp) {
                this.userId = '';
                this.userId = resp;
            }
        });
    }

    private setSnapshotPassword(signalName: any) {
        this.videoSnapShotPass = subscribeState('s', signalName, (resp: any) => {
            if (resp) {
                this.password = '';
                this.password = resp;
            }
        });
    }

    private setSnapshotRefreshRate(signalName: any) {
        this.videoSnapShotRefreshRate = subscribeState('n', signalName, (resp: any) => {
            if (resp) {
                this.refreshRate = 0;
                this.refreshRate = resp;
            }
        });
    }
}
