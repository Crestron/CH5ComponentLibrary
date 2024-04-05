import { ICh5CommonQrCode } from "../../ch5-common/interfaces/i-ch5-common-documentation-qrcode";
import { ICh5QrCodeAttributes } from "./i-ch5-qrcode-attributes";

/**
 * @name Ch5 QrCode
 * @isattribute false
 * @tagName ch5-qrcode
 * @role QR code
 * @description The QR Code Generator Widget is a programmable control used to display QR Code image desired by the designer.
 * @componentVersion 2.10.0
 * @childElements
 * [
 *    
 * ]
 * @documentation
 * [
 *   "`ch5-qrcode` element",
 *   "***",
 *   "The QR Code Generator Widget is a programmable control used to display QR Code image desired by the designer."
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
 *       "\tqrCode=\"${2:}\"",
 *       "\treceiveStateQrCode=\"${3:}\">",
 *       "</ch5-qrcode>$0"
 *       ]
 *    },
 *    {
 *     "prefix": "ch5-qrcode:default",
 *     "description": "Crestron qrcode (default)",
 *     "body": [
 *       "<ch5-qrcode id=\"ch5-qrcode_${1:id}\"",
 *       "\tqrCode=\"${2:}\">",
 *       "</ch5-qrcode>$0"
 *       ]
 *    }
 *  ]
 */
export interface ICh5QrCodeDocumentation extends ICh5CommonQrCode, ICh5QrCodeAttributes {

}