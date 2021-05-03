// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { subscribeState, unsubscribeState } from "../ch5-core";
import { TSnapShotSignalName } from "../_interfaces/ch5-video/types";
import { TCh5ProcessUriParams } from "../_interfaces/ch5-common/types/t-ch5-process-uri-params";
import { Ch5ImageUriModel } from "../ch5-image/ch5-image-uri-model";
import _ from "lodash";

export class Ch5VideoSnapshot {
    private snapShotImage: any;
    private isSnapShotLoading: boolean = true;
    private protocol: string = '';
    private videoSnapShotUrl: string = '';
    private videoSnapShotUser: string = '';
    private videoSnapShotPass: string = '';
    private videoSnapShotRefreshRate: string = '';
    private url: string = '';
    private userId: string = '';
    private password: string = '';
    private refreshRate: number = -1;
    private snapShotTimer: any;
    private snapShotObj: TSnapShotSignalName;
    private isSnapShotloaded: boolean = false;

    public constructor(snapShotObj: TSnapShotSignalName) {
        this.snapShotObj = snapShotObj;
        if (this.snapShotObj.isMultipleVideo) {
            this.unSubscribeStates(); // Unsubscribe if it is already subscribed
            this.setSnapShotData();
        } else {
            this.url = snapShotObj.snapShotUrl;
            this.userId = snapShotObj.snapShotUser;
            this.password = snapShotObj.snapShotPass;
            this.refreshRate = parseInt(snapShotObj.snapShotRefreshRate, 0);
        }
        this.startLoadingSnapShot();
    }

    /**
     * Start loading the snapshots with refresh rate
     */
    public startLoadingSnapShot() {
        this.isSnapShotLoading = true;
        // return if the snapshot url is empty
        if (this.url === "" || this.refreshRate === -1) {
            return;
        }

        // Check whether all the subscribed login 
        // credentials received to process further
        if (this.canProcessUri() && !this.url.startsWith("ch5-img")) {
            const processUriParams: TCh5ProcessUriParams = {
                protocol: this.protocol,
                user: this.userId,
                password: this.password,
                url: this.url
            }
            this.processUri(processUriParams);
        }

        if (!!this.snapShotTimer) {
            clearInterval(this.snapShotTimer);
        }
        this.setSnapShot();
        this.snapShotTimer = window.setInterval(() => {
            this.setSnapShot();
        }, 1000 * this.refreshRate, 0);
    }

    /**
     * Stop loading the snapshots and make the image empty
     */
    public stopLoadingSnapShot() {
        this.isSnapShotLoading = false;
        this.snapShotImage = ''; // clear the image
        this.isSnapShotloaded = false;
        clearInterval(this.snapShotTimer);
    }

    /**
     * Returns an image
     * @returns {} loaded snapshot image or blank
     */
    public getSnapShot() {
        return this.snapShotImage;
    }

    public getSnapShotStatus(): boolean {
        return this.isSnapShotloaded;
    }

    /**
     * Check the snapshot url and append web protocol and credentials to it
     */
    // TODO - No return required here
    private processUri(processUriParams: TCh5ProcessUriParams): void | string {
        // Assuming the video only plays on touch devices 
        const { http, https } = { "http": "ch5-img-auth", "https": "ch5-img-auths" };

        // sent to the uri model
        const protocols = { http, https };

        const uri = new Ch5ImageUriModel(
            protocols,
            processUriParams.user,
            processUriParams.password,
            processUriParams.url,
        );

        // check if the current uri contains authentication information
        // and other details necessary for URI
        if (!uri.isValidAuthenticationUri()) {
            return;
        }

        // adding a '#' makes the request a new one, while not intrusing with the request
        // this way, it won't be a "bad request" while making a new img request
        this.url = uri.toString() + '#' + new Date().toString();
        return;
    }

    private canProcessUri(): boolean {
        if (_.isEmpty(this.password) || _.isEmpty(this.userId) || _.isEmpty(this.url)) {
            return false;
        }
        return true;
    }

    /**
     * Load the snapshot once on CH5-video load`
     */
    private setSnapShot() {
        const videoImage = new Image();

        videoImage.onerror = () => {
            this.snapShotImage = "";
            this.isSnapShotloaded = false;
            console.log(this.url, " snapshot failed to load.");
        }

        videoImage.onload = (ev: Event) => {
            this.snapShotImage = videoImage;
            this.isSnapShotloaded = true;
        };
        videoImage.src = this.insertParamToUrl('ch5-avoid-cache', new Date().getTime().toString(), this.url);
    }

    /**
     * Unsubscribe existing signals
     */
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

    /**
     * Subscribe to the new signal name of the snapshot url
     * @param signalName 
     */
    private setSnapshotUrl(signalName: any) {
        this.videoSnapShotUrl = subscribeState('s', signalName, (resp: any) => {
            if (resp) {
                this.url = resp;
                if (this.isSnapShotLoading) {
                    this.startLoadingSnapShot();
                }
            }
        });
    }

    /**
     * Subscribe to the new signal name of the snapshot userid
     * @param signalName 
     */
    private setSnapshotUserId(signalName: any) {
        this.videoSnapShotUser = subscribeState('s', signalName, (resp: any) => {
            if (resp) {
                this.userId = resp;
                this.startLoadingSnapShot();
            }
        });
    }

    /**
     * Subscribe to the new signal name of the snapshot password
     * @param signalName 
     */
    private setSnapshotPassword(signalName: any) {
        this.videoSnapShotPass = subscribeState('s', signalName, (resp: any) => {
            if (resp) {
                this.password = resp;
                this.startLoadingSnapShot();
            }
        });
    }

    /**
     * Subscribe to the new signal name of the snapshot refresh rate
     * @param signalName 
     */
    private setSnapshotRefreshRate(signalName: any) {
        this.videoSnapShotRefreshRate = subscribeState('n', signalName, (resp: any) => {
            if (resp) {
                this.refreshRate = resp;
                this.startLoadingSnapShot();
            }
        });
    }

    /**
     * Add unique param value to the url to avoid caching of image
     *
     * @param key
     * @param value
     * @param url
     * @return {string} url value with new param and value
     */
    private insertParamToUrl(key: string, value: string, url: string): string {
        key = encodeURI(key);
        value = encodeURI(value);

        if (this.getUrlVars(url).size === 0) {
            return url + '?' + key + '=' + value;
        }

        const kvp = url.split('&');

        let i = kvp.length; let x; while (i--) {
            x = kvp[i].split('=');

            if (x[0] === key) {
                x[1] = value;
                kvp[i] = x.join('=');
                break;
            }
        }

        if (i < 0) { kvp[kvp.length] = [key, value].join('='); }

        return kvp.join('&');
    }

    /**
     * Get url vars
     * @param url
     * @return {Map} returns params
     */
    private getUrlVars(url: string) {
        const vars: Map<string, string> = new Map();
        let hash: string[];
        const questionMarkIndex = url.indexOf('?');

        if (questionMarkIndex > 1) {
            const hashes = url.slice(questionMarkIndex + 1).split('&');

            for (const iterator of hashes) {
                hash = iterator.split('=');
                vars.set(hash[0], hash[1]);
            }
        }

        return vars;
    }

}
