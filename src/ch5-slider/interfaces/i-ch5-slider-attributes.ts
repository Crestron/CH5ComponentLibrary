import { TCh5SliderHandleShape, TCh5SliderOrientation, TCh5SliderSize, TCh5SliderHandleSize, TCh5SliderStretch, TCh5SliderToolTipShowType, TCh5SliderToolTipDisplayType, } from './t-ch5-slider';
import { TCh5CommonInputFeedbackModes } from "../../ch5-common-input/interfaces/t-ch5-common-input";
import { ICh5CommonAttributes } from "../../ch5-common/interfaces";


/**
 * @ignore
 */
export interface ICh5SliderAttributes extends ICh5CommonAttributes {

   /**
    * @documentation
    * [
    * "`handleShape` attribute",
    * "***",
    * "It defines the handle shape.",
    * "The default value is 'rounded-rectangle'. Valid Values: 'rectangle', 'circle', 'oval', 'rounded-rectangle' "
    * ]
    * @name handleshape
    * @default rounded-rectangle
    * @attributeType "EnumeratedValue"
    */
   handleShape: TCh5SliderHandleShape;

   /**
    * @documentation
    * [
    * "`value` attribute",
    * "***",
    * "The Initial values of the single value, or a lower value if range=true."
    * ]
    * @name value
    * @default 0
    * @limits [{"min": 0, "max": 65535}]
    * @attributeType "Integer"
    */
   value: number;

   /**
    * @documentation
    * [
    * "`valueHigh` attribute",
    * "***",
    * "The higher value is only applicable if range = true. valueHigh should always greater than value."
    * ]
    * @name valuehigh
    * @default 65535
    * @limits [{"min": 1, "max": 65535}]
    * @attributeType "Integer"
    */
   valueHigh: number;

   /**
    * @documentation
    * [
    * "`max` attribute",
    * "***",
    * "The maximum value determines the analog value sent to and received from the control system that will reflect the topmost point of the slider. Default value is 65535.It can range from 1 to 65535."
    * ]
    * @name max
    * @default 65535
    * @limits [{"min": 1, "max": 65535}]
    * @attributeType "Integer"
    */
   max: number;

   /**
    * @documentation
    * [
    * "`min` attribute",
    * "***",
    * "The minimum value determines the analog value sent to and received from the control system that will reflect the lowest position of the slider. Default value is 0.It can range from 0 to 65534."
    * ]
    * @name min
    * @default 0
    * @limits [{"min": 0, "max": 65534}]
    * @attributeType "Integer"
    */
   min: number;

   /**
    * @documentation
    * [
    * "`orientation` attribute",
    * "***",
    * "Sets the orientation (horizontal or vertical) of the slider.The default value is 'horizontal'."
    * ]
    * @name orientation
    * @default horizontal
    * @attributeType "EnumeratedValue"
    */
   orientation: TCh5SliderOrientation;

   /**
    * @documentation
    * [
    * "`size` attribute",
    * "***",
    * "defines the different sizes of slider. Possible values are 'x-small', 'small', 'regular', 'large', 'x-large'.",
    * "The default value is 'regular'."
    * ]
    * @name size
    * @default regular
    * @attributeType "EnumeratedValue"
    */
   size: TCh5SliderSize;

   /**
    * @documentation
    * [
    * "`handleSize` attribute",
    * "***",
    * "defines the different sizes of slider handle. Possible values are 'x-small', 'small', 'regular', 'large', 'x-large'.",
    * "The default value is 'regular'."
    * ]
    * @name handlesize
    * @default regular
    * @attributeType "EnumeratedValue"
    */
   handleSize: TCh5SliderHandleSize;

   /**
    * @documentation
    * [
    * "`step` attribute",
    * "***",
    * "The default value is 1. Defines the size or amount of each interval or step the slider takes between the min and max values.",
    * "If the value range between max and min (i.e. max - min) is not evenly divisible by step value, the max will be adjusted accordingly.",
    * "Since all values on the slider are part of a range, step is strictly related to min and max attributes.",
    * "If you want quarters (0, 25, 50, 75, 100), then 25 is the value for step attribute, 0 is value for min, and 100 is value for max."
    * ]
    * @name step
    * @default 1
    * @limits [{"min": 1, "max": 65535}]
    * @attributeType "Integer"
    */
   step: number;

   /**
    * @documentation
    * [
    * "`stretch` attribute",
    * "***",
    * "When the stretch property is set, the slider inherits the width and/or ",
    * "height of the container.",
    * "The default value is 'both'. Valid Values are 'width', 'height', 'both'. "
    * ]
    * @name stretch
    * @default both
    * @attributeType "EnumeratedValue"
    */
   stretch: TCh5SliderStretch;

   /**
    * @documentation
    * [
    * "`ticks` attribute",
    * "***",
    * "Defines the ticks on the slider. ",
    * "This definition is based on advanced tick scales: non-linear or logarithmic. ",
    * "Sliders can be created with ever-increasing increments by",
    * "specifying the value for the slider at certain intervals. ",
    * "- The first value defines the % position along the length of the slider scale to place a tick mark. ",
    * "- The second value is the label value to place next to the tick at that position.",
    * "***",
    * "An example would be [[0.0,'-60'], [0.25,'-40'], [0.50,'-20'],[0.75,'-10'], [1.0,'0']]"
    * ]
    * @name ticks
    * @default 
    * @attributeType "String"
    */
   ticks: string;

   /**
  * @documentation
  * [
  * "`tooltipshowtype` attribute",
  * "***",
  * "The default value is 'off'.  Provides the ability to display a tooltip above (horizontal) or right (vertical) of the handle.  Valid values: ",
  * "-'off': Not displayed ",
  * "-'on': Always displayed ",
  * "-'auto': Displayed while user interacts with the slider"
  * ]
  * @name tooltipshowtype
  * @default off
  * @attributeType "EnumeratedValue"
  */
   toolTipShowType: TCh5SliderToolTipShowType;

   /**
    * @documentation
    * [
    * "`toolTipDisplayType` attribute",
    * "***",
    * "The default value is '%'. Sets what is displayed in the tooltip. Valid values: ",
    * "'%' - The value is displayed as a percent ",
    * "'value' - The actual value provided"
    * ]
    * @name tooltipdisplaytype
    * @default %
    * @attributeType "EnumeratedValue"
    */
   toolTipDisplayType: TCh5SliderToolTipDisplayType;

   /**
    * @documentation
    * [
    * "`signalvaluesynctimeout` attribute",
    * "***",
    * "The default value is 1500. Defines the time (milliseconds) between when the user ",
    * "releases the slider handle and the time the slider will check ",
    * "if the value is equal with the value from the signal. If not, it will automatically apply the value from the signal."
    * ]
    * @name signalvaluesynctimeout
    * @default 1500
    */
   signalValueSyncTimeout: string | number;

   /**
    * @documentation
    * [
    * "`feedbackmode` attribute",
    * "***",
    * "The default value is direct.",
    * "If set to direct, value send and receive will be instant. On submit, it ",
    * "will send and listen for the first received event."
    * ]
    * @name feedbackmode
    * @default direct
    */
   feedbackMode: TCh5CommonInputFeedbackModes;

   /**
    * @documentation
    * [
    * "`onclean` attribute",
    * "***",
    * "Runs when a clean event is initiated."
    * ]
    * @name onclean
    */
   onclean: {};

   /**
    * @documentation
    * [
    * "`ondirty` attribute",
    * "***",
    * "Runs when a dirty event is initiated."
    * ]
    * @name ondirty
    */
   ondirty: {};

   /**
    * @documentation
    * [
    * "`range` attribute",
    * "***",
    * "If true, the slider will have two handles so two different values can be defined.The default value is false.",
    * "Advance slider is not supported when range is true."
    * ]
    * @name range
    * @default false
    */
   range: boolean;

   /**
    * @documentation
    * [
    * "`showTickValues` attribute",
    * "***",
    * "The default value is false. Used to display optional value labels next to tick marks at each tick increment.Possible values are true/false."
    * ]
    * @name showtickvalues
    * @default false
    * @attributeType "Boolean"
    */
   showTickValues: boolean;

   /**
    * @documentation
    * [
    * "`noHandle` attribute",
    * "***",
    * "If the noHandle attribute is set to true, then the handle of the slider will hide. The possible values are true/false. The default value is false."
    * ]
    * @name nohandle
    * @default false
    * @attributeType "Boolean"
    */
   noHandle: boolean

   /**
    * @documentation
    * [
    * "`tapSettable` attribute",
    * "***",
    * "The default value is false. If true, sets the handle closest to the area where slider gets tapped. Possible values are true/false."
    * ]
    * @name tapsettable
    * @default false
    * @attributeType "Boolean"
    */
   tapSettable: boolean

   /**
    * @documentation
    * [
    * "`receiveStateValue` attribute",
    * "***",
    * "On receive, changes the value of the slider handle. Ramp Control Blocks (RCB) are defined as a numerical value and a time duration sent as a single signal."
    * ]
    * @name receivestatevalue
    * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
    * @attributeType "Join"
    */
   receiveStateValue: string;

   /**
    * @documentation
    * [
    * "`receiveStateValueHigh` attribute",
    * "***",
    * "when receive, change the value of the high Handle of the slider, if range slider is set to true."
    * ]
    * @name receivestatevaluehigh
    * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
    * @attributeType "Join"
    */
   receiveStateValueHigh: string;

   /**
    * @documentation
    * [
    * "`sendEventOnChange` attribute",
    * "***",
    * "Sends a signal value on slider change."
    * ]
    * @name sendeventonchange
    * @join {"direction": "event", "isContractName": true, "numericJoin": 1}
    * @attributeType "Join"
    */
   sendEventOnChange: string;

   /**
    * @documentation
    * [
    * "`sendEventOnChangeHigh` attribute",
    * "***",
    * "If the range slider is set to true, sends a signal value high on the slider change."
    * ]
    * @name sendeventonchangehigh
    * @join {"direction": "event", "isContractName": true, "numericJoin": 1}
    * @attributeType "Join"
    */
   sendEventOnChangeHigh: string;

   /**
    * @documentation
    * [
    * "`onOffOnly` attribute",
    * "***",
    * "The onOffOnly set to true will hide the slider leaving only the two buttons showing. The default value is false."
    * ]
    * @name onoffonly
    * @default false
    * @attributeType "Boolean"
    */
   onOffOnly: boolean;
   /**
    * @documentation
    * [
    * "`receiveStateShowOnOffOnly` attribute",
    * "***",
    * "Receive the signal(true) that value will hide the slider leaving only the two buttons showing."
    * ]
    * @name receivestateshowonoffonly
    * @join {"direction": "state", "isContractName": true, "booleanJoin": 1}
    * @attributeType "Join"
    */
   receiveStateShowOnOffOnly: string;
   /**
    * @documentation
    * [
    * "`sendEventOnUpper` attribute",
    * "***",
    * "Digital join to send a value to the control system if the user presses the top 3/4 half(vertical) or right 3/4 half(horizontal) of the slider."
    * ]
    * @name sendeventonupper
    * @join {"direction": "event", "isContractName": true, "booleanJoin": 1}
    * @attributeType "Join"
    */
   sendEventOnUpper: string;
   /**
    * @documentation
    * [
    * "`sendEventOnLower` attribute",
    * "***",
    * "Digital join to send a value to the control system if the user presses the bottom 1/4 half(vertical) or left 1/4 half(horizontal) of the slider."
    * ]
    * @name sendeventonlower
    * @join {"direction": "event", "isContractName": true, "booleanJoin": 1}
    * @attributeType "Join"
    */
   sendEventOnLower: string;
   /**
    * @documentation
    * [
    * "`sendEventOnHandleClick` attribute",
    * "***",
    * "Sends a high signal when user places the finger on the handle and low signal when finger is released."
    * ]
    * @name sendeventonhandleclick
    * @default
    * @join {"direction": "event", "isContractName": true, "booleanJoin": 1}
    * @attributeType "Join"
    */
   sendEventOnHandleClick: string;

}
