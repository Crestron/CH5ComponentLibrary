//import { ICh5CommonAttributesLegacyMediaPlayerMyMusic  } from "../../ch5-common/interfaces/i-ch5-common-attributes-legacy-media-player-my-music";


/**
 * @ignore
 */
export interface ICh5LegacyMediaPlayerMyMusicAttributes  {
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
   * "`menuIconReceiveStateSelected` attribute",
   * "***",
   * "Digital join applied when an icon is selected"
   * ]
   * @name menuiconreceivestateselected
   * @default 
   * @attributeType "String"
   */
  menuIconReceiveStateSelected: string;
  /**
   * @documentation
   * [
   * "`menuReceiveStateIconClass` attribute",
   * "***",
   * "Serial join for the menu icon class from the control system"
   * ]
   * @name menureceivestateiconclass
   * @default 
   * @attributeType "String"
   */
  menuReceiveStateIconClass: string;
  /**
   * @documentation
   * [
   * "`menuReceiveStateIconUrl` attribute",
   * "***",
   * "Serial join for the menu icon url from control system"
   * ]
   * @name menureceivestateiconurl
   * @default 
   * @attributeType "String"
   */
  menuReceiveStateIconUrl: string;
  /**
   * @documentation
   * [
   * "`menuIconReceiveStateShow` attribute",
   * "***",
   * "Show or hide icons based on control system signal"
   * ]
   * @name menuiconreceivestateshow
   * @default 
   * @attributeType "String"
   */
  menuIconReceiveStateShow: string;
  /**
   * @documentation
   * [
   * "`menuIconReceiveStateEnable` attribute",
   * "***",
   * "Enable or disable icons based on control system signal"
   * ]
   * @name menuiconreceivestateenable
   * @default 
   * @attributeType "String"
   */
  menuIconReceiveStateEnable: string;
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