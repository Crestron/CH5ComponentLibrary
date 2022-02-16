import { ICh5Common, ICh5CommonAttributes } from "../../ch5-common/interfaces";


/**
 * @name Ch5 JointextBoolean
 * @isattribute false
 * @tagName ch5-jointext-boolean
 * @role presentation
 * @description Ch5 Jointext
 * @componentVersion 1.0.0
 * @documentation
 * [
 * "`ch5-jointext-boolean` element",
 * "***",
 * ""
 * ]
 * @snippets
 * [
 *    {
 *      "prefix": "ch5-jointext-boolean:blank",
 *      "description": "Crestron Jointext Boolean (Blank)",
 *      "body": [
 *        "<ch5-jointext-boolean>",
 *         "</ch5-jointext-boolean>$0"
 *        ]
 *    },
 *    {
 *      "prefix": "ch5-jointext-boolean:default",
 *      "description": "Crestron Jointext Boolean (Default)",
 *      "body": [
 *        "<ch5-jointext-boolean value=\"${1:true}\"",
 *        "\ttextWhenTrue=\"${2:The value is true}\"",
 *        "\ttextWhenFalse=\"${3:The value is false}\">",
 *         "</ch5-jointext-boolean>$0"
 *        ]
 *    },
 *    {
 *      "prefix": "ch5-jointext-boolean:receive-signal",
 *      "description": "Crestron Jointext Boolean (Receive Signal)",
 *      "body": [
 *        "<ch5-jointext-boolean receiveStateValue=\"${1:19}\"",
 *        "\ttextWhenTrue=\"${2:The value is true}\"",
 *        "\ttextWhenFalse=\"${3:The value is false}\">",
 *         "</ch5-jointext-boolean>$0"
 *        ] 
 *    }
 * ]
 * 
 */
export interface ICh5JoinToTextBooleanDocumentation extends ICh5Common, ICh5CommonAttributes {

}