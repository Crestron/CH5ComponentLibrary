// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

/**
 * Returns whether the browser is Safari mobile
 */
export function isSafariMobile(): boolean {
    const ua = window.navigator.userAgent.toLowerCase();

    // since the launch of iPadOS, iPadOS Safari shows desktop versions of websites by default
    const isiPadOS = ua.indexOf('ipad') > -1 || ua.indexOf('macintosh') > -1 && 'ontouchend' in document;

    const iOS = isiPadOS || !!ua.match(/iPhone/i);
    const webkit = !!ua.match(/WebKit/i);
    return !!(iOS && webkit && !ua.match(/CriOS/i));
}