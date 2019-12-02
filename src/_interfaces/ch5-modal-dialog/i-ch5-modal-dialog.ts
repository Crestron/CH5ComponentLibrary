// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5Common } from "../ch5-common/i-ch5-common";
import { ICh5OverlayPanel } from "../ch5-overlay-panel/i-ch5-overlay-panel";
import { ICh5CommonAttributes } from "../ch5-common";
import { ICh5ModalDialogAttributes } from "./i-ch5-modal-dialog-attributes";
import { TBoolAttribute } from "../ch5-common/types/t-bool-attribute";

/**
 * @name Ch5 Modal Dialog
 * @isattribute false
 * @tagName ch5-modal-dialog
 * @description Ch5 Modal
 * @documentation
 * [
 * "`ch5-modal-dialog` element",
 * "***",
 * "The Modal Dialog component is a special-case instance of an overlay panel used primarily",
 * "to display dialog windows and user prompts.",
 * "The modal dialog should generally contains an optional header bar with a title",
 * "an optional message with an optional icon, and optional button 'ok' and 'cancel' buttons. "
 * ]
 * @snippets
 * [
 *    {
 *      "prefix": "ch5-modal-dialog:blank",
 *      "description": "Crestron Modal Dialog (Blank)",
 *      "body": [
 *          "<ch5-modal-dialog>",
 *          "</ch5-modal-dialog>$0"
 *      ]
 *    }, 
 *    {
 *      "prefix": "ch5-modal-dialog:default",
 *      "description": "Crestron Modal Dialog (Default)",
 *      "body": [
 *          "<ch5-modal-dialog receivestateshowpulse=\"${1:trigger_1}\" closable>",
 *          "    <p>Sample text</p>",
 *          "    <ch5-image id=\"${2:ex1-img}\" url=\"${3:some_server_url}\">",
 *          "    </ch5-image>",
 *          "</ch5-modal-dialog>$0"
 *      ]
 *   },
 *    {
 *        "prefix": "ch5-modal-dialog:signals",
 *        "description": "Crestron Modal Dialog Signals",
 *        "body": [
 *            "<ch5-modal-dialog",
 *            "    receivestateshowpulse=\"${1:trigger_1}\"",
 *            "    closable",
 *            "    sendeventonshow=\"${1:signal_on_show}\"",
 *            "    sendeventonbeforeshow=\"${2:signal_on_before_show}\"",
 *            "    sendeventonaftershow=\"${3:signal_on_after_show}\"",
 *            "    sendeventonbeforehide=\"${4:signal_on_before_hide}\"",
 *            "    sendeventonafterhide=\"${5:signal_on_after_hide}\"",
 *            "    sendeventonok=\"${6:signal_on_ok}\"",
 *            "    sendSignaloncancel=\"${7:signal_on_cancel}\"",
 *            "    >",
 *            "    <p>Sample text</p>",
 *            "    <ch5-image id=\"${8:ex1-img}\" url=\"${9:some_server_url}\">",
 *           "    </ch5-image>",
 *            "</ch5-modal-dialog>$0"
 *        ]
 *    }
 * ]
 */
export interface ICh5ModalDialog extends ICh5ModalDialogAttributes, ICh5Common {

  /**
   * @documentation
   * [
   * "`dismissable` attribute",
   * "***",
   * "Default 'true'. If false, the panel won't automatically hide if a touch event occurs outside of it"
   * ]
   * @name dismissable
   */
  dismissable: TBoolAttribute
  
  /**
   * @documentation
   * [
   * "`closable` attribute",
   * "***",
   * "Default 'false'. If true, show a close icon on the corner of the panel, else",
   * "don't show the close icon"
   * ]
   * @name closable
   */
  closable: TBoolAttribute

  /**
   * @documentation
   * [
   * "`mask` attribute",
   * "***",
   * "Specifies whether to apply a background mask"
   * ]
   * @name mask
   */
  mask: TBoolAttribute;

  /**
   * @documentation
   * [
   * "`hideokbutton` attribute",
   * "***",
   * "Default false. If true hide the button."
   * ]
   * @name hideokbutton
   */
  hideOkButton: TBoolAttribute;

  /**
   * @documentation
   * [
   * "`hidecancelbutton` attribute",
   * "***",
   * "Default false. If true hide the button."
   * ]
   * @name hidecancelbutton
   */
  hideCancelButton: TBoolAttribute;
}