// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5CommonAttributes } from "../ch5-common/i-ch5-common-attributes";
import { TCh5CommonInputFeedbackModes } from "./types";
/**
 * @ignore
 */
export interface ICh5CommonInputAttributes extends ICh5CommonAttributes {

  /**
   * @documentation
   * [
   * "`feedbackmode` attribute",
   * "***",
   *  "The default value is direct. Valid values: 'direct', 'submit'.",
   * "***",
   * "The 'direct' value triggers a change event and sendEventOnChange",
   * "as the user changes.",
   * "The 'submit' value triggers a change event and updates the signal in ",
   * "the sendEventOnChange attribute only when the submit() method is called by a Form Component."
   * ]
   * @name feedbackmode
   */
  feedbackMode: TCh5CommonInputFeedbackModes;

  /**
   * @documentation
   * [
   * "`signalvaluesynctimeout` attribute",
   * "***",
   * "The default value is 1500ms. Defines the duration before a timeout (No more user action; ",
   * "for example, for a ch5-toggle, this means that the user has released the handle of the toggle) ",
   * "and the time the ch5 element will check if the value is equal to the value from the signal.",
   * "If not, it will automatically apply the value from the signal. Apply this only for feedbackMode direct."
   * ]
   * @name signalvaluesynctimeout
   */
  signalValueSyncTimeout: number | string;

}
