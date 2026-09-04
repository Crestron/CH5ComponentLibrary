// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { expect } from 'chai';
import 'jsdom-global/register';
import { describe } from 'mocha';
import { Ch5SignalFactory } from '../ch5-core/ch5-signal-factory';
import { Ch5Button } from './ch5-button';

describe('Ch5Button', () => {

    let cb: any = document.createElement('ch5-button');

    before(() => {
        Ch5Button.registerCustomElement();
    });

    beforeEach(() => {
        cb = document.createElement('ch5-button') as any;
        document.body.innerHTML = '';
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('should default multilineSupport to false for invalid JS setter values', () => {
        document.body.appendChild(cb);
        (cb as any).label = 'Test button';

        (cb as any).multilineSupport = 'safasf';

        expect((cb as any).multilineSupport).to.equal(false);

        const label = cb.querySelector('.ch5-button--label') as HTMLElement;
        expect(label).to.not.equal(null);
        expect(label.classList.contains('ch5-button--label-multiline-support-false')).to.equal(true);
        expect(label.classList.contains('ch5-button--label-multiline-support-safasf')).to.equal(false);
    });

    it('should keep valid CSS enum values and fall back to the default for invalid values', () => {
        const cases = [
            { property: 'size', defaultValue: Ch5Button.SIZES[0], values: Ch5Button.SIZES, invalid: 'bad-size', attr: 'size' },
            { property: 'shape', defaultValue: Ch5Button.SHAPES[0], values: Ch5Button.SHAPES, invalid: 'bad-shape', attr: 'shape' },
            { property: 'stretch', defaultValue: Ch5Button.STRETCHES[0], values: Ch5Button.STRETCHES, invalid: 'bad-stretch', attr: 'stretch' },
            { property: 'iconPosition', defaultValue: Ch5Button.ICON_POSITIONS[0], values: Ch5Button.ICON_POSITIONS, invalid: 'bad-icon-position', attr: 'iconposition' },
            { property: 'orientation', defaultValue: Ch5Button.ORIENTATIONS[0], values: Ch5Button.ORIENTATIONS, invalid: 'bad-orientation', attr: 'orientation' },
            { property: 'hAlignLabel', defaultValue: Ch5Button.H_ALIGN_LABELS[0], values: Ch5Button.H_ALIGN_LABELS, invalid: 'bad-h-align', attr: 'halignlabel' },
            { property: 'vAlignLabel', defaultValue: Ch5Button.V_ALIGN_LABELS[0], values: Ch5Button.V_ALIGN_LABELS, invalid: 'bad-v-align', attr: 'valignlabel' },
            { property: 'type', defaultValue: Ch5Button.TYPES[0], values: Ch5Button.TYPES, invalid: 'bad-type', attr: 'type' },
            { property: 'checkboxPosition', defaultValue: Ch5Button.CHECKBOX_POSITIONS[0], values: Ch5Button.CHECKBOX_POSITIONS, invalid: 'bad-checkbox-position', attr: 'checkboxposition' },
            { property: 'iconUrlFillType', defaultValue: Ch5Button.ICON_URL_FILL_TYPES[0], values: Ch5Button.ICON_URL_FILL_TYPES, invalid: 'bad-icon-fill', attr: 'iconurlfilltype' },
            { property: 'backgroundImageFillType', defaultValue: Ch5Button.BACKGROUND_IMAGE_URL_FILL_TYPES[0], values: Ch5Button.BACKGROUND_IMAGE_URL_FILL_TYPES, invalid: 'bad-bg-fill', attr: 'backgroundImageFillType' }
        ];

        cases.forEach(({ property, defaultValue, values, invalid, attr }) => {
            const validValue = values[values.length - 1];
            cb[property] = validValue;
            expect(cb[property]).to.equal(validValue);
            expect(cb.getAttribute(attr)).to.equal(validValue);

            cb[property] = invalid;
            expect(cb[property]).to.equal(defaultValue);
            expect(cb.getAttribute(attr)).to.equal(defaultValue);
        });
    });

    it('should coerce boolean attributes to canonical true/false values and ignore invalid JS values', () => {
        const cases = [
            { property: 'selected', attr: 'selected', validTrue: true, validFalse: false },
            { property: 'checkboxShow', attr: 'checkboxshow', validTrue: true, validFalse: false },
            { property: 'multilineSupport', attr: 'multilinesupport', validTrue: true, validFalse: false },
            { property: 'truncateText', attr: 'truncatetext', validTrue: true, validFalse: false }
        ];

        cases.forEach(({ property, attr, validTrue, validFalse }) => {
            cb[property] = validTrue;
            expect(cb[property]).to.equal(validTrue);
            expect(cb.getAttribute(attr)).to.equal('true');

            cb[property] = validFalse;
            expect(cb[property]).to.equal(validFalse);
            expect(cb.getAttribute(attr)).to.equal('false');

            (cb as any)[property] = 'not-a-boolean';
            expect((cb as any)[property]).to.equal(validFalse);
        });
    });

    it('should render static HTML labels and static icon/background values in their DOM slots', () => {
        document.body.appendChild(cb);

        cb.label = 'Static label';
        cb.labelInnerHTML = '<b>Static html</b>';
        cb.iconClass = 'fa fa-star';
        cb.iconUrl = 'https://example.com/icon.png';
        cb.backgroundImageUrl = 'https://example.com/bg.png';

        expect(cb.label).to.equal('Static label');
        expect(cb.labelInnerHTML).to.equal('<b>Static html</b>');
        expect(cb.iconClass).to.equal('fa fa-star');
        expect(cb.iconUrl).to.equal('https://example.com/icon.png');
        expect(cb.backgroundImageUrl).to.equal('https://example.com/bg.png');

        const button = cb.querySelector('.ch5-button--btn') as HTMLElement;
        const label = cb.querySelector('.ch5-button--label') as HTMLElement;
        const icon = cb.querySelector('.ch5-button--img, .ch5-button--icon') as HTMLElement;

        expect(button).to.not.equal(null);
        expect(label).to.not.equal(null);
        expect(label.innerHTML).to.equal('<b>Static html</b>');
        expect(icon).to.not.equal(null);
        expect(icon.style.backgroundImage).to.contain('https://example.com/icon.png');
        expect(button.style.backgroundImage).to.contain('https://example.com/bg.png');
    });

    it('should prefer receiveStateScriptLabelHtml over receiveStateLabel and over static label values', () => {
        const htmlSignalName = 'btn_receive_html_script_label';
        const textSignalName = 'btn_receive_label';
        const htmlSignal = Ch5SignalFactory.getInstance().getStringSignal(htmlSignalName);
        const textSignal = Ch5SignalFactory.getInstance().getStringSignal(textSignalName);

        cb.receiveStateLabel = textSignalName;
        cb.receiveStateScriptLabelHtml = htmlSignalName;
        cb.label = 'Static label';
        cb.labelInnerHTML = '<i>Static html</i>';
        document.body.appendChild(cb);

        textSignal!.publish('text signal value');
        htmlSignal!.publish('<b>html signal value</b>');

        expect(cb.label).to.equal('text signal value');
        expect(cb.scriptLabelHtml).to.equal('<b>html signal value</b>');

        const label = cb.querySelector('.ch5-button--label') as HTMLElement;
        expect(label).to.not.equal(null);
        expect(label.innerHTML).to.equal('<b>html signal value</b>');
    });

    it('should prefer receiveStateIconUrl over receiveStateIconClass and over static icon values', () => {
        const iconUrlSignal = 'btn_receive_icon_url';
        const iconClassSignal = 'btn_receive_icon_class';
        const urlSig = Ch5SignalFactory.getInstance().getStringSignal(iconUrlSignal);
        const classSig = Ch5SignalFactory.getInstance().getStringSignal(iconClassSignal);

        cb.receiveStateIconUrl = iconUrlSignal;
        cb.receiveStateIconClass = iconClassSignal;
        cb.iconUrl = 'https://example.com/static-icon.png';
        cb.iconClass = 'fa fa-static';
        document.body.appendChild(cb);

        urlSig!.publish('https://example.com/signal-icon.png');
        classSig!.publish('fa fa-signal');

        const icon = cb.querySelector('.ch5-button--img, .ch5-button--icon') as HTMLElement;
        expect(icon).to.not.equal(null);
        expect(icon.style.backgroundImage).to.contain('https://example.com/signal-icon.png');
    });

    it('should keep signal attribute names and values on the element when set via JS', () => {
        const signalName = 'btn_receive_background';

        document.body.appendChild(cb);

        cb.receiveStateType = 'receive_signal_type';
        cb.receiveStateSelected = 'receive_signal_selected';
        cb.receiveStateLabel = 'receive_signal_label';
        cb.receiveStateScriptLabelHtml = 'receive_signal_script_label_html';
        cb.receiveStateIconClass = 'receive_signal_icon_class';
        cb.receiveStateIconUrl = 'receive_signal_icon_url';
        cb.receiveStateBackgroundImageUrl = signalName;
        cb.sendEventOnClick = 'send_event_on_click';

        expect(cb.getAttribute('receiveStateType')).to.equal('receive_signal_type');
        expect(cb.getAttribute('receiveStateSelected')).to.equal('receive_signal_selected');
        expect(cb.getAttribute('receiveStateLabel')).to.equal('receive_signal_label');
        expect(cb.getAttribute('receiveStateScriptLabelHtml')).to.equal('receive_signal_script_label_html');
        expect(cb.getAttribute('receiveStateIconClass')).to.equal('receive_signal_icon_class');
        expect(cb.getAttribute('receiveStateIconUrl')).to.equal('receive_signal_icon_url');
        expect(cb.getAttribute('receiveStateBackgroundImageUrl')).to.equal(signalName);
        expect(cb.getAttribute('sendEventOnClick')).to.equal('send_event_on_click');
    });

    it('should update both label and script label when the same signal name is bound to both receiveState attributes', () => {
        const signalName = 'btn_receive_label';
        const signal = Ch5SignalFactory.getInstance().getStringSignal(signalName);

        expect(signal).to.not.equal(null);

        cb.receiveStateLabel = signalName;
        cb.receiveStateScriptLabelHtml = signalName;
        document.body.appendChild(cb);

        signal!.publish('normal label one');

        expect(cb.label).to.equal('normal label one');
        expect(cb.scriptLabelHtml).to.equal('normal label one');

        const label = cb.querySelector('.ch5-button--label') as HTMLElement;
        expect(label).to.not.equal(null);
        expect(label.textContent).to.equal('normal label one');
    });
});
