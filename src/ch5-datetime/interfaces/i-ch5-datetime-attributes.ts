import { ICh5AttributesDateTime } from "../../ch5-common/interfaces/i-ch5-common-attributes-datetime";
import { TCh5DateTimeStyleForDate, TCh5DateTimeHorizontalAlignment, TCh5DateTimeDisplayType } from "./t-ch5-datetime";

/**
 * @ignore
 */
export interface ICh5DateTimeAttributes extends ICh5AttributesDateTime {

	/**
	 * @documentation
	 * [
	 * "`display24HourFormat` attribute",
	 * "***",
	 * "The default value is false. Time will be displayed in 24 hour format (applicable for displayType as 'datetime' or 'time')."
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
	 * "The default value is true. Time will display AM/PM (applicable for displayType as 'datetime' or 'time')."
	 * ]
	 * @name displayampm
	 * @default true
	 * @attributeType "Boolean"
	 * @showWhen [{"display24HourFormat":"false"}]
	 */
	displayAmPm: boolean;

	/**
	 * @documentation
	 * [
	 * "`displayTwoDigitsHour` attribute",
	 * "***",
	 * "The default value is false. If set to true, the hours will always display two digits (applicable for displayType as 'datetime' or 'time')."
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
	 * "The default value is false. Seconds will be displayed (applicable for displayType as 'datetime' or 'time')."
	 * ]
	 * @name displayseconds
	 * @default false
	 * @attributeType "Boolean"
	 * @showWhen [{"displayType":['datetime', 'time']}]
	 */
	displaySeconds: boolean;

	/**
	 * @documentation
	 * [
	 * "`styleForDate` attribute",
	 * "***",
	 * "Possible values are MM-dd-yyyy (default) | M-dd-yyyy | M-d-yyyy | MM-dd-yy | M-dd-yy | M-d-yy | dd_MM_yyyy | d_MM_yyyy | d_M_yyyy | dd_MM_yy | d_MM_yy | d_M_yy | d MMM yyyy | MMM d yyyy | d MMMM yyyy | MMMM d yyyy | yyyy-MM-dd | yyyy_MM_dd | MMM d, yyyy | yyyy MM, dd | yyyy MMMM, dd | MMMM d, yyyy,  Style used for the date. M=numerical month 1-12 | MM=numerical month with preceding 0 for months 1 to 9 | MMM=short month string | MMMM=full month string | d=day of month | dd=day of month with preceding 0 for values 1 to 9 | YY=last two digits of year | YYYY=4 digit year | '_'=forward slash character | '-'=dash character."
	 * ]
	 * @name stylefordate
	 * @default MM-dd-yyyy
	 * @attributeType "EnumeratedValue"
	 */
	styleForDate: TCh5DateTimeStyleForDate;

	/**
	 * @documentation
	 * [
	 * "`horizontalAlignment` attribute",
	 * "***",
	 * "Possible values are center(default), left, right. Sets the horizontal alignment of the text."
	 * ]
	 * @name horizontalalignment
	 * @default center
	 * @attributeType "EnumeratedValue"
	 */
	horizontalAlignment: TCh5DateTimeHorizontalAlignment;

	/**
	 * @documentation
	 * [
	 * "`displayType` attribute",
	 * "***",
	 * "Possible values are datetime (default): Date and Time are displayed | date: Date is displayed | time: Time is displayed"
	 * ]
	 * @name displaytype
	 * @default datetime
	 * @attributeType "EnumeratedValue"
	 */
	displayType: TCh5DateTimeDisplayType;

	/**
	 * @documentation
	 * [
	 * "`timeOffsetHours` attribute",
	 * "***",
	 * "Default value: 0 | Min value: -37768 | Max value: 37767 | Offset the date/time in hours. As an example, to direct an offset of 1 hour 30 minutes, provide an analog value of 1.5"
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
	 * "`receiveStateOffsetTime` attribute",
	 * "***",
	 * "You may optionally select an analog join to programmatically change the time offset property during runtime. Values are in units of hundredths of an hour. As an example, to direct an offset of 1 hour 30 minutes, provide an analog value of 150."
	 * ]
	 * @name receivestateoffsettime
	 * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
	 * @attributeType "Join"
	 */
	receiveStateOffsetTime: string;
}
