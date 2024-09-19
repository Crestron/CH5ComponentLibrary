import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import QRCode from "qrcode";
import { Ch5ComponentLibrary } from "../ch5-core/ch5-component";
import Ch5ColorUtils from '../ch5-common/utils/ch5-color-utils';
import { Ch5BaseClass } from "../ch5-base/ch5-base-class";
import { ICh5QrCodeAttributes } from "./interfaces/i-ch5-qrcode-attributes";
import { resizeObserver } from "../ch5-core/resize-observer";

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
			default: 160,
			name: "size",
			removeAttributeOnNull: true,
			type: "number",
			valueOnAttributeEmpty: 160,
			numberProperties: {
				min: 160,
				max: 4000,
				conditionalMin: 160,
				conditionalMax: 4000,
				conditionalMinValue: 160,
				conditionalMaxValue: 160
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
	private calcuatedSizeFromCSS: number = 0;

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
		this.initializeCssClasses();
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

		resizeObserver(this._elContainer, this.onWindowResizeHandler.bind(this));

		customElements.whenDefined(Ch5QrCode.ELEMENT_NAME).then(() => {
			this.componentLoadedEvent(Ch5QrCode.ELEMENT_NAME, this.id);
			this.debounceBuildQrCode();
		});
		this.logger.stop();
	}

	private initializeCssClasses() {
		if (!this._elContainer.classList.contains("ch5-qrcode--size-css")) {
			this._elContainer.classList.add("ch5-qrcode--size-css");
		}
	}

	private onWindowResizeHandler() {
		// if (!this.hasAttribute("size")) {400
		// 	// Get size from CSS
		// 	// Component Attribute overrides CSS Value

		// } else {
		// 	this.style.setProperty('--ch5-qrcode--size', String(this.size));
		// 	this.calcuatedSizeFromCSS = 0;
		// 	this.style.setProperty('--ch5-qrcode--size', String(this.size));
		// 	// set width and height in css class
		// }
console.log("AAAAA");
		if (!this.hasAttribute("size")) {
			// Get size from CSS
			// Component Attribute overrides CSS Value
			// this.style.removeProperty('--ch5-qrcode--size'); // Used incase the size attribute is removed from DOM
			const computedStyle = getComputedStyle(this);
			const calcuatedSizeFromCSS = Number(computedStyle.getPropertyValue('--ch5-qrcode--size'));
			const calculatedSizeObj = Ch5QrCode.COMPONENT_PROPERTIES.find((colorCode: ICh5PropertySettings) => colorCode.name === "size");
			if (calcuatedSizeFromCSS >= Number(calculatedSizeObj?.numberProperties?.min) && calcuatedSizeFromCSS <= Number(calculatedSizeObj?.numberProperties?.max)) {
				this.calcuatedSizeFromCSS = calcuatedSizeFromCSS;
			} else {
				// this.style.setProperty('--ch5-qrcode--size', calculatedSizeObj?.default);
				this.calcuatedSizeFromCSS = 0;
			}
			// this.style.setProperty('--ch5-qrcode--size', calculatedSizeObj?.default);
		} else {
			// this.style.setProperty('--ch5-qrcode--size', String(this.size));
			this.calcuatedSizeFromCSS = 0;
		}
		this.handleQrCode();
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
		let calculatedSize: number = this.size; // TODO - use let after the below fix
		if (!this.hasAttribute("size") && this.calcuatedSizeFromCSS > 0) {
			// const calculatedSizeObj = Ch5QrCode.COMPONENT_PROPERTIES.find((colorCode: ICh5PropertySettings) => colorCode.name === "size")?.numberProperties;
			// if (this.calcuatedSizeFromCSS > Number(calculatedSizeObj?.min) && this.calcuatedSizeFromCSS < Number(calculatedSizeObj?.max)) {
			calculatedSize = this.calcuatedSizeFromCSS;
			// }
		}
		console.log("calculatedSize is ", calculatedSize);
		this.style.setProperty('--ch5-qrcode--size', String(calculatedSize));
			
		if (canvasForQRCode) {
			canvasForQRCode.setAttribute("width", String(calculatedSize));
			canvasForQRCode.setAttribute("height", String(calculatedSize));
		}

		if (data && data !== "") {
			let foregroundColor = Ch5ColorUtils.col2hex(this.color);
			if (!Ch5ColorUtils.validateColorName(this.color)) {
				foregroundColor = Ch5QrCode.COMPONENT_PROPERTIES.find((colorCode: ICh5PropertySettings) => colorCode.name === "color")?.default;
			}
			let backgroundColor = Ch5ColorUtils.col2hex(this.backgroundColor);
			if (!Ch5ColorUtils.validateColorName(this.backgroundColor)) {
				backgroundColor = Ch5QrCode.COMPONENT_PROPERTIES.find((colorCode: ICh5PropertySettings) => colorCode.name === "backgroundColor")?.default;
			}
			const opts: any = {
				errorCorrectionLevel: 'H',
				type: 'image/svg',
				width: calculatedSize,
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
					context.clearRect(0, 0, calculatedSize, calculatedSize);
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
