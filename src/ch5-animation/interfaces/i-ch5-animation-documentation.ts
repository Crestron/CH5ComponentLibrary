import { ICh5Common } from "../../_interfaces";
import { ICh5AnimationAttributes } from "./i-ch5-animation-attributes";

/**
 * @name ch5 animation
 * @isattribute false
 * @tagName ch5-animation
 * @role animation
 * @description An animation object is a theme-based object that support variable frame rates and automatic playback at runtime.
 * @componentVersion 2.1.0
 * @childElements
 * [
 *    
 * ]
 * @documentation
 * [
 *   "`ch5-animation` element",
 *   "***",
 *   "An animation object is designed to provide options to add startAnimating, size, animationStyle, receiveStateAnimate, receiveStateFramesPerSecond and receiveStateAnimationStyle"
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-animation:blank",
 *    "description": "Crestron Animation",
 *    "body": [
 *      "<ch5-animation>"
 *      "</ch5-animation>$0"
 *    ]
 *  }, 
 *  {
 *    "prefix": "ch5-animation:default",
 *    "description": "Crestron Animation",
 *    "body": [
 *      "<ch5-animation startAnimating=\"true\"",
 *      "\tanimationStyle=\"spinner\">",
 *      "</ch5-animation>$0"
 *    ]
 *  }
 *
 *  ]
 */
export interface ICh5AnimationDocumentation extends ICh5Common, ICh5AnimationAttributes {

}