import { ICh5VideoSwitcherScreenAttributes } from "./i-ch5-video-switcher-screen-attributes";

/**
 * @name Ch5 Video Switcher Screen
 * @isattribute false
 * @tagName ch5-video-switcher-screen
 * @role template
 * @description A child element designed to handle individual screen for Ch5 Video Switcher component
 * @componentVersion 2.9.0
 * @childElements
 * [
 *    
 * ]
 * @documentation
 * [
 *   "`ch5-video-switcher-screen` element",
 *   "***",
 *   "Ch5 Video Switcher Screen tag to provide ability to enter individual screen labels and align the labels for the screen."
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-video-switcher-screen:blank",
 *     "description": "Crestron video switcher screen",
 *     "body": [
 *       "<ch5-video-switcher-screen>",
 *       "</ch5-video-switcher-screen>$0"
 *     ]
 *   },
 *   {
 *     "prefix": "ch5-video-switcher-screen:default",
 *     "description": "Crestron video switcher screen (default)",
 *     "body": [
 *       "<ch5-video-switcher-screen id=\"ch5-video-switcher-screen_${1:id}\"",
 *       "\talignLabel=\"${2:center}\">",
 *       "</ch5-video-switcher-screen>$0"
 *       ]
 *    },
 *   {
 *     "prefix": "ch5-video-switcher-screen:all-attributes",
 *     "description": "Crestron video switcher screen (All Attributes)",
 *     "body": [
 *       "<ch5-video-switcher-screen id=\"ch5-video-switcher-screen_${1:id}\"",
 *       "\tlabelInnerHTML=\"${2:}\"",
 *       "\talignLabel=\"${3:center}\">",
 *       "</ch5-video-switcher-screen>$0"
 *       ]
 *    }
 *  ]
 */
export interface ICh5VideoSwitcherScreenDocumentation extends ICh5VideoSwitcherScreenAttributes {

}