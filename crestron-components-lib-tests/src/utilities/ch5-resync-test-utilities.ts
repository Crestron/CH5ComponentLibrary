// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5ClearRangeDataModel } from "../../../crestron-components-lib/src/ch5-resync/models/ch5-clear-range-data-model";
import { IResynchronizationRequestModel } from "../../../crestron-components-lib/src/ch5-resync/models/resynchronization-request-model";

/**
 * Utility / helper methods for testing the ch5-resync component
 */
export class Ch5ResyncTestUtilities{

    // Csig.State_Synchronization event
    public static readonly resyncEventName = "Csig.State_Synchronization";
    public static readonly resyncEventType = "object";

    public static readonly resyncEventValueOnClearAll: IResynchronizationRequestModel = {
        id: "Mock_ID",
        state: "ClearAll",
        value: {excludePrefixes: ["Csig"]}
    };

    public static readonly resyncEventValueOnClearRange: IResynchronizationRequestModel = {
        id: "Mock_ID",
        state: "ClearRange",
        value: {
            excludePrefixes: ["Csig"],
            range: Ch5ResyncTestUtilities.clearRangeDataModel()
        },
    };

    public static readonly resyncEventValueOnEndOfUpdate: IResynchronizationRequestModel = {
        id: "Mock_ID",
        state: "EndOfUpdate"
    };

    public static clearRangeDataModel(): ICh5ClearRangeDataModel {
        return {
            boolean: {
                stateNames: ['boolean_toggle_element', 'some_random_element'],
                joinLow: 10,
                joinHigh: 40
            },
            numeric: {
                stateNames: ['numeric_input_element', 'some_random_element'],
                joinLow: 20,
                joinHigh: 30
            },
            string: {
                stateNames: ['string_input_element', 'some_random_element'],
                joinLow: 30,
                joinHigh: 70
            }
        } as ICh5ClearRangeDataModel;
    }
}
