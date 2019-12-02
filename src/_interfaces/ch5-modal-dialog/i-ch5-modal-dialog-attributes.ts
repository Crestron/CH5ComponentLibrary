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
     * "A class name of the close icon, it may be a font awesome class"
     * ]
     * @name closeicon
     */
    closeIcon: string
    
    /**
     * @documentation
     * [
     * "`stretch` attribute",
     * "***",
     * "Valid values are 'width', 'height', and 'both'. The component will stretch to",
     * "the available width or the available height in the parent component. Using",
     * "'both' it will stretch both ways."
     * ]
     * @name stretch
     */
    stretch: TCh5OverlayPanelStretch
    
    /**
     * @documentation
     * [
     * "`overflow` attribute",
     * "***",
     * "Valid values are 'scroll' and 'show'. The overflow property specifies what",
     * "happens if content overflows the component box or not.",
     * "This is related with stretch property. This property specifies whether to add",
     * "scrollbars when an element's content is too big to fit in a specified area.",
     * "If 'show' is selected the overflow is not clipped."
     * ]
     * @name overflow
     */
    overflow: TCh5OverlayPanelOverflow
  
  /**
   * @documentation
   * [
   * "`width` attribute",
   * "***",
   * "The width of the modal dialog, in pixels. Must be a string of the form Npx"
   * ]
   * @name width
   */
  width: string;
  
  /**
   * @documentation
   * [
   * "`height` attribute",
   * "***",
   * "The height of the modal dialog, in pixels. Must be a string of the form Npx"
   * ]
   * @name height
   */
  height: string;
  
  /**
   * @documentation
   * [
   * "`title` attribute",
   * "***",
   * "The title of the modal dialog. Must be a string"
   * ]
   * @name title
   */
  title: string;
  
  /**
   * @documentation
   * [
   * "`maskstyle` attribute",
   * "***",
   * "Header title text. If absent or empty, hide the title bar"
   * ]
   * @name maskstyle
   */
  maskStyle: string;
  
  /**
   * @documentation
   * [
   * "`okbuttonlabel` attribute",
   * "Ok button text. If absent or empty the default translated 'OK' text will show."
   * ]
   * @name okbuttonlabel
   */
  okButtonLabel: string;
  
  /**
   * @documentation
   * [
   * "`okbuttonicon` attribute",
   * "***",
   * "Ok button icon. If absent or empty, hide the icon"
   * ]
   * @name okbuttonicon
   */
  okButtonIcon: string;
  
  /**
   * @documentation
   * [
   * "`okbuttonstyle` attribute",
   * "***",
   * "Inline style value for the ok button to override theme."  
   * ]
   * @name okbuttonstyle
   */
  okButtonStyle: string;
  
  /**
   * @documentation
   * [
   * "`cancelbuttonlabel` attribute",
   * "***",
   * "Cancel button text. If absent or empty the default translated 'Cancel' text",
   * "will show"
   * ]
   * @name cancelbuttonlabel
   */
  cancelButtonLabel: string;
  
  /**
   * @documentation
   * [
   * "`cancelbuttonicon` attribute",
   * "***",
   * "Cancel button icon. If absent or empty, hide the icon"
   * ]
   * @name cancelbuttonicon
   */
  cancelButtonIcon: string;
  
  /**
   * @documentation
   * [
   * "`cancelbuttonstyle` attribute",
   * "***",
   * "Inline style value for the cancel button to override theme."
   * ]
   * @name cancelbuttonstyle
   */
  cancelButtonStyle: string;
  
  /**
   * @documentation
   * [
   * "`prompt` attribute",
   * "***",
   * "Optional Text of message."
   * ]
   * @name prompt
   */
  prompt: string;
  
  /**
   * @documentation
   * [
   * "`prompticon` attribute",
   * "***",
   * "Icon that appears next to prompt text"
   * ]
   * @name prompticon
   */
  promptIcon: string;
  
  /**
   * @documentation
   * [
   * "`sendeventonbeforeshow` attribute",
   * "***",
   * "The name of the boolean signal that will be sent to native just before the panel is shown."
   * ]
   * @name sendeventonbeforeshow
   */
  sendEventOnBeforeShow: string;

  /**
   * @documentation
   * [
   * "`sendeventonaftershow` attribute",
   * "***",
   * "The name of the boolean signal that will be sent to native after the panel is shown."
   * ]
   * @name sendeventonaftershow
   */
  sendEventOnAfterShow: string;

  /**
   * @documentation
   * [
   * "`sendeventonbeforehide` attribute",
   * "***",
   * "The name of the boolean signal that will be sent to native before the panel is hidden."
   * ]
   * @name sendeventonbeforehide
   */
  sendEventOnBeforeHide: string;

  /**
   * @documentation
   * [
   * "`sendeventonafterhide` attribute",
   * "***",
   * "The name of the boolean signal that will be sent to native after the panel is hidden."
   * ]
   * @name sendeventonafterhide
   */
  sendEventOnAfterHide: string;

  /**
   * @documentation
   * [
   * "`sendeventonok` attribute",
   * "***",
   * "The name of the boolean signal that will be sent when the Ok button is pressed"
   * ]
   * @name sendeventonok
   */
  sendEventOnOk: string;

  /**
   * @documentation
   * [
   * "`sendeventoncancel` attribute",
   * "***",
   * "The name of the boolean signal that will be sent when the Cancel button is pressed"
   * ]
   * @name sendeventoncancel
   */
  sendEventOnCancel: string;
}
