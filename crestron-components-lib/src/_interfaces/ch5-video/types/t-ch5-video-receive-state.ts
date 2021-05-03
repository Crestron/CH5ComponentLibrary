// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

/**
 * Encapsulating the receive state details.
 */
export type TState = {
    url: string;
    type: string;
    user: string;
    videoPass: string;
    snapShotUrl: string;
    snapShotRefreshRate: string;
    snapShotUser: string;
    snapShotPass: string;
}

export type TSnapShotSignalName = {
    index: number;
    snapShotUrl: string;
    snapShotRefreshRate: string;
    snapShotUser: string;
    snapShotPass: string;
    isMultipleVideo: boolean
}

export type TReceiveState = {
    subscriptionIds:TState;
    values: TState;
}
