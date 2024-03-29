import { Ch5Log } from "../../ch5-common/ch5-log";
import { Ch5RoleAttributeMapping } from "../../utility-models/ch5-role-attribute-mapping";
import { ICh5ButtonListLabelDocumentation } from "./../interfaces/i-ch5-button-list-label-documentation";

export class Ch5ButtonListLabelBase extends Ch5Log implements ICh5ButtonListLabelDocumentation {

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
      this.setAttribute('role', Ch5RoleAttributeMapping.ch5ButtonListLabel);
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
