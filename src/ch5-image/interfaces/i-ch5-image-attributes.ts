// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5CommonAttributes } from "../../ch5-common/interfaces/";

/**
 * @ignore
 */
export interface ICh5ImageAttributes extends ICh5CommonAttributes {
  /**
   * @documentation
   * [
   * "`alt` attribute",
   * "***",
   * "Defines an alternative text description for the image."
   * ]
   * @name alt
   * @attributeType "String"
   */
  alt: string;

  /**
   * @documentation
   * [
   * "`height` attribute",
   * "***",
   * "The intrinsic height of the image, in pixels. Must be a string of the form Npx or N%."
   * ]
   * @name height
   * @attributeType "String"
   */
  height: string;

  /**
   * @documentation
   * [
   * "`width` attribute",
   * "***",
   * "The intrinsic width of the image, in pixels. Must be a string of the form Npx or N%."
   * ]
   * @name width
   * @attributeType "String"
   */
  width: string;

  /**
   * @documentation
   * [
   *  "`refreshrate` attribute",
   * "***",
   * "The default value is '0'. ",
   * "The number of seconds between each URL refresh. If 0, the URL will not",
   * "be refreshed."
   * ]
   * @name refreshrate
   * @default 0
   * @limits [{"min": 0, "max": 600}]
   * @attributeType "Integer"
   */
  refreshRate: number;

  /**
   * @documentation
   * [
   * "`url` attribute",
   * "***",
   * "Must be a supported image format, including JPEG, GIF, PNG, SVG, and BMP."
   * ]
   * @name url
   * @attributeType "ImageURL"
   */
  url: string;

  /**
   * @documentation
   * [
   * "`mode` attribute",
   * "***",
   * "This attribute is used together with <ch5-image-mode> child component."
   * ]
   * @name mode
   * @attributeType "Integer"
   */
  mode: number | undefined;

  /**
   * @documentation
   * [
   * "`password` attribute",
   * "***",
   * "The authentication password required to get the image."
   * ]
   * @name password
   * @attributeType "String"
   */
  password: string;

  /**
   * @documentation
   * [
   * "`dir` attribute",
   * "***",
   * "The image direction."
   * ]
   * @name dir
   * @attributeType "String"
   */
  dir: string;

  /**
   * @documentation
   * [
   * "`user` attribute",
   * "***",
   * "The authentication username required to get the image."
   * ]
   * @name user
   * @attributeType "String"
   */
  user: string;

  /**
   * @documentation
   * [
   * "`receivestateurl` attribute",
   * "***",
   * "The image URL."
   * ]
   * @name receivestateurl
   * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
   * @attributeType "Join"
   */
  receiveStateUrl: string;

  /**
   * @documentation
   * [
   * "`receivestatemode` attribute",
   * "***",
   * "The image mode received."
   * ]
   * @name receivestatemode
   * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
   * @attributeType "Join"
   */
  receiveStateMode: string;

  /**
   * @documentation
   * [
   * "`sendeventontouch` attribute",
   * "***",
   * "Sends a boolean true event when the screen is tapped and boolean false event when released. ",
   * "Use this when the control system takes an action on a level-sensitive boolean digital event. ",
   * "Examples include the SIMPL Logic Symbol for Analog Ramp with a description of ",
   * "Digital input <up> 'High/1 (level sensitive) = Ramp up; Low/0 = Stop ramp'."
   * ]
   * @name sendeventontouch
   * @join {"direction": "event", "isContractName": true, "booleanJoin": 1}
   * @attributeType "Join"
   */
  sendEventOnTouch: string;

  /**
   * @documentation
   * [
   * "`sendeventonclick` attribute",
   * "***",
   * "Sends an on click or tap event (mouse or swipe up and down quickly). ",
   * "Use this when the control system takes an action on the rising edge from false to true of a boolean digital event. ",
   * "Examples include the SIMPL Logic Symbol for Toggle with a description of ",
   * "Digital input <clock> 'High/1 (rising edge) = Toggle; Low/0 = No effect'."
   * ]
   * @name sendeventonclick
   * @join {"direction": "event", "isContractName": true, "booleanJoin": 1}
   * @attributeType "Join"
   */
  sendEventOnClick: string;

  /**
   * @documentation
   * [
   * "`sendeventonerror` attribute",
   * "***",
   * "Sends an event on error."
   * ]
   * @name sendeventonerror
   * @join {"direction": "event", "isContractName": true, "stringJoin": 1}
   * @attributeType "Join"
   */
  sendEventOnError: string;

  /**
   * @documentation
   * [
   * "`allowValuesOnMove` attribute",
   * "***",
   * "Signals for X and Y position will be sent if this value is set to true on touch move. If allowPositionDataToBeSent is set to false, then the value for allowValuesOnMove will be set to false automatically."
   * ]
   * @name allowvaluesonmove
   * @default false
   * @attributeType "Boolean"
   */
  allowValuesOnMove: boolean;

  /**
   * @documentation
   * [
   * "`allowPositionDataToBeSent` attribute",
   * "***",
   * "Signals for X and Y position will be sent if this value is set to true on touch end."
   * ]
   * @name allowpositiondatatobesent
   * @default false
   * @attributeType "Boolean"
   */
  allowPositionDataToBeSent: boolean;

  /**
   * @documentation
   * [
   * "`receiveStateAllowValuesOnMove` attribute",
   * "***",
   * "Receives signal to identify the events to be supported for sending signals. This is the signal based attribute for allowValuesOnMove. Signal always overrides the non-signal attribute."
   * ]
   * @name receivestateallowvaluesonmove
   * @join {"direction": "state", "isContractName": true, "booleanJoin": 1}
   * @attributeType "Join"
   */
  receiveStateAllowValuesOnMove: string;

  /**
   * @documentation
   * [
   * "`receiveStateAllowPositionDataToBeSent` attribute",
   * "***",
   * "Receives signal to identify if signals should be sent from UI to CS for the X and Y Positions. This is the signal based attribute for allowPositionDataToBeSent. Signal always overrides the non-signal attribute."
   * ]
   * @name receivestateallowpositiondatatobesent
   * @join {"direction": "state", "isContractName": true, "booleanJoin": 1}
   * @attributeType "Join"
   */
  receiveStateAllowPositionDataToBeSent: string;

  /**
   * @documentation
   * [
   * "`sendEventXPosition` attribute",
   * "***",
   * "Sends a value for X position "
   * ]
   * @name sendeventxposition
   * @join {"direction": "event", "isContractName": true, "numericJoin": 1}
   * @attributeType "Join"
   */
  sendEventXPosition: string;

  /**
   * @documentation
   * [
   * "`sendEventYPosition` attribute",
   * "***",
   * "Sends a value for Y position"
   * ]
   * @name sendeventyposition
   * @join {"direction": "event", "isContractName": true, "numericJoin": 1}
   * @attributeType "Join"
   */
  sendEventYPosition: string;
}
