import { TCh5ButtonListButtonType, TCh5ButtonListButtonHAlignLabel, TCh5ButtonListButtonVAlignLabel, TCh5ButtonListButtonCheckboxPosition, TCh5ButtonListButtonIconPosition } from "./t-ch5-button-list";

/**
 * @ignore
 */
export interface ICh5ButtonListModeAttributes {
  /**
  * @documentation
  * [
  * "`type` attribute",
  * "***",
  * "Possible values are danger, text, warning, info, success, default, primary, secondary"
  * ]
  * @name type
  * @default default
  * @attributeType "EnumeratedValue"
  */
  type: TCh5ButtonListButtonType;
  /**
  * @documentation
  * [
  * "`hAlignLabel` attribute",
  * "***",
  * "Default attribute is center. Possible values are 'center', 'left', 'right'.  When the buttonHAlignLabel property is set, the label and the icon of the button are horizontally aligned. The center property sets the horizontal alignment of the label to the center of the button. The left property sets the horizontal alignment of the label to the left of the button. The right property sets the horizontal alignment of the label to the right of the button."
  * ]
  * @name halignlabel
  * @default center
  * @attributeType "EnumeratedValue"
  */
  hAlignLabel: TCh5ButtonListButtonHAlignLabel;
  /**
  * @documentation
  * [
  * "`vAlignLabel` attribute",
  * "***",
  * "Default attribute is middle. Possible values are 'middle', 'top', 'bottom'. When the buttonvAlignLabel property is set, the label and the icon of the button are vertically aligned. The middle property sets the vertical alignment of the label to the middle of the button. The top property sets the vertical alignment of the label to the top of the button. The bottom property sets the vertical alignment of the label to the bottom of the button."
  * ]
  * @name valignlabel
  * @default middle
  * @attributeType "EnumeratedValue"
  */
  vAlignLabel: TCh5ButtonListButtonVAlignLabel;
  /**
  * @documentation
  * [
  * "`checkboxPosition` attribute",
  * "***",
  * "Default value is left.  Valid values are 'left', 'right'.  This property is used to set the position of a checkbox in a button.  The value left would set the checkbox to the left of the button and the value right would set the checkbox to the right of the button."
  * ]
  * @name checkboxposition
  * @default left
  * @attributeType "EnumeratedValue"
  */
  checkboxPosition: TCh5ButtonListButtonCheckboxPosition;
  /**
  * @documentation
  * [
  * "`iconPosition` attribute",
  * "***",
  * "The default value is 'first'. Valid values: 'first', 'last', 'top', 'bottom'. The icon position relative to the label."
  * ]
  * @name iconposition
  * @default first
  * @attributeType "EnumeratedValue"
  */
  iconPosition: TCh5ButtonListButtonIconPosition;
  /**
  * @documentation
  * [
  * "`iconClass` attribute",
  * "***",
  * "The iconClass attribute with Font Awesome icons and Material Icons. You can declare more than one css class in the iconClass attribute."
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
   * "The iconUrl attribute with SVG icons and PNG Icons we can pass only one url in the iconUrl attribute"
   * ]
   * @name iconurl
   * @default 
   * @attributeType "String"
   */
  iconUrl: string;
  /**
   * @documentation
   * [
   * "`customClass` attribute",
   * "***",
   * "defines custom class for the button list mode"
   * ]
   * @name customclass
   * @default 
   * @attributeType "String"
   */
  customClass: string;
  /**
   * @documentation
   * [
   * "`customStyle` attribute",
   * "***",
   * "defines custom style for the button list mode"
   * ]
   * @name customstyle
   * @default 
   * @attributeType "String"
   */
  customStyle: string;
  /**
   * @documentation
   * [
   * "`labelInnerHTML` attribute",
   * "***",
   * "Ability to provide a template that applies for the button"
   * ]
   * @name labelinnerhtml
   * @default 
   * @attributeType "String"
   */
  labelInnerHTML: string;
}