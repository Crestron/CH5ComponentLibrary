// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5Animation } from "./ch5-animation";
import _ from 'lodash';
import { TCh5ListElementOrientation } from '../interfaces/t-ch5-list';
import { Ch5List } from "../ch5-list";

export class Ch5StandardAnimation extends Ch5Animation {
    
    protected animationTimeWatcher: number = 0;    

    constructor(duration: number, easeMode: string, wrapper: HTMLElement) {
        super(duration, easeMode, wrapper);
    }

    public animate(
        element: HTMLElement,
        currentPosition: number, 
        mode: TCh5ListElementOrientation, 
    ) {
        this.handleTransition(element);

        if (mode === Ch5List.ORIENTATION[1]) {
            element.style.transform = `translate3d(${currentPosition}px, 0, 0)`;
        } else {
            element.style.transform = `translate3d(0, ${currentPosition}px, 0)`;
        }
    }

    protected handleTransition(element: HTMLElement) {

        if (_.isEmpty(element.style.transition) || _.isNil(element.style.transition)) {
            element.style.transition = `transform ${this.duration}ms ${this.easeMode}`
        }

        if (element.style.transitionDuration === '0ms' || _.isEmpty(element.style.transitionDuration)) {
            element.style.transitionDuration = `${this.duration}ms`;
        } else if (parseFloat(element.style.transitionDuration as string) !== this.duration) {
            element.style.transitionDuration = `${this.duration}ms`;
        }

        clearTimeout(this.animationTimeWatcher);

        this.animationTimeWatcher = window.setTimeout(() => {
            element.style.transitionDuration = '0ms';
        }, this.duration)
        
    }
}
