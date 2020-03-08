// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

/**
 * Encapsulating the publish event request in an object.
 */
export interface ICREDENTIALS {
    userid: string;
    password: string;
}

export interface ISOURCE {
    type: string;
    url: string;
}

export interface ILOCATION {
    top: number;
    left: number;
    width: number;
    height: number;
    z: number;
}

export interface IPUBLISHEVENT {
    action: string;
    id: number;
    credentials?: ICREDENTIALS;
    source?: ISOURCE;
    location?: ILOCATION;
    alphablend?: boolean;
    starttime?: number;
    endtime?: number;
    timing?: string;
}

export interface IBACKGROUND {
    action: string;
    id: string;
    top: number;
    left: number;
    width: number;
    height: number;
}
