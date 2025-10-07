import { ICh5CommonLegacyMediaPlayer } from "../../ch5-common/interfaces/i-ch5-common-documentation-legacy-media-player";
import { ICh5LegacyMediaPlayerAttributes } from "./i-ch5-legacy-media-player-attributes";

/**
 * @name Ch5 Legacy Media Player
 * @isattribute false
 * @tagName ch5-legacy-media-player
 * @role media-player
 * @description Legacy Media Player provides a standard music playback solution (an audio-only solution). The component is an HTML5 implementation of the legacy VTPro version and is based on CRPC.  Legacy Media Player should support legacy devices like Autonomic, Sonos, BlueSound, etc. along with the new look and feel for UI component. Legacy Media Player should be able to communicate with the NAX hardware..
 * @componentVersion 1.0
 * @childElements
 * [
 *    
 * ]
 * @documentation
 * [
 *   "`ch5-legacy-media-player` element",
 *   "***",
 *   "Legacy Media Player provides a standard music playback solution (an audio-only solution). The component is an HTML5 implementation of the legacy VTPro version and is based on CRPC.  Legacy Media Player should support legacy devices like Autonomic, Sonos, BlueSound, etc. along with the new look and feel for UI component. Legacy Media Player should be able to communicate with the NAX hardware."
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-legacy-media-player:blank",
 *     "description": "Crestron legacy media player",
 *     "body": [
 *       "<ch5-legacy-media-player>",
 *       "</ch5-legacy-media-player>$0"
 *     ]
 *   },
 *   {
 *     "prefix": "ch5-legacy-media-player:all-attributes",
 *     "description": "Crestron legacy media player (All Attributes)",
 *     "body": [
 *       "<ch5-legacy-media-player id=\"ch5-legacy-media-player_${1:id}\"",
 *       "\tcontractName=\"${2:}\"",
 *       "\treceiveStateCRPC=\"${3:}\"",
 *       "\tsendEventCRPC=\"${4:}\"",
 *       "\treceiveStateMessage=\"${5:}\"",
 *       "\treceiveStateRefreshMediaPlayer=\"${6:}\"",
 *       "\treceiveStateDeviceOffline=\"${7:}\"",
 *       "\treceiveStatePlayerName=\"${8:}\">",
 *       "</ch5-legacy-media-player>$0"
 *       ]
 *    },
 *    {
 *     "prefix": "ch5-legacy-media-player:default",
 *     "description": "Crestron legacy media player (default)",
 *     "body": [
 *       "<ch5-legacy-media-player id=\"ch5-legacy-media-player_${1:id}\"",
 *       "\treceiveStateCRPC=\"${2:}\"",
 *       "\tsendEventCRPC=\"${3:}\"",
 *       "\treceiveStateMessage=\"${4:}\"",
 *       "\treceiveStateRefreshMediaPlayer=\"${5:}\"",
 *       "\treceiveStatePlayerName=\"${6:}\"",
 *       "\treceiveStateDeviceOffline=\"${7:}\">",
 *       "</ch5-legacy-media-player>$0"
 *       ]
 *    }
 *  ]
 */
export interface ICh5LegacyMediaPlayerDocumentation extends ICh5CommonLegacyMediaPlayer, ICh5LegacyMediaPlayerAttributes {

}