import { Ch5Log } from "../ch5-common/ch5-log";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";

export class Ch5VideoSwitcherSourceLabel extends Ch5Log {


  //#region Variables

  public static ELEMENT_NAME = 'ch5-video-switcher-source-label';

  //#endregion

  //#region Static Methods

  public static registerCustomElement() {
    if (typeof window === "object"
      && typeof window.customElements === "object"
      && typeof window.customElements.define === "function"
      && window.customElements.get(Ch5VideoSwitcherSourceLabel.ELEMENT_NAME) === undefined) {
      window.customElements.define(Ch5VideoSwitcherSourceLabel.ELEMENT_NAME, Ch5VideoSwitcherSourceLabel);
    }
  }

  //#endregion 

  //#region Component Lifecycle

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
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', Ch5RoleAttributeMapping.ch5VideoSwitcherSourceLabel);
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

Ch5VideoSwitcherSourceLabel.registerCustomElement();
