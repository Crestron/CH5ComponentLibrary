export class Ch5LightButton extends HTMLElement {

	//#region Constants

	public static readonly ELEMENT_NAME = 'ch5-light-button';

	public static readonly PRIMARY_CSS_CLASS = 'ch5-light-button';

	private static readonly OBSERVED_ATTRIBUTES = ['label', 'iconclass', 'iconurl'];

	//#endregion

	//#region Variables

	private _label = '';
	private _iconClass = '';
	private _iconUrl = '';
	private _isInitialized = false;

	private _elContainer: HTMLElement = this;
	private _elButton: HTMLButtonElement | null = null;
	private _elIcon: HTMLElement | null = null;
	private _elLabel: HTMLElement | null = null;

	//#endregion

	//#region Getters and Setters

	public set label(value: string) {
		value = value ?? '';
		if (this._label !== value) {
			this._label = value;
			this.handleLabel();
		}
	}
	public get label(): string {
		return this._label;
	}

	public set iconClass(value: string) {
		value = value ?? '';
		if (this._iconClass !== value) {
			this._iconClass = value;
			this.handleIcon();
		}
	}
	public get iconClass(): string {
		return this._iconClass;
	}

	public set iconUrl(value: string) {
		value = value ?? '';
		if (this._iconUrl !== value) {
			this._iconUrl = value;
			this.handleIcon();
		}
	}
	public get iconUrl(): string {
		return this._iconUrl;
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

	public attributeChangedCallback(attr: string, oldValue: string | null, newValue: string | null): void {
		if (oldValue === newValue) {
			return;
		}
		switch (attr) {
			case 'label':
				this.label = newValue || '';
				break;
			case 'iconclass':
				this.iconClass = newValue || '';
				break;
			case 'iconurl':
				this.iconUrl = newValue || '';
				break;
		}
	}

	/**
	 * Called when the Ch5LightButton component is first connected to the DOM
	 */
	public connectedCallback() {
		if (!this._isInitialized) {
			this.createInternalHtml();
			this.initAttributes();
			this.handleIcon();
			this.handleLabel();
			this._isInitialized = true;
		}

		// Keep the internal subtree across disconnect/reconnect cycles and only
		// reattach when needed.
		if (this._elButton && this._elButton.parentNode !== this) {
			this._elContainer.appendChild(this._elButton);
		}
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

		// Create the button OFF-DOM. The icon/label are added to it (via the
		// handlers) while it is still detached, and the whole subtree is appended
		// to the host once in connectedCallback.
		this._elButton = document.createElement('button');
		this._elButton.className = `${Ch5LightButton.PRIMARY_CSS_CLASS}--btn`;
	}

	private initAttributes() {
		// Set the backing fields directly (bypassing the setters). The setters are
		// only needed for runtime property assignment; during the initial build we
		// want the handlers in connectedCallback to run exactly once.
		this._label = this.getAttribute('label') || '';
		this._iconClass = this.getAttribute('iconclass') || '';
		this._iconUrl = this.getAttribute('iconurl') || '';
	}

	/**
	 * Clear the content of component in order to avoid duplication of elements
	 */
	private clearComponentContent() {
		// Use a single native operation instead of repeated removeChild calls.
		this.replaceChildren();
	}

	private handleLabel() {
		// Button is only available after createInternalHtml() has run
		if (!this._elButton) {
			return;
		}
		if (this._label) {
			// Create the label element lazily the first time a label is set
			if (!this._elLabel) {
				this._elLabel = document.createElement('span');
				this._elLabel.className = `${Ch5LightButton.PRIMARY_CSS_CLASS}--label`;
				this._elButton.appendChild(this._elLabel);
			}
			this._elLabel.textContent = this._label;
		} else if (this._elLabel) {
			// Remove the label element when the label is cleared
			this._elLabel.remove();
			this._elLabel = null;
		}
	}

	private handleIcon() {
		// Button is only available after createInternalHtml() has run
		if (!this._elButton) {
			return;
		}
		if (this._iconUrl || this._iconClass) {
			// Create the icon element lazily the first time an icon is set.
			// DOM order does not matter: the icon position is controlled by the CSS
			// `order` property (see _light-button-icon-position.scss).
			if (!this._elIcon) {
				this._elIcon = document.createElement('i');
				this._elButton.appendChild(this._elIcon);
			}
			if (this._iconUrl) {
				// iconUrl takes the highest priority over iconClass. Render the icon
				// as a background image using the --img modifier class. The --img and
				// --icon classes are mutually exclusive (same as ch5-button).
				this._elIcon.className = `${Ch5LightButton.PRIMARY_CSS_CLASS}--img`;
				this._elIcon.style.backgroundImage = `url("${this._iconUrl}")`;
			} else {
				// Fall back to the icon font class when no iconUrl is provided.
				this._elIcon.className = `${Ch5LightButton.PRIMARY_CSS_CLASS}--icon ${this._iconClass}`;
				this._elIcon.style.backgroundImage = '';
			}
		} else if (this._elIcon) {
			// Remove the icon element when both the icon class and url are cleared
			this._elIcon.remove();
			this._elIcon = null;
		}
	}

	//#endregion
}

Ch5LightButton.registerCustomElement();