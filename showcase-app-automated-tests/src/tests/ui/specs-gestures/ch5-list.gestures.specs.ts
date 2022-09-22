// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { PlaygroundPage } from '../page-objects';
import { ListData } from '../data-providers/ListData';

describe('Ch5-list.gestures - Test will fail on Mac platform because of a known issue in chromedriver for Mobile Emulation mode - https://bugs.chromium.org/p/chromedriver/issues/detail?id=2144', ()=>{
    it('should have the pagedSwipe attribute', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(ListData.HTML_TEMPLATE_LIST_PAGEDSWIPE)
            .clickPreviewBtn()
            .checkExistance(ListData.GENERATED_LIST)
            .checkVisibility(ListData.GENERATED_LIST)
            .checkAttribute(ListData.GENERATED_LIST, ListData.PAGEDSWIPE_ATTRIBUTE, ListData.PAGEDSWIPE_ATTRIBUTE_VALUE)
            .getElementPostition(ListData.ITEM_TO_SWIPE)
            .swipeElementUp(ListData.ITEM_TO_SWIPE)
            .checkElementPosition(ListData.ITEM_TO_SWIPE);                   
        });
    });
