// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.


import { Ch5SignalFactory } from "./ch5-signal-factory";
import isUndefined from 'lodash/isUndefined';

enum ch5VersionError {
    versionNotSet = 'VERSION_NOT_SET',
    invalidDate = 'BUILD_DATE_INVALID'
};

export const version = !!process.env.BUILD_VERSION ? process.env.BUILD_VERSION : ch5VersionError.versionNotSet; // 'X.XX.XX.XX'
export const buildDate = !!process.env.BUILD_DATE ? process.env.BUILD_DATE : ch5VersionError.invalidDate; // 'YYYY-MM-DD'

export const signalNameForLibraryVersion: string = 'Csig.library.ver';
export const signalNameForLibraryBuildDate: string = 'Csig.library.date';

class Ch5Version {

    public static init() {
        Ch5Version.displayVersionMessage();
        Ch5Version.initVersionSignals()
    }

    public static displayVersionMessage() {
        const message = `Crestron Component Library version ${version} build date ${buildDate}`;

        console.log(message);
    }

    public static initVersionSignals() {
        const sigFactory = Ch5SignalFactory.getInstance();
        const sigVer = sigFactory.getStringSignal(signalNameForLibraryVersion);
        const sigBuildDate = sigFactory.getStringSignal(signalNameForLibraryBuildDate);

        if (null !== sigVer && !isUndefined(version)) {
            sigVer.publish(version);
        } else {
            console.log('Error: unable to create signal containing library version');
        }

        if (null !== sigBuildDate && !isUndefined(buildDate)) {
            sigBuildDate.publish(buildDate);
        } else {
            console.log('Error: unable to create signal containing library build date');
        }
    }

}

Ch5Version.init();
