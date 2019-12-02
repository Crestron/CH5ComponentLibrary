// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

/**
 * Allows generating an unique id among the ch5 components
 */
export class Ch5Uid {
    private static _id = 0;
    private static _prefix = "cr-id-";

    public static getUid() {
        return Ch5Uid._prefix + (++Ch5Uid._id);
    }
}