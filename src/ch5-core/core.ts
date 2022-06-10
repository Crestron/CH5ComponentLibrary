// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Subscription } from 'rxjs';
// import { ISigComSendToNative, ISigComSubscribe, ISigComUnsubscribe } from './interfaces-sig-com';
// export declare var JSInterface: ISigComUnsubscribe & ISigComSubscribe & ISigComSendToNative;

export type TSignalNonStandardTypeName = "boolean" | "b" | "number" | "numeric" | "n" | "string" | "s" | "object" | "o";
export type TSignalStandardTypeName = "boolean" | "number" | "string" | "object";
export type TRepeatDigitalSignalValue = {[key: string]: boolean|string|number|object};
export type TSignalValue = boolean|string|number|object;
export type TActionLogic = "set"|"link"|"toggle"|"pulse"|"increment"|"decrement"|"rcb";
export type TStringSet = Set<string>;

export type TSignalsSubscriptionsByType = {
    "boolean": TStringSet;
    "number": TStringSet;
    "string": TStringSet;
    "object": TStringSet;
    [key: string]: TStringSet;
};
export type TSignalSubscriptions = {
    [key: string]:Subscription;
};

/* tslint:disable */
export class Core {

}

