// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import _ from 'lodash';
import { Ch5Animation } from './ch5-animation';
import { Ch5StandardAnimation } from './ch5-standard-animation';

export class Ch5AnimationFactory {

    public getAnimation(duration: number, easeMode: string, wrapper: HTMLElement) {

        let animationInstance: Ch5Animation;
        animationInstance = new Ch5StandardAnimation(duration, easeMode, wrapper);
        
        return animationInstance;
    }

}
