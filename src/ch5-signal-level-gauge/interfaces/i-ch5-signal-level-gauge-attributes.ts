import { ICh5CommonAttributesSet3 } from "../../ch5-common/interfaces";
import { TCh5SignalLevelGaugeOrientation, TCh5SignalLevelGaugeSize, } from './t-ch5-signal-level-gauge';

/**
 * @ignore
 */
export interface ICh5SignalLevelGaugeAttributes extends ICh5CommonAttributesSet3 {
  /**
  * @documentation
  * [
  * "`orientation` attribute",
  * "***",
  * "Sets the orientation (horizontal or vertical) of the gauge."
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
  * "The minimum value determines the analog value sent to and received from the control system that will reflect the lowest position of the gauge."
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
   * "The maximum value determines the analog value sent to and received from the control system that will reflect the topmost point of the gauge"
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
   * "Sets the number of visible bars on the gauge. This number is restricted to a maximum of 15 for usability."
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
   * "Sets the spacing (in pixels) between bars in the control."
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
   * "defines the different sizes of gauge. Possible values are regular, small, large, x-large"
   * ]
   * @name size
   * @default regular
   * @attributeType "EnumeratedValue"
   */
  size: TCh5SignalLevelGaugeSize;

}