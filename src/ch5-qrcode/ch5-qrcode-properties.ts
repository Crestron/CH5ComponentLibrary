// import { ICh5QrCodeAttributes } from './interfaces/i-ch5-qrcode-attributes';
// import { ICh5PropertySettings } from "../ch5-core/ch5-property";
// import { Ch5Base } from "../ch5-base/ch5-base";

// export class Ch5QrCodeProperties extends Ch5Base implements ICh5QrCodeAttributes {

// 	//#region Variables

// 	public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
// 		{
// 			default: "",
// 			name: "qrCode",
// 			nameForSignal: "receiveStateQrCode",
// 			removeAttributeOnNull: true,
// 			type: "string",
// 			valueOnAttributeEmpty: "",
// 			isObservableProperty: true
// 		},
// 		{
// 			default: "",
// 			isSignal: true,
// 			name: "receiveStateQrCode",
// 			signalType: "string",
// 			removeAttributeOnNull: true,
// 			type: "string",
// 			valueOnAttributeEmpty: "",
// 			isObservableProperty: true
// 		},
// 		Ch5Base.COMMON_PROPERTIES.debug,
// 		Ch5Base.COMMON_PROPERTIES.id,
// 		Ch5Base.COMMON_PROPERTIES.noshowType,
// 		Ch5Base.COMMON_PROPERTIES.receiveStateShow,
// 		Ch5Base.COMMON_PROPERTIES.show,
// 		Ch5Base.COMMON_PROPERTIES.trace
// 	];

// 	//#endregion

// 	//#region Getters and Setters

// 	public set qrCode(value: string) {
// 		this._ch5Properties.set<string>("qrCode", value, () => {
// 			this.handleQrCode(value);
// 		});
// 	}
// 	public get qrCode(): string {
// 		return this._ch5Properties.get<string>("qrCode");
// 	}

// 	public set receiveStateQrCode(value: string) {
// 		this._ch5Properties.set("receiveStateQrCode", value, null, (newValue: string) => {
// 			this._ch5Properties.setForSignalResponse<number>("qrCode", newValue, () => {
// 				this.handleReceiveStateQrCode();
// 			});
// 		});
// 	}
// 	public get receiveStateQrCode(): string {
// 		return this._ch5Properties.get<string>('receiveStateQrCode');
// 	}

// 	//#endregion

// }
