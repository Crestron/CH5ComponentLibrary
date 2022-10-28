import { ICh5CommonAttributesAnimation } from "../../ch5-common/interfaces";
import { TCh5AnimationSize, TCh5AnimationStyle } from './t-ch5-animation';

/**
 * @ignore
 */
export interface ICh5AnimationAttributes extends ICh5CommonAttributesAnimation {
  /**
        * @documentation
        * [
        * "`startAnimating` attribute",
        * "***",
        * "Starts or stops playing the animation object."
        * ]
        * @name startanimating
        * @default true
        * @attributeType "boolean"
        */
  startAnimating: boolean;
  /**
   * @documentation
   * [
   * "`size` attribute",
   * "***",
   * "Select the size of the animation object from small, regular, large and x-large."
   * ]
   * @name size
   * @default regular
   * @attributeType "EnumeratedValue"
   */
  size: TCh5AnimationSize;
  /**
  * @documentation
  * [
  * "`animationStyle` attribute",
  * "***",
  * "The styled graphics that determine the look/feel of this object. Each state of the style chosen corresponds to a frame of the animation. Default value is ring"
  * ]
  * @name animationstyle
  * @default ring
  * @attributeType "EnumeratedValue"
  */
  animationStyle: TCh5AnimationStyle;
  /**
   * @documentation
   * [
   * "`receiveStateAnimate` attribute",
   * "***",
   * "Select a digital join receive feedback from the control system. When the signal is high the animation will play. If the signal is low, the animation will stop."
   * ]
   * @name receivestateanimate
   * @join {"direction": "state", "isContractName": true, "booleanJoin": 1}
   * @attributeType "Join"
   */
  receiveStateAnimate: string;
  /**
   * @documentation
   * [
   * "`receiveStateFramesPerSecond` attribute",
   * "***",
   * "Sets an integer value representing the number of frames that are played every second. Default is 2 frames per second."
   * ]
   * @name receivestateframespersecond
   * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
   * @attributeType "Join"
   */
  receiveStateFramesPerSecond: string;
  /**
   * @documentation
   * [
   * "`receiveStateAnimationStyle` attribute",
   * "***",
   * "Select an serial join to receive desired animation style to be displayed from the control system. If no join is selected, the animation object will display the default style."
   * ]
   * @name receivestateanimationstyle
   * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
   * @attributeType "Join"
   */
  receiveStateAnimationStyle: string;

}