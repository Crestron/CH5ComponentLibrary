import { ICh5CommonMediaPlayer } from "../../ch5-common/interfaces/i-ch5-common-documentation-media-player";
import { ICh5MediaPlayerAttributes } from "./i-ch5-media-player-attributes";

/**
 * @name Ch5 Media Player
 * @isattribute false
 * @tagName ch5-media-player
 * @role media-player
 * @description Media Player provides a standard music playback solution (an audio-only solution). The component is an HTML5 implementation of the VTPro version and is based on CRPC. Media Player should support devices like Autonomic, Sonos, BlueSound, etc. along with the new look and feel for UI component. Media Player should be able to communicate with the NAX hardware..
 * @componentVersion 1.0
 * @childElements
 * [
 *    
 * ]
 * @documentation
 * [
 *   "`ch5-media-player` element",
 *   "***",
 *   "Media Player provides a standard music playback solution (an audio-only solution). The component is an HTML5 implementation of the VTPro version and is based on CRPC. Media Player should support devices like Autonomic, Sonos, BlueSound, etc. along with the new look and feel for UI component. Media Player should be able to communicate with the NAX hardware."
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-media-player:blank",
 *     "description": "Crestron Media Player",
 *     "body": [
 *       "<ch5-media-player>",
 *       "</ch5-media-player>$0"
 *     ]
 *   },
 *   {
 *     "prefix": "ch5-media-player:all-attributes",
 *     "description": "Crestron Media Player (All Attributes)",
 *     "body": [
 *       "<ch5-media-player id=\"ch5-media-player_${1:id}\"",
 *       "\tcontractName=\"${2:}\"",
 *       "\tuseContractForEnable=\"${3:false}\"",
 *       "\tuseContractForShow=\"${4:false}\"",    
 *       "\tuseContractForCustomStyle=\"${5:false}\"",
 *       "\tuseContractForCustomClass=\"${6:false}\"",
 *       "\treceiveStateCRPC=\"${7:}\"",
 *       "\tsendEventCRPC=\"${8:}\"",
 *       "\treceiveStateMessage=\"${9:}\"",
 *       "\treceiveStateRefreshMediaPlayer=\"${10:}\"",
 *       "\treceiveStateDeviceOffline=\"${11:}\"",
 *       "\treceiveStatePlayerName=\"${12:}\">",
 *       "</ch5-media-player>$0"
 *       ]
 *    },
 *    {
 *     "prefix": "ch5-media-player:default",
 *     "description": "Crestron Media Player (default)",
 *     "body": [
 *       "<ch5-media-player id=\"ch5-media-player_${1:id}\"",
 *       "\treceiveStateCRPC=\"${2:}\"",
 *       "\tsendEventCRPC=\"${3:}\"",
 *       "\treceiveStateMessage=\"${4:}\"",
 *       "\treceiveStateRefreshMediaPlayer=\"${5:}\"",
 *       "\treceiveStatePlayerName=\"${6:}\"",
 *       "\treceiveStateDeviceOffline=\"${7:}\">",
 *       "</ch5-media-player>$0"
 *       ]
 *    },
 *    {
 *      "prefix": "ch5-media-player:contract-based",
 *      "description": "Crestron Media Player (contract-based)",
 *      "body": [
 *        "<ch5-media-player id=\"ch5-media-player_${1:id}\"",
 *        "\tcontractName=\"${2:}\">",
 *        "</ch5-media-player>$0"
 *        ]
 *    },
 *    {
 *      "prefix": "ch5-media-player:contract-based-attributes",
 *      "description": "Crestron Media Player (contract-based-attributes)",
 *      "body": [
 *        "<ch5-media-player id=\"ch5-media-player_${1:id}\"",
 *        "\tcontractName=\"${2:}\"",
 *        "\tuseContractForEnable=\"${3:false}\"",
 *        "\tuseContractForShow=\"${4:false}\"",
 *        "\tuseContractForCustomStyle=\"${5:false}\"",
 *        "\tuseContractForCustomClass=\"${6:false}\">",
 *        "</ch5-media-player>$0"
 *        ]
 *    }
 *  ]
 */
export interface ICh5MediaPlayerDocumentation extends ICh5CommonMediaPlayer, ICh5MediaPlayerAttributes {

}