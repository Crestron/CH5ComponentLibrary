// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5CommonAttributes } from "../ch5-common";
import { TCh5OverlayPanelStretch, TCh5OverlayPanelOverflow, TCh5OverlayPanelPositionOffset } from "./types";
import { ICh5OverlayPanelAttributes } from "./i-ch5-overlay-panel-attributes";

/**
 * @ignore
 */
export interface ICh5OverlayPanelAttributes extends ICh5CommonAttributes {
  
  /**
   * @documentation
   * [
   * "`closeicon` attribute",
   * "***",
   * "A class name of the close icon. It may be a font awesome class"
   * ]
   * @name closeicon
   */
  closeIcon: string
  
  /**
   * @documentation
   * [
   * "`stretch` attribute",
   * "***",
   * "Valid values: 'width', 'height', and 'both'. The component will stretch to",
   * "the available width or the available height in the parent component. Using",
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
   * "happens if content does or does not overflow the component box.",
   * "This is related with stretch property. This property specifies whether to add ",
   * "scrollbars when an element's content is too big to fit in a specified area.",
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
   * "If not set, the position will be related to the viewport.",
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
   * "Valid values 'top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center',",
   * "'bottom-right', 'left-center', and 'right-center'. Auto-positions the panel offset",
   * "to the event element's position."
   * ]
   * @name positionoffset
   */
  positionOffset: TCh5OverlayPanelPositionOffset

  /**
   * @documentation
   * [
   * "`receivestatepositionto` attribute ",
   * "***",
   * "When received, positions to this component"
   * ]
   * @name receivestatepositionto 
   */
  receiveStatePositionTo: string;

  /**
   * @documentation
   * [
   * "`receivestatepositionoffset` attribute",
   * "***",
   * "when received, positions offset to this component.",
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
