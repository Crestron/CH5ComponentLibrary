// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { TCh5OverlayPanelStretch, TCh5OverlayPanelOverflow, TCh5OverlayPanelPositionOffset } from ".";
import { ICh5CommonAttributes } from "../../ch5-common/interfaces";

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
   * @attributeType "IconClass"
   */
  closeIcon: string;

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
   * @default null
   * @attributeType "EnumeratedValue"
   */
  stretch: TCh5OverlayPanelStretch | null;

  /**
   * @documentation
   * [
   * "`overflow` attribute",
   * "***",
   * "The default value is scroll. ",
   * "Valid values: 'scroll' and 'show'. The overflow property specifies what ",
   * "happens if content does or does not overflow the component box. ",
   * "This is related with stretch property. This property specifies whether to add ",
   * "scrollbars when an element's content is too big to fit in a specified area. ",
   * "If 'show' is selected, the overflow is not clipped."
   * ]
   * @name overflow
   * @default scroll
   * @attributeType "EnumeratedValue"
   */
  overflow: TCh5OverlayPanelOverflow;

  /**
   * @documentation
   * [
   * "`positionto` attribute",
   * "***",
   * "If not set, the position will be related to the viewport. ",
   * "Positions the component related to either a window or an element by id."
   * ]
   * @name positionto
   * @attributeType "String"
   */
  positionTo: string;

  /**
   * @documentation
   * [
   * "`positionoffset` attribute",
   * "***",
   * "The default value is top-left. ",
   * "Valid values 'top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', ",
   * "'bottom-right', 'left-center', and 'right-center'. Auto-positions the panel offset ",
   * "to the event element's position."
   * ]
   * @name positionoffset
   * @default top-left
   * @attributeType "EnumeratedValue"
   */
  positionOffset: TCh5OverlayPanelPositionOffset;

  /**
   * @documentation
   * [
   * "`dismissable` attribute",
   * "***",
   * "The default value is 'true'. If false, the panel won't automatically hide if a touch event occurs outside of it."
   * ]
   * @name dismissable
   * @default true
   * @attributeType "Boolean"
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
   * @default false
   * @attributeType "Boolean"
   */
  closable: boolean;

  /**
   * @documentation
   * [
   * "`receivestatepositionto` attribute ",
   * "***",
   * "When received, positions to this component."
   * ]
   * @name receivestatepositionto
   * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
   * @attributeType "Join"
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
   * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
   * @attributeType "Join"
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
   * @join {"direction": "event", "isContractName": true, "booleanJoin": 1}
   * @attributeType "Join"
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
   * @join {"direction": "event", "isContractName": true, "booleanJoin": 1}
   * @attributeType "Join"
   */
  sendEventOnAfterShow: string;

  /**
   * @documentation
   * [
   * "`sendeventonbeforehide` attribute",
   * "***",
   * "Sends a signal on overlay panel before hide."
   * ]
   * @name sendeventonbeforehide
   * @join {"direction": "event", "isContractName": true, "booleanJoin": 1}
   * @attributeType "Join"
   */
  sendEventOnBeforeHide: string;

  /**
   * @documentation
   * [
   * "`sendeventonafterhide` attribute",
   * "***",
   * "Sends a signal on overlay panel after hide."
   * ]
   * @name sendeventonafterhide
   * @join {"direction": "event", "isContractName": true, "booleanJoin": 1}
   * @attributeType "Join"
   */
  sendEventOnAfterHide: string;
}
