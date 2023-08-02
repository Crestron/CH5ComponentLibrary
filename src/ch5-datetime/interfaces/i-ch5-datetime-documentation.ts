import { ICh5Common } from "../../_interfaces";
import { ICh5DatetimeAttributes } from "./i-ch5-datetime-attributes";

/**
 * @name Ch5 Datetime
 * @isattribute false
 * @tagName ch5-datetime
 * @role datetime
 * @description of the component.
 * @componentVersion 1.0.0
 * @childElements
 * [
 *    
 * ]
 * @documentation
 * [
 *   "`ch5-datetime` element",
 *   "***",
 *   "An date object is designed to provide options to show date with display, timeOffsetHours, display24HourFormat, displayAmPm, displayTwoDigitsHour, displaySeconds, styleForDate, horizontalAlignment and receiveStateTimeOffsetHours"
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-datetime:blank",
 *     "description": "Crestron datetime",
 *     "body": [
 *       "<ch5-datetime>",
 *       "</ch5-datetime>$0"
 *     ]
 *   },
 *   {
 *     "prefix": "ch5-datetime:all-attributes",
 *     "description": "Crestron datetime (All Attributes)",
 *     "body": [
 *       "<ch5-datetime id=\"ch5-datetime\"",
 *       "\treceiveStateTimeOffset=\"0\"",
 *       "\tdisplay=\"datetime\"",
 *       "\ttimeOffsetHours=\"0\"",
 *       "\tdisplay24HourFormat=\"false\"",
 *       "\tdisplayAmPm=\"true\"",
 *       "\tdisplayTwoDigitsHour=\false\"",
 *       "\tdisplaySeconds=\"false\"",
 *       "\tstyleForDate=\"d_MM_yyyy\"",
 *       "\thorizontalAlignment=\"center\">",
 *       "</ch5-datetime>$0"
 *       ]
 *    },
 * {
 *     "prefix": "ch5-datetime:default",
 *     "description": "Crestron datetime (Default)",
 *     "body": [
 *       "<ch5-datetime id=\"ch5-datetime\"",
 *       "\treceiveStateTimeOffset=\"0\"",
 *       "\tdisplay=\"datetime\"",
 *       "\ttimeOffsetHours=\"0\"",
 *       "\tdisplay24HourFormat=\"false\"",
 *       "\tdisplayAmPm=\"true\"",
 *       "\tdisplayTwoDigitsHour=\"false\"",
 *       "\tdisplaySeconds=\"false\"",
 *       "\tstyleForDate=\"d_MM_yyyy\"",
 *       "\thorizontalAlignment=\"center\">",
 *       "</ch5-datetime>$0"
 *       ]
 *    }
 *  ]
 */
export interface ICh5DatetimeDocumentation extends ICh5Common, ICh5DatetimeAttributes {

}