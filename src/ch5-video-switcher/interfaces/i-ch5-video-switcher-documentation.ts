import { ICh5CommonVideoSwitcher } from "../../ch5-common/interfaces/i-ch5-common-documentation-video-switcher";
import { ICh5VideoSwitcherAttributes } from "./i-ch5-video-switcher-attributes";

/**
 * @name Ch5 Video Switcher
 * @isattribute false
 * @tagName ch5-video-switcher
 * @role video-switcher
 * @description The Video Switcher widget combines a scrolling list with a drag and drop functionality geared towards controlling video sources in a switcher matrix.
 * @componentVersion 2.9.0
 * @childElements
 * [
 *    
 * ]
 * @documentation
 * [
 *   "`ch5-video-switcher` element",
 *   "***",
 *   "The Video Switcher widget combines a scrolling list with a drag and drop functionality geared towards controlling video sources in a switcher matrix."
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-video-switcher:blank",
 *     "description": "Crestron video switcher",
 *     "body": [
 *       "<ch5-video-switcher>",
 *       "</ch5-video-switcher>$0"
 *     ]
 *   },
 *   {
 *     "prefix": "ch5-video-switcher:all-attributes",
 *     "description": "Crestron video switcher (All Attributes)",
 *     "body": [
 *       "<ch5-video-switcher id=\"ch5-video-switcher_${1:id}\"",
 *       "\tsourceListPosition=\"${2:top}\"",
 *       "\tendless=\"${3:false}\"",
 *       "\tnumberOfSourceListDivisions=\"${4:1}\"",
 *       "\tscrollbar=\"${5:false}\"",
 *       "\tnumberOfSources=\"${6:5}\"",
 *       "\tnumberOfScreenColumns=\"${7:0}\"",
 *       "\tindexId=\"${8:}\"",
 *       "\tdisplayScreenLabel=\"${9:true}\"",
 *       "\tscreenAspectRatio=\"${10:stretch}\"",
 *       "\tnumberOfScreens=\"${11:2}\"",
 *       "\tsourceIconClass=\"${12:fa-solid fa-video}\"",
 *       "\tsendEventOnDrop=\"${13:}\"",
 *       "\tsendEventOnChange=\"${14:}\"",
 *       "\treceiveStateSourceChanged=\"${15:}\"",
 *       "\treceiveStateSourceLabel=\"${16:}\"",
 *       "\treceiveStateScriptSourceLabelHtml=\"${17:}\"",
 *       "\treceiveStateScreenLabel=\"${18:}\"",
 *       "\treceiveStateScriptScreenLabelHtml=\"${19:}\"",
 *       "\treceiveStateNumberOfScreens=\"${20:}\"",
 *       "\tcontractName=\"${21:}\"",
 *       "\tuseContractForEnable=\"${22:false}\"",
 *       "\tuseContractForShow=\"${23:false}\"",
 *       "\tcontractSourceLabelType=\"${24:none}\"",
 *       "\tcontractScreenLabelType=\"${25:none}\">",
 *       "</ch5-video-switcher>$0"
 *       ]
 *    },
 *    {
 *     "prefix": "ch5-video-switcher:default",
 *     "description": "Crestron video switcher (default)",
 *     "body": [
 *       "<ch5-video-switcher id=\"ch5-video-switcher_${1:id}\"",
 *       "\tsourceListPosition=\"${2:top}\"",
 *       "\tendless=\"${3:false}\"",
 *       "\tnumberOfSourceListDivisions=\"${4:1}\"",
 *       "\tscrollbar=\"${5:false}\"",
 *       "\tnumberOfSources=\"${6:5}\"",
 *       "\tnumberOfScreenColumns=\"${7:0}\"",
 *       "\tindexId=\"${8:}\"",
 *       "\tdisplayScreenLabel=\"${9:true}\"",
 *       "\tscreenAspectRatio=\"${10:stretch}\"",
 *       "\tnumberOfScreens=\"${11:2}\"",
 *       "\tsourceIconClass=\"${12:fa-solid fa-video}\">",
 *       "\tcontractName=\"${21:}\">",
 *       "</ch5-video-switcher>$0"
 *       ]
 *    },
 *    {
 *      "prefix": "ch5-video-switcher:contractbased",
 *      "description": "Crestron video switcher(contractbased)",
 *      "body": [
 *        "<ch5-video-switcher id=\"ch5-video-switcher_${1:id}\"",
 *        "\tcontractName=\"${2:}\">",
 *        "</ch5-video-switcher>$0"
 *        ]
 *    },
 *    {
 *      "prefix": "ch5-video-switcher:contractbased-attributes",
 *      "description": "Crestron video switcher(contractbased-attributes)",
 *      "body": [
 *        "<ch5-video-switcher id=\"ch5-video-switcher_${1:id}\"",
 *        "\tcontractName=\"${2:}\"",
 *        "\tuseContractForEnable=\"${3:false}\"",
 *        "\tuseContractForShow=\"${4:false}\"",
 *        "\tcontractSourceLabelType=\"${5:none}\"",
 *        "\tcontractScreenLabelType=\"${6:none}\">",
 *        "</ch5-video-switcher>$0"
 *        ]
 *    }
 *  ]
 */
export interface ICh5VideoSwitcherDocumentation extends ICh5CommonVideoSwitcher, ICh5VideoSwitcherAttributes {

}