import { TCh5SliderHandleShape, TCh5SliderOrientation, TCh5SliderSize, TCh5SliderHandleSize, TCh5SliderStretch, TCh5SliderToolTipShowType, TCh5SliderToolTipDisplayType, } from './t-ch5-slider';
import { TCh5CommonInputFeedbackModes } from "../../ch5-common-input/interfaces/t-ch5-common-input";
import { ICh5CommonAttributes } from "../../ch5-common/interfaces";

/**
 * @name Ch5 Slider
 * @isattribute false
 * @tagName ch5-slider
 * @role slider
 * @description Ch5 Slider inherits the default input range behavior but provides a lot of extra features.
 * @componentVersion 1.0.0
 * @documentation
 * [
 * "`ch5-slider` element",
 * "***",
 * "A component to provide input by dragging a handle. One or two numeric values can be ",
 * "visualized with this component. If two values are used, two handles are provided."
 * ]
 * @snippets
 * [
 *    {
 *       "prefix": "ch5-slider:blank",
 *       "description": "Crestron slider (Blank)",
 *       "body": [
 *           "<ch5-slider>",
 *           "</ch5-slider>$0"
 *       ]
 *    },
 *    {
 *       "prefix": "ch5-slider:default",
 *       "description": "Crestron slider (Default)",
 *       "body": [
 *           "<ch5-slider value=\"${1:20}\"",
 *           "\tmin=\"${2:0}\"",
 *           "\tmax=\"${3:100}\"",
 *           "\tstep=\"${4:20}\"",
 *           "\tsendeventonchange=\"${5:slider_value_on_change}\"",
 *           "\treceivestatevalue=\"${6:receive_slider_value}\">",
 *           "</ch5-slider>$0"
 *       ]
 *   },
 *   {
 *    "prefix": "ch5-slider:range",
 *        "description": "Crestron slider range(If true, we provide two handles to define two values.)",
 *        "body": [
 *            "<ch5-slider value=\"${1:20}\"",
 *            "\tvaluehigh=\"${2:80}\"",
 *            "\tmin=\"${3:0}\"",
 *            "\tmax=\"${4:100}\"",
 *            "\tstep=\"${5:20}\"",
 *            "\trange=\"${6:true}\"",
 *            "\tsendeventonchange=\"${7:slider_value_on_change}\"",
 *            "\treceivestatevalue=\"${8:receive_slider_value}\"",
 *            "\tsendeventonchangehigh=\"${9:slider_value_high_on_change}\"",
 *            "\treceivestatevaluehigh=\"${10:receive_slider_value_high}\">",
 *            "</ch5-slider>$0"
 *        ]
 *    },
 *    {
 *    "prefix": "ch5-slider:ticks",
 *        "description": "Crestron slider ticks(Defines the ticks on the slider, value should be a valid JSON.)",
 *        "body": [
 *            "<ch5-slider value=\"${1:40}\"",
 *            "\tshowtickvalues=\"${2:true}\"",
 *            "\tticks='${3:{\"0\":\"-60\", \"25\":\"-40\", \"50\":\"-20\", \"75\":\"-10\", \"100\": \"0\" }}'",
 *            "\tsendeventonchange=\"${4:slider_value_on_change}\"",
 *            "\treceivestatevalue=\"${5:receive_slider_value}\">",
 *            "</ch5-slider>$0"
 *        ]
 *    }
 * ]
 */

export interface ICh5SliderAttributes extends ICh5CommonAttributes {

   /**
    * @documentation
    * [
    * "`handleShape` attribute",
    * "***",
    * "The default value is 'rounded-rectangle'. Valid Values: 'rectangle', 'circle', 'oval', 'rounded-rectangle' ",
    * "Defines the handle shape."
    * ]
    * @name handleshape
    * @default rectangle
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
    * "The higher value is only applicable if range=true."
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
    * "The maximum value determines the analog value sent to and received from the control system that will reflect the topmost point of the slider. Default value is 65535"
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
    * "The minimum value determines the analog value sent to and received from the control system that will reflect the lowest position of the slider. Default value is 0"
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
    * "The default value is 'horizontal'. Valid values: 'horizontal', 'vertical'."
    * ]
    * @name orientation
    * @default horizontal
    */
   orientation: TCh5SliderOrientation;

   /**
    * @documentation
    * [
    * "`size` attribute",
    * "***",
    * "The default value is 'regular'. Valid values: 'x-small', 'small', 'regular', 'large', 'xlarge'. ",
    * "The size of the slider."
    * ]
    * @name size
    * @default regular
    */
   size: TCh5SliderSize;

   /**
    * @documentation
    * [
    * "`handleSize` attribute",
    * "***",
    * "The default value is 'regular'. The size of the handle.",
    * "Valid values: 'x-small', 'small', 'regular', 'large', 'x-large'."
    * ]
    * @name handlesize
    * @default regular
    */
   handleSize: TCh5SliderHandleSize;

   /**
    * @documentation
    * [
    * "`step` attribute",
    * "***",
    * "The default value is 1. Defines the size or amount of each interval or step the slider takes between the min and max values.
    If the value range between max and min (i.e. max - min) is not evenly divisible by step value, the max will be adjusted accordingly.
    Since all values on the slider are part of a range, step is strictly related to min and max attributes.
    If you want quarters (0, 25, 50, 75, 100), then 25 is the value for step attribute, 0 is value for min, and 100 is value for max."
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
    * "The default value is 'both'. Valid Values: 'width', 'height', 'both'. ",
    * "When the stretch property is set, the slider inherits the width and/or ",
    * "height of the container."
    * ]
    * @name stretch
    * @default both
    */
   stretch: TCh5SliderStretch;

   /**
    * @documentation
    * [
    * "`ticks` attribute",
    * "***",
    * "Defines the ticks on the slider. ",
    * "This definition is based on advanced tick scales: non-linear or logarithmic. ",
    * "Sliders can be created with ever-increasing increments b ",
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
    * "`toolTipShowType` attribute",
    * "***",
    * "The default value is "off". Displays an optional tooltip above (horizontal) or to the right (vertical) of the handle. 
    Valid values: ",
    * "-'off': Not displayed ",
    * "-'on': Always displayed ",
    * "-'auto': Displayed while user interacts with the slider"
    * ]
    * @name tooltipshowtype
    * @default off
    */
   toolTipShowType: TCh5SliderToolTipShowType;

   /**
    * @documentation
    * [
    * "`toolTipDisplayType` attribute",
    * "***",
    * "The default value is 'percent'. Sets what is displayed in the tooltip. Valid values: ",
    * "'%' - The value is displayed as a percent ",
    * "'value' - The actual value provided"
    * ]
    * @name tooltipdisplaytype
    * @default %
    *  {"tooltipdisplaytype": [null, "off"]},
    *  {"nohandle": ["true", ""] }
    * ]
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
    * "The default value is direct. ",
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
    * "The default value is false. If true, the slider will have two handles so two different values can be defined."
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
    * "The default value is false. Used to display optional value labels next to tick marks at each tick increment."
    * ]
    * @name showtickvalues
    * @default false
    */
   showTickValues: boolean;

   /**
    * @documentation
    * [
    * "`noHandle` attribute",
    * "***",
    * "The default value is false. Hides the slider handle."
    * ]
    * @name nohandle
    * @default false
    */
   noHandle: boolean

   /**
    * @documentation
    * [
    * "`tapSettable` attribute",
    * "***",
    * "The default value is false. If true, sets the handle closest to the area where slider gets tapped."
    * ]
    * @name tapsettable
    * @default false
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
    */
   receiveStateValue: string;

   /**
    * @documentation
    * [
    * "`receiveStateValueHigh` attribute",
    * "***",
    * "when receive change the value of the high Handle of the slider, if range slider is set to true,"
    * ]
    * @name receivestatevaluehigh
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
    */
   sendEventOnChangeHigh: string;

   /**
    * @documentation
    * [
    * "`onOffOnly` attribute",
    * "***",
    * "Enables or disables whether the control is on/off only. This will cause the Fader Slider to not be shown, leaving only the two On and Off buttons."
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
    * "You may optionally select a digital join that will hide the slider leaving only the two buttons showing. "
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
    * "You may optionally select a digital join to send a value to the control system if the user presses the top half(vertical) or right half(horizontal) of the slider. The control system can then use the analog feedback join to increment the gauge. "
    * ]
    * @name sendeventonupper
    * @join {"direction": "state", "isContractName": true, "booleanJoin": 1}
    * @attributeType "Join"
    */
   sendEventOnUpper: string;
   /**
    * @documentation
    * [
    * "`receiveStateUpper` attribute",
    * "***",
    * "Analog join to receive feedback from sendEventOnUpper"
    * ]
    * @name receivestateupper
    * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
    * @attributeType "Join"
    */
   receiveStateUpper: string;
   /**
    * @documentation
    * [
    * "`sendEventOnLower` attribute",
    * "***",
    * "You may optionally select a digital join to send a value to the control system if the user presses the bottom half(vertical) or left half(horizontal) of the slider. The control system can then use the analog feedback join to decrement the gauge. "
    * ]
    * @name sendeventonlower
    * @join {"direction": "state", "isContractName": true, "booleanJoin": 1}
    * @attributeType "Join"
    */
   sendEventOnLower: string;
   /**
    * @documentation
    * [
    * "`receiveStateLower` attribute",
    * "***",
    * "Analog join to receive feedback from sendEventOnLower"
    * ]
    * @name receivestatelower
    * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
    * @attributeType "Join"
    */
   receiveStateLower: string;

}
