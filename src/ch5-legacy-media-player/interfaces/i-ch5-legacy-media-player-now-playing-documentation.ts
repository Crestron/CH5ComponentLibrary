import { ICh5CommonLegacyMediaPlayerNowPlaying } from "../../ch5-common/interfaces/i-ch5-common-documentation-legacy-media-player-now-playing";
import { ICh5LegacyMediaPlayerNowPlayingAttributes } from "./i-ch5-legacy-media-player-now-playing-attributes";

/**
 * @name Ch5 Legacy Media Player Now Playing
 * @isattribute false
 * @tagName ch5-legacy-media-player-now-playing
 * @role legacy-media-player-now-playing
 * @description The Now Playing component displays information on the currently playing track in the selected zone for the current user profile. .
 * @componentVersion 1.0
 * @childElements
 * [
 *    
 * ]
 * @documentation
 * [
 *   "`ch5-legacy-media-player-now-playing` element",
 *   "***",
 *   "The Now Playing component displays information on the currently playing track in the selected zone for the current user profile. "
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-legacy-media-player-now-playing:blank",
 *     "description": "Crestron legacy media player now playing",
 *     "body": [
 *       "<ch5-legacy-media-player-now-playing>",
 *       "</ch5-legacy-media-player-now-playing>$0"
 *     ]
 *   },
 *   {
 *     "prefix": "ch5-legacy-media-player-now-playing:all-attributes",
 *     "description": "Crestron legacy media player now playing (All Attributes)",
 *     "body": [
 *       "<ch5-legacy-media-player-now-playing id=\"ch5-legacy-media-player-now-playing_${1:id}\"",
 *       "\treceiveStateSelectedProfile=\"${2:}\"",
 *       "\tmenuIconSendEventOnClick=\"${3:}\">",
 *       "</ch5-legacy-media-player-now-playing>$0"
 *       ]
 *    },
 *    {
 *     "prefix": "ch5-legacy-media-player-now-playing:default",
 *     "description": "Crestron legacy media player now playing (default)",
 *     "body": [
 *       "<ch5-legacy-media-player-now-playing id=\"ch5-legacy-media-player-now-playing_${1:id}\">",
 *       "</ch5-legacy-media-player-now-playing>$0"
 *       ]
 *    }
 *  ]
 */
export interface ICh5LegacyMediaPlayerNowPlayingDocumentation extends ICh5CommonLegacyMediaPlayerNowPlaying, ICh5LegacyMediaPlayerNowPlayingAttributes {

}