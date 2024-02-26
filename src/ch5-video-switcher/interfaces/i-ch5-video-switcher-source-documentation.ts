import { ICh5VideoSwitcherSourceAttributes } from "./i-ch5-video-switcher-source-attributes";

/**
 * @name Ch5 Video Switcher Source
 * @isattribute false
 * @tagName ch5-video-switcher-source
 * @role template
 * @description A child element designed to handle individual source for Ch5 Video Switcher component
 * @componentVersion 2.9.0
 * @childElements
 * [
 *    
 * ]
 * @documentation
 * [
 *   "`ch5-video-switcher-source` element",
 *   "***",
 *   "Ch5 Video Switcher Source tag to provide ability to enter individual source labels, align the labels for the source and provide iconclass for the source."
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-video-switcher-source:blank",
 *     "description": "Crestron video switcher source",
 *     "body": [
 *       "<ch5-video-switcher-source>",
 *       "</ch5-video-switcher-source>$0"
 *     ]
 *   },
 *   {
 *     "prefix": "ch5-video-switcher-source:default",
 *     "description": "Crestron video switcher source (default)",
 *     "body": [
 *       "<ch5-video-switcher-source id=\"ch5-video-switcher-source_${1:id}\"",
 *       "\talignLabel=\"${2:center}\"",
 *        "\ticonClass=\"${3:}\">",
 *       "</ch5-video-switcher-source>$0"
 *       ]
 *    },
 *   {
 *     "prefix": "ch5-video-switcher-source:all-attributes",
 *     "description": "Crestron video switcher source (All Attributes)",
 *     "body": [
 *       "<ch5-video-switcher-source id=\"ch5-video-switcher-source_${1:id}\"",
 *       "\tlabelInnerHTML=\"${2:}\"",
 *       "\talignLabel=\"${3:center}\"",
 *       "\ticonClass=\"${4:}\">",
 *       "</ch5-video-switcher-source>$0"
 *       ]
 *    }
 *  ]
 */
export interface ICh5VideoSwitcherSourceDocumentation extends ICh5VideoSwitcherSourceAttributes {

}