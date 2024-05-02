import { ICh5CommonForClass } from "../../ch5-common/interfaces/common/i-ch5-common-class";
import { ICh5CommonForDebug } from "../../ch5-common/interfaces/common/i-ch5-common-debug";
import { ICh5CommonForRole } from "../../ch5-common/interfaces/common/i-ch5-common-role";
import { ICh5CommonForStyle } from "../../ch5-common/interfaces/common/i-ch5-common-style";
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
 *   "The QR Code component is designed to provide options to add backgroundColor, color, qrCode, size and receiveStateQrCode."
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-qrcode:blank",
 *     "description": "Crestron QR Code",
 *     "body": [
 *       "<ch5-qrcode>",
 *       "</ch5-qrcode>$0"
 *     ]
 *   },
 *   {
 *     "prefix": "ch5-qrcode:all-attributes",
 *     "description": "Crestron QR Code (All Attributes)",
 *     "body": [
 *       "<ch5-qrcode id=\"ch5-qrcode_${1:id}\"",
 *       "\tqrCode=\"${2:}\"",
 *       "\tcolor=\"${3:#000000}\"",
 *       "\tbackgroundColor=\"${4:#ffffff}\"",
 *       "\tsize=\"${5:200}\"",
 *       "\treceiveStateQrCode=\"${6:}\">",
 *       "</ch5-qrcode>$0"
 *       ]
 *    },
 *    {
 *     "prefix": "ch5-qrcode:default",
 *     "description": "Crestron QR Code (default)",
 *     "body": [
 *       "<ch5-qrcode id=\"ch5-qrcode_${1:id}\"",
 *       "\tqrCode=\"${2:}\"",
 *       "\tcolor=\"${3:#000000}\"",
 *       "\tbackgroundColor=\"${4:#ffffff}\"",
 *       "\tsize=\"${5:200}\">",
 *       "</ch5-qrcode>$0"
 *       ]
 *    }
 *  ]
 */
export interface ICh5QrCodeDocumentation extends ICh5CommonForDebug, ICh5CommonForRole, ICh5CommonForStyle, ICh5CommonForClass, ICh5QrCodeAttributes {

}