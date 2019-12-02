// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.


/**
 * template is a string that can contain placeholders defined by {n} where n is the 1 based index of the parameter passed to the function after the template.
 * The {n} placeholders can appear multiple times in the template and they do not need to follow a specific order.
 *
 * Examples:
 *
 * textformat('the third param: {3}, the first param: {1}, the second param: {2}, the first param again {1}', 'p1',2,'param3')
 * will return the string:
 * 'the third param: param3, the first param: p1, the second param: 2, the first param again p1'
 */
export function textformat(template: string, ...templateParams: any[]): string {
    let processedTemplate = template;

    for (let i = 0, len = templateParams.length; i < len; i++) {
        processedTemplate = processedTemplate.replace(new RegExp('\\{' + (+i + 1) + '\\}', 'g'), templateParams[i]);
    }

    return processedTemplate;
}
