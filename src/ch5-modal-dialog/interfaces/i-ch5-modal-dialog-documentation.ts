// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5ModalDialogAttributes } from ".";
import { ICh5Common } from "../../ch5-common/interfaces";

/**
 * @name Ch5 Modal Dialog
 * @isattribute false
 * @tagName ch5-modal-dialog
 * @role dialog
 * @description The Modal Dialog component is a special-case instance of an overlay panel used primarily to display dialog windows and user prompts.
 * @componentVersion 1.0.0
 * @documentation
 * [
 * "`ch5-modal-dialog` element",
 * "***",
 * "The modal dialog should generally contains an optional header bar with a title, ",
 * "an optional message with an optional icon, an optional button 'ok', and 'cancel' buttons."
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
 *            "    >",
 *            "    <p>Sample text</p>",
 *            "    <ch5-image id=\"${7:ex1-img}\" url=\"${8:some_server_url}\">",
 *           "    </ch5-image>",
 *            "</ch5-modal-dialog>$0"
 *        ]
 *    }
 * ]
 */
export interface ICh5ModalDialogDocumentation extends ICh5Common, ICh5ModalDialogAttributes {
}