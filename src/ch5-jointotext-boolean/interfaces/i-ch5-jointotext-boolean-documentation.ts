import { ICh5Common } from "../../ch5-common/interfaces";
import { ICh5JoinToTextBooleanAttributes } from "./i-ch5-jointotext-boolean-attributes";


/**
 * @name Ch5 JoinToTextBoolean
 * @isattribute false
 * @tagName ch5-jointotext-boolean
 * @role presentation
 * @description The component provides a response of a digital join. This component can be used to show different values for true and false digital signal responses.
 * @componentVersion 2.0.0
 * @documentation
 * [
 * "`ch5-jointotext-boolean` element",
 * "***",
 * "This component provides attributes like - ",
 * "value (this attribute is not expected to be used outside of diagnostic purposes. This attribute should not be used or honored when receiveStateValue attribute is provided),  ",
 * "receiveStateValue (expected value is boolean/digital join number or contract state signal name. When not provided, the tag will evaluate to empty string), ",
 * "textWhenTrue (expected value is the text to be displayed when the boolean join evaluates to true. If not provided and the boolean join evaluates to true, the component 'textContent' will evaluate to empty string), ",
 * "textWhenFalse (expected value is the text to be displayed when the boolean value evaluates to false. If not provided and the boolean join evaluates to false, the component 'textContent' will evaluate to empty string)."
 * ]
 * @snippets
 * [
 *    {
 *      "prefix": "ch5-jointotext-boolean:blank",
 *      "description": "Crestron JoinToText Boolean (Blank)",
 *      "body": [
 *        "<ch5-jointotext-boolean>",
 *         "</ch5-jointotext-boolean>$0"
 *        ]
 *    },
 *    {
 *      "prefix": "ch5-jointotext-boolean:default",
 *      "description": "Crestron JoinToText Boolean (Default)",
 *      "body": [
 *        "<ch5-jointotext-boolean value=\"${1:true}\"",
 *        "\ttextWhenTrue=\"${2:The value is true}\"",
 *        "\ttextWhenFalse=\"${3:The value is false}\">",
 *         "</ch5-jointotext-boolean>$0"
 *        ]
 *    },
 *    {
 *      "prefix": "ch5-jointotext-boolean:receive-signal",
 *      "description": "Crestron JoinToText Boolean (Receive Signal)",
 *      "body": [
 *        "<ch5-jointotext-boolean receiveStateValue=\"${1:19}\"",
 *        "\ttextWhenTrue=\"${2:The value is true}\"",
 *        "\ttextWhenFalse=\"${3:The value is false}\">",
 *         "</ch5-jointotext-boolean>$0"
 *        ] 
 *    }
 * ]
 * 
 */
export interface ICh5JoinToTextBooleanDocumentation extends ICh5Common, ICh5JoinToTextBooleanAttributes {

}