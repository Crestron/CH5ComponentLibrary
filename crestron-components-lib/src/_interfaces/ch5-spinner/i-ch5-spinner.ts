// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5SpinnerAttributes } from "./i-ch5-spinner-attributes";
import { ICh5Common } from "../ch5-common";
import { TBoolAttribute } from "../ch5-common/types/t-bool-attribute";

/**
 * @name Ch5 Spinner
 * @isattribute false
 * @tagName ch5-spinner
 * @description CH5 Spinner provides a list of items where items can be moved between by dragging the spinner element.
 * @documentation
 * [
 * "`ch5-spinner` element",
 * "***",
 * "Functionally, the Spinner component is similar to the Select component. The primary differences are in the visual representation. ",
 * "The Spinner component presents a vertical list of values centered around one centrally-orientated ",
 * "item, which is considered the single selected item. Swiping up and down on the items allow the user ",
 * "to see other selections, and placing an item in the center chooses that item."
 * ]
 * @snippets
 * [
 *    {
 *       "prefix": "ch5-spinner:blank",
 *       "description": "Crestron Spinner (Blank)",
 *       "body": [
 *           "<ch5-spinner>",
 *           "</ch5-spinner>$0"
 *       ]
 *    },
 *    {
 *       "prefix": "ch5-spinner:default",
 *       "description": "Crestron Spinner (Default)",
 *       "body": [
 *           "<ch5-spinner",
 *           "    label=\"${1:item {{idx}}}\"",
 *           "    indexid=\"${2:idx}\"",
 *           "    size=\"${3:40}\"",
 *           "    itemheight=\"${4:40}\"",
 *           "    visibleitemscroll=\"${5:3}\"",
 *           "    sendeventonchange=\"${6:changed_signal}\">",
 *           "</ch5-spinner>$0"
 *       ]
 *   },
 *     {
 *        "prefix": "ch5-spinner:endless",
 *        "description": "Crestron Spinner endless attribute allows the user to continuously drag the spinner.",
 *        "body": [
 *            "<ch5-spinner",
 *            "    label=\"${1:item {{idx}}}\"",
 *            "    indexid=\"${2:idx}\"",
 *            "    size=\"${3:20}\"",
 *            "    itemheight=\"${4:40}\"",
 *            "    visibleitemscroll=\"${5:3}\"",
 *            "    endless=\"${6:true}\">",
 *            "</ch5-spinner>$0"
 *        ]
 *   },
 *   {
 *      "prefix": "ch5-spinner:signals",
 *      "description": "Crestron Spinner sending signals when interact with the component.",
 *      "body": [
 *            "<ch5-spinner",
 *            "    label=\"${1:item {{idx}}}\"",
 *            "    indexid=\"${2:idx}\"",
 *            "    size=\"${3:20}\"",
 *            "    itemheight=\"${4:40}\"",
 *            "    visibleitemscroll=\"${5:3}\"",
 *            "    endless=\"${6:true}\"",
 *            "    sendeventonchange=\"${7:changed_signal}\"",
 *            "    sendeventonfocus=\"${8:spinner_focusin}\">",
 *            "</ch5-spinner>$0"
 *      ]
 *   }
 * ]
 */
export interface ICh5Spinner extends ICh5SpinnerAttributes, ICh5Common {
  /**
   * @documentation
   * [
   * "`onclean` attribute",
   * "***",
   * "Runs when a clean event is initiated."
   * ]
   * @name onclean
   */
  onclean: string;

  /**
   * @documentation
   * [
   * "`ondirty` attribute",
   * "***",
   * "Runs when a dirty event is initiated."
   * ]
   * @name ondirty
   */
  ondirty: string;

  /**
   * @documentation
   * [
   * "`resize` attribute",
   * "***",
   * "If true, the options panel is resized to fit content width. ",
   * "Apply only with the CSS rule 'width=fit-content' and/or 'width =auto' ",
   * "(depending on the browser agent)."
   * ]
   * @name resize
   */
  resize: TBoolAttribute;

  /**
   * @documentation
   * [
   * "`endless` attribute",
   * "***",
   * "The default value is false. Creates an infinite spinner. This will trigger the next ",
   * "element after the last to be the first element in the list."
   * ]
   * @name endless
   */
  endless: TBoolAttribute;
  
  /**
   * @documentation
   * [
   * "`autosetitemheight` attribute",
   * "***",
   * "Adjusts the height of ch5-spinner items automatically."
   * ]
   * @name autosetitemheight
   */
  autosetitemheight: TBoolAttribute;
}
