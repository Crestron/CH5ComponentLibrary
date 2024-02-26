import { TCh5VideoSwitcherSourceAlignLabel } from "./t-ch5-video-switcher";

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
   * @default 
   * @attributeType "String"
   */
  labelInnerHTML: string;
  /**
   * @documentation
   * [
   * "`alignLabel` attribute",
   * "***",
   * "Set the label alignment on the source window as either left, center(default) and right."
   * ]
   * @name alignlabel
   * @default center
   * @attributeType "EnumeratedValue"
   */
  alignLabel: TCh5VideoSwitcherSourceAlignLabel;
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
}