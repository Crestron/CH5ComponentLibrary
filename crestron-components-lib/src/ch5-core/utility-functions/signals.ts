// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5SignalFactory } from "../ch5-signal-factory";

/**
 * Utility function that returns the number of active subscriptions of CH5 Components
 */
export function getSubscriptionsCount() {
    const signals = Ch5SignalFactory.getInstance().getStates();
    return signals;
}