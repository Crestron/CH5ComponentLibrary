import { ICh5Common } from "../../_interfaces";
import { ICh5JoinToTextNumericAttributes } from "./i-ch5-jointotext-numeric-attributes";

/**
 * @name Ch5 JoinToTextNumeric
 * @isattribute false
 * @tagName ch5-jointotext-numeric
 * @role presentation
 * @description Ch5 JoinToText Numeric
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
 *      "description": "Crestron JoinToText Numeric (Blank)",
 *      "body": [
 *        "<ch5-jointotext-numeric>",
 *         "</ch5-jointotext-numeric>$0"
 *        ]
 *    },
 *    {
 *      "prefix": "ch5-jointotext-numeric:default",
 *      "description": "Crestron JoinToText Numeric (Default)",
 *      "body": [
 *        "<ch5-jointotext-numeric value=\"${1:true}\"",
 *        "\ttype=\"${2:percentage}\">",
 *         "</ch5-jointotext-numeric>$0"
 *        ]
 *    },
 *    {
 *      "prefix": "ch5-jointotext-numeric:receive-signal",
 *      "description": "Crestron JoinToText Numeric (Receive Signal)",
 *      "body": [
 *        "<ch5-jointotext-numeric receiveStateValue=\"${1:19}\"",
 *        "\ttype=\"${2:percentage}\">",
 *         "</ch5-jointotext-numeric>$0"
 *        ] 
 *    }
 * ]
 * 
 */
export interface ICh5JoinToTextNumericDocumentation extends ICh5Common, ICh5JoinToTextNumericAttributes {

}