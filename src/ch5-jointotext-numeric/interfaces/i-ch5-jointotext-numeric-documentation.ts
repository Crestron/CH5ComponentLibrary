import { ICh5Common } from "../../_interfaces";


/**
 * @name Ch5 JointextNumeric
 * @isattribute false
 * @tagName ch5-jointext-numeric
 * @role presentation
 * @description Ch5 Jointext
 * @componentVersion 1.0.0
 * @documentation
 * [
 * "`ch5-jointext-numeric` element",
 * "***",
 * ""
 * ]
 * @snippets
 * [
 *    {
 *      "prefix": "ch5-jointext-numeric:blank",
 *      "description": "Crestron Jointext Boolean (Blank)",
 *      "body": [
 *        "<ch5-jointext-numeric>",
 *         "</ch5-jointext-numeric>$0"
 *        ]
 *    },
 *    {
 *      "prefix": "ch5-jointext-numeric:default",
 *      "description": "Crestron Jointext Boolean (Default)",
 *      "body": [
 *        "<ch5-jointext-numeric value=\"${1:true}\"",
 *        "\ttype=\"${2:decimal}\">",
 *         "</ch5-jointext-numeric>$0"
 *        ]
 *    },
 *    {
 *      "prefix": "ch5-jointext-numeric:receive-signal",
 *      "description": "Crestron Jointext Boolean (Receive Signal)",
 *      "body": [
 *        "<ch5-jointext-numeric receiveStateValue=\"${1:19}\"",
 *        "\ttype=\"${2:decimal}\">",
 *         "</ch5-jointext-numeric>$0"
 *        ] 
 *    }
 * ]
 * 
 */
export interface ICh5JoinToTextNumericDocumentation extends ICh5Common {

}