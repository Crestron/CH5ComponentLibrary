/**
 * @ignore
 */
export interface ICh5TabButtonIndividualButtonAttributes {
  /**
   * @documentation
   * [
   * "`labelInnerHtml` attribute",
   * "***",
   * "Ability to provide a template that applies for the individual button in the tab button. This attribute overrides the labelInnerHtml attribute in ch5-tab-button for the respective individual button based on index."
   * ]
   * @name labelinnerhtml
   * @default 
   * @attributeType "String"
   */
  labelInnerHtml: string;
  /**
   * @documentation
   * [
   * "`iconUrl` attribute",
   * "***",
   * "The iconUrl attribute with SVG icons and PNG Icons. We can pass only one url in the iconUrl attribute. This attribute overrides the buttonIconUrl attribute in ch5-tab-button for the respective individual button based on index."
   * ]
   * @name iconurl
   * @default 
   * @attributeType "String"
   */
  iconUrl: string;
  /**
   * @documentation
   * [
   * "`iconClass` attribute",
   * "***",
   * "The iconClass attribute with Font Awesome icons and Material Icons. We can declare more than one css class in the iconClass attribute. This attribute overrides the buttonIconClass attribute in ch5-tab-button for the respective individual button based on index."
   * ]
   * @name iconclass
   * @default 
   * @attributeType "String"
   */
  iconClass: string;
  /**
   * @documentation
   * [
   * "`onRelease` attribute",
   * "***",
   * "The onRelease attribute"
   * ]
   * @name onrelease
   * @default 
   * @attributeType "String"
   */
  onRelease: string;
}