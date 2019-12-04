// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { TSignal } from "./signal.type";
import { IResynchronizationRequestModel } from "../../ch5-resync/models/resynchronization-request-model";

export type Ch5SignalUpdateCallback<T extends TSignal> = (value: T) => void;
export type Ch5SignalErrorCallback = (err: any) => void;

export type TAllSignalSubscriptionUpdateCallbacks = Ch5SignalUpdateCallback<boolean>
                | Ch5SignalUpdateCallback<number>
                | Ch5SignalUpdateCallback<string>
                | Ch5SignalUpdateCallback<object>
                | Ch5SignalUpdateCallback<IResynchronizationRequestModel>;
