import { ICh5Common } from "../../ch5-common/interfaces";

/**
 * @name Ch5 JointextString
 * @isattribute false
 * @tagName ch5-jointext-string
 * @role presentation
 * @description Ch5 Jointext
 * @componentVersion 1.0.0
 * @documentation
 * [
 * "`ch5-jointext-string` element",
 * "***",
 * ""
 * ]
 * @snippets
 * [
 *    {
 *      "prefix": "ch5-jointext-string:blank",
 *      "description": "Crestron Jointext String (Blank)",
 *      "body": [
 *        "<ch5-jointext-string>",
 *         "</ch5-jointext-string>$0"
 *        ]
 *    },
 *    {
 *      "prefix": "ch5-jointext-string:default",
 *      "description": "Crestron Jointext String (Default)",
 *      "body": [
 *        "<ch5-jointext-string value=\"${1:true}\"",
 *        "\ttextWhenEmpty=\"${2:The value is empty}\">",
 *         "</ch5-jointext-string>$0"
 *        ]
 *    },
 *    {
 *      "prefix": "ch5-jointext-string:receive-signal",
 *      "description": "Crestron Jointext String (Receive Signal)",
 *      "body": [
 *        "<ch5-jointext-string receiveStateValue=\"${1:19}\"",
 *        "\ttextWhenEmpty=\"${2:The value is empty}\">",
 *         "</ch5-jointext-string>$0"
 *        ] 
 *    }
 * ]
 * 
 */
export interface ICh5JoinToTextStringDocumentation extends ICh5Common {

}