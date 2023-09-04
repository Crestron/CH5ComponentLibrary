import { ICh5Common } from "../../ch5-common/interfaces";
import { ICh5JoinToTextStringAttributes } from "./i-ch5-jointotext-string-attributes";

/**
 * @name Ch5 JoinToTextString
 * @isattribute false
 * @tagName ch5-jointotext-string
 * @role presentation
 * @description The component provides a response of a serial join.
 * @componentVersion 2.0.0
 * @documentation
 * [
 * "`ch5-jointotext-string` element",
 * "***",
 * "When the response string join value is not empty, the tag component will provide the value of the string join. When the provided string join value is empty, then the component will provide the value of the textWhenEmpty attribute."
 * ]
 * @snippets
 * [
 *    {
 *      "prefix": "ch5-jointotext-string:blank",
 *      "description": "Crestron JoinToText String (Blank)",
 *      "body": [
 *        "<ch5-jointotext-string>",
 *         "</ch5-jointotext-string>$0"
 *        ]
 *    },
 *    {
 *      "prefix": "ch5-jointotext-string:default",
 *      "description": "Crestron JoinToText String (Default)",
 *      "body": [
 *        "<ch5-jointotext-string value=\"${1:true}\"",
 *        "\ttextWhenEmpty=\"${2:The value is empty}\">",
 *         "</ch5-jointotext-string>$0"
 *        ]
 *    },
 *    {
 *      "prefix": "ch5-jointotext-string:receive-signal",
 *      "description": "Crestron JoinToText String (Receive Signal)",
 *      "body": [
 *        "<ch5-jointotext-string receiveStateValue=\"${1:19}\"",
 *        "\ttextWhenEmpty=\"${2:The value is empty}\">",
 *         "</ch5-jointotext-string>$0"
 *        ] 
 *    }
 * ]
 * 
 */
export interface ICh5JoinToTextStringDocumentation extends ICh5Common, ICh5JoinToTextStringAttributes {

}