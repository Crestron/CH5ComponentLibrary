// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Observable, fromEvent, merge, pipe } from 'rxjs'
import { debounceTime } from 'rxjs/operators';

// List of window events need to capture while video streaming.
export enum EVideoWindowEvents {
    RESIZE_EVENT = 'resize',
    ORIENTATIONCHANGE_EVENT = 'orientationchange',
    SCROLL_EVENT = 'scroll',
    TOUCH_MOVE_EVENT = 'touchmove',
    TOUCH_END_EVENT = 'touchend'
}

export enum EWindowOrientation {
    PORTRAIT_ORIENTATION = 'portrait',
    LANDSCAPE_ORIENTATION = 'landscape'
}

// Defines the Icons to control the video
export enum ESVGIcons {
    PLAY_ICON = '<svg xmlns="http://www.w3.org/2000/svg" class="svgIconStyle" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',

    STOP_ICON = '<svg xmlns="http://www.w3.org/2000/svg" class="svgIconStyle" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M6 6h12v12H6z"/></svg>',

    EXIT_FULLSCREEN_ICON = '<svg xmlns="http://www.w3.org/2000/svg" class="svgIconStyle" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>',

    FULLSCREEN_ICON = '<svg xmlns="http://www.w3.org/2000/svg" class="svgIconStyle" class="svgIconStyle" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>',

    SCREEN_PLAY_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',

    SCREEN_STOP_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M6 6h12v12H6z"/></svg>'
}

export class Ch5VideoEventHandler {
    public static eventList: Observable<Event>;

    public static attachWindowEvents(): Observable<Event> {
        // Add debounceTime in order to avoid multiple resize problem
        const resizeEvents = fromEvent(window, EVideoWindowEvents.RESIZE_EVENT).pipe(debounceTime(100));
        const orientationchangeEvents = fromEvent(window, EVideoWindowEvents.ORIENTATIONCHANGE_EVENT);
        // Add debounceTime in order to avoid multiple scroll problem
        const scrollEvents = fromEvent(window, EVideoWindowEvents.SCROLL_EVENT).pipe(debounceTime(100));
        const touchMoveEvents = fromEvent(window, EVideoWindowEvents.TOUCH_MOVE_EVENT);
        const touchEndEvents = fromEvent(window, EVideoWindowEvents.TOUCH_END_EVENT);

        Ch5VideoEventHandler.eventList = merge(
            resizeEvents,
            orientationchangeEvents,
            scrollEvents,
            touchMoveEvents,
            touchEndEvents
        );
        return Ch5VideoEventHandler.eventList;
    }

    // when orientationchange event trigger check Window Orientation 
    public static isPortrait() {
        return window.innerHeight > window.innerWidth;
    }

    public static isLandscape() {
        return (window.orientation === 90 || window.orientation === -90);
    }
    
}
