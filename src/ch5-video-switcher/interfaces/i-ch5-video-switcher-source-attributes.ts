/**
 * @ignore
 */
export interface ICh5VideoSwitcherSourceAttributes {
  /**
   * @documentation
   * [
   * "`labelInnerHTML` attribute",
   * "***",
   * "Ability to provide a template that applies for the individual sources in the video switcher."
   * ]
   * @name labelinnerhtml
   * @attributeType "String"
   * @hidden true
   */
  labelInnerHTML: string;
  /**
   * @documentation
   * [
   * "`iconClass` attribute",
   * "***",
   * "The styled graphics and font styling information that determine the look/feel of the source icon image and the source icon text label. This style contains n states of icon images"
   * ]
   * @name iconclass
   * @default 
   * @attributeType "String"
   */
  iconClass: string;
  /**
   * @documentation
   * [
   * "`iconUrl` attribute",
   * "***",
   * "The iconUrl attribute with SVG icons and PNG Icons. We can pass only one url in the iconUrl attribute. This attribute overrides the iconClass attribute in ch5-video-switcher for the respective individual source based on index."
   * ]
   * @name iconurl
   * @default 
   * @attributeType "String"
   */
  iconUrl: string;
}