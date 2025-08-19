import { ICh5CommonAttributesLegacyMediaPlayer  } from "../../ch5-common/interfaces/i-ch5-common-attributes-legacy-media-player";


/**
 * @ignore
 */
export interface ICh5LegacyMediaPlayerAttributes extends ICh5CommonAttributesLegacyMediaPlayer  {
  /**
            * @documentation
            * [
            * "`demoMode` attribute",
            * "***",
            * "This is an internal property specifically for Construct usage. This attribute will not be exposed in Showcase. This attribute will show labels / icons against each of the controls etc. The expectation of the attribute is to allow the end users to customize colors and other CSS variables for each theme."
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
            * "`sendEventMessage` attribute",
            * "***",
            * "Connected to the Media Server Object Router SIMPL module and contains any direct-connect data from the selected device. This Signal is not used in Ara’s sample project. Need to check with Ara whether it's required or not."
            * ]
            * @name sendeventmessage
            * @join {"direction": "event", "isContractName": true, "stringJoin": 1}
            * @attributeType "Join"
            */
           sendEventMessage: string;
           /**
            * @documentation
            * [
            * "`receiveStateRefreshMediaPlayer` attribute",
            * "***",
            * "To refresh the media player. Connected to the Media Server Object Router SIMPL module and triggered when the SmartGraphics Media Player component needs to refresh its data. To refresh the player, what steps will be required?"
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
            * "The value is coming as false. Connected to the Media Server Object Router SIMPL module, and is high when the selected device is offline and low when the selected device is online. We need to check when it will come true. "
            * ]
            * @name receivestatedeviceoffline
            * @join {"direction": "state", "isContractName": true, "booleanJoin": 1}
            * @attributeType "Join"
            */
           receiveStateDeviceOffline: string;
           /**
            * @documentation
            * [
            * "`receiveStateUseMessage` attribute",
            * "***",
            * "The value is coming true. Connected to the Media Server Object Router SIMPL module, and is high when the selected device supports the “Message_FB” serial input on the GUI extender. We need to understand its usage."
            * ]
            * @name receivestateusemessage
            * @join {"direction": "state", "isContractName": true, "booleanJoin": 1}
            * @attributeType "Join"
            */
           receiveStateUseMessage: string;
           /**
            * @documentation
            * [
            * "`receiveStateControlSystemOffline` attribute",
            * "***",
            * "The value is coming as false. If the control system is offline, we don’t receive any value, we need to check with Ara. "
            * ]
            * @name receivestatecontrolsystemoffline
            * @join {"direction": "state", "isContractName": true, "booleanJoin": 1}
            * @attributeType "Join"
            */
           receiveStateControlSystemOffline: string;
           /**
            * @documentation
            * [
            * "`sendEventPlayerName` attribute",
            * "***",
            * "An optional string input used to show the name of the device. Dealers custom-program this string."
            * ]
            * @name sendeventplayername
            * @join {"direction": "event", "isContractName": true, "stringJoin": 1}
            * @attributeType "Join"
            */
           sendEventPlayerName: string;
           
}