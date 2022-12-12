import { ICh5CommonAttributes } from "../../ch5-common/interfaces";
import { TCh5SegmentedGaugeOrientation, TCh5SegmentedGaugeGaugeLedStyle, TCh5SegmentedGaugeStateGraphic } from './t-ch5-segmented-gauge';

/**
 * @ignore
 */
export interface ICh5SegmentedGaugeAttributes extends ICh5CommonAttributes {
  /**
  * @documentation
  * [
  * "`orientation` attribute",
  * "***",
  * "Sets the orientation of the gauge to horizontal(default) or vertical."
  * ]
  * @name orientation
  * @default horizontal
  * @attributeType "EnumeratedValue"
  */
  orientation: TCh5SegmentedGaugeOrientation;
  /**
  * @documentation
  * [
  * "`gaugeLedStyle` attribute",
  * "***",
  * "Determines the graphic features of the gauge. Possible values are rectangle(default) and circle."
  * ]
  * @name gaugeledstyle
  * @default rectangle
  * @attributeType "EnumeratedValue"
  */
  gaugeLedStyle: TCh5SegmentedGaugeGaugeLedStyle;
  /**
  * @documentation
  * [
  * "`primaryStateGraphic` attribute",
  * "***",
  * "Sets the segment graphic for the largest group of segments. Possible values are green(default), yellow, red, blue, orange, white and inactive."
  * ]
  * @name primarystategraphic
  * @default green
  * @attributeType "EnumeratedValue"
  */
  primaryStateGraphic: TCh5SegmentedGaugeStateGraphic;
  /**
  * @documentation
  * [
  * "`secondaryStateGraphic` attribute",
  * "***",
  * "Defines the segment graphic for the second largest group of segments. Possible values are yellow(default), green, red, blue, orange, white and inactive."
  * ]
  * @name secondarystategraphic
  * @default yellow
  * @attributeType "EnumeratedValue"
  */
  secondaryStateGraphic: TCh5SegmentedGaugeStateGraphic;
  /**
  * @documentation
  * [
  * "`tertiaryStateGraphic` attribute",
  * "***",
  * "Determines the segment graphic for the smallest group of segments. Possible values are red(default), green, yellow, blue, orange, white and inactive."
  * ]
  * @name tertiarystategraphic
  * @default red
  * @attributeType "EnumeratedValue"
  */
  tertiaryStateGraphic: TCh5SegmentedGaugeStateGraphic;
  /**
  * @documentation
  * [
  * "`minValue` attribute",
  * "***",
  * "The minimum value determines the analog value sent to and received from the control system that will reflect the lowest position of the gauge. Default value is 0."
  * ]
  * @name minvalue
  * @default 0
  * @limits [{"min": 0, "max": 65534}]
  * @attributeType "number"
  */
  minValue: number;
  /**
  * @documentation
  * [
  * "`maxValue` attribute",
  * "***",
  * "The maximum value determines the analog value sent to and received from the control system that will reflect the topmost point of the gauge. Default value is 65535."
  * ]
  * @name maxvalue
  * @default 65535
  * @limits [{"min": 1, "max": 65535}]
  * @attributeType "number"
  */
  maxValue: number;
  /**
  * @documentation
  * [
  * "`numberOfSegments` attribute",
  * "***",
  * "Sets the number of gauge segments displayed on the gauge. This number is restricted to a maximum of 50 for usability. Default number of segments are 20."
  * ]
  * @name numberofsegments
  * @default 20
  * @limits [{"min": 1, "max": 50}]
  * @attributeType "number"
  */
  numberOfSegments: number;
  /**
  * @documentation
  * [
  * "`touchSettable` attribute",
  * "***",
  * "Enables or disables whether the control is touch settable. Default value is true."
  * ]
  * @name touchsettable
  * @default true
  * @attributeType "Boolean"
  */
  touchSettable: boolean
  /**
  * @documentation
  * [
  * "`sendEventOnClick` attribute",
  * "***",
  * "User may optionally select a digital join to send a value to the control system. The value goes high when the user places their finger on the gauge and low when it is released."
  * ]
  * @name sendeventonclick
  * @join {"direction": "state", "isContractName": true, "booleanJoin": 1}
  * @attributeType "Join"
  */
  sendEventOnClick: string;
  /**
  * @documentation
  * [
  * "`sendEventOnChange` attribute",
  * "***",
  * "Send an analog signal value on a change of value in the gauge. "
  * ]
  * @name sendeventonchange
  * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
  * @attributeType "Join"
  */
  sendEventOnChange: string;
  /**
  * @documentation
  * [
  * "`receiveStateValue` attribute",
  * "***",
  * "Analog join to receive feedback from the control system. Note that if no join is selected, the gauge will not update its position."
  * ]
  * @name receivestatevalue
  * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
  * @attributeType "Join"
  */
  receiveStateValue: string;
}