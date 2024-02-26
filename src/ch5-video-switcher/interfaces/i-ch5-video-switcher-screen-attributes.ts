import { TCh5VideoSwitcherScreenAlignLabel } from "./t-ch5-video-switcher";

/**
 * @ignore
 */
export interface ICh5VideoSwitcherScreenAttributes {
  /**
   * @documentation
   * [
   * "`labelInnerHTML` attribute",
   * "***",
   * "Ability to provide a template that applies for the individual screen in the list."
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
   * "Set the label alignment on the screen window as either left, center(default) and right."
   * ]
   * @name alignlabel
   * @default center
   * @attributeType "EnumeratedValue"
   */
  alignLabel: TCh5VideoSwitcherScreenAlignLabel;
}