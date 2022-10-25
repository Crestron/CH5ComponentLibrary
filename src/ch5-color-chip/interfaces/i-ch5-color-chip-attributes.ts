import { ICh5CommonAttributes } from "../../ch5-common/interfaces";


/**
 * @ignore
 */
export interface ICh5ColorChipAttributes extends ICh5CommonAttributes {
  /**
   * @documentation
   * [
   * "`previewColor` attribute",
   * "***",
   * "PreviewColor"
   * ]
   * @name previewColor
   * @default rgb(0,0,0)
   * @attributeType "string"
   */
  previewColor: string;
  /**
   * @documentation
   * [
   * "`maxValue` attribute",
   * "***",
   * "Determines the maximum analog value to use as analog join input for changing current red, green and/or blue values of color chip."
   * ]
   * @name maxValue
   * @default 255
   * @limits [{"min": 255, "max": 65535}]
   * @attributeType "number"
   */
  maxValue: number;
  /**
   * @documentation
   * [
   * "`sendEventOnClick` attribute",
   * "***",
   * "	
 Sends a high signal when user places the finger on the control and low signal when finger is released."
   * ]
   * @name sendEventOnClick
   * @default
   * @join {"direction": "event", "isContractName": true, "booleanJoin": 1}
   * @attributeType "Join"
   */
  sendEventOnClick: string;

  /**
   * @documentation
   * [
   * "`receiveStateRedValue` attribute",
   * "***",
   * "Input join, with valid values from 0-Maximum Analog Value, to update red color value of the color chip. Shall scale to 24-bit color range of 256 if Maximum analog value exceeds 256."
   * ]
   * @name receiveStateRedValue
   * @default 
   * @join {"direction": "state", "isContractName": true, "booleanJoin": 1}
   * @attributeType "Join"
   */
  receiveStateRedValue: string;

  /**
   * @documentation
   * [
   * "`receiveStateGreenValue` attribute",
   * "***",
   * "Input join, with valid values from 0-Maximum Analog Value, to update green color value of the color chip. Shall scale to 24-bit color range of 256 if Maximum analog value exceeds 256."
   * ]
   * @name receiveStateGreenValue
   * @default
   * @join {"direction": "state", "isContractName": true, "booleanJoin": 1}
   * @attributeType "Join"
   */
  receiveStateGreenValue: string;

  /**
   * @documentation
   * [
   * "`receiveStateBlueValue` attribute",
   * "***",
   * "Input join, with valid values from 0-Maximum Analog Value, to update blue color value of the color chip. Shall scale to 24-bit color range of 256 if Maximum analog value exceeds 256."
   * ]
   * @name receiveStateBlueValue
   * @default
   * @join {"direction": "state", "isContractName": true, "booleanJoin": 1}
   * @attributeType "Join"
   */
  receiveStateBlueValue: string;

  /**
  * @documentation
  * [
  * "`sendEventColorRedOnChange` attribute",
  * "***",
  * "Send changed red value to Control System"
  * ]
  * @name sendEventColorRedOnChange
  * @default
  * @join {"direction": "event", "isContractName": true, "booleanJoin": 1}
  * @attributeType "Join"
  */
  sendEventColorRedOnChange: string;
  /**
   * @documentation
   * [
   * "`sendEventColorGreenOnChange` attribute",
   * "***",
   * "Send changed green value to Control System"
   * ]
   * @name sendEventColorGreenOnChange
   * @default
   * @join {"direction": "event", "isContractName": true, "booleanJoin": 1}
   * @attributeType "Join"
   */
  sendEventColorGreenOnChange: string;
  /**
   * @documentation
   * [
   * "`sendEventColorBlueOnChange` attribute",
   * "***",
   * "Send changed blue value to control system"
   * ]
   * @name sendEventColorBlueOnChange
   * @default 
   * @join {"direction": "event", "isContractName": true, "booleanJoin": 1}
   * @attributeType "Join"
   */
  sendEventColorBlueOnChange: string;


}