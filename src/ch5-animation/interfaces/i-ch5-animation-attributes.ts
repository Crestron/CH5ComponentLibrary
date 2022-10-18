import { ICh5CommonAttributes } from "../../ch5-common/interfaces";
import {TCh5AnimationSize,  }from './t-ch5-animation';

/**
 * @ignore
 */
export interface ICh5AnimationAttributes extends ICh5CommonAttributes {
  /**
        * @documentation
        * [
        * "`startAnimating` attribute",
        * "***",
        * "StartAnimating"
        * ]
        * @name startAnimating
        * @default true
        * @attributeType "boolean"
        */
       startAnimating: boolean;
       /**
        * @documentation
        * [
        * "`framesPerSecond` attribute",
        * "***",
        * "Sets an integer value representing the number of frames that are played every second. Default value is 6 frames per second."
        * ]
        * @name framesPerSecond
        * @default 6
        * @attributeType "number"
        */
       framesPerSecond: number;
       /**
        * @documentation
        * [
        * "`Size` attribute",
        * "***",
        * "Select the size of the animation object from small, regular, large and x-large."
        * ]
        * @name size
        * @default regualr
        * @attributeType "TCh5AnimationSize"
        */
        size: TCh5AnimationSize;
        /**
        * @documentation
        * [
        * "`animationStyle` attribute",
        * "***",
        * "The styled graphics that determine the look/feel of this object. Each state of the style chosen corresponds to a frame of the animation."
        * ]
        * @name animationStyle
        * @default spinner
        * @attributeType "string"
        */
       animationStyle: string;
       /**
        * @documentation
        * [
        * "`sendEventOnClick` attribute",
        * "***",
        * "The enable click-through property is used to toggle the option of the Animation Object being click-through."
        * ]
        * @name sendEventOnClick
        * @default 
        * @attributeType "string"
        */
       sendEventOnClick: string;
       /**
        * @documentation
        * [
        * "`receiveStateAnimate` attribute",
        * "***",
        * "Select a digital join receive feedback from the control system. When the signal is high the animation will play. If the signal is low, the animation will stop."
        * ]
        * @name receiveStateAnimate
        * @default 
        * @attributeType "string"
        */
       receiveStateAnimate: string;
       /**
        * @documentation
        * [
        * "`receiveStateMode` attribute",
        * "***",
        * "Select a serial join to receive feedback from the control system. The value of this join is the name of the frame of the animation in the theme. If no join is selected, the animation object will display it's initial mode."
        * ]
        * @name receiveStateMode
        * @default 
        * @attributeType "string"
        */
       receiveStateMode: string;
       /**
        * @documentation
        * [
        * "`receiveStateValue` attribute",
        * "***",
        * "Select an analog join to receive feedback from the control system. The value of join will select which mode the animation object will display. If no join is selected, the animation object will display its initial mode."
        * ]
        * @name receiveStateValue
        * @default 
        * @attributeType "string"
        */
       receiveStateValue: string;
       
}