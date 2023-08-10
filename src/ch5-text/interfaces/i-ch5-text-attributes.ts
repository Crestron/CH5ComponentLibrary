import { ICh5AttributesCh5Text  } from "../../ch5-common/interfaces/i-ch5-common-ch5-text";


import { TCh5TextHorizontalAlignment,  }from './t-ch5-text';

/**
 * @ignore
 */
export interface ICh5TextAttributes extends ICh5AttributesCh5Text  {
  /**
        * @documentation
        * [
        * "`horizontalAlignment` attribute",
        * "***",
        * "Sets the horizontal alignment of the text."
        * ]
        * @name horizontalalignment
        * @default center
        * @attributeType "EnumeratedValue"
        */
        horizontalAlignment: TCh5TextHorizontalAlignment ;
        /**
        * @documentation
        * [
        * "`multilineSupport` attribute",
        * "***",
        * "Enables or disables support for multi-line input text. Text will be truncated when the text area does not allow for second line. This shall not resize the text area to fit the text. The designer is responsible for defining the appropriate text area required."
        * ]
        * @name multilinesupport
        * @default false
        * @attributeType "Boolean"
        */
       multilineSupport: boolean;
       /**
        * @documentation
        * [
        * "`truncateText` attribute",
        * "***",
        * "Enables or disables text truncation depending on the length of text input and the size of the control. Will show ellipsis when the text extends beyond the vertical allocated space."
        * ]
        * @name truncatetext
        * @default false
        * @attributeType "Boolean"
        */
       truncateText: boolean;
       /**
        * @documentation
        * [
        * "`label` attribute",
        * "***",
        * "Label"
        * ]
        * @name label
        * @default 
        * @attributeType "String"
        */
       label: string;
       /**
        * @documentation
        * [
        * "`receiveStateLabel` attribute",
        * "***",
        * "Select a serial join to receive feedback from the control system. The value of this join gets assigned to the label as text. NOTE: Due to a clearing of all joins at design time, if a join is set, the design time label will not display any text. To remedy this issue see CIPS documentation."
        * ]
        * @name receivestatelabel
        * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
        * @attributeType "Join"
        */
       receiveStateLabel: string;
       /**
        * @documentation
        * [
        * "`labelInnerHtml` attribute",
        * "***",
        * "Used to set the label displayed for the text. Takes the preference over the label attribute."
        * ]
        * @name labelinnerhtml
        * @default 
        * @attributeType "String"
        */
       labelInnerHtml: string;
       /**
        * @documentation
        * [
        * "`textStyle` attribute",
        * "***",
        * "The text formatting information that will be applied to the text of this object."
        * ]
        * @name textstyle
        * @default 
        * @attributeType "String"
        */
       textStyle: string;
       
}