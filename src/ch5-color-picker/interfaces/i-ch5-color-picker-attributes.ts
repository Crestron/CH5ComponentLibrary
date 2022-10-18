import { ICh5CommonAttributes } from "../../ch5-common/interfaces";


/**
 * @ignore
 */
export interface ICh5ColorPickerAttributes extends ICh5CommonAttributes {
  /**
        * @documentation
        * [
        * "`maxValue` attribute",
        * "***",
        * "Determines the maximum analog value to use as analog join input for changing current red, green and/or blue values of color picker. For hardware that support a wider range than 256, CH5 shall scale the individual color values to a 256 equivalent."
        * ]
        * @name maxValue
        * @default 255
        * @attributeType "number"
        */
  maxValue: number;
  /**
   * @documentation
   * [
   * "`receiveStateRedValue` attribute",
   * "***",
   * "Input join, with valid values from 0-Maximum Analog Value, to update red color value of the color chip. Shall scale to 24-bit color range of 256 if Maximum analog value exceeds 256"
   * ]
   * @name receiveStateRedValue
   * @default 
   * @attributeType "string"
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
   * @attributeType "string"
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
   * @attributeType "string"
   */
  receiveStateBlueValue: string;
  /**
   * @documentation
   * [
   * "`sendRedOnChange` attribute",
   * "***",
   * "Send changed red value to Control System"
   * ]
   * @name sendRedOnChange
   * @default 
   * @attributeType "string"
   */
  sendRedOnChange: string;
  /**
   * @documentation
   * [
   * "`sendGreenOnChange` attribute",
   * "***",
   * "Send changed green value to control system "
   * ]
   * @name sendGreenOnChange
   * @default 
   * @attributeType "string"
   */
  sendGreenOnChange: string;
  /**
   * @documentation
   * [
   * "`sendBlueOnChange` attribute",
   * "***",
   * "Send changed blue value to control system "
   * ]
   * @name sendBlueOnChange
   * @default 
   * @attributeType "string"
   */
  sendBlueOnChange: string;

}