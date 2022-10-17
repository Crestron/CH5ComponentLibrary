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
              * @default 
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
         * @attributeType "string"
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
        * "`sendEventColorRedOnChange` attribute",
        * "***",
        * "SendEventColorRedOnChange"
        * ]
        * @name sendEventColorRedOnChange
        * @default 
        * @attributeType "string"
        */
        sendEventColorRedOnChange: string;
        /**
         * @documentation
         * [
         * "`sendEventColorGreenOnChange` attribute",
         * "***",
         * "SendEventColorGreenOnChange"
         * ]
         * @name sendEventColorGreenOnChange
         * @default 
         * @attributeType "string"
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
         * @attributeType "string"
         */
        sendEventColorBlueOnChange: string;


}