export class Ch5LightButton extends HTMLElement {

	//#region Constants

	public static readonly ELEMENT_NAME = 'ch5-light-button';

	public static readonly PRIMARY_CSS_CLASS = 'ch5-light-button';

	private static readonly OBSERVED_ATTRIBUTES = ['label', 'iconclass'];

	//#endregion

	//#region Variables

	private _label = '';
	private _iconClass = '';

	private _elContainer: HTMLElement = this;
	private _elButton: HTMLButtonElement | null = null;
	private _elIcon: HTMLElement | null = null;
	private _elLabel: HTMLElement | null = null;

	//#endregion

	//#region Getters and Setters

	public set label(value: string) {
		value = value || '';
		if (this._label !== value) {
			this._label = value;
			this.handleLabel();
		}
	}
	public get label(): string {
		return this._label;
	}

	public set iconClass(value: string) {
		value = value || '';
		if (this._iconClass !== value) {
			this._iconClass = value;
			this.handleIconClass();
		}
	}
	public get iconClass(): string {
		return this._iconClass;
	}

	//#endregion

	//#region Static Methods

	public static registerCustomElement() {
		if (typeof window === "object"
			&& typeof window.customElements === "object"
			&& typeof window.customElements.define === "function"
			&& window.customElements.get(Ch5LightButton.ELEMENT_NAME) === undefined) {
			window.customElements.define(Ch5LightButton.ELEMENT_NAME, Ch5LightButton);
		}
	}

	public static get observedAttributes(): string[] {
		return Ch5LightButton.OBSERVED_ATTRIBUTES;
	}

	//#endregion

	//#region Component Lifecycle

	public constructor() {
		super();
	}

	public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
		if (oldValue === newValue) {
			return;
		}
		switch (attr.toLowerCase()) {
			case 'label':
				this.label = newValue;
				break;
			case 'iconclass':
				this.iconClass = newValue;
				break;
		}
	}

	/**
	 * Called when the Ch5LightButton component is first connected to the DOM
	 */
	public connectedCallback() {
		this.createInternalHtml();
		this.initAttributes();
		this.handleLabel();
		this.handleIconClass();
	}

	public disconnectedCallback() {
		// no-op
	}

	//#endregion

	//#region Private Methods

	private createInternalHtml() {
		this.clearComponentContent();

		// clearComponentContent() removed all previously created children, so the
		// cached label/icon references now point at detached elements. Reset them
		// to force handleLabel()/handleIconClass() to recreate them inside the new
		// button on every (re)connect, otherwise the label/icon go missing when the
		// component is disconnected and connected again.
		this._elLabel = null;
		this._elIcon = null;

		this._elContainer = this;
		this._elContainer.classList.add(Ch5LightButton.PRIMARY_CSS_CLASS);

		this._elButton = document.createElement('button');
		this._elButton.classList.add(`${Ch5LightButton.PRIMARY_CSS_CLASS}--btn`);
		this._elContainer.appendChild(this._elButton);
	}

	private initAttributes() {
		if (this.hasAttribute('label')) {
			this.label = this.getAttribute('label') as string;
		}
		if (this.hasAttribute('iconclass')) {
			this.iconClass = this.getAttribute('iconclass') as string;
		}
	}

	/**
	 * Clear the content of component in order to avoid duplication of elements
	 */
	private clearComponentContent() {
		while (this.firstChild) {
			this.removeChild(this.firstChild);
		}
	}

	private handleLabel() {
		// Button is only available once the component is connected to the DOM
		if (!this._elButton) {
			return;
		}
		if (this._label) {
			// Create the label element lazily the first time a label is set
			if (!this._elLabel) {
				this._elLabel = document.createElement('span');
				this._elLabel.classList.add(`${Ch5LightButton.PRIMARY_CSS_CLASS}--label`);
				this._elButton.appendChild(this._elLabel);
			}
			this._elLabel.textContent = this._label;
		} else if (this._elLabel) {
			// Remove the label element when the label is cleared
			this._elLabel.remove();
			this._elLabel = null;
		}
	}

	private handleIconClass() {
		// Button is only available once the component is connected to the DOM
		if (!this._elButton) {
			return;
		}
		if (this._iconClass) {
			// Create the icon element lazily the first time an icon class is set
			if (!this._elIcon) {
				this._elIcon = document.createElement('i');
				this._elButton.insertBefore(this._elIcon, this._elButton.firstChild);
			}
			this._elIcon.className = `${Ch5LightButton.PRIMARY_CSS_CLASS}--icon ${this._iconClass}`.trim();
		} else if (this._elIcon) {
			// Remove the icon element when the icon class is cleared
			this._elIcon.remove();
			this._elIcon = null;
		}
	}

	//#endregion
}

Ch5LightButton.registerCustomElement();