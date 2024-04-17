import { ICh5CommonVideoSwitcher } from "../../ch5-common/interfaces/i-ch5-common-documentation-video-switcher";
import { ICh5VideoSwitcherAttributes } from "./i-ch5-video-switcher-attributes";

/**
 * @name Ch5 Video Switcher
 * @isattribute false
 * @tagName ch5-video-switcher
 * @role video-switcher
 * @description Ch5 Video Switcher offers a wide range of functionality out-of-the-box.
 * @componentVersion 2.9.0
 * @childElements
 * [
 *    {
 *      "tagName": "ch5-video-switcher-source",
 *      "optional": true,
 *      "childElements": [
 *        {
 *          "tagName": "ch5-video-switcher-source-label",
 *          "optional": true,
 *          "childElements": [
 *            {
 *              "tagName": "template",
 *              "optional": false,
 *              "childElements": []
 *            }
 *          ]
 *        }
 *      ]
 *    },
 *    {
 *      "tagName": "ch5-video-switcher-screen",
 *      "optional": true,
 *      "childElements": [
 *        {
 *          "tagName": "ch5-video-switcher-screen-label",
 *          "optional": true,
 *          "childElements": [
 *            {
 *              "tagName": "template",
 *              "optional": false,
 *              "childElements": []
 *            }
 *          ]
 *        }
 *      ]
 *    }
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
 *       "\tsourceIconUrl=\"${13:}\"",
 *       "\tsendEventOnDrop=\"${14:}\"",
 *       "\tsendEventOnChange=\"${15:}\"",
 *       "\treceiveStateSourceChanged=\"${16:}\"",
 *       "\treceiveStateSourceLabel=\"${17:}\"",
 *       "\treceiveStateScriptSourceLabelHtml=\"${18:}\"",
 *       "\treceiveStateScreenLabel=\"${19:}\"",
 *       "\treceiveStateScriptScreenLabelHtml=\"${20:}\"",
 *       "\treceiveStateNumberOfScreens=\"${21:}\"",
 *       "\tcontractName=\"${22:}\"",
 *       "\tuseContractForEnable=\"${23:false}\"",
 *       "\tuseContractForShow=\"${24:false}\"",
 *       "\tcontractSourceLabelType=\"${25:none}\"",
 *       "\tcontractScreenLabelType=\"${26:none}\">",
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
 *       "\tsourceIconClass=\"${12:fa-solid fa-video}\"",
 *       "\tsourceIconUrl=\"${13:}\">",
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