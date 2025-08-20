//import { ICh5CommonAttributesLegacyMediaPlayerNowPlaying  } from "../../ch5-common/interfaces/i-ch5-common-attributes-legacy-media-player-now-playing";


/**
 * @ignore
 */
export interface ICh5LegacyMediaPlayerNowPlayingAttributes {
  /**
            * @documentation
            * [
            * "`receiveStateSelectedProfile` attribute",
            * "***",
            * "Currently selected user profile to use with the player"
            * ]
            * @name receivestateselectedprofile
            * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
            * @attributeType "Join"
            */
           receiveStateSelectedProfile: string;
           /**
            * @documentation
            * [
            * "`menuIconSendEventOnClick` attribute",
            * "***",
            * "Send an event on tap or click"
            * ]
            * @name menuiconsendeventonclick
            * @default 
            * @attributeType "String"
            */
           menuIconSendEventOnClick: string;
           
}