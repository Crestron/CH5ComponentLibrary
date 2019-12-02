// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5Common, ICh5CommonAttributes } from "../ch5-common";
import { TCh5ButtonSize, TCh5ButtonIconPosition, TCh5ButtonOrientation, TCh5ButtonShape, TCh5ButtonStretch, TCh5ButtonType } from "./types";


/**
 * @ignore
 */
export interface ICh5ButtonAttributes extends ICh5CommonAttributes {
    /**
     * @name size
     * @documentation
     * [
     * "`size` attribute",
     *  "***",
     *  "Overrides the appearance of the button with alternative css defined in classes defined with ch5-button--size where size is the value of the property.If no `size` is provided, type of `default` is used."
     * ]
     */
    size: TCh5ButtonSize;

    /**
     * @documentation
     * [
     * "`label` attribute",
     * "***",
     * "Label value"
     * ]
     * @name label
     */
    label: string;

    /**
     * @documentation
     * [
     * "`icon` attribute",
     * "***",
     * "Icon class"
     * ]
     * @name iconclass
     */
    iconClass: string;

    /**
     * @documentation
     * [
     * "`iconposition` attribute",
     * "***",
     * "Default left",
     * "Valid values: first, last, top, bottom.",
     * "Icon position relative to the label."
     * ]
     * @name iconposition
     */
    iconPosition: TCh5ButtonIconPosition;

    /**
     * @documentation
     * [
     * "`iconurl` attribute",
     * "***",
     * "Attribute used for add a svg image"
     * ]
     * @name iconurl
     */
    iconUrl: string;

    /**
     * @documentation
     * [
     * "`orientation` attribute",
     * "***",
     * "Default 'horizontal'. Valid values horizontal, vertical. Lays out",
     * "the elements of the control in a horizontal or vertical manner.",
     * "For vertical alignment it will apply a css class that will rotate the ",
     * "component -90 degrees ( 270 degrees clockwise, 90 degrees counter clockwise )."
     * ]
     * @name orientation
     */
    orientation: TCh5ButtonOrientation;

    /**
     * @documentation
     * [
     * "`shape` attribute",
     * "***",
     * "Default rounded-rectangle. Valid values: rounded-rectangle,",
     * "rectangle, tab, circle, oval. Shape of the button."
     * ]
     * @name shape
     */
    shape: TCh5ButtonShape;

    /**
     * @documentation
     * [
     * "`stretch` attribute",
     * "***",
     * "Default both. Valid values: width, height, both",
     * "When stretch property is set, the button element inherits the",
     * "width or/and height of the container. If stretch by height is used,",
     * "the button will be responsive based on the label length, until",
     * "reaches the max-width of the container. If stretch width is",
     * "applied, there is no responsiveness after reaching the maxwidth,",
     * "the text will overflow. Same if stretch both is used. Note",
     * "that, if button element shape is 'circle' or 'ova', stretch",
     * "property will be ignored."
     * ]
     * @name stretch
     */
    stretch: TCh5ButtonStretch;

    /**
     * @documentation
     * [
     * "`type` attribute",
     * "***",
     * "Valid values: default, info, text, danger, warning, success,primary, secondary.",
     * "overrides the appearance of the button with alternative css",
     * "defined in classes defined with ch5-button--type where type is",
     * "the value of the property. If no 'type' is provided, type of",
     * "'default' is used. "
     * ]
     * @name type
     */
    type: TCh5ButtonType;

    /**
     * @documentation
     * [
     * "`receivestateselected` attribute",
     * "***",
     * "When receive apply true value apply the selected class ( ch5-button--selected"
     * ]
     * @name receivestateselected
     */
    receiveStateSelected: string;

    /**
     * @documentation
     * [
     * "`receivestatelabel` attribute",
     * "***",
     * "When receive apply the value on the label"
     * ]
     * @name receivestatelabel
     */
    receiveStateLabel: string;

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
    receiveStateScriptLabelHtml: string;

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
    sendEventOnClick: string;

    /**
     * @documentation
     * [
     * "`sendeventontouch` attribute",
     * "***",
     * "Sends boolean true event when finger on glass and boolean false event when finger released",
     * "Use this when control system takes action on level sensitive boolean digital event",
     * "Examples include SIMPL Logic Symbol for Analog Ramp with description of",
     * "Digital input <up> 'High/1 (level sensitive) = Ramp up; Low/0 = Stop ramp'"
     * ]
     * @name sendeventontouch
     */
    // * Implementation documentation for developers
    // * "The signal will be sent with value true and reasserted",
    // * "true every 500ms while the finger is on the",
    // * "component. The reassertion is needed to avoid",
    // * "unending ramp should there be a communications error,",
    // * "a failure of the button itself or any intermediate proxy of",
    // * "the signal.",
    // * "This signal should not be generated as part of a gesture "
    sendEventOnTouch: string;

    /**
     * @documentation
     * [
     * "`receivestateiconclass` attribute",
     * "***",
     * "The icon class received from Control System"
     * ]
     * @name receivestateiconclass
     */
    receiveStateIconClass: string | null;

    /**
     * @documentation
     * [
     * "`receivestatetype` attribute",
     * "***",
     * "when receive stateType value from control system, value is applied to the type attribute.",
     * "See description of the type attribute."
     * ]
     * @name receivestatetype
     */
    receiveStateType: string | null;

    /**
     * @documentation
     * [
     * "`receivestateiconurl` attribute",
     * "***",
     * "When receive stateIconUrl value from control system, value is applied to the iconUrl attribute.",
     * "See description of the iconUrl attribute."
     * ]
     * @name receivestateiconurl
     */
    receiveStateIconUrl: string | null;
    
    /**
     * @documentation
     * [
     * "`customclasspressed` attribute",
     * "***",
     * "Name of CSS class applied while the button is pressed by user."
     * ]
     * @name customclasspressed
     */
    customClassPressed: string | null;

    /**
     * @documentation
     * [
     * "`customclassdisabled` attribute",
     * "***",
     * "Name of CSS class applied while the button is disabled."
     * ]
     * @name customclassdisabled
     */
    customClassDisabled: string | null;

}
