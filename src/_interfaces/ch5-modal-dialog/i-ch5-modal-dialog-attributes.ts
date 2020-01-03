// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { TCh5OverlayPanelOverflow, TCh5OverlayPanelStretch } from "../ch5-overlay-panel/types";

/**
 * @ignore
 */
export interface ICh5ModalDialogAttributes {
    
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
     * "'both' will stretch the component both ways."
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
     * "This is related to the stretch property. This property specifies whether to add ",
     * "scrollbars when an element's content is too big to fit in a specified area. ",
     * "If 'show' is selected, the overflow is not clipped."
     * ]
     * @name overflow
     */
    overflow: TCh5OverlayPanelOverflow
  
  /**
   * @documentation
   * [
   * "`width` attribute",
   * "***",
   * "The width of the modal dialog, in pixels. Must be a string of the form Npx."
   * ]
   * @name width
   */
  width: string;
  
  /**
   * @documentation
   * [
   * "`height` attribute",
   * "***",
   * "The height of the modal dialog, in pixels. Must be a string of the form Npx."
   * ]
   * @name height
   */
  height: string;
  
  /**
   * @documentation
   * [
   * "`title` attribute",
   * "***",
   * "The title of the modal dialog. Must be a string."
   * ]
   * @name title
   */
  title: string;
  
  /**
   * @documentation
   * [
   * "`maskstyle` attribute",
   * "***",
   * "The Header title text. If absent or empty, the title bar will be hidden."
   * ]
   * @name maskstyle
   */
  maskStyle: string;
  
  /**
   * @documentation
   * [
   * "`okbuttonlabel` attribute",
   * "The OK button text. If absent or empty, the default translated 'OK' text is shown."
   * ]
   * @name okbuttonlabel
   */
  okButtonLabel: string;
  
  /**
   * @documentation
   * [
   * "`okbuttonicon` attribute",
   * "***",
   * "The OK button icon. If absent or empty, the icon is hidden."
   * ]
   * @name okbuttonicon
   */
  okButtonIcon: string;
  
  /**
   * @documentation
   * [
   * "`okbuttonstyle` attribute",
   * "***",
   * "The inline style value for the OK button to override the theme."  
   * ]
   * @name okbuttonstyle
   */
  okButtonStyle: string;
  
  /**
   * @documentation
   * [
   * "`cancelbuttonlabel` attribute",
   * "***",
   * "The Cancel button text. If absent or empty, the default translated 'Cancel' text ",
   * "is shown."
   * ]
   * @name cancelbuttonlabel
   */
  cancelButtonLabel: string;
  
  /**
   * @documentation
   * [
   * "`cancelbuttonicon` attribute",
   * "***",
   * "The Cancel button icon. If absent or empty, the icon is hidden."
   * ]
   * @name cancelbuttonicon
   */
  cancelButtonIcon: string;
  
  /**
   * @documentation
   * [
   * "`cancelbuttonstyle` attribute",
   * "***",
   * "The inline style value for the Cancel button to override the theme."
   * ]
   * @name cancelbuttonstyle
   */
  cancelButtonStyle: string;
  
  /**
   * @documentation
   * [
   * "`prompt` attribute",
   * "***",
   * "The optional text for a message."
   * ]
   * @name prompt
   */
  prompt: string;
  
  /**
   * @documentation
   * [
   * "`prompticon` attribute",
   * "***",
   * "The icon that appears next to prompt text"
   * ]
   * @name prompticon
   */
  promptIcon: string;
  
  /**
   * @documentation
   * [
   * "`sendeventonbeforeshow` attribute",
   * "***",
   * "The name of the boolean signal that will be sent to Native just before the panel is shown."
   * ]
   * @name sendeventonbeforeshow
   */
  sendEventOnBeforeShow: string;

  /**
   * @documentation
   * [
   * "`sendeventonaftershow` attribute",
   * "***",
   * "The name of the boolean signal that will be sent to Native after the panel is shown."
   * ]
   * @name sendeventonaftershow
   */
  sendEventOnAfterShow: string;

  /**
   * @documentation
   * [
   * "`sendeventonbeforehide` attribute",
   * "***",
   * "The name of the boolean signal that will be sent to Native before the panel is hidden."
   * ]
   * @name sendeventonbeforehide
   */
  sendEventOnBeforeHide: string;

  /**
   * @documentation
   * [
   * "`sendeventonafterhide` attribute",
   * "***",
   * "The name of the boolean signal that will be sent to Native after the panel is hidden."
   * ]
   * @name sendeventonafterhide
   */
  sendEventOnAfterHide: string;

  /**
   * @documentation
   * [
   * "`sendeventonok` attribute",
   * "***",
   * "The name of the boolean signal that will be sent when the OK button is pressed."
   * ]
   * @name sendeventonok
   */
  sendEventOnOk: string;

  /**
   * @documentation
   * [
   * "`sendeventoncancel` attribute",
   * "***",
   * "The name of the boolean signal that will be sent when the Cancel button is pressed."
   * ]
   * @name sendeventoncancel
   */
  sendEventOnCancel: string;
}