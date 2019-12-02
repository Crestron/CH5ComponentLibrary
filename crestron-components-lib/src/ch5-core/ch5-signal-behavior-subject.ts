// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { BehaviorSubject } from 'rxjs';
import { Ch5TranslationUtility } from './ch5-translation-utility';
import { TSignal } from './types/signal.type';


/**
 * Extends the rxjs BehaviorSubject to allow storing the previous value ( besides the current one )
 */
export class Ch5SignalBehaviorSubject<T extends TSignal> extends BehaviorSubject<T> {
    private _prevValue:T;

    public constructor(value:T, prevValue: T) {
        super(value);
        this._prevValue = prevValue;
    }

    public get prevValue(): T {
        return this.getPrevValue();
    }

    private getPrevValue(): T {
        return this._prevValue;
    }

    public next(value: T): void {
        this._prevValue = this.value;

        if ( typeof value === 'string') {

            let newValue: T = value;

            if (Ch5TranslationUtility.getInstance().isTranslationIdentifier(value)) {
                newValue = Ch5TranslationUtility.getInstance().translatedValue(value) as T;
            }

            super.next( newValue );
        }
        else {
            super.next( value );
        }
    }
}
