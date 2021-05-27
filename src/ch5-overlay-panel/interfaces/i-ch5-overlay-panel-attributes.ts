// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { TCh5OverlayPanelStretch, TCh5OverlayPanelOverflow, TCh5OverlayPanelPositionOffset } from ".";
import { ICh5CommonAttributes } from "../../ch5-common/interfaces";

/**
 * @name Ch5 Overlay Panel
 * @isattribute false
 * @tagName ch5-overlay-panel
 * @role dialog
 * @description Ch5 Overlay Panel
 * @componentVersion 1.0.0
 * @documentation
 * [
 * "`ch5-overlay-panel` element",
 * "***",
 * "The overlay panel component provides a content container for other components that ",
 * "'pop up' on top of and overlays the main content container."
 * ]
 * @snippets
 * [
 *    {
 *       "prefix": "ch5-overlay-panel:blank",
 *       "description": "Crestron Overlay Panel (Blank)",
 *       "body": [
 *           "<ch5-overlay-panel>",
 *           "</ch5-overlay-panel>$0"
 *       ]
 *    },
 *    {
 *       "prefix": "ch5-overlay-panel:default",
 *       "description": "Crestron Overlay Panel (Default)",
 *       "body": [
 *           "<ch5-overlay-panel receivestateshowpulse=\"${1:trigger_1}\" closable>",
 *           "    <p>Sample text</p>",
 *          "    <ch5-image id=\"${2:ex1-img}\" url=\"${3:some_server_url}\">",
 *           "    </ch5-image>",
 *           "</ch5-overlay-panel>$0"
 *       ]
 *    },
 *    {
 *        "prefix": "ch5-overlay-panel:signals",
 *        "description": "Crestron Overlay Panel Signals",
 *        "body": [
 *            "<ch5-overlay-panel",
 *            "    receivestateshowpulse=\"${1:trigger_1}\"",
 *            "    closable",
 *           "    sendeventonshow=\"${1:signal_on_show}\"",
 *            "    sendeventonbeforeshow=\"${2:signal_on_before_show}\"",
 *            "    sendeventonaftershow=\"${3:signal_on_after_show}\"",
 *            "    sendeventonbeforehide=\"${4:signal_on_before_hide}\"",
 *            "    sendeventonafterhide=\"${5:signal_on_after_hide}\"",
 *            "    >",
 *            "    <p>Sample text</p>",
 *            "    <ch5-image id=\"${8:ex1-img}\" url=\"${9:some_server_url}\">",
 *            "    </ch5-image>",
 *            "</ch5-overlay-panel>$0"
 *        ]
 *    }
 * ]
 */

/**
 * @ignore
 */
export interface ICh5OverlayPanelAttributes extends ICh5CommonAttributes {
  
  /**
   * @documentation
   * [
   * "`closeicon` attribute",
   * "***",
   * "A class name of the close icon. It may be a font awesome class."
   * ]
   * @name closeicon
   */
  closeIcon: string
  
  /**
   * @documentation
   * [
   * "`stretch` attribute",
   * "***",
   * "Valid values: 'width', 'height', and 'both'. The component will stretch to ",
   * "the available width or the available height in the parent component. Using ",
   * "'both' will stretch the component both directions."
   * ]
   * @name stretch
   */
  stretch: TCh5OverlayPanelStretch
  
  /**
   * @documentation
   * [
   * "`overflow` attribute",
   * "***",
   * "Valid values: 'scroll' and 'show'. The overflow property specifies what ",
   * "happens if content does or does not overflow the component box. ",
   * "This is related with stretch property. This property specifies whether to add ",
   * "scrollbars when an element's content is too big to fit in a specified area. ",
   * "If 'show' is selected, the overflow is not clipped."
   * ]
   * @name overflow
   */
  overflow: TCh5OverlayPanelOverflow
  
  /**
   * @documentation
   * [
   * "`positionto` attribute",
   * "***",
   * "If not set, the position will be related to the viewport. ",
   * "Positions the component related to either a window or an element by id."
   * ]
   * @name positionto
   */
  positionTo: string
  
  /**
   * @documentation
   * [
   * "`positionoffset` attribute",
   * "***",
   * "Valid values 'top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', ",
   * "'bottom-right', 'left-center', and 'right-center'. Auto-positions the panel offset ",
   * "to the event element's position."
   * ]
   * @name positionoffset
   */
  positionOffset: TCh5OverlayPanelPositionOffset

  /**
   * @documentation
   * [
   * "`dismissable` attribute",
   * "***",
   * "The default value is 'true'. If false, the panel won't automatically hide if a touch event occurs outside of it."
   * ]
   * @name dismissable
   */
  dismissable: boolean;
  
  /**
   * @documentation
   * [
   * "`closable` attribute",
   * "***",
   * "The default value is 'false'. If true, shows a close icon on the corner of the panel. If false, ",
   * "the close icon is not shown."
   * ]
   * @name closable
   */
  closable: boolean;

  /**
   * @documentation
   * [
   * "`mask` attribute",
   * "***",
   * "Specifies whether or not to apply a background mask."
   * ]
   * @name mask
   */
  mask: boolean;

  /**
   * @documentation
   * [
   * "`receivestatepositionto` attribute ",
   * "***",
   * "When received, positions to this component."
   * ]
   * @name receivestatepositionto
   */
  receiveStatePositionTo: string;

  /**
   * @documentation
   * [
   * "`receivestatepositionoffset` attribute",
   * "***",
   * "when received, positions offset to this component. ",
   * "See attribute 'positionOffset' for valid values."
   * ]
   * @name receivestatepositionoffset
   */
  receiveStatePositionOffset: string;

  /**
   * @documentation
   * [
   * "`sendeventonbeforeshow` attribute",
   * "***",
   * "Sends a signal on the overlay panel before show."
   * ]
   * @name sendeventonbeforeshow
   */
  sendEventOnBeforeShow: string;

  /**
   * @documentation
   * [
   * "`sendeventonaftershow` attribute",
   * "***",
   * "Sends a signal on the overlay panel after show."
   * ]
   * 
   * @name sendeventonaftershow
   */
  sendEventOnAfterShow: string;

  /**
   * @documentation
   * [
   * "`sendisignalonbeforehide` attribute",
   * "***",
   * "Sends a signal on overlay panel before hide."
   * ]
   * @name sendeventonbeforehide
   */
  sendEventOnBeforeHide: string;

  /**
   * @documentation
   * [
   * "`sendisgnalonafterhide` attribute",
   * "***",
   * "Sends a signal on overlay panel after hide."
   * ]
   * @name sendeventonafterhide
   */
  sendEventOnAfterHide: string;
}
