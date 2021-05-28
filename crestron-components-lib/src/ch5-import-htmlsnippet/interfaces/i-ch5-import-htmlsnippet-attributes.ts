// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

/**
 * @name Ch5 import-htmlsnippet
 * @isattribute false
 * @tagName ch5-import-htmlsnippet
 * @description Ch5 import-htmlsnippet allows to import the HTML snippet.
 * @componentVersion 1.0.0
 * @documentation
 * [
 *    "`ch5-import-htmlsnippet` element",
 *    "***",
 *    "The component used to load HTML snippets during run time. ",
 *    "This component allows users to load HTML snippets. The snippets should not contain HTML, HEAD, and BODY tags. ",
 *    "Users can modularize the HTML files into pages or sections using this component, ",
 *    "and the snippet is inserted into the DOM at the respective location ",
 *    "during run time. ",
 *    "An afterload event occurs when a snippet HTML has been loaded and inserted into the DOM. ",
 *    "Afterload is most often used within the ch5-import-htmlsnippet element to execute a script once an HTML ",
 *    "snippet has completely loaded all content (including images, script files, CSS files, etc.). ",
 *    "To import the snippet in Angular, the source directory must be added in angular.json file as follows: ",
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
 *        "<ch5-import-htmlsnippet url=\"\" receivestateshowpulse=\"\" receivestatehidepulse=\"\" receivestateshow=\"\" sendeventonshow=\"\">",
 *         "</ch5-import-htmlsnippet>$0"
 *        ]
 *    }
 * ]
 * 
 */

/**
 * @ignore
 */
export interface ICh5ImportHtmlSnippetAttributes {
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
     * "On transition from false to true, this signal will direct the component to be visible."
     * ]
     * @name receivestateshowpulse
     */
    receiveStateShowPulse: string;

    /**
     * @documentation
     * [
     * "`receiveStateHidePulse` attribute",
     * "***",
     * "On transition from false to true, the signal will direct if the component to no longer be visible."
     * ]
     * @name receivestatehidepulse
     */
    receiveStateHidePulse: string;

    /**
     * @documentation
     * [
     * "`receiveStateShow` attribute",
     * "***",
     * "While true, the boolean value of the signal determines if the component is visible."
     * ]
     * @name receivestateshow
     */
    receiveStateShow: string;
}
