import { ICh5CommonAttributesSet3 } from "../../ch5-common/interfaces/i-ch5-common-attributes-set3";
import { TCh5WifiSignalLevelGaugeGaugeStyle, TCh5WifiSignalLevelGaugeAlignment, TCh5WifiSignalLevelGaugeSize, } from './t-ch5-wifi-signal-level-gauge';

/**
 * @ignore
 */
export interface ICh5WifiSignalLevelGaugeAttributes extends ICh5CommonAttributesSet3 {
  /**
   * @documentation
   * [
   * "`receiveStateValue` attribute",
   * "***",
   * "The gauge value gets updated with the newly received value from signal."
   * ]
   * @name receivestatevalue
   * @default
   * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
   * @attributeType "Join"
   */
  receiveStateValue: string;
  /**
   * @documentation
   * [
   * "`gaugeStyle` attribute",
   * "***",
   * "Determines the graphic presentation/appearance of the gauge. This style can contain any number of states each representing a different level of signal strength. It sets the style(accents,light and dark) of the gauge. Default value is 'light'."
   * ]
   * @name gaugestyle
   * @default light
   * @attributeType "EnumeratedValue"
   */
  gaugeStyle: TCh5WifiSignalLevelGaugeGaugeStyle;
  /**
  * @documentation
  * [
  * "`alignment` attribute",
  * "***",
  * "Sets the alignment of the gauge up, down, left and right. Default value is 'up'."
  * ]
  * @name alignment
  * @default up
  * @attributeType "EnumeratedValue"
  */
  alignment: TCh5WifiSignalLevelGaugeAlignment;
  /**
  * @documentation
  * [
  * "`minValue` attribute",
  * "***",
  * "Determines the minimum analog value received from the control system, when receiving this value or a value below the minimum the control will show the off state. Default value is 0 and it can range from 0 to 99."
  * ]
  * @name minvalue
  * @default 0
  * @limits [{"min": 0, "max": 99}]
  * @attributeType "Integer"
  */
  minValue: number;
  /**
   * @documentation
   * [
   * "`maxValue` attribute",
   * "***",
   * "Determines the maximum analog value received from the control system, when receiving this value or a value above the maximum the control will show the maximum signal strength state. Default value is 100 and it can range from 1 to 100."
   * ]
   * @name maxvalue
   * @default 100
   * @limits [{"min": 1, "max": 100}]
   * @attributeType "Integer"
   */
  maxValue: number;
  /**
   * @documentation
   * [
   * "`size` attribute",
   * "***",
   * "Select the size of the wifi-signal level gauge from small, regular, large and x-large. Default value is 'regular'."
   * ]
   * @name size
   * @default regular
   * @attributeType "EnumeratedValue"
   */
  size: TCh5WifiSignalLevelGaugeSize;

}