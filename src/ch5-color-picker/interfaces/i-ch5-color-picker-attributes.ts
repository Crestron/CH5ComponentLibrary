import { ICh5CommonAttributesSet3 } from "../../ch5-common/interfaces/i-ch5-common-attributes-set3";


/**
 * @ignore
 */
export interface ICh5ColorPickerAttributes extends ICh5CommonAttributesSet3 {
  /**
   * @documentation
   * [
   * "`maxValue` attribute",
   * "***",
   * "Determines the maximum analog value to use as analog join input / output for changing current red, green and/or blue values of color picker. For hardware that support a wider range than 256, CH5 shall scale the individual color values to a 256 equivalent. Default value is 255 and it can range from 255 to 65535."
   * ]
   * @name maxvalue
   * @default 255
   * @limits [{"min": 255, "max": 65535}]
   * @attributeType "number"
   */
  maxValue: number;
  /**
   * @documentation
   * [
   * "`receiveStateRedValue` attribute",
   * "***",
   * "Input join, with valid values from 0-Maximum Analog Value, to update red color value of the color picker. Shall scale to 24-bit color range of 256 if Maximum analog value exceeds 256"
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
   * "Input join, with valid values from 0-Maximum Analog Value, to update green color value of the color picker. Shall scale to 24-bit color range of 256 if Maximum analog value exceeds 256."
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
   * "Input join, with valid values from 0-Maximum Analog Value, to update blue color value of the color picker. Shall scale to 24-bit color range of 256 if Maximum analog value exceeds 256."
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
   * "Send changed green value to control system "
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
   * "Send changed blue value to control system "
   * ]
   * @name sendeventcolorblueonchange
   * @default
   * @join {"direction": "event", "isContractName": true, "numericJoin": 1}
   * @attributeType "Join"
   */
  sendEventColorBlueOnChange: string;

}