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
   * "Used to set the label displayed for the HTML div component. This attribute takes the preference over the label attribute."
   * ]
   * @name labelinnerhtml
   * @default 
   * @attributeType "EncodedHTML"
   * @hidden true
   */
  labelInnerHTML: string;

}