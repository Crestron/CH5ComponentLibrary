import { ICh5Common, ICh5CommonAttributes } from "../../ch5-common/interfaces";
import { ICh5JoinToTextBooleanAttributes } from "./i-ch5-jointotext-boolean-attributes";


/**
 * @name Ch5 JoinToTextBoolean
 * @isattribute false
 * @tagName ch5-jointotext-boolean
 * @role presentation
 * @description Ch5 JoinToText
 * @componentVersion 1.0.0
 * @documentation
 * [
 * "`ch5-jointotext-boolean` element",
 * "***",
 * ""
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