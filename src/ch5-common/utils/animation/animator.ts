// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import * as Easings from '../math/easings';
import { GetViewportDetails } from '../viewport';
import { AddTick } from '../tick';
import { USER_SCROLL_EVENTS } from './user-scroll-events';

const win = window;
const body = document.body;


export interface IScrollableArea {
    class: ScrollableArea;
    element: HTMLElement | Window;
}

export interface IScrollableAreaOptions {
    offset?: Position;
    duration?: DurationRange | number;
    easing?: Easing;
    cancelOnUserScroll?: boolean;
    animate?: boolean;
    autoDurationMultiplier?: number;
}

export interface IOptions extends IScrollableAreaOptions {
    scrollContainer?: HTMLElement | Window;
}

export interface IMergedOptions {
    offset: Position;
    duration: DurationRange | number;
    easing: Easing;
    cancelOnUserScroll: boolean;
    animate: boolean;
    autoDurationMultiplier: number;
}

export type Position = [number, number];
export type DurationRange = [number, number];

export enum Easing {
    easeInQuad = 'easeInQuad',
    easeOutQuad = 'easeOutQuad',
    easeInOutQuad = 'easeInOutQuad',
    easeInCubic = 'easeInCubic',
    easeOutCubic = 'easeOutCubic',
    easeInOutCubic = 'easeInOutCubic',
    easeInQuart = 'easeInQuart',
    easeOutQuart = 'easeOutQuart',
    easeInOutQuart = 'easeInOutQuart',
    easeInQuint = 'easeInQuint',
    easeOutQuint = 'easeOutQuint',
    easeInOutQuint = 'easeInOutQuint',
    easeInSine = 'easeInSine',
    easeOutSine = 'easeOutSine',
    easeInOutSine = 'easeInOutSine',
    easeInExpo = 'easeInExpo',
    easeOutExpo = 'easeOutExpo',
    easeInOutExpo = 'easeInOutExpo',
    easeInCirc = 'easeInCirc',
    easeOutCirc = 'easeOutCirc',
    easeInOutCirc = 'easeInOutCirc',
    easeInElastic = 'easeInElastic',
    easeOutElastic = 'easeOutElastic',
    easeInOutElastic = 'easeInOutElastic',
    easeInBack = 'easeInBack',
    easeOutBack = 'easeOutBack',
    easeInOutBack = 'easeInOutBack',
    easeInBounce = 'easeInBounce',
    easeOutBounce = 'easeOutBounce',
    easeInOutBounce = 'easeInOutBounce',
}

const defaultOptions: IScrollableAreaOptions = {
    offset: [0, 0],
    duration: [200, 5000],
    easing: Easing.easeInOutQuart,
    cancelOnUserScroll: true,
    animate: true,
    autoDurationMultiplier: 2,
};

export class ScrollableArea {
    private ticking: boolean = false;
    private _scrolling: boolean = false;
    private scrollFrom: Position | null  = null;
    private scrollTo: Position | null = null;
    private duration: number = 0;
    private timestamp: number = 0;
    private scrollX: number = 0;
    private scrollY: number = 0;
    // eslint-disable-next-line @typescript-eslint/ban-types
    private easing: Function | null  = null;
    // eslint-disable-next-line @typescript-eslint/ban-types
    private resolve: Function | null  = null;

    constructor(private scrollContainer: HTMLElement | Window) { }

    public ScrollToTarget(target: Position | HTMLElement, options?: IScrollableAreaOptions): Promise<void> {
        if (!Array.isArray(target)) {
            target = [target.offsetLeft, target.offsetTop];
        }

        const { offset, easing, animate, duration, cancelOnUserScroll, autoDurationMultiplier } = Object.assign(
            defaultOptions,
            options
        ) as IMergedOptions;

        this.setScrollPosition();

        this.easing = Easings[easing];

        this.scrollFrom = [this.scrollX, this.scrollY];
        this.scrollTo = [target[0] + offset[0], target[1] + offset[1]];

        return new Promise(resolve => {
            if (this.scrollFrom === this.scrollTo) {
                resolve();
            } else {
                if (animate) {
                    if (!this.ticking) {
                        this.ticking = true;
                        AddTick(this.tick.bind(this));
                    }

                    let scrollHeight;
                    let scrollWidth;

                    if (this.scrollContainer instanceof Window) {
                        const viewport = GetViewportDetails();
                        scrollWidth = body.offsetWidth - viewport.width;
                        scrollHeight = body.offsetHeight - viewport.heightCollapsedControls;
                    } else {
                        scrollWidth = this.scrollContainer.scrollWidth;
                        scrollHeight = this.scrollContainer.scrollHeight;
                    }

                    this.scrollTo![0] = Math.max(Math.min(this.scrollTo![0], scrollWidth), 0);
                    this.scrollTo![1] = Math.max(Math.min(this.scrollTo![1], scrollHeight), 0);

                    const distanceX = Math.abs(this.scrollFrom![0] - this.scrollTo![0]);
                    const distanceY = Math.abs(this.scrollFrom![1] - this.scrollTo![1]);
                    const autoDuration = Math.max(distanceX, distanceY) * autoDurationMultiplier;

                    if (Array.isArray(duration)) {
                        this.duration = Math.round(Math.min(Math.max(Math.round(autoDuration), duration[0]), duration[1]));
                    } else {
                        this.duration = duration;
                    }

                    this.timestamp = Date.now();

                    this.resolve = resolve;

                    this.scrolling = true;

                    if (cancelOnUserScroll) {
                        this.addEventListeners();
                    }
                } else {
                    (this.scrollContainer.scrollTo! as any)(...this.scrollTo!);

                    resolve();
                }
            }
        });
    }

    private get scrolling(): boolean {
        return this._scrolling;
    }

    private set scrolling(scrolling: boolean) {
        this._scrolling = scrolling;
        (win as any).autoScrolling = scrolling;
    }

    private setScrollPosition(): void {
        if (this.scrollContainer instanceof Window) {
            this.scrollX = win.pageXOffset;
            this.scrollY = win.pageYOffset;
        } else {
            this.scrollX = (this.scrollContainer as HTMLElement).scrollLeft;
            this.scrollY = (this.scrollContainer as HTMLElement).scrollTop;
        }
    }

    private addEventListeners(): void {
        USER_SCROLL_EVENTS.forEach(event => {
            this.scrollContainer.addEventListener(event, this.cancelScroll.bind(this));
        });
    }

    private removeEventListeners(): void {
        USER_SCROLL_EVENTS.forEach(event => {
            this.scrollContainer.removeEventListener(event, this.cancelScroll.bind(this));
        });
    }

    private cancelScroll(): void {
        this.scrolling = false;
        this.removeEventListeners();
    }

    private tick(): void {
        this.setScrollPosition();

        if (this.scrolling) {
            this.scroll();
        }
    }

    private scroll(): void {
        const elapsed = Date.now() - this.timestamp;

        let x;
        let y;

        if (elapsed < this.duration) {
            x = this.calculateNextPosition(0, elapsed);
            y = this.calculateNextPosition(1, elapsed);
        } else {
            this.scrolling = false;

            x = this.scrollTo![0];
            y = this.scrollTo![1];

            this.removeEventListeners();

            this.resolve!();
        }

        if (this.scrollContainer instanceof Window) {
            this.scrollContainer.scrollTo(x, y);
        } else {
            this.scrollContainer.scrollLeft = x;
            this.scrollContainer.scrollTop = y;
        }
    }

    private calculateNextPosition(index: number, elapsed: number): number {
        const from = this.scrollFrom![index];
        const to = this.scrollTo![index];

        if (from > to) {
            return from - this.easing!(elapsed, 0, from - to, this.duration);
        } else {
            return from + this.easing!(elapsed, 0, to - from, this.duration);
        }
    }
}

const scrollableAreas: IScrollableArea[] = [];

export function ScrollTo(target: Position | HTMLElement, options?: IOptions): Promise<void> {
    return new Promise(resolve => {
        const scrollContainer = options ? options.scrollContainer || window : window;

        let scrollableArea = scrollableAreas.find(a => a.element === scrollContainer);

        if (!scrollableArea) {
            scrollableArea = {
                element: scrollContainer,
                class: new ScrollableArea(scrollContainer),
            } as IScrollableArea;

            scrollableAreas.push(scrollableArea);
        }

        scrollableArea.class.ScrollToTarget(target, options).then(resolve);
    });
}