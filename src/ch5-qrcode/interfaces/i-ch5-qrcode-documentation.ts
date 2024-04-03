import { ICh5CommonQrcode } from "../../ch5-common/interfaces/i-ch5-common-documentation-qrcode";
import { ICh5QrcodeAttributes } from "./i-ch5-qrcode-attributes";

/**
 * @name Ch5 Qrcode
 * @isattribute false
 * @tagName ch5-qrcode
 * @role QR code
 * @description The QR Code Generator Widget is a programmable control used to store alphanumeric data in a QR Image desired by the designer..
 * @componentVersion 2.10.0
 * @childElements
 * [
 *    
 * ]
 * @documentation
 * [
 *   "`ch5-qrcode` element",
 *   "***",
 *   "The QR Code Generator Widget is a programmable control used to store alphanumeric data in a QR Image desired by the designer."
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-qrcode:blank",
 *     "description": "Crestron qrcode",
 *     "body": [
 *       "<ch5-qrcode>",
 *       "</ch5-qrcode>$0"
 *     ]
 *   },
 *   {
 *     "prefix": "ch5-qrcode:all-attributes",
 *     "description": "Crestron qrcode (All Attributes)",
 *     "body": [
 *       "<ch5-qrcode id=\"ch5-qrcode_${1:id}\"",
 *       "\tqrcode=\"${2:}\"",
 *       "\treceiveStateQrCode=\"${3:}\">",
 *       "</ch5-qrcode>$0"
 *       ]
 *    },
 *    {
 *     "prefix": "ch5-qrcode:default",
 *     "description": "Crestron qrcode (default)",
 *     "body": [
 *       "<ch5-qrcode id=\"ch5-qrcode_${1:id}\"",
 *       "\tqrcode=\"${2:}\"",
            
 *       "</ch5-qrcode>$0"
 *       ]
 *    }
 *  ]
 */
export interface ICh5QrcodeDocumentation extends ICh5CommonQrcode, ICh5QrcodeAttributes {

}