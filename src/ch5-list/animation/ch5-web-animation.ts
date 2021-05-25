// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import _ from 'lodash';
import { Ch5Animation, TAnimationCallback } from "./ch5-animation";
import { TCh5ListElementOrientation } from '../interfaces/t-ch5-list';
import { Ch5List } from "../ch5-list";

type Animation = {};

type TAnimateFn = (keyframes: any, opts: any) => HTMLAnimatedElement;

type HTMLAnimatedElement = {
    animate: TAnimateFn
    onfinish: () => void
} & HTMLElement;

export class Ch5WebAnimation extends Ch5Animation {

    private _animation: Animation = {} as Animation;

    public animate(
        element: HTMLElement, 
        currentPosition: number, 
        mode: TCh5ListElementOrientation, 
        previousPosition?: number,
        callback?: TAnimationCallback,
        ) {

        let keyframes = [
            { transform: `translate3d(0, ${previousPosition}px, 0)` },
            { transform: `translate3d(0, ${currentPosition}px, 0)` }
        ];
        
        if (mode === Ch5List.ORIENTATION[1]) {
            keyframes = [
                { transform: `translate3d(${previousPosition}px, 0, 0)` },
                { transform: `translate3d(${currentPosition}px, 0, 0)` }
            ]
        }

        const animation = (element as HTMLAnimatedElement).animate(keyframes, {
            duration: this.duration,
            fill: 'forwards',
            easing: this.easeMode
        });

        if (!_.isNil(callback)) {
            animation.onfinish = () => {
                this.resetAnimation();
                callback();
            };
        }

        this._animation = animation;
    }

    public resetAnimation() {
        this._animation = {} as Animation;
    }
}
