// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

/**
 * Returns whether the browser is mobile
 * 
 * Recommended by
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent
 */
export function isMobileDevice(): boolean {
    return window.navigator.userAgent.toLowerCase().includes("mobi");
}