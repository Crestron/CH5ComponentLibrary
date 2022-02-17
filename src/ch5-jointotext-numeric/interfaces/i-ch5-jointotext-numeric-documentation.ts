import { ICh5Common } from "../../_interfaces";


/**
 * @name Ch5 JoinToTextNumeric
 * @isattribute false
 * @tagName ch5-jointotext-numeric
 * @role presentation
 * @description Ch5 JoinToText
 * @componentVersion 1.0.0
 * @documentation
 * [
 * "`ch5-jointotext-numeric` element",
 * "***",
 * ""
 * ]
 * @snippets
 * [
 *    {
 *      "prefix": "ch5-jointotext-numeric:blank",
 *      "description": "Crestron JoinToText Boolean (Blank)",
 *      "body": [
 *        "<ch5-jointotext-numeric>",
 *         "</ch5-jointotext-numeric>$0"
 *        ]
 *    },
 *    {
 *      "prefix": "ch5-jointotext-numeric:default",
 *      "description": "Crestron JoinToText Boolean (Default)",
 *      "body": [
 *        "<ch5-jointotext-numeric value=\"${1:true}\"",
 *        "\ttype=\"${2:decimal}\">",
 *         "</ch5-jointotext-numeric>$0"
 *        ]
 *    },
 *    {
 *      "prefix": "ch5-jointotext-numeric:receive-signal",
 *      "description": "Crestron JoinToText Boolean (Receive Signal)",
 *      "body": [
 *        "<ch5-jointotext-numeric receiveStateValue=\"${1:19}\"",
 *        "\ttype=\"${2:decimal}\">",
 *         "</ch5-jointotext-numeric>$0"
 *        ] 
 *    }
 * ]
 * 
 */
export interface ICh5JoinToTextNumericDocumentation extends ICh5Common {

}