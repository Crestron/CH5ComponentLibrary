import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import QRCode from "qrcode";
import { Ch5ComponentLibrary } from "../ch5-core/ch5-component";
import Ch5ColorUtils from '../ch5-common/utils/ch5-color-utils';
import { Ch5BaseClass } from "../ch5-base/ch5-base-class";
import { ICh5QrCodeAttributes } from "./interfaces/i-ch5-qrcode-attributes";

export class Ch5QrCode extends Ch5BaseClass implements ICh5QrCodeAttributes {

	//#region Variables

	protected COMPONENT_NAME = "Ch5QrCode";

	public static COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
		Ch5BaseClass.COMMON_PROPERTIES.debug,
		Ch5BaseClass.COMMON_PROPERTIES.trace,
		Ch5BaseClass.COMMON_PROPERTIES.id,
		Ch5BaseClass.COMMON_PROPERTIES.noshowType,
		Ch5BaseClass.COMMON_PROPERTIES.receiveStateShow,
		Ch5BaseClass.COMMON_PROPERTIES.show,
		{
			default: "#000000",
			name: "color",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "#000000",
			isObservableProperty: true
		},
		{
			default: "#ffffff",
			name: "backgroundColor",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "#ffffff",
			isObservableProperty: true
		},
		{
			default: 200,
			name: "size",
			removeAttributeOnNull: true,
			type: "number",
			valueOnAttributeEmpty: 200,
			numberProperties: {
				min: 160,
				max: 10000,
				conditionalMin: 160,
				conditionalMax: 10000,
				conditionalMinValue: 160,
				conditionalMaxValue: 10000
			},
			isObservableProperty: true
		},
		{
			default: "",
			name: "qrCode",
			nameForSignal: "receiveStateQrCode",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: "",
			isSignal: true,
			name: "receiveStateQrCode",
			signalType: "string",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		}
	];

	public static readonly ELEMENT_NAME = 'ch5-qrcode';

	public primaryCssClass = 'ch5-qrcode';

	private _elContainer: HTMLElement = {} as HTMLElement;
	private _canvasContainer: HTMLElement = {} as HTMLElement;

	//#endregion

	//#region Getters and Setters

	public set color(value: string) {
		this._ch5Properties.set<string>("color", value, () => {
			this.debounceBuildQrCode();
		});
	}
	public get color(): string {
		return this._ch5Properties.get<string>("color");
	}

	public set backgroundColor(value: string) {
		this._ch5Properties.set<string>("backgroundColor", value, () => {
			this.debounceBuildQrCode();
		});
	}
	public get backgroundColor(): string {
		return this._ch5Properties.get<string>("backgroundColor");
	}

	public set size(value: number) {
		this._ch5Properties.set<number>("size", value, () => {
			this.debounceBuildQrCode();
		});
	}
	public get size(): number {
		return this._ch5Properties.get<number>("size");
	}

	public set qrCode(value: string) {
		this._ch5Properties.set<string>("qrCode", value, () => {
			this.debounceBuildQrCode();
		});
	}
	public get qrCode(): string {
		return this._ch5Properties.get<string>("qrCode");
	}

	public set receiveStateQrCode(value: string) {
		this._ch5Properties.set("receiveStateQrCode", value, null, (newValue: string) => {
			this._ch5Properties.setForSignalResponse<number>("qrCode", newValue, () => {
				this.debounceBuildQrCode();
			});
		});
	}
	public get receiveStateQrCode(): string {
		return this._ch5Properties.get<string>('receiveStateQrCode');
	}

	//#endregion

	//#region Component Lifecycle

	public constructor() {
		super(Ch5QrCode.COMPONENT_PROPERTIES);
		if (!this._isInstantiated) {
			this.createInternalHtml();
		}
		this._isInstantiated = true;
	}

	/**
	 * Called when the Ch5QrCode component is first connected to the DOM
	 */
	public connectedCallback() {
		super.connectedCallback();
		this.logger.start('connectedCallback()');
		if (!this.hasAttribute('role')) {
			this.setAttribute('role', Ch5ComponentLibrary.ROLES.Ch5QrCode);
		}
		if (this._elContainer.parentElement !== this) {
			this._elContainer.classList.add('ch5-qrcode');
			this.appendChild(this._elContainer);
		}
		this.initAttributes();
		this.initCommonMutationObserver(this);

		customElements.whenDefined(Ch5QrCode.ELEMENT_NAME).then(() => {
			this.componentLoadedEvent(Ch5QrCode.ELEMENT_NAME, this.id);
			this.debounceBuildQrCode();
		});
		this.logger.stop();
	}

	public disconnectedCallback() {
		this.logger.start('disconnectedCallback()');
		this.unsubscribeFromSignals();
		this.logger.stop();
	}

	//#endregion

	//#region Protected / Private Methods

	protected createInternalHtml() {
		this.logger.start('createInternalHtml()');
		this.clearComponentContent();
		this._elContainer = document.createElement('div');
		this._canvasContainer = document.createElement('canvas');
		this._elContainer.appendChild(this._canvasContainer);
		this._elContainer.classList.add(this.primaryCssClass);
		this.appendChild(this._elContainer);
		this.logger.stop();
	}

	public debounceBuildQrCode = this.util.debounce(() => {
		this.handleQrCode();
	}, 50);

	/**
	 * Clear the content of component in order to avoid duplication of elements
	 */
	private clearComponentContent() {
		const containers = this.getElementsByTagName("div");
		Array.from(containers).forEach((container) => {
			container.remove();
		});
	}

	private handleQrCode() {
		const data: string = this.qrCode;
		const canvasForQRCode = this.querySelector<HTMLCanvasElement>('canvas');
		if (canvasForQRCode) {
			canvasForQRCode.setAttribute("width", String(this.size));
			canvasForQRCode.setAttribute("height", String(this.size));
		}

		if (data && data !== "") {
			const foregroundColor = Ch5ColorUtils.col2hex(this.color);
			const backgroundColor = Ch5ColorUtils.col2hex(this.backgroundColor);
			const opts: any = {
				errorCorrectionLevel: 'H',
				type: 'image/svg',
				width: this.size,
				margin: 3,
				color: {
					light: backgroundColor,
					dark: foregroundColor
				}
			};

			// The below is the best way to set QR Code. The above code is implemented for sake of x60
			QRCode.toCanvas(this._canvasContainer, data, opts, function (error) {
				if (error) { console.error(error); }
			});
		} else {
			if (canvasForQRCode) {
				const context = canvasForQRCode.getContext('2d');
				if (context) {
					context.clearRect(0, 0, this.size, this.size);
				}
			}
		}
	}

	protected getTargetElementForCssClassesAndStyle(): HTMLElement {
		return this._elContainer;
	}

	//#endregion

}

Ch5ComponentLibrary.registerComponent(Ch5QrCode);
