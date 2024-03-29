import { ICh5AttributesColorChip } from "../../ch5-common/interfaces/i-ch5-common-attributes-color-chip";


/**
 * @ignore
 */
export interface ICh5ColorChipAttributes extends ICh5AttributesColorChip {
  /**
   * @documentation
   * [
   * "`previewColor` attribute",
   * "***",
   * "Select a color to preview and define initial color of the color chip. Default value is rgb(0,0,0)."
   * ]
   * @name previewcolor
   * @default rgb(0,0,0)
   * @attributeType "string"
   */
  previewColor: string;
  /**
   * @documentation
   * [
   * "`maxValue` attribute",
   * "***",
   * "Determines the maximum analog value to use as analog join input / output for changing current red, green and/or blue values of color chip. Default value is 255 and it can range from 50 to 65535."
   * ]
   * @name maxvalue
   * @default 255
   * @limits [{"min": 50, "max": 65535}]
   * @attributeType "number"
   */
  maxValue: number;
  /**
   * @documentation
   * [
   * "`sendEventOnClick` attribute",
   * "***",
   * "Sends a high signal when user places the finger on the control and low signal when finger is released."
   * ]
   * @name sendeventonclick
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
   * @name receivestateredvalue
   * @default 
   * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
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
   * @name receivestategreenvalue
   * @default
   * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
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
   * @name receivestatebluevalue
   * @default
   * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
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
  * @name sendeventcolorredonchange
  * @default
  * @join {"direction": "event", "isContractName": true, "numericJoin": 1}
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
   * @name sendeventcolorgreenonchange
   * @default
   * @join {"direction": "event", "isContractName": true, "numericJoin": 1}
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
   * @name sendeventcolorblueonchange
   * @default 
   * @join {"direction": "event", "isContractName": true, "numericJoin": 1}
   * @attributeType "Join"
   */
  sendEventColorBlueOnChange: string;

}