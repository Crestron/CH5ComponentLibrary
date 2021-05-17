// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import isNil from 'lodash/isNil';

export class Ch5ButtonPressInfo {

    private readonly _threshold: number = 15;

    private _startX: number = 0;
    private _startY: number = 0;

    private _endX: number = 0;
    private _endY: number = 0;

    /**
     * Validate the press event
     * 
     * @return {boolean}
     */
    public valid(): boolean {
        const diffBetweenPoints = this.calculatePointDiff();
        return diffBetweenPoints < this._threshold;
    }

    /**
     * Store start coordinates
     * 
     * @param {number} x 
     * @param {number} y 
     */
    public saveStart(x: number, y: number) {
        this.startX = x;
        this.startY = y;
    }

    /**
     * Store end coordinates
     * 
     * @param {number} x 
     * @param {number} y 
     */
    public saveEnd(x: number, y: number) {
        this.endX = x;
        this.endY = y;
    }

    public set startX(x: number) {
        if (isNil(x)) {
            return;
        }

        this._startX = x;
    }

    public get startX(): number {
        return this._startX;
    }

    public set startY(y: number) {
        if (isNil(y)) {
            return;
        }

        this._startY = y;
    }

    public get startY(): number {
        return this._startY;
    }

    public set endX(x: number) {
        if (isNil(x)) {
            return;
        }

        this._endX = x;
    }

    public get endX(): number {
        return this._endX;
    }

    public set endY(y: number) {
        if (isNil(y)) {
            return;
        }

        this._endY = y;
    }

    public get endY(): number {
        return this._endY;
    }

    /**
     * Calculate distance between x1,x2 and y1,y2
     * 
     * @return {number}
     */
    private calculatePointDiff(): number {
        const diff = Math.sqrt(
            Math.pow(this.endX - this.startX, 2) + Math.pow(this.endY - this.startY, 2) 
        );        
        return diff;
    }
}