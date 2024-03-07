import { Ch5Log } from "../ch5-common/ch5-log";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { ICh5VideoSwitcherScreenLabelDocumentation } from "./interfaces";

export class Ch5VideoSwitcherScreenLabel extends Ch5Log implements ICh5VideoSwitcherScreenLabelDocumentation {

  //#region Component Lifecycle

  public static ELEMENT_NAME = 'ch5-video-switcher-screen-label';

  //#region Static Methods

  public static registerCustomElement() {
    if (typeof window === "object"
      && typeof window.customElements === "object"
      && typeof window.customElements.define === "function"
      && window.customElements.get(Ch5VideoSwitcherScreenLabel.ELEMENT_NAME) === undefined) {
      window.customElements.define(Ch5VideoSwitcherScreenLabel.ELEMENT_NAME, Ch5VideoSwitcherScreenLabel);
    }
  }

  //#endregion


  public constructor() {
    super();
    this.logger.start('constructor()');
    this.logger.stop();
  }

  /**
   * Called when the Ch5ButtonListLabel component is first connected to the DOM
   */
  public connectedCallback() {
    this.logger.start('connectedCallback()');
    if (this.parentElement?.nodeName.toLowerCase() !== 'ch5-video-switcher-screen') {
      throw new Error(`Invalid parent element for ch5-video-switcher-screen-label.`);
    }
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', Ch5RoleAttributeMapping.ch5VideoSwitcherScreenLabel);
    }
    this.setAttribute('data-ch5-id', this.getCrId());
    this.initAttributes();
    this.logger.stop();
  }

  public disconnectedCallback() {
    this.logger.start('disconnectedCallback()');
    this.logger.stop();
  }

  //#endregion

}

Ch5VideoSwitcherScreenLabel.registerCustomElement();
