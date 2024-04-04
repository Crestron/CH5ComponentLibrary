import { ICh5CommonAttributesQrCode } from "../../ch5-common/interfaces/i-ch5-common-attributes-qrcode";


/**
 * @ignore
 */
export interface ICh5QrCodeAttributes extends ICh5CommonAttributesQrCode {
  /**
   * @documentation
   * [
   * "`qrCode` attribute",
   * "***",
   * "QR Code image"
   * ]
   * @name qrcode
   * @default 
   * @attributeType "String"
   */
  qrCode: string;
  /**
   * @documentation
   * [
   * "`receiveStateQrCode` attribute",
   * "***",
   * "Serial join to programmatically change the QR Code image."
   * ]
   * @name receivestateqrcode
   * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
   * @attributeType "Join"
   */
  receiveStateQrCode: string;

}