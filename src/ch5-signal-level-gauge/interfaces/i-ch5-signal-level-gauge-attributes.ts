import { ICh5CommonAttributesSet3 } from "../../ch5-common/interfaces/i-ch5-common-attributes-set3";
import { TCh5SignalLevelGaugeOrientation, TCh5SignalLevelGaugeSize } from './t-ch5-signal-level-gauge';

/**
 * @ignore
 */
export interface ICh5SignalLevelGaugeAttributes extends ICh5CommonAttributesSet3 {
  /**
  * @documentation
  * [
  * "`value` attribute",
  * "***",
  * "It sets the value of signal level gauge."
  * ]
  * @name value
  * @default 0
  * @limits [{"min": 0, "max": 65535}]
  * @attributeType "number"
  */
  value: number;
  /**
  * @documentation
  * [
  * "`orientation` attribute",
  * "***",
  * "Sets the orientation (horizontal or vertical) of the gauge. Default value is 'horizontal'."
  * ]
  * @name orientation
  * @default horizontal
  * @attributeType "EnumeratedValue"
  */
  orientation: TCh5SignalLevelGaugeOrientation;
  /**
  * @documentation
  * [
  * "`minValue` attribute",
  * "***",
  * "The minimum value determines the analog value sent to and received from the control system that will reflect the lowest position of the gauge. Default value is 0 and it can range from 0 to 65534."
  * ]
  * @name minvalue
  * @default 0
  * @limits [{"min": 0, "max": 65534}]
  * @attributeType "Integer"
  */
  minValue: number;
  /**
   * @documentation
   * [
   * "`maxValue` attribute",
   * "***",
   * "The maximum value determines the analog value sent to and received from the control system that will reflect the topmost point of the gauge. Default value is 65535 and it can range from 1 to 65535."
   * ]
   * @name maxvalue
   * @default 65535
   * @limits [{"min": 1, "max": 65535}]
   * @attributeType "Integer"
   */
  maxValue: number;
  /**
   * @documentation
   * [
   * "`numberOfBars` attribute",
   * "***",
   * "Sets the number of visible bars on the gauge. Default value is 6 and it can range from 1 to 15."
   * ]
   * @name numberofbars
   * @default 6
   * @limits [{"min": 1, "max": 15}]
   * @attributeType "Integer"
   */
  numberOfBars: number;
  /**
   * @documentation
   * [
   * "`signalBarSpacing` attribute",
   * "***",
   * "Sets the spacing (in pixels) between bars in the control. Default value is 1 and it can range from 0 to 6"
   * ]
   * @name signalbarspacing
   * @default 1
   * @limits [{"min": 0, "max": 6}]
   * @attributeType "Integer"
   */
  signalBarSpacing: number;
  /**
   * @documentation
   * [
   * "`receiveStateValue` attribute",
   * "***",
   * "The gauge value gets updated with the newly received value from signal."
   * ]
   * @name receivestatevalue
   * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
   * @attributeType "Join"
   */
  receiveStateValue: string;
  /**
   * @documentation
   * [
   * "`size` attribute",
   * "***",
   * "defines the different sizes of gauge. Possible values are regular, small, large, x-large. Default value is 'regular'."
   * ]
   * @name size
   * @default regular
   * @attributeType "EnumeratedValue"
   */
  size: TCh5SignalLevelGaugeSize;

}