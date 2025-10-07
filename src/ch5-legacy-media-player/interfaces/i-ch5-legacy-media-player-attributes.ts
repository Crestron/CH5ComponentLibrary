import { ICh5CommonAttributesLegacyMediaPlayer } from "../../ch5-common/interfaces/i-ch5-common-attributes-legacy-media-player";

/**
 * @ignore
 */
export interface ICh5LegacyMediaPlayerAttributes extends ICh5CommonAttributesLegacyMediaPlayer {
	/**
		* @documentation
		* [
		* "`demoMode` attribute",
		* "***",
		* "This is an internal property specifically for Construct usage. This attribute will show labels / icons against each of the controls etc. The attribute will allow the end users to customize colors and other CSS variables at design time."
		* ]
		* @name demomode
		* @default false
		* @attributeType "Boolean"
		*/
	demoMode: boolean;
	/**
	 * @documentation
	 * [
	 * "`contractName` attribute",
	 * "***",
	 * "Represents the name of the Contract"
	 * ]
	 * @name contractname
	 * @default 
	 * @attributeType "String"
	 */
	contractName: string;
	/**
	 * @documentation
	 * [
	 * "`receiveStateCRPC` attribute",
	 * "***",
	 * "All api responses we get through this signal. Connected to the Media Server Object Router SIMPL module and contains the CRPC data from the SmartGaphics Media Player object going to the selected device. Connected to the Media Server Object Router SIMPL module and contains the CRPC data from the selected device."
	 * ]
	 * @name receivestatecrpc
	 * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
	 * @attributeType "Join"
	 */
	receiveStateCRPC: string;
	/**
	 * @documentation
	 * [
	 * "`sendEventCRPC` attribute",
	 * "***",
	 * "This signal will be used to request all APIs from the Control System. Connected to the Media Server Object Router SIMPL module and contains the CRPC data from the selected device."
	 * ]
	 * @name sendeventcrpc
	 * @join {"direction": "event", "isContractName": true, "stringJoin": 1}
	 * @attributeType "Join"
	 */
	sendEventCRPC: string;
	/**
	 * @documentation
	 * [
	 * "`receiveStateMessage` attribute",
	 * "***",
	 * "Connected to the Media Server Object Router SIMPL module and contains the message data from the SmartGraphics Media Player object going to the selected device. We will receive a message from CS for the tag and src value."
	 * ]
	 * @name receivestatemessage
	 * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
	 * @attributeType "Join"
	 */
	receiveStateMessage: string;
	/**
	 * @documentation
	 * [
	 * "`receiveStateRefreshMediaPlayer` attribute",
	 * "***",
	 * "To refresh the media player. Connected to the Media Server Object Router SIMPL module and triggered when the SmartGraphics Media Player component needs to refresh its data. When CS program restarts this signal will get a high value."
	 * ]
	 * @name receivestaterefreshmediaplayer
	 * @join {"direction": "state", "isContractName": true, "booleanJoin": 1}
	 * @attributeType "Join"
	 */
	receiveStateRefreshMediaPlayer: string;
	/**
	 * @documentation
	 * [
	 * "`receiveStateDeviceOffline` attribute",
	 * "***",
	 * "The value is coming as false. Connected to the Media Server Object Router SIMPL module, and is high when the selected device is offline and low when the selected device is online. When we remove an entry Nax IP from ip table, the signal value comes as high."
	 * ]
	 * @name receivestatedeviceoffline
	 * @join {"direction": "state", "isContractName": true, "booleanJoin": 1}
	 * @attributeType "Join"
	 */
	receiveStateDeviceOffline: string;
	/**
	 * @documentation
	 * [
	 * "`receiveStatePlayerName` attribute",
	 * "***",
	 * "An optional string input used to show the name of the device. Dealers custom-program this string."
	 * ]
	 * @name receivestateplayername
	 * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
	 * @attributeType "Join"
	 */
	receiveStatePlayerName: string;

}