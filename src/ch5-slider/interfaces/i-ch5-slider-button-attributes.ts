import { TCh5SliderButtonKey } from './t-ch5-slider-button';

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
   * "The default value of key is on."
   * ]
   * @name key
   * @default on
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

}