// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5CommonAttributes } from "../../ch5-common/interfaces";

/**
 * @ignore
 */
export interface ICh5ImportHtmlSnippetAttributes extends ICh5CommonAttributes {
    /**
     * @documentation
     * [
     * "`url` attribute",
     * "***",
     * "The HTML file path."
     * ]
     * @name url
     */
    url: string;

    /**
     * @documentation
     * [
     * "`receiveStateShowPulse` attribute",
     * "***",
     * "On transition from false to true, this signal will direct the component to be visible."
     * ]
     * @name receivestateshowpulse
     */
    receiveStateShowPulse: string;

    /**
     * @documentation
     * [
     * "`receiveStateHidePulse` attribute",
     * "***",
     * "On transition from false to true, the signal will direct if the component to no longer be visible."
     * ]
     * @name receivestatehidepulse
     */
    receiveStateHidePulse: string;

    /**
     * @documentation
     * [
     * "`receiveStateShow` attribute",
     * "***",
     * "While true, the boolean value of the signal determines if the component is visible."
     * ]
     * @name receivestateshow
     */
    receiveStateShow: string;
}
