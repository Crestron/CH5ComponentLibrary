// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

/**
 * Helper class for identifying whether the orientation of the host device has changed.
 * 
 * To be used inside a resize event callback, as the orientationchange event is deprecated
 * and no viable alternative exists at the moment.
 */
export class OrientationHelper {
    private width: number;
    private height: number;

    public constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    /**
     * Checks if the orientation has changed based on previously stored width and height.
     * Updates the width and height with the new values from window.
     */
    public hasOrientationChanged(): boolean {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        const hasChanged = this.isPortrait(this.width, this.height) !== this.isPortrait(newWidth, newHeight);
        this.width = newWidth;
        this.height = newHeight;

        return hasChanged;
    }

    /**
     * Specifies whether the provided width and height make a portrait orientation.
     * @param width 
     * @param height 
     */
    private isPortrait(width: number, height: number): boolean {
        return width < height;
    }
}