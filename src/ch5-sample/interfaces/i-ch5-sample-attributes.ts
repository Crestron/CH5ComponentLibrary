import { ICh5CommonAttributes } from "../../ch5-common/interfaces";
import { TCh5SampleAspectRatio,  }from './t-ch5-sample';

/**
 * @ignore
 */
export interface ICh5SampleAttributes extends ICh5CommonAttributes {
  /**
        * @documentation
        * [
        * "`aspectRatio` attribute",
        * "***",
        * "Sets the ratio of width to height of the video.  Width and height of the component to be controlled by css style classes.  Values are 16:9 (default), 4:3, and custom"
        * ]
        * @name aspectratio
        * @default 16:9
        * @attributeType "EnumeratedValue"
        */
        aspectRatio: TCh5SampleAspectRatio;
        /**
        * @documentation
        * [
        * "`indexId` attribute",
        * "***",
        * "Provides the name of the offset identifier to substituted with 1 based index of the item in list within the signal names provided in the Receive Signal Attributes surrounded by {{ }} delimiters.   See examples."
        * ]
        * @name indexid
        * @default 
        * @attributeType "String"
        */
       indexId: string;
       /**
        * @documentation
        * [
        * "`url` attribute",
        * "***",
        * "Provide the url of the video"
        * ]
        * @name url
        * @default 
        * @attributeType "String"
        */
       url: string;
       /**
        * @documentation
        * [
        * "`userid` attribute",
        * "***",
        * "Provide the userid to access the video url"
        * ]
        * @name userid
        * @default 
        * @attributeType "String"
        */
       userid: string;
       /**
        * @documentation
        * [
        * "`password` attribute",
        * "***",
        * "Provide the password to access the video url"
        * ]
        * @name password
        * @default 
        * @attributeType "String"
        */
       password: string;
       
}