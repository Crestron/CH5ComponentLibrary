import _ from "lodash";
import { Ch5Log } from "../ch5-common/ch5-log";
import { Ch5Image } from "./ch5-image";
import { ICH5ImageModeAttributes } from "./interfaces/i-ch5-image-mode-attributes";

export class Ch5ImageMode extends Ch5Log implements ICH5ImageModeAttributes {

	public static readonly ELEMENT_NAME: string = 'ch5-image-mode';
	public _url: string = '';
	private _parentCh5Image: Ch5Image;

	public set url(value: string) {
		if (value && this._url !== value) {
			this._url = value;
			this.setAttribute('url', value);
			this._parentCh5Image.setImageDisplay();
		}
	}
	public get url(): string {
		return this._url;
	}

	public static get observedAttributes() {
		const commonAttributes = Ch5Log.observedAttributes;

		const ch5ButtonModeChildAttributes: string[] = [
			'url'
		];

		return commonAttributes.concat(ch5ButtonModeChildAttributes);
	}

	constructor() {
		super();
		this.logger.start('constructor()');
		this._parentCh5Image = this.getParentImage();
		this.logger.stop();
	}

	public attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
		console.log("oldValue", oldValue);
		console.log("newValue", newValue);
		if (newValue === oldValue) {
			return;
		}

		switch (attr) {
			case 'url':
				this.url = newValue;
				break;
		}
	}

	public getParentImage(): Ch5Image {
		const getTheMatchingParent = (node: Node): Ch5Image => {
			if (!_.isNil(node) && node.nodeName.toString().toUpperCase() !== "CH5-IMAGE") {
				return getTheMatchingParent(node.parentNode as Node);
			}
			return node as Ch5Image;
		}
		return getTheMatchingParent(this.parentElement as Node);
	}

}

if (typeof window === "object" && typeof window.customElements === "object"
	&& typeof window.customElements.define === "function") {
	window.customElements.define(Ch5ImageMode.ELEMENT_NAME, Ch5ImageMode);
}
