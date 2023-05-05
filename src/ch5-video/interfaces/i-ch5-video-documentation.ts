import { ICh5Common } from "../../_interfaces";
import { ICh5VideoAttributes } from "./i-ch5-video-attributes";

/**
 * @name Ch5 Video
 * @isattribute false
 * @tagName ch5-video
 * @role 
 * @description of the component.
 * @componentVersion 1.0.0
 * @childElements
 * [
 *    
 * ]
 * @documentation
 * [
 *   "`ch5-video` element",
 *   "***",
 *   "Component description"
      // TODO: DEV:CHANGES
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-video:blank",
 *     "description": "Crestron video",
 *     "body": [
 *       "<ch5-video>",
 *       "</ch5-video>$0"
 *     ]
 *   },
 *   {
 *     "prefix": "ch5-video:all-attributes",
 *     "description": "Crestron video (All Attributes)",
 *     "body": [
 *       "<ch5-video id=\"ch5-video_${1:id}\"",
 *       "\tindexId=\"${2:0}\"",
        *       "\taspectRatio=\"${3:16:9}\"",
        *       "\tstretch=\"${4:false}\"",
        *       "\turl=\"${5:}\"",
        *       "\tsourceType=\"${6:Network}\"",
        *       "\tuserId=\"${7:}\"",
        *       "\tpassword=\"${8:}\"",
        *       "\tsnapshotURL=\"${9:}\"",
        *       "\tsnapshotRefreshRate=\"${10:0}\"",
        *       "\tsnapshotUserId=\"${11:}\"",
        *       "\tsnapshotPassword=\"${12:}\"",
        *       "\tsize=\"${13:regular}\"",
        *       "\tzindex=\"${14:0}\"",
        *       "\treceiveStatePlay=\"${15:}\"",
        *       "\treceiveStateSelect=\"${16:}\"",
        *       "\treceiveStateURL=\"${17:}\"",
        *       "\treceiveStateSourceType=\"${18:}\"",
        *       "\treceiveStateUserId=\"${19:}\"",
        *       "\treceiveStatePassword=\"${20:}\"",
        *       "\treceiveStateSnapshotURL=\"${21:}\"",
        *       "\treceiveStateSnapshotRefreshRate=\"${22:}\"",
        *       "\treceiveStateSnapshotUserId=\"${23:}\"",
        *       "\treceiveStateSnapshotPassword=\"${24:}\"",
        *       "\treceiveStateVideoCount=\"${25:}\"",
        *       "\tsendEventOnClick=\"${26:}\"",
        *       "\tsendEventSelectionChange=\"${27:}\"",
        *       "\tsendEventSelectionSourceType=\"${28:}\"",
        *       "\tsendEventSelectionURL=\"${29:}\"",
        *       "\tsendEventSnapshotURL=\"${30:}\"",
        *       "\tsendEventState=\"${31:}\"",
        *       "\tsendEventErrorCode=\"${32:}\"",
        *       "\tsendEventErrorMessage=\"${33:}\"",
        *       "\tsendEventRetryCount=\"${34:}\"",
        *       "\tsendEventResolution=\"${35:}\"",
        *       "\tsendEventSnapshotStatus=\"${36:}\"",
        *       "\tsendEventSnapshotLastUpdateTime=\"${37:}\">",
 *       "</ch5-video>$0"
 *       ]
 *    }
      // TODO: DEV:CHANGES
 *  ]
 */
export interface ICh5VideoDocumentation extends ICh5Common, ICh5VideoAttributes {

}