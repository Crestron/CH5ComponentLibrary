// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import _ from 'lodash';
import { TCh5ListElementOrientation } from '../interfaces/t-ch5-list';

export type TAnimationCallback = () => void;

export abstract class Ch5Animation {

    private _duration: number = 0;
    private _defaultDuration: number = 0;
    private _easeMode: string = 'linear';
    private _wrapper: HTMLElement = {} as HTMLElement;

    constructor(duration: number, easeMode: string, wrapper: HTMLElement) {
        this.duration = duration;
        this.defaultDuration = duration;
        this.easeMode = easeMode;
        this.wrapper = wrapper;
    }

    public set duration(duration: number) {
        if (_.isNil(duration)) {
            return;
        }

        this._duration = duration;
    }

    public get duration(): number {
        return this._duration;
    }

    public set defaultDuration(duration: number) {
        if (_.isNil(duration)) {
            return;
        }

        this._defaultDuration = duration;
    }

    public get defaultDuration(): number {
        return this._defaultDuration;
    }
    public set easeMode(easeMode: string) {
        if (_.isNil(easeMode)) {
            return;
        }

        this._easeMode = easeMode;
    }

    public get easeMode(): string {
        return this._easeMode;
    }

    public set wrapper(wrapper: HTMLElement) {
        if (_.isNil(wrapper)) {
            return;
        }

        this._wrapper = wrapper;
    }

    public get wrapper(): HTMLElement {
        return this._wrapper;
    }

    /**
     * Animate the element
     * 
     * @param {number} currentPosition current position of list in px 
     * @param previousPosition  previous position of list in px
     */
    public abstract animate(
        element: HTMLElement, 
        currentPosition: number, 
        mode: TCh5ListElementOrientation, 
        previousPosition?: number, 
        callback?: TAnimationCallback,
    ): void;
}
