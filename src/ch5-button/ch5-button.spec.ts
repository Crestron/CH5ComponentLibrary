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

    it('should normalize null label from JS setter to empty string (never "null")', () => {
        document.body.appendChild(cb);

        (cb as any).label = null;

        expect(cb.label).to.equal('');
        expect(cb.getAttribute('label')).to.equal('');

        const label = cb.querySelector('.ch5-button--label') as HTMLElement;
        expect(label).to.equal(null);
    });

    it('should normalize null on all JS string setters to empty strings', () => {
        document.body.appendChild(cb);

        (cb as any).labelInnerHTML = null;
        (cb as any).iconClass = null;
        (cb as any).iconUrl = null;
        (cb as any).backgroundImageUrl = null;

        expect(cb.labelInnerHTML).to.equal('');
        expect(cb.iconClass).to.equal('');
        expect(cb.iconUrl).to.equal('');
        expect(cb.backgroundImageUrl).to.equal('');

        expect(cb.getAttribute('labelInnerHTML')).to.equal('');
        expect(cb.getAttribute('iconClass')).to.equal('');
        expect(cb.getAttribute('iconUrl')).to.equal('');
        expect(cb.getAttribute('backgroundImageUrl')).to.equal('');
    });

    it('should keep valid CSS enum values and fall back to default for invalid and nil values', () => {
        const cases = [
            { property: 'size', defaultValue: Ch5Button.SIZES[0], values: Ch5Button.SIZES, invalid: 'bad-size', attr: 'size' },
            { property: 'shape', defaultValue: Ch5Button.SHAPES[0], values: Ch5Button.SHAPES, invalid: 'bad-shape', attr: 'shape' },
            { property: 'iconPosition', defaultValue: Ch5Button.ICON_POSITIONS[0], values: Ch5Button.ICON_POSITIONS, invalid: 'bad-icon-position', attr: 'iconposition' },
            { property: 'orientation', defaultValue: Ch5Button.ORIENTATIONS[0], values: Ch5Button.ORIENTATIONS, invalid: 'bad-orientation', attr: 'orientation' },
            { property: 'hAlignLabel', defaultValue: Ch5Button.H_ALIGN_LABELS[0], values: Ch5Button.H_ALIGN_LABELS, invalid: 'bad-h-align', attr: 'halignlabel' },
            { property: 'vAlignLabel', defaultValue: Ch5Button.V_ALIGN_LABELS[0], values: Ch5Button.V_ALIGN_LABELS, invalid: 'bad-v-align', attr: 'valignlabel' },
            { property: 'type', defaultValue: Ch5Button.TYPES[0], values: Ch5Button.TYPES, invalid: 'bad-type', attr: 'type' },
            { property: 'checkboxPosition', defaultValue: Ch5Button.CHECKBOX_POSITIONS[0], values: Ch5Button.CHECKBOX_POSITIONS, invalid: 'bad-checkbox-position', attr: 'checkboxposition' },
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

            const defaultingInputs = [false, '', null, undefined];
            defaultingInputs.forEach((input) => {
                (cb as any)[property] = input;
                expect((cb as any)[property]).to.equal(defaultValue);
                expect(cb.getAttribute(attr)).to.equal(defaultValue);
            });
        });
    });

    it('should keep stretch enum strict and remove attribute for invalid and nil values', () => {
        cb.stretch = Ch5Button.STRETCHES[2];
        expect(cb.stretch).to.equal(Ch5Button.STRETCHES[2]);
        expect(cb.getAttribute('stretch')).to.equal(Ch5Button.STRETCHES[2]);

        (cb as any).stretch = 'bad-stretch';
        expect(cb.stretch).to.equal(null);
        expect(cb.hasAttribute('stretch')).to.equal(false);

        [false, '', null, undefined].forEach((input) => {
            (cb as any).stretch = input;
            expect(cb.stretch).to.equal(null);
            expect(cb.hasAttribute('stretch')).to.equal(false);
        });
    });

    it('should keep iconUrlFillType enum strict while returning null when attribute is absent', () => {
        expect(Ch5Button.ICON_URL_FILL_TYPES.includes('null')).to.equal(false);
        expect(cb.iconUrlFillType).to.equal(null);
        expect(cb.hasAttribute('iconurlfilltype')).to.equal(false);

        cb.iconUrlFillType = Ch5Button.ICON_URL_FILL_TYPES[2];
        expect(cb.iconUrlFillType).to.equal(Ch5Button.ICON_URL_FILL_TYPES[2]);
        expect(cb.getAttribute('iconurlfilltype')).to.equal(Ch5Button.ICON_URL_FILL_TYPES[2]);

        (cb as any).iconUrlFillType = 'bad-icon-fill';
        expect(cb.iconUrlFillType).to.equal(Ch5Button.ICON_URL_FILL_TYPES[0]);
        expect(cb.getAttribute('iconurlfilltype')).to.equal(Ch5Button.ICON_URL_FILL_TYPES[0]);

        cb.iconUrlFillType = null;
        expect(cb.iconUrlFillType).to.equal(null);
        expect(cb.hasAttribute('iconurlfilltype')).to.equal(false);

        cb.iconUrlFillType = undefined;
        expect(cb.iconUrlFillType).to.equal(null);
        expect(cb.hasAttribute('iconurlfilltype')).to.equal(false);
    });

    it('should keep enum attributes present and defaulted for false/empty/null/undefined across all observed cases', () => {
        const defaultingInputs = [false, '', null, undefined];
        const cases = [
            { property: 'size', defaultValue: Ch5Button.SIZES[0], attr: 'size' },
            { property: 'shape', defaultValue: Ch5Button.SHAPES[0], attr: 'shape' },
            { property: 'type', defaultValue: Ch5Button.TYPES[0], attr: 'type' },
            { property: 'orientation', defaultValue: Ch5Button.ORIENTATIONS[0], attr: 'orientation' },
            { property: 'backgroundImageFillType', defaultValue: Ch5Button.BACKGROUND_IMAGE_URL_FILL_TYPES[0], attr: 'backgroundImageFillType' },
            { property: 'iconPosition', defaultValue: Ch5Button.ICON_POSITIONS[0], attr: 'iconposition' },
            { property: 'hAlignLabel', defaultValue: Ch5Button.H_ALIGN_LABELS[0], attr: 'halignlabel' },
            { property: 'vAlignLabel', defaultValue: Ch5Button.V_ALIGN_LABELS[0], attr: 'valignlabel' },
            { property: 'checkboxPosition', defaultValue: Ch5Button.CHECKBOX_POSITIONS[0], attr: 'checkboxposition' }
        ];

        cases.forEach(({ property, defaultValue, attr }) => {
            defaultingInputs.forEach((input) => {
                (cb as any)[property] = input;
                expect((cb as any)[property]).to.equal(defaultValue);
                expect(cb.getAttribute(attr)).to.equal(defaultValue);
                expect(cb.hasAttribute(attr)).to.equal(true);
            });
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

    it('should normalize selected setter with true allow-list and false fallback', () => {
        const trueInputs = [true, 'true', 1, '1', ''];
        const falseInputs = [false, 'false', 0, '0', 'random', null, undefined, ' '];

        trueInputs.forEach((input) => {
            (cb as any).selected = input;
            expect(cb.getAttribute('selected')).to.equal('true');
            expect(cb.selected).to.equal(true);
        });

        falseInputs.forEach((input) => {
            (cb as any).selected = input;
            expect(cb.getAttribute('selected')).to.equal('false');
            expect(cb.selected).to.equal(false);
        });
    });

    it('should normalize checkboxShow setter with true allow-list and false fallback', () => {
        const trueInputs = [true, 'true', 1, '1', ''];
        const falseInputs = [false, 'false', 0, '0', 'random', null, undefined, ' '];

        trueInputs.forEach((input) => {
            (cb as any).checkboxShow = input;
            expect(cb.getAttribute('checkboxshow')).to.equal('true');
            expect(cb.checkboxShow).to.equal(true);
        });

        falseInputs.forEach((input) => {
            (cb as any).checkboxShow = input;
            expect(cb.getAttribute('checkboxshow')).to.equal('false');
            expect(cb.checkboxShow).to.equal(false);
        });
    });

    it('should normalize disabled setter with true allow-list and false fallback', () => {
        const trueInputs = [true, 'true', 1, '1', ''];
        const falseInputs = [false, 'false', 0, '0', 'random', null, undefined, ' '];

        trueInputs.forEach((input) => {
            (cb as any).disabled = input;
            expect(cb.getAttribute('disabled')).to.equal('true');
            expect(cb.disabled).to.equal(true);
        });

        falseInputs.forEach((input) => {
            (cb as any).disabled = input;
            expect(cb.getAttribute('disabled')).to.equal('false');
            expect(cb.disabled).to.equal(false);
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

    it('should preserve leading and trailing whitespace for static labelInnerHTML', () => {
        document.body.appendChild(cb);

        const htmlWithPadding = '  <b>A</b>  ';
        cb.labelInnerHTML = htmlWithPadding;

        expect(cb.labelInnerHTML).to.equal(htmlWithPadding);
        expect(cb.getAttribute('labelInnerHTML')).to.equal(htmlWithPadding);

        const label = cb.querySelector('.ch5-button--label') as HTMLElement;
        expect(label).to.not.equal(null);
        expect(label.innerHTML).to.equal(htmlWithPadding);
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

    it('should preserve leading and trailing whitespace for receiveStateScriptLabelHtml signal values', () => {
        const htmlSignalName = 'btn_receive_html_script_label_whitespace';
        const htmlSignal = Ch5SignalFactory.getInstance().getStringSignal(htmlSignalName);

        expect(htmlSignal).to.not.equal(null);

        cb.receiveStateScriptLabelHtml = htmlSignalName;
        document.body.appendChild(cb);

        const htmlWithPadding = '  <b>html signal value</b>  ';
        htmlSignal!.publish(htmlWithPadding);

        expect(cb.scriptLabelHtml).to.equal(htmlWithPadding);
        expect(cb.getAttribute('label')).to.equal(htmlWithPadding);

        const label = cb.querySelector('.ch5-button--label') as HTMLElement;
        expect(label).to.not.equal(null);
        expect(label.innerHTML).to.equal(htmlWithPadding);

        htmlSignal!.publish('');
        expect(cb.getAttribute('label')).to.equal(null);
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

    it('should mirror signal-driven icon values onto host attributes without changing signal priority', () => {
        const iconUrlSignalName = 'btn_receive_icon_url_reflect';
        const iconClassSignalName = 'btn_receive_icon_class_reflect';
        const iconUrlSignal = Ch5SignalFactory.getInstance().getStringSignal(iconUrlSignalName);
        const iconClassSignal = Ch5SignalFactory.getInstance().getStringSignal(iconClassSignalName);

        expect(iconUrlSignal).to.not.equal(null);
        expect(iconClassSignal).to.not.equal(null);

        cb.setAttribute('iconUrl', 'https://example.com/static-icon.png');
        cb.setAttribute('iconClass', 'fa fa-static');
        cb.setAttribute('receiveStateIconUrl', iconUrlSignalName);
        cb.setAttribute('receiveStateIconClass', iconClassSignalName);
        document.body.appendChild(cb);

        iconClassSignal!.publish('fa fa-signal');
        expect(cb.getAttribute('iconClass')).to.equal('fa fa-signal');

        iconUrlSignal!.publish('https://example.com/signal-icon.png');
        expect(cb.getAttribute('iconUrl')).to.equal('https://example.com/signal-icon.png');

        const icon = cb.querySelector('.ch5-button--img, .ch5-button--icon') as HTMLElement;
        expect(icon).to.not.equal(null);
        expect(icon.className).to.equal('ch5-button--img');
        expect(icon.style.backgroundImage).to.contain('https://example.com/signal-icon.png');

        iconUrlSignal!.publish('');
        expect(cb.getAttribute('iconUrl')).to.equal(null);

        iconClassSignal!.publish('');
        expect(cb.getAttribute('iconClass')).to.equal(null);
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

    it('should give receiveStateLabel strict priority regardless of attribute order, including empty signal values', () => {
        const signalName = 'btn_receive_label_order_independent';
        const signal = Ch5SignalFactory.getInstance().getStringSignal(signalName);
        expect(signal).to.not.equal(null);

        // Case 1: receiveStateLabel before label
        const first = document.createElement('ch5-button') as any;
        first.setAttribute('receiveStateLabel', signalName);
        first.setAttribute('label', 'Static Label');
        document.body.appendChild(first);

        // Signal present but no value yet -> signal still owns priority (empty)
        let firstLabel = first.querySelector('.ch5-button--label') as HTMLElement;
        expect(firstLabel).to.equal(null);

        // Empty signal value must still win over static label
        signal!.publish('');
        firstLabel = first.querySelector('.ch5-button--label') as HTMLElement;
        expect(firstLabel).to.equal(null);
        expect(first.getAttribute('label')).to.equal(null);

        // Non-empty signal value appears
        signal!.publish('Signal Label');
        firstLabel = first.querySelector('.ch5-button--label') as HTMLElement;
        expect(firstLabel).to.not.equal(null);
        expect(firstLabel.textContent).to.equal('Signal Label');
        expect(first.getAttribute('label')).to.equal('Signal Label');

        // Case 2: label before receiveStateLabel
        const second = document.createElement('ch5-button') as any;
        second.setAttribute('label', 'Static Label');
        second.setAttribute('receiveStateLabel', signalName);
        document.body.appendChild(second);

        let secondLabel = second.querySelector('.ch5-button--label') as HTMLElement;
        expect(secondLabel).to.not.equal(null);
        expect(secondLabel.textContent).to.equal('Signal Label');

        // Empty signal keeps priority, no fallback to static label
        signal!.publish('');
        secondLabel = second.querySelector('.ch5-button--label') as HTMLElement;
        expect(secondLabel).to.equal(null);
        expect(second.getAttribute('label')).to.equal(null);
    });

    it('should give receiveStateIconUrl and receiveStateIconClass strict priority regardless of static order, including empty signal values', () => {
        const iconUrlSignalName = 'btn_receive_icon_url_order_independent';
        const iconClassSignalName = 'btn_receive_icon_class_order_independent';
        const iconUrlSignal = Ch5SignalFactory.getInstance().getStringSignal(iconUrlSignalName);
        const iconClassSignal = Ch5SignalFactory.getInstance().getStringSignal(iconClassSignalName);
        expect(iconUrlSignal).to.not.equal(null);
        expect(iconClassSignal).to.not.equal(null);

        // iconUrl signal wins from bind time, even before first publish.
        const first = document.createElement('ch5-button') as any;
        first.setAttribute('receiveStateIconUrl', iconUrlSignalName);
        first.setAttribute('iconUrl', 'https://example.com/static-icon.png');
        first.setAttribute('iconClass', 'fa fa-static');
        document.body.appendChild(first);

        let firstIcon = first.querySelector('.ch5-button--img, .ch5-button--icon') as HTMLElement;
        expect(firstIcon).to.not.equal(null);
        // Empty url signal must suppress fallback to static iconUrl.
        iconUrlSignal!.publish('');
        firstIcon = first.querySelector('.ch5-button--img, .ch5-button--icon') as HTMLElement;
        expect(firstIcon).to.not.equal(null);
        expect(firstIcon.className).to.contain('ch5-button--icon');
        expect(firstIcon.style.backgroundImage).to.equal('');

        iconUrlSignal!.publish('https://example.com/signal-icon.png');
        firstIcon = first.querySelector('.ch5-button--img, .ch5-button--icon') as HTMLElement;
        expect(firstIcon.className).to.equal('ch5-button--img');
        expect(firstIcon.style.backgroundImage).to.contain('https://example.com/signal-icon.png');

        // iconClass signal wins from bind time, even before first publish.
        const second = document.createElement('ch5-button') as any;
        second.setAttribute('iconClass', 'fa fa-static');
        second.setAttribute('receiveStateIconClass', iconClassSignalName);
        document.body.appendChild(second);

        let secondIcon = second.querySelector('.ch5-button--img, .ch5-button--icon') as HTMLElement;
        expect(secondIcon).to.equal(null);

        // Empty icon class signal remains authoritative.
        iconClassSignal!.publish('');
        secondIcon = second.querySelector('.ch5-button--img, .ch5-button--icon') as HTMLElement;
        expect(secondIcon).to.equal(null);

        iconClassSignal!.publish('fa fa-signal');
        secondIcon = second.querySelector('.ch5-button--img, .ch5-button--icon') as HTMLElement;
        expect(secondIcon).to.not.equal(null);
        expect(secondIcon.className).to.contain('fa fa-signal');
    });

    it('should give receiveStateBackgroundImageUrl strict priority regardless of static order, including empty signal values', () => {
        const signalName = 'btn_receive_background_order_independent';
        const signal = Ch5SignalFactory.getInstance().getStringSignal(signalName);
        expect(signal).to.not.equal(null);

        const first = document.createElement('ch5-button') as any;
        first.setAttribute('receiveStateBackgroundImageUrl', signalName);
        first.setAttribute('backgroundImageUrl', 'https://example.com/static-bg.png');
        document.body.appendChild(first);

        const firstButton = first.querySelector('.ch5-button--btn') as HTMLElement;
        expect(firstButton.style.backgroundImage).to.equal('');

        signal!.publish('https://example.com/signal-bg.png');
        expect(firstButton.style.backgroundImage).to.contain('https://example.com/signal-bg.png');

        // Empty signal remains authoritative (no fallback to static background).
        signal!.publish('');
        expect(firstButton.style.backgroundImage).to.equal('');

        const second = document.createElement('ch5-button') as any;
        second.setAttribute('backgroundImageUrl', 'https://example.com/static-bg2.png');
        second.setAttribute('receiveStateBackgroundImageUrl', signalName);
        document.body.appendChild(second);

        const secondButton = second.querySelector('.ch5-button--btn') as HTMLElement;
        expect(secondButton.style.backgroundImage).to.equal('');
    });

    it('should keep static type and signal type together so selected/pressed can resolve effective type from data-signal-type', () => {
        const typeSignalName = 'btn_receive_type_effective_type';
        const typeSignal = Ch5SignalFactory.getInstance().getStringSignal(typeSignalName);
        expect(typeSignal).to.not.equal(null);

        // Matches real usage: static type remains on host while signal writes data-signal-type.
        cb.setAttribute('type', 'danger');
        cb.setAttribute('label', 'Danger');
        cb.setAttribute('receiveStateType', typeSignalName);
        cb.setAttribute('selected', 'true');
        cb.setAttribute('pressed', 'true');
        document.body.appendChild(cb);

        typeSignal!.publish('success');

        // DOM contract for theme selectors:
        // - static type is preserved
        // - effective signal type is written to data-signal-type
        // - selected/pressed flags are simultaneously present
        expect(cb.getAttribute('type')).to.equal('danger');
        expect(cb.getAttribute('data-signal-type')).to.equal('success');
        expect(cb.getAttribute('selected')).to.equal('true');
        expect(cb.getAttribute('pressed')).to.equal('true');

        // Removing receiveStateType should drop signal channel and restore static-only styling.
        cb.removeAttribute('receiveStateType');
        expect(cb.getAttribute('data-signal-type')).to.equal(null);
        expect(cb.getAttribute('type')).to.equal('danger');
    });

    it('should ignore static show=false when receivestateshow is present, regardless of attribute order, in noshowtype=remove mode', () => {
        const signalName = 'btn_receive_show_remove_mode_order';
        const signal = Ch5SignalFactory.getInstance().getBooleanSignal(signalName);
        expect(signal).to.not.equal(null);

        // Case: static show appears before receivestateshow (the problematic order).
        const first = document.createElement('ch5-button') as any;
        first.setAttribute('show', 'false');
        first.setAttribute('noshowtype', 'remove');
        first.setAttribute('receivestateshow', signalName);
        document.body.appendChild(first);

        // Static show must be ignored while receiveStateShow is bound.
        expect(first.isConnected).to.equal(true);
        expect(document.body.contains(first)).to.equal(true);

        // Signal false hides via remove.
        signal!.publish(false);
        expect(document.body.contains(first)).to.equal(false);

        // Signal true reattaches.
        signal!.publish(true);
        expect(document.body.contains(first)).to.equal(true);

        // Case: receivestateshow before static show should behave identically.
        const second = document.createElement('ch5-button') as any;
        second.setAttribute('receivestateshow', signalName);
        second.setAttribute('noshowtype', 'remove');
        second.setAttribute('show', 'false');
        document.body.appendChild(second);

        expect(second.isConnected).to.equal(true);
        expect(document.body.contains(second)).to.equal(true);
    });

    it('should publish sendeventonshow only after receivestateshow receives a value', () => {
        const suffix = Date.now() + '_' + Math.floor(Math.random() * 100000);
        const receiveSignalName = 'btn_receive_show_publish_gate_' + suffix;
        const sendSignalName = 'btn_send_show_publish_gate_' + suffix;

        const receiveSignal = Ch5SignalFactory.getInstance().getBooleanSignal(receiveSignalName);
        const sendSignal = Ch5SignalFactory.getInstance().getBooleanSignal(sendSignalName);
        expect(receiveSignal).to.not.equal(null);
        expect(sendSignal).to.not.equal(null);

        const publishedValues: boolean[] = [];
        const subKey = sendSignal!.subscribe((value: boolean) => {
            publishedValues.push(value);
        });

        const button = document.createElement('ch5-button') as any;
        button.setAttribute('sendeventonshow', sendSignalName);
        button.setAttribute('receivestateshow', receiveSignalName);
        document.body.appendChild(button);

        const baselineCount = publishedValues.length;

        receiveSignal!.publish(false);
        expect(publishedValues.length).to.equal(baselineCount + 1);
        expect(publishedValues[publishedValues.length - 1]).to.equal(false);

        receiveSignal!.publish(true);
        expect(publishedValues.length).to.equal(baselineCount + 2);
        expect(publishedValues[publishedValues.length - 1]).to.equal(true);

        sendSignal!.unsubscribe(subKey);
    });

    it('should not publish sendeventonshow when receivestateshow is not configured', () => {
        const suffix = Date.now() + '_' + Math.floor(Math.random() * 100000);
        const sendSignalName = 'btn_send_show_no_receive_state_' + suffix;
        const sendSignal = Ch5SignalFactory.getInstance().getBooleanSignal(sendSignalName);
        expect(sendSignal).to.not.equal(null);

        const publishedValues: boolean[] = [];
        const subKey = sendSignal!.subscribe((value: boolean) => {
            publishedValues.push(value);
        });

        const button = document.createElement('ch5-button') as any;
        button.setAttribute('sendeventonshow', sendSignalName);
        button.setAttribute('show', 'true');
        document.body.appendChild(button);

        const baselineCount = publishedValues.length;
        button.setAttribute('show', 'false');
        button.setAttribute('show', 'true');

        expect(publishedValues.length).to.equal(baselineCount);
        sendSignal!.unsubscribe(subKey);
    });
});
