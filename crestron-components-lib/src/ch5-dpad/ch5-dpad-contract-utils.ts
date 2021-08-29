// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

export class CH5DpadContractUtils {

    // the join number is applied to the top button, join+1 applies to bottom,
    // join+2 applies to left, join+3 applies to right, join+4 to center
    public static readonly sendEventOnClickSigCountToAdd = {
        top: 0,
        bottom: 1,
        left: 2,
        right: 3,
        center: 4
    };

    public static readonly contractSuffix = {
        top: 'Up',
        bottom: 'Down',
        left: 'Left',
        right: 'Right',
        center: 'Center'
    }
}