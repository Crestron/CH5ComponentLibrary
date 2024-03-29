// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5ImportHtmlSnippetAttributes } from ".";
import { ICh5Common } from "../../ch5-common/interfaces";

/**
 * @name Ch5 Import Html Snippet
 * @isattribute false
 * @tagName ch5-import-htmlsnippet
 * @role template
 * @description Ch5 import-htmlsnippet allows to import the HTML snippet.
 * @componentVersion 1.0.0
 * @documentation
 * [
 *    "`ch5-import-htmlsnippet` element",
 *    "***",
 *    "The component is used to load HTML snippets during run time. ",
 *    "This component allows users to load HTML snippets. The snippets should not contain HTML, HEAD, and BODY tags. ",
 *    "Users can modularize the HTML files into pages or sections using this component, ",
 *    "and the snippet is inserted into the DOM at the respective location ",
 *    "during run time. ",
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
export interface ICh5ImportHtmlSnippetDocumentation extends ICh5Common, ICh5ImportHtmlSnippetAttributes {
}