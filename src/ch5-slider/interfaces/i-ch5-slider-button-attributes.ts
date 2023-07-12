import { TCh5SliderButtonShape, TCh5IconUrlFillType, TCh5SliderButtonKey, TCh5SliderButtonVerticalAlignLabel, TCh5SliderButtonType, TCh5SliderButtonHorizontalAlignLabel } from './t-ch5-slider-button';

/**
 * @ignore
 */
export interface ICh5SliderButtonAttributes {
  /**
   * @documentation
   * [
   * "`key` attribute",
   * "***",
   * "Used to set the type of button i.e on ,off."
   * ]
   * @name key
   * @default
   * @attributeType "EnumeratedValue"
   */
  key: TCh5SliderButtonKey;
  /**
   * @documentation
   * [
   * "`label` attribute",
   * "***",
   * "Used to set the label displayed for the on/off button."
   * ]
   * @name label
   * @attributeType "string"
   */
  label: string
  /**
   * @documentation
   * [
   * "`labelInnerHTML` attribute",
   * "***",
   * "Used to set the label displayed for the on/off button. Takes the preference over the label attribute."
   * ]
   * @name labelinnerhtml
   * @attributeType "string"
   */
  labelInnerHTML: string
  /**
   * @documentation
   * [
   * "`iconClass` attribute",
   * "***",
   * "The iconClass attribute with Font Awesome icons and Material Icons. We can declare more than one css class in the iconClass attribute."
   * ]
   * @name iconclass
   * @attributeType "string"
   */
  iconClass: string;
  /**
   * @documentation
   * [
   * "`iconurl` attribute",
   * "***",
   * "The iconUrl attribute with SVG icons and PNG Icons. We can pass only one url in the iconUrl attribute."
   * ]
   * @name iconurl
   * @attributeType "string"
   */
  iconUrl: string;
  /**
   * @documentation
   * [
   * "`sendeventonclick` attribute",
   * "***",
   * "Sends a high signal when user places the finger on the control and low signal when finger is released."
   * ]
   * @name sendeventonclick
   * @join {"direction": "event", "isContractName": true, "booleanJoin": 1}
   * @attributeType "Join"
   */
  sendEventOnClick: string;
  /**
   * @documentation
   * [
   * "`receivestatelabel` attribute",
   * "***",
   * "When received, applies the value to set the label displayed for the on/off button."
   * ]
   * @name receivestatelabel
   * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
   * @attributeType "Join"
   */
  receiveStateLabel: string;
  /**
   * @documentation
   * [
   * "`receivestateiconclass` attribute",
   * "***",
   * "After receiving the signal iconClass value from control system,It sets the icon class received from the control system."
   * ]
   * @name receivestateiconclass
   * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
   * @attributeType "Join"
   */
  receiveStateIconClass: string;
  /**
   * @documentation
   * [
   * "`receivestateiconurl` attribute",
   * "***",
   * "After receiving the signal iconUrl value from control system, this value is applied to the iconUrl."
   * ]
   * @name receivestateiconurl
   * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
   * @attributeType "Join"
   */
  receiveStateIconUrl: string;
  /**
   * @documentation
   * [
   * "`iconUrlFillType` attribute",
   * "***",
   * "Sets the icon url fill type. Default value is 'null'. Applicable values are 'null', 'stretch', 'stretch-aspect', 'center', 'tile', 'initial'. Uses the css property background-size for the implementation."
   * ]
   * @name iconurlfilltype
   * @default null
   * @attributeType "EnumeratedValue"
   */
  iconUrlFillType: TCh5IconUrlFillType | null;
  /**
   * @documentation
   * [
   * "`type` attribute",
   * "***",
   * "Valid values: 'default', 'primary', 'info', 'text', 'danger', 'warning', 'success', 'secondary'.",
   * "Overrides the appearance of the slider button with alternative CSS ",
   * "If no 'type' is provided, the type of ",
   * "'default' is used."
   * ]
   * @name type
   * @default default
   * @attributeType "EnumeratedValue"
   */
  type: TCh5SliderButtonType;
  /**
   * @documentation
   * [
   * "`halignlabel` attribute",
   * "***",
   * "Valid values: 'left', 'right', 'center'.",
   * "When the hAlignLabel property is set, the label and the icon of the button are horizontally aligned. ",
   * "The center property sets the horizontal alignment of the label to the center of the button. ",
   * "The left property sets the horizontal alignment of the label to the left of the button. ",
   * "The right property sets the horizontal alignment of the label to the right of the button. "
   * ]
   * @name halignlabel
   * @default center
   * @attributeType "EnumeratedValue"
   */
  hAlignLabel: TCh5SliderButtonHorizontalAlignLabel;
  /**
   * @documentation
   * [
   * "`valignlabel` attribute",
   * "***",
   * "Valid values: 'top', 'bottom', 'middle'.",
   * "When the vAlignLabel property is set, the label and the icon of the button are vertically aligned. ",
   * "The middle property sets the vertical alignment of the label to the middle of the button. ",
   * "The top property sets the vertical alignment of the label to the top of the button. ",
   * "The bottom property sets the vertical alignment of the label to the bottom of the button. "
   * ]
   * @name valignlabel
   * @default middle
   * @attributeType "EnumeratedValue"
   */
  vAlignLabel: TCh5SliderButtonVerticalAlignLabel;
  /**
   * @documentation
   * [
   * "`selected` attribute",
   * "***",
   * "The default value is false.",
   * "This property reflects the selected state of the component."
   * ]
   * @name selected
   * @default false
   * @attributeType "Boolean"
   */
  selected: boolean;
  /**
   * @documentation
   * [
   * "`pressed` attribute",
   * "***",
   * "The default value is false.",
   * "This property reflects the pressed state of the component."
   * ]
   * @name pressed
   * @default false
   * @attributeType "Boolean"
   */
  pressed: boolean;
  /**
   * @documentation
   * [
   * "`shape` attribute",
   * "***",
   * "The default value is 'rounded-rectangle'. Valid values: 'rounded-rectangle', ",
   * "'rectangle', 'tab', 'circle', 'oval'. The shape of the button."
   * ]
   * @name shape
   * @default rounded-rectangle
   * @attributeType "EnumeratedValue"
   */
  shape: TCh5SliderButtonShape;
}