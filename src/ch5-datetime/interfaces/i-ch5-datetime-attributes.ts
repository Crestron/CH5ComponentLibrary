import { ICh5AttributesCh5Datetime } from "../../ch5-common/interfaces/i-ch5-common-ch5-datetime";


import { TCh5DatetimeStyleForDate, TCh5DatetimeHorizontalAlignment, TCh5DatetimeDisplay, } from './t-ch5-datetime';

/**
	* @ignore
	*/
export interface ICh5DatetimeAttributes extends ICh5AttributesCh5Datetime {
	/**
		* @documentation
		* [
		* "`display24HourFormat` attribute",
		* "***",
		* "Time will be displayed in 24 hour format."
		* ]
		* @name display24hourformat
		* @default false
		* @attributeType "Boolean"
		*/
	display24HourFormat: boolean;
	/**
		* @documentation
		* [
		* "`displayAmPm` attribute",
		* "***",
		* "Time will display AM/PM."
		* ]
		* @name displayampm
		* @default true
		* @attributeType "Boolean"
		*/
	displayAmPm: boolean;
	/**
		* @documentation
		* [
		* "`displayTwoDigitsHour` attribute",
		* "***",
		* "Hours will alway display two digits."
		* ]
		* @name displaytwodigitshour
		* @default false
		* @attributeType "Boolean"
		*/
	displayTwoDigitsHour: boolean;
	/**
		* @documentation
		* [
		* "`displaySeconds` attribute",
		* "***",
		* "Seconds will be displayed."
		* ]
		* @name displayseconds
		* @default false
		* @attributeType "Boolean"
		*/
	displaySeconds: boolean;
	/**
		* @documentation
		* [
		* "`styleForDate` attribute",
		* "***",
		* "Style used for the date. M=numerical month 1-12, MM=numerical month with preceding 0 for months 1 to 9, MMM=short month string, MMMM=full month string, d=day of month, dd=day of month with preceding 0 for values 1 to 9, YY=last two digits of year, YYYY=4 digit year, '_'=forward slash character, '-'=dash character."
		* ]
		* @name stylefordate
		* @default MM-dd-yyyy
		* @attributeType "EnumeratedValue"
		*/
	styleForDate: TCh5DatetimeStyleForDate;
	/**
		* @documentation
		* [
		* "`horizontalAlignment` attribute",
		* "***",
		* "The horizontal alignment of the text."
		* ]
		* @name horizontalalignment
		* @default MM-dd-yyyy
		* @attributeType "EnumeratedValue"
		*/
	horizontalAlignment: TCh5DatetimeHorizontalAlignment;
	/**
		* @documentation
		* [
		* "`display` attribute",
		* "***",
		* "Combination of time and date should be displayed."
		* ]
		* @name display
		* @default MM-dd-yyyy
		* @attributeType "EnumeratedValue"
		*/
	display: TCh5DatetimeDisplay;
	/**
		* @documentation
		* [
		* "`timeOffsetHours` attribute",
		* "***",
		* "Offset the date/time in Hours."
		* ]
		* @name timeoffsethours
		* @default 0
		* @limits [{"min": -37768, "max": 37767}]
		* @attributeType "Integer"
		*/
	timeOffsetHours: number;
	/**
		* @documentation
		* [
		* "`receiveStateTimeOffsetHours` attribute",
		* "***",
		* "You may optionally select an analog join to programmatically change the time offset in hours property during run time. Values are in units of hundredths of hour. As example to direct an offset of 1 hour 30 minutes, provide analog value of 150."
		* ]
		* @name receivestatetimeoffsethours
		* @join {"direction": "state", "isContractName": true, "numericJoin": 1}
		* @attributeType "Join"
		*/
	receiveStateTimeOffsetHours: string;
}