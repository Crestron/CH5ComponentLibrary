// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5CommonAttributes } from "../ch5-common";
import { TCh5SelectOptionIconPosition } from "./types/t-ch5-select-option-icon-position";

/**
 * @ignore
 */
export interface ICh5SelectOptionAttributes extends ICh5CommonAttributes {

  /**
   * @documentation
   * [
   * "`iconposition` attribute",
   * "***",
   * "Valid values are 'first' and 'last'. Default is 'first'.",
   * "This attribute only applies when a template is not provided",
   * "and the implied template is in use. If template is provided,",
   * "this property is ignored."
   * ]
   * @name iconposition
   *
   */
  iconPosition: TCh5SelectOptionIconPosition | string;

    /**
     * @documentation
     * [
     * "`receivestateselected` attribute",
     * "***",
     * "When receive apply true value apply the selected class ( ch5-button--selected"
     * ]
     * @name receivestateselected
     */
    receiveStateSelected: string | null;

    /**
     * @documentation
     * [
     * "`receivestatelabel` attribute",
     * "***",
     * "The label / name of this ch5-select-option is received via this attribute"
     * ]
     * @name receivestatelabel
     */
    receiveStateLabel: string | null;

    /**
     * @documentation
     * [
     * "`receivestateurl` attribute",
     * "***",
     * "Provides the image/icon url."
     * ]
     * @name receivestateurl
     */
    receiveStateUrl: string | null;

    /**
     * @documentation
     * [
     * "`receivestatescriptlabelhtml` attribute",
     * "***",
     * "Signal script evaluation will be applied to the",
     * "button.innerHTML. Allows for multiline, multistyled labels. "
     * ]
     * @name receivestatescriptlabelhtml
     */
    receiveStateScriptLabelHTML: string | null;

    /**
     * @documentation
     * [
     * "`sendeventonclick` attribute",
     * "***",
     * "Sends event on click or tap event (mouse or finger up and down in a small period of time).",
     * "Use this when control system takes action on rising edge from false to true of boolean digital event.",
     * "Examples include SIMPL Logic Symbol for Toggle with description of",
     * "Digital input <clock> 'High/1 (rising edge) = Toggle; Low/0 = No effect'"
     * ]
     * @name sendeventonclick
     */
    sendEventOnClick: string | null;
}
