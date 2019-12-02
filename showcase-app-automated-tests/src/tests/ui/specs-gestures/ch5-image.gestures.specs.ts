// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { PlaygroundPage } from '../page-objects';
import { ImageData } from '../data-providers/ImageData';

describe('Ch5-image.gestures - Test will fail on Mac platform because of a known issue in chromedriver for Mobile Emulation mode - https://bugs.chromium.org/p/chromedriver/issues/detail?id=2144', ()=>{
    it('should be able to send the sendEventOnTouch signal', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(ImageData.HTML_TEMPLATE_SEND_SIGNAL_ON_TOUCH)
            .clickPreviewBtn()
            .checkExistance(ImageData.GENERATED_IMAGE)
            .checkVisibility(ImageData.GENERATED_IMAGE)
            .subscribeBooleanSignal(ImageData.SEND_SIGNAL_ON_TOUCH_ATTRIBUTE_VALUE)
            .touchGeneratedElement(ImageData.GENERATED_IMAGE)
            .checkTouchSignal();                  
        });
    });
