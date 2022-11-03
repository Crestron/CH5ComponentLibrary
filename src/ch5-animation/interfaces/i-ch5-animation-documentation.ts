import { ICh5CommonAttributesAnim } from "../../ch5-common/interfaces/i-ch5-common-animation";
import { ICh5AnimationAttributes } from "./i-ch5-animation-attributes";

/**
 * @name ch5 Animation
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
 *      "<ch5-animation>",
 *      "</ch5-animation>$0"
 *    ]
 *  }, 
 *  {
 *    "prefix": "ch5-animation:default",
 *    "description": "Crestron Animation",
 *    "body": [
 *      "<ch5-animation startAnimating=\"true\"",
 *      "\tanimationStyle=\"ring\"",
 *      "\tsize=\"regular\">",
 *      "</ch5-animation>$0"
 *    ]
 *  },
 *  {
 *    "prefix": "ch5-animation:all-attributes",
 *    "description": "Crestron Animation (All Attributes)",
 *    "body": [
 *      "<ch5-animation startAnimating=\"true\"",
 *      "\tanimationStyle=\"ring\"",
 *      "\tsize=\"regular\"",
 *      "\treceiveStateAnimate=\"${4}\"",
 *      "\treceiveStateFramesPerSecond=\"${5}\"",
 *      "\treceiveStateAnimationStyle=\"${6}\">",
 *      "</ch5-animation>$0"
 *      ] 
 *    }
 *  ]
 */
export interface ICh5AnimationDocumentation extends ICh5CommonAttributesAnim, ICh5AnimationAttributes {

}