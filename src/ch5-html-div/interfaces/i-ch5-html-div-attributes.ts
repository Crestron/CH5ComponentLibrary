import { ICh5CommonAttributesHtmlDiv } from "../../ch5-common/interfaces/i-ch5-common-attributes-html-div";


/**
 * @ignore
 */
export interface ICh5HtmlDivAttributes extends ICh5CommonAttributesHtmlDiv {
  /**
   * @documentation
   * [
   * "`label` attribute",
   * "***",
   * "Label for the HTML div component"
   * ]
   * @name label
   * @default 
   * @attributeType "String"
   */
  label: string;

  /**
   * @documentation
   * [
   * "`labelInnerHTML` attribute",
   * "***",
   * "Inner HTML for the label of the HTML div component"
   * ]
   * @name labelinnerhtml
   * @default 
   * @attributeType "String"
   */
  labelInnerHTML: string;

}