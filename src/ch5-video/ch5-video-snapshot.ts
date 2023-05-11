import _ from "lodash";
import { Ch5ImageUriModel } from "../ch5-image/ch5-image-uri-model";
import { CH5VideoUtils } from "./ch5-video-utils";
export class Ch5VideoSnapshot {

    public url: string = '';
    public userId: string = '';
    public password: string = '';
    public refreshRate: number = 5;
    private snapshotTimer: any;
    private videoImage = new Image();

    constructor() {
        this.videoImage.alt = "Video Snapshot";
        this.videoImage.classList.add('hide');
    }

    public startLoadingSnapshot() {
        if (this.url.trim() === "" || this.refreshRate === -1) {
            return;
        }

        if (this.canProcessUri() && !this.url.startsWith("ch5-img")) {
            this.processUri();
        }
        if (!!this.snapshotTimer) {
            clearInterval(this.snapshotTimer);
        }
        this.setSnapshot();
        this.videoImage.classList.remove('hide');
        if (this.refreshRate !== 0) {
            this.snapshotTimer = window.setInterval(() => {
                this.setSnapshot();
            }, 1000 * this.refreshRate, 0);
        }
    }

    public stopLoadingSnapshot() {
        clearInterval(this.snapshotTimer);
        this.videoImage.classList.add('hide');
    }

    private canProcessUri(): boolean {
        if (_.isEmpty(this.password) || _.isEmpty(this.userId) || _.isEmpty(this.url)) {
            return false;
        }
        return true;
    }

    private processUri(): void {
        // Assuming the video only plays on touch devices 
        const { http, https } = { "http": "ch5-img-auth", "https": "ch5-img-auths" };

        // sent to the uri model
        const protocols = { http, https };

        const uri = new Ch5ImageUriModel(protocols, this.userId, this.password, this.url);

        // check if the current uri contains authentication information
        // and other details necessary for URI
        if (!uri.isValidAuthenticationUri()) {
            return;
        }

        // adding a '#' makes the request a new one, while not intrusing with the request
        // this way, it won't be a "bad request" while making a new img request
        this.url = uri.toString();
        return;
    }

    private setSnapshot() {
        this.videoImage.src = this.url + '#' + CH5VideoUtils.rfc3339TimeStamp();
    }

    public getImage() {
        return this.videoImage;
    }
}