import { Ch5Common } from "../ch5-common/ch5-common";
import { ICH5ImageModeAttributes } from "./interfaces/i-ch5-image-mode-attributes";

export class Ch5ImageMode extends Ch5Common implements ICH5ImageModeAttributes {

    public static get observedAttributes() {
        return [
            'url'
        ]
    }

    public _url: string = '';

    attributeChangedCallback(attr: string, newValue: string, oldValue: string) {

        if (newValue === oldValue) {
            return;
        }

        switch (attr) {
            case 'url':
                this.url = newValue;
                break;
        }
    }

    public set url(url: string) { 
        if (url && this._url !== url) {
            this._url = url;
            this.setAttribute('url', url);
        }
    }

    public get url(): string {
        return this._url;
    }

}

if (typeof window === "object" && typeof window.customElements === "object"
    && typeof window.customElements.define === "function") {
    window.customElements.define('ch5-image-mode', Ch5ImageMode);

}
