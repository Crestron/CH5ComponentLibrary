// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5ImportHtmlSnippetAttributes } from "./i-ch5-import-htmlsnippet-attributes";
import { ICh5Common } from "../ch5-common";
/**
 * @name Ch5 import-htmlsnippet
 * @isattribute false
 * @tagName ch5-import-htmlsnippet
 * @description Ch5 import-htmlsnippet allows to import the HTML snippet.
 * @documentation
 * [
 *    "`ch5-import-htmlsnippet` element",
 *    "***",
 *    "A component to load HTML snippets during runtime.",
 *    "This component allows the users to load HTML snippets. The snippets should not contain HTML, HEAD, and BODY tags.",
 *    "Users can modularize the HTML files into pages or sections using this component, ",
 *    "and it inserts the snippet into the DOM at the respective location ",
 *    "during runtime.",
 *    "The afterload event occurs when an HTML snippet has been loaded and inserted into the DOM.",
 *    "Afterload is most often used within the ch5-import-htmlsnippet element to execute a script once an HTML ",
 *    "snippet has loaded all content completely (including images, script files, CSS files, an so forth).",
 *    "To import the snippet in Angular, the source directory must be added in the angular.json file as shown below:",
 *    "     \"assets\": [",
 *    "         \"src\/assets\/htmlsnippets\" ",
 *    "     ]"
 * ]
 * @snippets
 * [
 *    {
 *      "prefix": "ch5-import-htmlsnippet:default",
 *      "description": "Crestron import-htmlsnippet (Default)",
 *      "body": [
 *        "<ch5-import-htmlsnippet url=\"\">",
 *         "</ch5-import-htmlsnippet>$0"
 *        ]
 *    },
 *    {
 *      "prefix": "ch5-import-htmlsnippet:All Attributes",
 *      "description": "Crestron import-htmlsnippet (All Attributes)",
 *      "body": [
 *        "<ch5-import-htmlsnippet url=\"\" receivestateshowpulse=\"\" data-ch5-noshow-type=\"\" receivestatehidepulse=\"\" receivestateshow=\"\" sendeventonshow=\"\">",
 *         "</ch5-import-htmlsnippet>$0"
 *        ]
 *    }
 * ]
 * 
 */
export interface ICh5importHtmlSnippet extends ICh5ImportHtmlSnippetAttributes, ICh5Common {
    /**
     * @documentation
     * [
     * "`url` attribute",
     * "***",
     * "The HTML file path."
     * ]
     * @name url
     */
    url: string;

    /**
     * @documentation
     * [
     * "`receiveStateShowPulse` attribute",
     * "***",
     * "On transition from false to true, this signal will reveal the component."
     * ]
     * @name receivestateshowpulse
     */
    receiveStateShowPulse: string;

    /**
     * @documentation
     * [
     * "`receiveStateHidePulse` attribute",
     * "***",
     * "On transition from false to true, the signal will hide the component from view."
     * ]
     * @name receivestatehidepulse
     */
    receiveStateHidePulse: string;

    /**
     * @documentation
     * [
     * "`receiveStateShow` attribute",
     * "***",
     * "The boolean value of the signal determines if the component is visible to the user.",
     * "A true value indicates that the component is visible."
     * ]
     * @name receivestateshow
     */
    receiveStateShow: string;
}
