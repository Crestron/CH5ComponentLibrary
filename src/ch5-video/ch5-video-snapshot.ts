// Copyright (C) 2022 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import _ from "lodash";
import { Ch5ImageUriModel } from "../ch5-image/ch5-image-uri-model";
import { Ch5SignalFactory } from "../ch5-core/index";

export class Ch5VideoSnapshot {

	public url: string = '';
	public userId: string = '';
	public password: string = '';
	public refreshRate: number = 5;
	private snapshotTimer: number | null = null;
	private videoImage = new Image();
	public sendEventSnapshotStatus: string = '';
	public sendEventSnapshotLastUpdateTime: string = '';

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
			window.clearInterval(this.snapshotTimer as number);
			this.snapshotTimer = null
		}
		this.setSnapshot();
		this.videoImage.classList.remove('hide');
		if (this.refreshRate !== 0) {
			this.snapshotTimer = window.setInterval(() => {
				if (this.snapshotTimer) { this.setSnapshot(); }
			}, 1000 * this.refreshRate, 0);
		}
	}

	public stopLoadingSnapshot() {
		this.videoImage.removeAttribute('src');
		window.clearInterval(this.snapshotTimer as number);
		this.snapshotTimer = null;
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
		this.videoImage.onerror = () => {
			if (this.sendEventSnapshotStatus !== null && this.sendEventSnapshotStatus !== undefined && this.sendEventSnapshotStatus !== "") {
				Ch5SignalFactory.getInstance().getNumberSignal(this.sendEventSnapshotStatus)?.publish(2);
			}
		}
		this.videoImage.onload = (ev: Event) => {
			if (this.sendEventSnapshotStatus !== null && this.sendEventSnapshotStatus !== undefined && this.sendEventSnapshotStatus !== "") {
				Ch5SignalFactory.getInstance().getNumberSignal(this.sendEventSnapshotStatus)?.publish(1);
			}
		};
		this.videoImage.src = this.url + '#' + (new Date().toISOString()); // epoch time
		if (this.sendEventSnapshotLastUpdateTime !== null && this.sendEventSnapshotLastUpdateTime !== undefined && this.sendEventSnapshotLastUpdateTime !== "") {
			Ch5SignalFactory.getInstance().getStringSignal(this.sendEventSnapshotLastUpdateTime)?.publish(this.videoImage.src);
		}
	}

	public getImage() {
		return this.videoImage;
	}

}