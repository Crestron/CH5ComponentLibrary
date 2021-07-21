// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5Signal, Ch5SignalBridge, Ch5SignalFactory } from "../ch5-core/index";
import isNil from 'lodash/isNil';

import {
	TCh5ButtonIconPosition,
	TCh5ButtonOrientation,
	TCh5ButtonShape,
	TCh5ButtonSize,
	TCh5ButtonStretch,
	TCh5ButtonType,
	TCh5ButtonActionType,
	TCh5ButtonCheckboxPosition,
	TCh5ButtonHorizontalAlignLabel,
	TCh5ButtonVerticalAlignLabel
} from './interfaces/t-ch5-button';

import { ICh5ButtonAttributes } from "./interfaces/i-ch5-button-attributes";
import { Ch5Pressable } from "../ch5-common/ch5-pressable";
import Hammer from 'hammerjs';
import { Ch5ButtonPressInfo } from "./ch5-button-pressinfo";
import { normalizeEvent } from "../ch5-triggerview/utils";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { isSafariMobile } from "../ch5-core/utility-functions/is-safari-mobile";
import { Ch5ButtonMode } from "./ch5-button-mode";
import { Ch5ButtonModeState } from "./ch5-button-mode-state";
import { Subscription } from "rxjs";
import { Ch5ButtonUtils } from "./ch5-button-utils";
import { Ch5ButtonExtendedProperties } from "./ch5-button-extended-properties";

/**
 * Html Attributes
 *
 * - checkboxShow, checkboxshow
 * - checkboxPosition, checkboxposition
 * - customClassSelected, customclassselected
 * - customClassPressed, customclasspressed
 * - customClassDisabled, customclassdisabled
 * - disabled
 * - hAlignLabel, halignlabel
 * - iconClass, iconclass
 * - iconPosition, iconposition
 * - iconUrl, iconurl
 * - id
 * - label
 * - mode
 * - orientation
 * - receiveStateSelected, receivestateselected
 * - receiveStateLabel, receivestatelabel,
 * - receiveStateScriptLabelHtml, receivestatescriptlabelhtml
 * - receiveStateIconClass, receivestateiconclass
 * - receiveStateIconUrl, receivestateiconurl
 * - selected
 * - sendEventOnTouch, sendeventontouch
 * - sendEventOnClick, sendeventonclick
 * - shape
 * - size
 * - stretch
 * - type
 * - vAlignLabel, valignlabel
 *
 *
 * CSS Classes applied for ch5-button
 *
 * | Name                              | Description                                                          |
 * |:--------------------------------- |:-------------------------------------------------------------------- |
 * | ch5-button                       | primary class
 * | ch5-button--label                | applied on button label
 * | ch5-button--icon                 | applied on button icon
 * | ch5-button--rectangle            | applied when shape is "rectangle"
 * | ch5-button--rounded-rectangle    | applied when shape is "rounded-rectangle"
 * | ch5-button--circle               | applied when shape is "circle"
 * | ch5-button--tab                  | applied when shape is "tab"
 * | ch5-button--oval                 | applied when shape is "oval"
 * | ch5-button--info,                | applied when type is "info"
 * | ch5-button--warning,             | applied when type is "warning"
 * | ch5-button--danger,              | applied when type is "danger"
 * | ch5-button--text,                | applied when type is "text"
 * | ch5-button--success,             | applied when type is "success"
 * | ch5-button--primary,             | applied when type is "primary"
 * | ch5-button--secondary,           | applied when type is "secondary"
 * | ch5-button--default,             | applied when type is "default"
 * | ch5-button--disabled             | applied when button is disabled
 * | ch5-button_selected              | applied when button is selected (when true was received on the receiveStateSelected signal
 * | ch5-button_pressed               | applied while the button is pressed
 * | ch5-button__label--horizontal 		| applied for horizontal alignment of the label
 * | ch5-button__label--vertical 			| applied for vertical alignment of the label
 * | ch5-button__checkbox 						| applied to define the checkbox position
 * | ch5-button__checkbox--checked 		| applied to define the icon for 'selected (checked) checkbox'
 * | ch5-button__checkbox--unchecked 	| applied to define the icon for for 'deselected (unchecked) checkbox'
 * | ch5-button__checkbox--checked-disabled | applied to define the icon for 'disabled selected (checked) checkbox'
 * | ch5-button__checkbox--unchecked-disabled | applied to define the icon for 'disabled deselected (unchecked) checkbox'
 */
export class Ch5Button extends Ch5Common implements ICh5ButtonAttributes {

	//#region 1. Variables

	public static VAR_FOR_NUMBER: number = 0;

	//#region 1.1 readonly variables

	/**
	 * The first value is in the array is the default value
	 */
	public static readonly TYPES: TCh5ButtonType[] = ['default', 'primary', 'info', 'text', 'danger', 'warning', 'success', 'secondary'];

	/**
	 * The first value is in the array is the default value
	 */
	public static readonly SHAPES: TCh5ButtonShape[] = ['rounded-rectangle', 'rectangle', 'tab', 'circle', 'oval'];

	/**
	 * The first value is in the array is the default value
	 */
	public static readonly SIZES: TCh5ButtonSize[] = ['regular', 'x-small', 'small', 'large', 'x-large'];

	/**
	 * No default value for Stretch
	 */
	public static readonly STRETCHES: TCh5ButtonStretch[] = ['both', 'width', 'height'];

	/**
	 * The first value is in the array is the default value
	 */
	public static readonly ICON_POSITIONS: TCh5ButtonIconPosition[] = ['first', 'last', 'top', 'bottom'];

	/**
	 * The first value is in the array is the default value
	 */
	public static readonly CHECKBOX_POSITIONS: TCh5ButtonCheckboxPosition[] = ['left', 'right'];
	/**
	 * The first value is in the array is the default value
	 */
	public static readonly HORIZONTAL_LABEL_ALIGNMENTS: TCh5ButtonHorizontalAlignLabel[] = ['center', 'left', 'right'];

	/**
	 * The first value is in the array is the default value
	 */
	public static readonly VERTICAL_LABEL_ALIGNMENTS: TCh5ButtonVerticalAlignLabel[] = ['middle', 'top', 'bottom'];

	/**
	 * The first value is in the array is the default value
	 */
	public static readonly ORIENTATIONS: TCh5ButtonOrientation[] = ['horizontal', 'vertical'];

	public static readonly COMPONENT_DATA: any = {
		TYPES: {
			default: Ch5Button.TYPES[0],
			values: Ch5Button.TYPES,
			key: 'type',
			classListPrefix: 'ch5-button--'
		},
		SHAPES: {
			default: Ch5Button.SHAPES[0],
			values: Ch5Button.SHAPES,
			key: 'shape',
			classListPrefix: 'ch5-button--shape-'
		},
		SIZES: {
			default: Ch5Button.SIZES[0],
			values: Ch5Button.SIZES,
			key: 'size',
			classListPrefix: 'ch5-button--size-'
		},
		STRETCH: {
			default: null,
			values: Ch5Button.STRETCHES,
			key: 'stretch',
			classListPrefix: 'ch5-button--stretch-'
		},
		ICON_POSITIONS: {
			default: Ch5Button.ICON_POSITIONS[0],
			values: Ch5Button.ICON_POSITIONS,
			key: 'iconposition',
			classListPrefix: 'ch5-button--iconposition-'
		},
		CHECKBOX_POSITIONS: {
			default: Ch5Button.CHECKBOX_POSITIONS[0],
			values: Ch5Button.CHECKBOX_POSITIONS,
			key: 'checkboxposition',
			classListPrefix: 'cx-button-checkbox-pos-'
		},
		HORIZONTAL_LABEL_ALIGNMENTS: {
			default: Ch5Button.HORIZONTAL_LABEL_ALIGNMENTS[0],
			values: Ch5Button.HORIZONTAL_LABEL_ALIGNMENTS,
			key: 'halignlabel',
			classListPrefix: 'ch5-button--horizontal-'
		},
		VERTICAL_LABEL_ALIGNMENTS: {
			default: Ch5Button.VERTICAL_LABEL_ALIGNMENTS[0],
			values: Ch5Button.VERTICAL_LABEL_ALIGNMENTS,
			key: 'valignlabel',
			classListPrefix: 'ch5-button--vertical-'
		},
		ORIENTATIONS: {
			default: Ch5Button.ORIENTATIONS[0],
			values: Ch5Button.ORIENTATIONS,
			key: 'orientation',
			classListPrefix: 'ch5-button--'
		}
	};

	public readonly primaryCssClass: string = 'ch5-button';
	public readonly cssClassPrefix: string = 'ch5-button';

	private readonly TOUCH_TIMEOUT: number = 250;
	private readonly DEBOUNCE_PRESS_TIME: number = 200;
	private readonly PRESS_MOVE_THRESHOLD: number = 10;
	private readonly STATE_CHANGE_TIMEOUTS: number = 500;

	private readonly CSS_CLASS_LIST = {
		CONTAINER_CLASS: 'cb-cntr',
		BUTTON_PRIMARY_CLASS: 'cb-btn'
	};
	private readonly COMPONENT_NAME: string = "ch5-button";

	private readonly pressedCssClassPostfix: string = '--pressed';
	private readonly selectedCssClassPostfix: string = '--selected';
	private readonly iosCssClassPostfix: string = '--ios-vertical';

	private readonly MAX_MODE_LENGTH: number = 99;
	private readonly DEBOUNCE_SETBUTTON_DISPLAY: number = 25;

	//#endregion

	//#region 1.2 private / protected variables

	private _elContainer: HTMLElement = {} as HTMLElement;
	private _elButton: HTMLElement = {} as HTMLElement;
	private _elSpanForLabelOnly: HTMLElement = {} as HTMLElement;
	private _elSpanForLabelIconImg: HTMLElement = {} as HTMLElement;
	private _elIcon: HTMLElement = {} as HTMLElement;
	private _elCheckboxIcon: HTMLElement = {} as HTMLElement;
	private _elImg: HTMLImageElement = {} as HTMLImageElement;
	private _elIosDots: HTMLElement = {} as HTMLElement;

	private _pressHorizontalStartingPoint: number | null = null;
	private _pressVerticalStartingPoint: number | null = null;

	private isLabelLoaded: boolean = false;

	private _pressableIsPressedSubscription: Subscription | null = null;

	/**
	 * Time after that press will be triggered
	 */
	private _pressTimeout: number = 0;

	/**
	 * Information about start and end position
	 * Including the threshold of px for valid presses
	 */
	private _pressInfo: Ch5ButtonPressInfo = {} as Ch5ButtonPressInfo;

	/**
	 * State of the button ( pressed or not )
	 */
	private _pressed: boolean = false;
	private _buttonPressed: boolean = false;
	private _buttonPressedInPressable: boolean = false;

	private _mode: number = 0;

	private _label: string = '';
	private _activeLabel: string = '';

	/**
	 * The icon's CSS class name as defined in the iconClass HTML attribute
	 */
	private _iconClass: string = '';
	private _receiveStateIconClassResponseValue: string = '';
	private _receiveStateIconUrlResponseValue: string = '';

	/**
	 * Icon position relative to label
	 */
	private _iconPosition: TCh5ButtonIconPosition = 'first';

	/**
	 * Icon position relative to label
	 */
	private _checkboxPosition: TCh5ButtonCheckboxPosition = "left";

	/**
	 * Reflects the checkbox display part of the component. If set to true, a checkbox is displayed and a CSS class named 'ch5-button__checkbox' will be applied
	 * on the button component
	 */
	private _checkboxShow: boolean = false;

	/**
	 * Horizontal Alignment for Label
	 */
	private _hAlignLabel: TCh5ButtonHorizontalAlignLabel = 'center';

	/**
	 * Vertical Alignment for Label
	 */
	private _vAlignLabel: TCh5ButtonVerticalAlignLabel = 'middle';

	/**
	 * Lays out the elements of the ch5-button in a horizontal or vertical manner.
	 * For vertical alignment it will apply a CSS class that will rotate the component -90 degrees ( 270 deg clockwise,
	 * 90 degrees counter clockwise )
	 */
	private _orientation: TCh5ButtonOrientation = 'horizontal';

	/**
	 * Shape of the button
	 */
	private _shape: TCh5ButtonShape = 'rounded-rectangle';

	/**
	 * Size of the button
	 */
	private _size: TCh5ButtonSize = 'regular';

	/**
	 * action type of the button
	 */
	private _formType: TCh5ButtonActionType | null = null;

	/**
	 * When stretch property is set, the button element inherits the width or/and height of the container.
	 * If stretch by height is used, the button will be responsive based on the label length, until reaches the
	 * max-width of the container.
	 * If stretch width is applied, there is no responsiveness after reaching the max- width, the text will overflow.
	 * Same if stretch both is used. Note that, if button element shape is "circle" or "oval", stretch property will be
	 * ignored.
	 */
	private _stretch: TCh5ButtonStretch | null = null;

	/**
	 * Valid values: default, info, text, danger, warning, success, primary, secondary.
	 * Overrides the appearance of the button with alternative css defined in classes defined with ch5-button--type
	 * where type is the value of the property. If no "type" is provided, type of 'default' is used.
	 */
	private _type: TCh5ButtonType = 'default';
	private _receiveStateTypeResponseValue: TCh5ButtonType | null = null;

	/**
	 * Reflects the selected state of the component. If set to true a CSS class named 'ch5-button--..._selected' will be applied
	 * on the button component
	 */
	private _selected: boolean = false;

	/**
	 * State class name as defined in customClassSelected, customClassPressed and customClassDisabled HTML attribute
	 *
	 * HTML attribute name: customclassselected, customclasspressed and customclassdisabled
	 */
	private _customClassState: string = '';

	/**
	 * The name of a boolean signal. When the signal is true the selected (ch5-button--selected) will be applied
	 *
	 * HTML attribute name: receiveStateSelected or receivestateselected
	 */
	private _sigNameReceiveSelected: string = '';

	/**
	 * The subscription id for the receiveStateSelected signal
	 */
	private _subReceiveSelected: string = '';

	/**
	 * The name of a string signal that will be applied to the label
	 *
	 * HTML attribute name: receiveStateLabel or receivestatelabel
	 */
	private _sigNameReceiveLabel: string = '';

	/**
	 * The subscription id for the receiveStateLabel signal
	 */
	private _subReceiveLabel: string = '';

	/**
	 * The name of the string signal for which the value will be applied to the component's label innerHtml
	 *
	 * HTML attribute name: receiveStateScriptLabelHtml or receivestatescriptlabelhtml
	 */
	private _sigNameReceiveScriptLabelHtml: string = '';

	/**
	 * The subscription id for the receiveStateScriptLabelHtml signal
	 */
	private _subReceiveScriptLabelHtml: string = '';

	/**
	 * The name of the boolean signal that will be sent to native on touch.
	 * boolean true while finger is on the glass, digital false when finger is released or “roll out”.
	 * The signal will be sent with value true and reasserted true every 200ms while the finger is on the
	 * component. The reassertion is needed to avoid unending ramp should there be a communications error, a failure of
	 * the button itself or any intermediate proxy of the signal.
	 * This signal should not be generated as part of a gesture swipe.
	 *
	 * HTML attribute name: sendEventOnTouch or sendeventontouch
	 */
	private _sigNameSendOnTouch: string = '';

	/**
	 * The name of the boolean signal that will be sent to native on click or tap event (mouse or finger up and down in
	 * a small period of time)
	 *
	 * HTML attribute name: sendEventOnClick or sendeventonclick
	 */
	private _sigNameSendOnClick: string = '';

	/**
	 * Changing iconClass through signal
	 */
	private _receiveStateIconClass: string | null = null;

	/**
	 * Changing iconUrl through signal
	 */
	private _receiveStateIconSvgUrl: string = '';

	/**
	 * Subscription reference for svg icon signal
	 *
	 * @type {string | null}
	 */
	private _subReceiveSignalSvgUrl: string | null = null;

	/**
	 * Subscription reference for icon class signal
	 *
	 * @type {string | null}
	 */
	private _subReceiveSignalIconClass: string | null = null;

	/**
	 * Changing the button type through signal
	 *
	 * @type {string | null}
	 */
	private _sigNameReceiveStateType: string | null = null;

	/**
	 * Changing the button mode through signal
	 *
	 * @type {string | null}
	 */
	private _sigNameReceiveStateMode: string | null = null;

	/**
	 * Subscription reference for type signal
	 *
	 * @type {string | null}
	 */
	private _subReceiveSignalType: string | null = null;

	/**
	 * Subscription reference for mode signal
	 *
	 * @type {string | null}
	 */
	private _subReceiveSignalMode: string | null = null;

	/**
	 * The interval id ( from setInterval ) for reenforcing the  onTouch signal
	 * This id allow canceling the interval.
	 */
	private _intervalIdForRepeatDigital: number | null = null;

	/**
	 * this is last tap time used to determine if should send click pulse in focus event 
	 */
	private _lastTapTime: number = 0;

	/**
	 * Ch5Pressable manager
	 */
	private _pressable: Ch5Pressable | null = null;

	private _hammerManager: HammerManager = {} as HammerManager;

	/**
	 * image URL. Must be a supported image format, including JPEG, GIF, PNG, SVG, and BMP.
	 */
	private _iconUrl: string = '';

	private _receiveStateCustomClassResponseValue: string = "";
	private _receiveStateCustomStyleResponseValue: string = "";

	/**
	 * CSS class applied while the button is pressed by user.
	 */
	private _customClassPressed: string | null = null;

	/**
	 * CSS class applied while the button is disabled.
	 */
	private _customClassDisabled: string | null = null;

	private allowPress: boolean = true;
	private allowPressTimeout: number = 0;

	private isTouch: boolean = false;

	private previousExtendedProperties: Ch5ButtonExtendedProperties = new Ch5ButtonExtendedProperties();

	private debounceSetButtonDisplay = this.debounce(() => {
		this.setButtonDisplayDetails(this);
	}, this.DEBOUNCE_SETBUTTON_DISPLAY);

	//#endregion

	//#endregion

	//#region 2. Setters and Getters

	public set label(value: string) {
		this.info('set label("' + value + '")');

		if (isNil(value)) {
			value = '';
		}

		const trValue: string = this._getTranslatedValue('label', value);
		if (trValue === this.label) {
			return;
		}
		// // TODO - the below lines are temporary comments to
		// // this._elSpanForLabelOnly.textContent = trValue;
		// // this._label = trValue;
		// this.setAttribute('label', trValue);
		// this.setButtonDisplay(this);

		this._elSpanForLabelOnly.textContent = trValue;
		this._label = trValue;
		this.setAttribute('label', trValue);
		this.setButtonDisplay(this);
	}
	public get label() {
		return this._label;
	}

	public set activeLabel(value: string) {
		this.info('set activeLabel("' + value + '")');
		if (value !== this._activeLabel) {
			this._activeLabel = value;
			this._elSpanForLabelOnly.innerHTML = value;
			this.updateInternalHtml(); // TODO - commented for temporary purpose for testing
		} else if (value === '') {	
			// Happens first time when <template></template> is present
			// TODO - this make sense only in ch5-button-label
			this._activeLabel = value;
			this._elSpanForLabelOnly.innerHTML = value;
			this.updateInternalHtml(); // TODO - commented for temporary purpose for testing
		}
	}
	public get activeLabel() {
		return this._activeLabel;
	}

	public set formType(value: TCh5ButtonActionType | null) {
		this.info('set formType("' + value + '")');
		if (!isNil(value)) {
			this.setAttribute('formType', value);
		} else {
			this.removeAttribute('formType');
		}
		// TODO - _formType isnt set anywhere
	}
	public get formType(): TCh5ButtonActionType | null {
		return this._formType;
	}

	public set customClass(value: string) {
		this.info('set customClass(\'' + value + '\')');
		value = this._checkAndSetStringValue(value);
		if (value !== this._customClass) {
			this.setAttribute('customclass', value);
			this.setButtonDisplay(this);
		}
	}
	public get customClass(): string {
		return this._customClass;
	}

	public set customStyle(value: string) {
		this.info('set customStyle(\'' + value + '\')');
		value = this._checkAndSetStringValue(value);
		if (value !== this._customStyle) {
			this._prevAddedStyle = this._customStyle;
			this.setAttribute('customstyle', value);
			this.setButtonDisplay(this);
		}
	}
	public get customStyle(): string {
		return this._customStyle;
	}

	public set iconClass(value: string) {
		if (typeof this._elIcon.classList === "undefined") {
			return;
		}
		this.info('set iconClass("' + value + '")');
		if (this._iconClass !== null && this._iconClass !== value) {
			this.setAttribute('iconclass', value);
			this.setButtonDisplay(this);
		}
	}
	public get iconClass(): string {
		return this._iconClass;
	}

	public set hAlignLabel(value: TCh5ButtonHorizontalAlignLabel) {
		this.info('set hAlignLabel("' + value + '")');
		if (this._hAlignLabel !== value) {
			this.setAttribute('hAlignLabel', Ch5ButtonUtils.getValidInputValue(Ch5Button.HORIZONTAL_LABEL_ALIGNMENTS, value))
			this.setButtonDisplay(this);
		}
	}
	public get hAlignLabel(): TCh5ButtonHorizontalAlignLabel {
		return this._hAlignLabel;
	}

	public set vAlignLabel(value: TCh5ButtonVerticalAlignLabel) {
		this.info('set vAlignLabel("' + value + '")');
		if (this._vAlignLabel !== value) {
			this.setAttribute('vAlignLabel', Ch5ButtonUtils.getValidInputValue(Ch5Button.VERTICAL_LABEL_ALIGNMENTS, value))
			this.setButtonDisplay(this);
		}
	}
	public get vAlignLabel(): TCh5ButtonVerticalAlignLabel {
		return this._vAlignLabel;
	}

	public set mode(value: number) {
		this.info('set mode("' + value + '")');
		if (this._mode !== value) {
			if (Number.isNaN(value)) {
				this._mode = 0;
			} else {
				if (value >= this.getModes().length) {
					this._mode = 0;
				} else {
					if (this.getModes().length > this.MAX_MODE_LENGTH) {
						this._mode = this.MAX_MODE_LENGTH;
					} else {
						this._mode = value;
					}
				}
			}
		}
		this.setAttribute('mode', String(this._mode));
		this.setButtonDisplay(this);
	}
	public get mode(): number {
		return this._mode;
	}

	public set checkboxPosition(value: TCh5ButtonCheckboxPosition) {
		this.info('set checkboxPosition("' + value + '")');
		if (this._checkboxPosition !== value) {
			this.setAttribute('checkboxPosition', Ch5ButtonUtils.getValidInputValue(Ch5Button.CHECKBOX_POSITIONS, value))
			this.setButtonDisplay(this);
		}
	}
	public get checkboxPosition(): TCh5ButtonCheckboxPosition {
		return this._checkboxPosition;
	}

	public set checkboxShow(value: boolean) {
		this.info('set checkboxShow("' + value + '")');
		// Value always comes as boolean even if input is junk
		if (typeof this._elCheckboxIcon.classList === "undefined") {
			return;
		}
		if (this.hasAttribute("checkboxshow")) {
			const attributeValue: string = (this.getAttribute("checkboxshow") as string).toLowerCase();
			if (attributeValue !== 'false' && attributeValue !== 'true') {
				this.removeAttribute('checkboxshow');
			}
		}
		if (this._checkboxShow !== value) {
			this._checkboxShow = value;
			if (this._checkboxShow === true) {
				this.setAttribute('checkboxShow', 'true');
			} else {
				this.setAttribute('checkboxShow', 'false');
			}
			this.checkboxDisplay();
		}
	}
	public get checkboxShow(): boolean {
		return this._checkboxShow;
	}

	private set buttonPressed(value: boolean) {
		if (this._buttonPressed !== value) {
			this._buttonPressed = value;
			if (value === false) {
				setTimeout(() => {
					this.setButtonDisplay(this);
				}, this.STATE_CHANGE_TIMEOUTS);
			} else {
				this.setButtonDisplay(this);
			}
		}
	}
	private get buttonPressed(): boolean {
		return this._buttonPressed;
	}

	public set iconPosition(value: TCh5ButtonIconPosition) {
		this.info('set iconPosition("' + value + '")');
		if (this._iconPosition !== value) {
			// if (Ch5Button.ICON_POSITIONS.indexOf(value) >= 0) {
			// 	this._iconPosition = value;
			// } else {
			// 	this._iconPosition = Ch5Button.ICON_POSITIONS[0];
			// }
			this.setAttribute('iconposition', Ch5ButtonUtils.getValidInputValue(Ch5Button.ICON_POSITIONS, value));
			this.setButtonDisplay(this);
		}
	}
	public get iconPosition(): TCh5ButtonIconPosition {
		return this._iconPosition;
	}

	public set iconUrl(value: string) {
		if (!isNil(value) && this._iconUrl !== value) {
			// this._iconSvgUrl = value || '';
			// this._elImg.src = this._iconSvgUrl;
			this.setAttribute('iconurl', value);
			this.setButtonDisplay(this);
		}
	}
	public get iconUrl(): string {
		return this._iconUrl;
	}

	public set orientation(value: TCh5ButtonOrientation) {
		this.info('set orientation("' + value + '")');
		if (this._orientation !== value) {
			this._orientation = Ch5ButtonUtils.getValidInputValue(Ch5Button.ORIENTATIONS, value);
			this.setAttribute('orientation', this._orientation);
		}
	}
	public get orientation(): TCh5ButtonOrientation {
		return this._orientation;
	}

	public set type(value: TCh5ButtonType) {
		this.info('set type("' + value + '")');
		if (this._type !== value) {
			this.setAttribute('type', Ch5ButtonUtils.getValidInputValue(Ch5Button.TYPES, value));
			this.setButtonDisplay(this);
		}
	}
	public get type(): TCh5ButtonType {
		return this._type;
	}

	public set shape(value: TCh5ButtonShape) {
		this.info('set shape("' + value + '")');
		if (this._shape !== value && value !== null) {
			if (Ch5Button.SHAPES.indexOf(value) >= 0) {
				this._shape = value;
			} else {
				this._shape = Ch5Button.SHAPES[0];
			}
			this.setAttribute('shape', this._shape);
		}
	}
	public get shape() {
		return this._shape;
	}

	public set size(value: TCh5ButtonSize) {
		this.info('set size("' + value + '")');
		if (this._size !== value && null !== value) {
			if (Ch5Button.SIZES.indexOf(value) >= 0) {
				this._size = value;
			} else {
				this._size = Ch5Button.SIZES[0];
			}
			this.setAttribute('size', this._size);
		}
	}
	public get size() {
		return this._size;
	}

	/**
	 * Stretch takes preference over size
	 */
	public set stretch(value: TCh5ButtonStretch | null) {
		this.info('set stretch("' + value + '")');
		if (value !== null) {
			if (this._stretch !== value) {
				if (Ch5Button.STRETCHES.indexOf(value) >= 0) {
					this._stretch = value;
					this.setAttribute('stretch', this._stretch);
				} else {
					this._stretch = null;
					this.removeAttribute('stretch');
				}
			}
		} else {
			this._stretch = null;
			this.removeAttribute('stretch');
		}
	}
	public get stretch(): TCh5ButtonStretch | null {
		return this._stretch;
	}

	public set selected(value: boolean) {
		this.info('set selected("' + value + '")');
		if (this._selected !== value) {
			this._selected = value;
			if (value === true) {
				this.setAttribute('selected', '');
			} else {
				this.removeAttribute('selected');
			}
			this.setButtonDisplay(this);
			this.checkboxDisplay();
		}
	}
	public get selected(): boolean {
		return this._selected;
	}

	public set customClassState(value: string) {
		this.info('set customclassstate("' + value + '")');
		if (this._customClassState !== value) {
			this._customClassState = value;
		}
	}
	public get customClassState(): string {
		return this._customClassState;
	}

	public set customClassPressed(value: string | null) {
		this.info('set customClassPressed("' + value + '")');
		if (this._customClassPressed !== value) {
			this._customClassPressed = value;
			// if (value !== null) {
			// 	this.setAttribute('customclasspressed', value);
			// }
		}
	}
	public get customClassPressed(): string | null {
		return this._customClassPressed;
	}

	public set customClassDisabled(value: string | null) {
		this.info('set customClassDisabled("' + value + '")');
		if (this._customClassDisabled !== value) {
			this._customClassDisabled = value;
		}
	}
	public get customClassDisabled(): string | null {
		return this._customClassDisabled;
	}

	//#region 2.1. Signals

	public set sendEventOnClick(value: string) {
		this.info('set sendEventOnClick("' + value + '")');
		if ((value !== '') && (value !== this._sigNameSendOnClick)) {
			this._sigNameSendOnClick = value;
			this.setAttribute('sendeventonclick', value);
		}
	}
	public get sendEventOnClick(): string {
		return this._sigNameSendOnClick;
	}

	public set sendEventOnTouch(value: string) {
		this.info('set sendEventOnTouch("' + value + '")');
		if ((value !== '') && (value !== this._sigNameSendOnTouch)) {
			this._sigNameSendOnTouch = value;
			this.setAttribute('sendeventontouch', value);
		}
	}
	public get sendEventOnTouch(): string {
		return this._sigNameSendOnTouch;
	}

	public set receiveStateSelected(value: string) {
		this.info('set receiveStateSelected("' + value + '")');
		if (!value || this._sigNameReceiveSelected === value) {
			return;
		}
		// clean up old subscription
		if (this._sigNameReceiveSelected) {

			const oldReceiveSelectedSigName: string = Ch5Signal.getSubscriptionSignalName(this._sigNameReceiveSelected);
			const oldSignal: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance().getBooleanSignal(oldReceiveSelectedSigName);

			if (oldSignal !== null) {
				oldSignal.unsubscribe(this._subReceiveSelected);
			}
		}

		// update internal property
		this._sigNameReceiveSelected = value;
		// update attribute
		// the condition at the start of the method stops an infinite loop ( property change <-> atribute changed callback)
		this.setAttribute('receiveStateSelected', value);

		// setup new subscription.
		const receiveSelectedSigName: string = Ch5Signal.getSubscriptionSignalName(this._sigNameReceiveSelected);
		const receiveSignal: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance().getBooleanSignal(receiveSelectedSigName);

		if (receiveSignal === null) {
			return;
		}

		this._subReceiveSelected = receiveSignal.subscribe((newValue: boolean) => {
			if (newValue !== this._selected) {
				this.setAttribute('selected', '' + newValue); // concatenates with empty string to convert to string
			}
		});
	}
	public get receiveStateSelected(): string {
		// The internal property is changed if/when the element is removed from DOM
		// Returning the attribute instead of the internal property preserves functionality
		return this._attributeValueAsString('receivestateselected');
	}

	public set receiveStateLabel(value: string) {
		this.info('set receiveStateLabel("' + value + '")');
		if (!value || this._sigNameReceiveLabel === value) {
			return;
		}
		// clean up old subscription
		if (this._sigNameReceiveLabel) {
			const oldReceiveLabelSigName: string = Ch5Signal.getSubscriptionSignalName(this._sigNameReceiveLabel);
			const oldSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(oldReceiveLabelSigName);

			if (oldSignal !== null) {
				oldSignal.unsubscribe(this._subReceiveLabel);
			}
		}

		this._sigNameReceiveLabel = value;
		this.setAttribute('receivestatelabel', value);

		// setup new subscription.
		const receiveLabelSigName: string = Ch5Signal.getSubscriptionSignalName(this._sigNameReceiveLabel);
		const receiveSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(receiveLabelSigName);

		if (receiveSignal === null) {
			return;
		}

		this._subReceiveLabel = receiveSignal.subscribe((newValue: string) => {
			if (newValue !== this.activeLabel) {
				// this.setAttribute('label', newValue);
				this.activeLabel = newValue;
			}
		});
	}
	public get receiveStateLabel(): string {
		// The internal property is changed if/when the element is removed from DOM
		// Returning the attribute instead of the internal property preserves functionality
		return this._attributeValueAsString('receivestatelabel');
	}

	public set receiveStateScriptLabelHtml(value: string) {
		this.info('set receiveStateScriptLabelHtml("' + value + '")');
		if (!value || this._sigNameReceiveScriptLabelHtml === value) {
			return;
		}
		// clean up old subscription
		if (this._sigNameReceiveScriptLabelHtml) {
			const oldReceiveScriptLabelHtmlSigName: string = Ch5Signal.getSubscriptionSignalName(this._sigNameReceiveScriptLabelHtml);
			const oldSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(oldReceiveScriptLabelHtmlSigName);

			if (oldSignal !== null) {
				oldSignal.unsubscribe(this._subReceiveScriptLabelHtml);
			}
		}

		this._sigNameReceiveScriptLabelHtml = value;
		this.setAttribute('receivestatescriptlabelhtml', value);

		// setup new subscription.
		const receiveScriptLabelHtmlSigName: string = Ch5Signal.getSubscriptionSignalName(this._sigNameReceiveScriptLabelHtml);
		const receiveSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(receiveScriptLabelHtmlSigName);

		if (receiveSignal === null) {
			return;
		}

		this._subReceiveScriptLabelHtml = receiveSignal.subscribe((newValue: string) => {
			if ('' !== newValue && newValue !== this.activeLabel) {
				this.activeLabel = newValue;
				// this._elSpanForLabelOnly.innerHTML = newValue;
			}
		});
	}
	public get receiveStateScriptLabelHtml(): string {
		// The internal property is changed if/when the element is removed from DOM
		// Returning the attribute instead of the internal property preserves functionality
		return this._attributeValueAsString('receivestatescriptlabelhtml');
	}

	public set receiveStateIconClass(signalName: string | null) {
		this.info('set receiveStateIconClass(\'' + signalName + '\')');
		if (!signalName || this._receiveStateIconClass === signalName) {
			return;
		}
		// clean up old subscription
		if (this._receiveStateIconClass) {
			const oldReceiveStateIconClass: string = Ch5Signal.getSubscriptionSignalName('' + this._receiveStateIconClass);
			const oldSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(oldReceiveStateIconClass);

			if (oldSignal !== null) {
				oldSignal.unsubscribe('' + this.subReceiveSignalIconClass);
			}
		}

		this._receiveStateIconClass = signalName;
		this.setAttribute('receivestateiconclass', signalName);

		// setup new subscription.
		const receiveSateIconClassSigName: string = Ch5Signal.getSubscriptionSignalName('' + this._receiveStateIconClass);
		const receiveSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(receiveSateIconClassSigName);

		if (receiveSignal === null) {
			return;
		}
		this.info("Before subReceiveSignalIconClass");
		this.subReceiveSignalIconClass = receiveSignal.subscribe((newValue: string) => {
			this._receiveStateIconClassResponseValue = newValue;
			this.setButtonDisplay(this);
		});
	}
	public get receiveStateIconClass(): string | null {
		return this._receiveStateIconClass;
	}

	public set subReceiveSignalIconClass(subscription: string | null) {
		this._subReceiveSignalIconClass = subscription;
	}
	public get subReceiveSignalIconClass(): string | null {
		return this._subReceiveSignalIconClass;
	}

	public set receiveStateIconUrl(signalName: string | null) {
		this.info('set receivestateiconurl("' + signalName + '")');
		if (!signalName || this._receiveStateIconSvgUrl === signalName) {
			return;
		}
		// clean up old subscription
		if (this._receiveStateIconSvgUrl) {

			const oldReceiveIconUrlSigName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateIconSvgUrl);
			const oldSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(oldReceiveIconUrlSigName);

			if (oldSignal !== null) {
				oldSignal.unsubscribe(this.subReceiveSignalSvgUrl as string);
			}
		}

		this._receiveStateIconSvgUrl = signalName;
		this.setAttribute('receivestateiconurl', signalName);

		// setup new subscription.
		const receiveIconurlSigName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateIconSvgUrl);
		const receiveSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(receiveIconurlSigName);

		if (receiveSignal === null) {
			return;
		}

		this.subReceiveSignalSvgUrl = receiveSignal.subscribe((newValue: string) => {
			this._receiveStateIconUrlResponseValue = newValue;
			this.setButtonDisplay(this);
		});
	}
	public get receiveStateIconUrl(): string | null {
		return this._attributeValueAsString('receivestateiconurl');
	}

	public set subReceiveSignalSvgUrl(subscription: string | null) {
		this._subReceiveSignalSvgUrl = subscription;
	}
	public get subReceiveSignalSvgUrl(): string | null {
		return this._subReceiveSignalSvgUrl;
	}

	public set receiveStateType(signalName: string) {
		this.info('set receiveStateType(\'' + signalName + '\')');

		if (this._sigNameReceiveStateType === signalName || signalName === null) {
			return;
		}
		// clean up old subscription
		if (this._sigNameReceiveStateType) {

			const oldReceiveStateSigName: string = Ch5Signal.getSubscriptionSignalName(this._sigNameReceiveStateType);
			const oldSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(oldReceiveStateSigName);

			if (oldSignal !== null) {
				oldSignal.unsubscribe(this._subReceiveSignalType as string);
			}
		}

		this._sigNameReceiveStateType = signalName;
		this.setAttribute('receivestatetype', signalName);

		// setup new subscription.
		const receiveLabelSigName: string = Ch5Signal.getSubscriptionSignalName(this._sigNameReceiveStateType);
		const receiveSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(receiveLabelSigName);

		if (receiveSignal === null) {
			return;
		}

		this._subReceiveSignalType = receiveSignal.subscribe((newValue: string) => {
			this._receiveStateTypeResponseValue = newValue as TCh5ButtonType;
			this.setButtonDisplay(this);
		});
	}
	public get receiveStateType(): string {
		return this._attributeValueAsString('receivestatetype');
	}

	public set receiveStateMode(signalName: string) {
		this.info('set receiveStateMode(\'' + signalName + '\')');
		this.info('this._sigNameReceiveStateMode' + this._sigNameReceiveStateMode);
		this.info('signalName' + signalName);

		if (this._sigNameReceiveStateMode === signalName || signalName === null) {
			return;
		}

		// clean up old subscription
		if (this._sigNameReceiveStateMode) {
			this.info('_sigNameReceiveStateMode exists');

			const oldReceiveStateSigName: string = Ch5Signal.getSubscriptionSignalName(this._sigNameReceiveStateMode);
			const oldSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(oldReceiveStateSigName);

			this.info('oldReceiveStateSigName', oldReceiveStateSigName);
			this.info('oldSignal', oldSignal);
			if (oldSignal !== null) {
				oldSignal.unsubscribe(this._subReceiveSignalMode as string);
			}
		}

		this._sigNameReceiveStateMode = signalName;
		this.info('signalName2: ', signalName);
		this.setAttribute('receivestatemode', signalName);

		// setup new subscription.
		const receiveLabelSigName: string = Ch5Signal.getSubscriptionSignalName(this._sigNameReceiveStateMode);
		const receiveSignal: Ch5Signal<number> | null = Ch5SignalFactory.getInstance().getNumberSignal(receiveLabelSigName);
		if (receiveSignal === null) {
			return;
		}

		this._subReceiveSignalMode = receiveSignal.subscribe((newValue: number) => {
			this.mode = (newValue) as number;
			this.setButtonDisplay(this);
		});
	}
	public get receiveStateMode(): string {
		return this._attributeValueAsString('receivestatemode');
	}

	// Rewriting this property from base class since it has to follow more features for button like buttonmode and state
	public set receiveStateCustomClass(value: string) {
		this.info('set receiveStateCustomClass(\'' + value + '\')');
		value = this._checkAndSetStringValue(value);
		if ('' === value || value === this._receiveStateCustomClass) {
			return;
		}

		this.clearStringSignalSubscription(this._receiveStateCustomClass, this._subKeySigReceiveCustomClass);

		this._receiveStateCustomClass = value;
		this.setAttribute('receivestatecustomclass', value);

		const recSigCustomClassName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateCustomClass);
		const recSig: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(recSigCustomClassName);

		if (null === recSig) {
			return;
		}
		// let hasSignalChanged = false;

		this._subKeySigReceiveCustomClass = recSig.subscribe((newValue: string) => {
			this.info('subs callback for signalReceiveCustomClass: ', this._receiveStateCustomClass, ' Signal has value ', newValue);
			// if ('' !== newVal) {
			// 	hasSignalChanged = true;
			// }
			// if (newVal !== this.customClass && hasSignalChanged) {
			// this.setAttribute('customclass', newVal);
			// this._customClass = newVal;
			this._receiveStateCustomClassResponseValue = newValue;
			this.setButtonDisplay(this);

			// }
		});
	}

	public get receiveStateCustomClass(): string {
		// The internal property is changed if/when the element is removed from dom
		// Returning the attribute instead of the internal property preserves functionality
		return this._attributeValueAsString('receivestatecustomclass');
	}

	// Rewriting this property from base class since it has to follow more features for button like buttonmode and state
	public set receiveStateCustomStyle(value: string) {
		this.info('set receiveStateCustomStyle(\'' + value + '\')');
		value = this._checkAndSetStringValue(value);
		if ('' === value || value === this._receiveStateCustomStyle) {
			return;
		}

		this.clearStringSignalSubscription(this._receiveStateCustomStyle, this._subKeySigReceiveCustomStyle);

		this._receiveStateCustomStyle = value;
		this.setAttribute('receivestatecustomstyle', value);

		const recSigCustomStyleName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateCustomStyle);
		const recSig: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(recSigCustomStyleName);

		if (null === recSig) {
			return;
		}

		// let hasSignalChanged = false;
		this._subKeySigReceiveCustomStyle = recSig.subscribe((newValue: string) => {
			this.info(' subs callback for signalReceiveCustomStyle: ', this._subKeySigReceiveCustomStyle, ' Signal has value ', newValue);
			// if ('' !== newVal) {
			// 	hasSignalChanged = true;
			// }
			// if (newVal !== this.customStyle && hasSignalChanged) {
			// 	// this.setAttribute('customStyle', newVal);
			// 	this._customStyle = newVal;
			// }
			this._receiveStateCustomStyleResponseValue = newValue;
			this.setButtonDisplay(this);

		});
	}
	public get receiveStateCustomStyle(): string {
		// The internal property is changed if/when the element is removed from dom
		// Returning the attribute instead of the internal property preserves functionality
		return this._attributeValueAsString('receivestatecustomstyle');
	}

	public set subReceiveSignalType(subscription: string | null) {
		this._subReceiveSignalType = subscription;
	}
	public get subReceiveSignalType(): string | null {
		return this._subReceiveSignalType;
	}

	private _subscribeToPressableIsPressed() {
		if (this._pressableIsPressedSubscription === null && this._pressable !== null) {
			this._pressableIsPressedSubscription = this._pressable.observablePressed.subscribe((value: boolean) => {
				if (value !== this._buttonPressedInPressable) {
					this._buttonPressedInPressable = value;
					if (value === false) {
						setTimeout(() => {
							this.setButtonDisplay(this);
						}, this.STATE_CHANGE_TIMEOUTS);
					} else {
						this.setButtonDisplay(this);
					}
				}
			});
		}
	}
	private _unsubscribeFromPressableIsPressed() {
		if (this._pressableIsPressedSubscription !== null) {
			this._pressableIsPressedSubscription.unsubscribe();
			this._pressableIsPressedSubscription = null;
		}
	}

	//#endregion

	//#endregion

	//#region 3. Lifecycle Hooks

	public constructor() {
		super();
		this.logger.start('constructor()', this.COMPONENT_NAME);
		this._listOfAllPossibleComponentCssClasses = this.generateListOfAllPossibleComponentCssClasses();

		// TODO - Check this variable - seems to be in baseclass but is not required in base class
		if (!this._wasInstatiated) {
			this.createInternalHtml();
		}
		this._wasInstatiated = true;

		this.updatePressedClass(this.cssClassPrefix + this.pressedCssClassPostfix);

		this._pressInfo = new Ch5ButtonPressInfo();

		this._onBlur = this._onBlur.bind(this);
		this._onFocus = this._onFocus.bind(this);
		this._onPress = this._onPress.bind(this);
		this._onPressUp = this._onPressUp.bind(this);
		this._onTap = this._onTap.bind(this);
		this._onTouchEnd = this._onTouchEnd.bind(this);
		this._onTouchCancel = this._onTouchCancel.bind(this);
		this._onTouchMove = this._onTouchMove.bind(this);
		this._onPressClick = this._onPressClick.bind(this);
		this._onMouseUp = this._onMouseUp.bind(this);
		this._onMouseMove = this._onMouseMove.bind(this);
		this._onLeave = this._onLeave.bind(this);

		this.logger.stop();
	}

	/**
	 * Called when the ch5-button component is first connected to the DOM
	 */
	public connectedCallback() {
		this.logger.start('connectedCallback()', this.COMPONENT_NAME);

		// WAI-ARIA Attributes
		if (!this.hasAttribute('role')) {
			this.setAttribute('role', Ch5RoleAttributeMapping.ch5Button);
		}

		if (this._elContainer.parentElement !== this) {
			this.appendChild(this._elContainer);
		}

		if (this.customClassState && this.hasAttribute('customclasspressed')) {
			this.updatePressedClass(this.customClassState);
		}

		// init pressable before initAttributes because pressable subscribe to gestureable attribute
		if (!isNil(this._pressable)) {
			this._pressable.init();
			this._subscribeToPressableIsPressed();

		}

		this._hammerManager = new Hammer(this._elContainer);

		this.initAttributes();
		this.updateCssClasses();
		this.updateForChangeInStretch();
		this.attachEventListeners();
		this.initCommonMutationObserver(this);

		if (!this.hasAttribute('customclasspressed')) {
			this.updateCssClassesForCustomState();
		}
		this.logger.stop();
	}

	public static get observedAttributes() {
		const inheritedObsAttrs = Ch5Common.observedAttributes;
		const newObsAttrs = [
			'label',

			'iconclass',
			'iconposition',
			'orientation',
			'iconurl',

			'checkboxshow',
			'checkboxposition',

			'halignlabel',
			'valignlabel',

			'shape',
			'size',
			'stretch',
			'type',
			'formtype',
			'mode',

			'selected',
			'customclassselected',
			'customclasspressed',
			'customclassdisabled',

			'receivestatemode',
			'receivestateselected',
			'receivestatelabel',
			'receivestatescriptlabelhtml',
			'receivestateiconclass',
			'receivestateiconurl',
			'receivestatetype',

			'sendeventonclick',
			'sendeventontouch'
		];

		return inheritedObsAttrs.concat(newObsAttrs);
	}

	protected initAttributes() {
		super.initAttributes();
		this.logger.start("initAttributes", this.COMPONENT_NAME);

		if (this.hasAttribute('checkboxposition')) {
			this.checkboxPosition = this.getAttribute('checkboxposition') as TCh5ButtonCheckboxPosition;
		}
		// let isCheckboxShow = false;
		if (this.hasAttribute('checkboxshow')) {
			this.checkboxShow = this.toBoolean((this.getAttribute('checkboxshow')));
		}
		// this.checkboxShow = isCheckboxShow;
		if (this.hasAttribute('customclassselected')) {
			this.customClassState = this.getAttribute('customclassselected') as string;
		}
		if (this.hasAttribute('customclasspressed')) {
			this.customClassPressed = this.getAttribute('customclasspressed') as string;
			this.customClassState = this.customClassPressed;
		}
		if (this.hasAttribute('customclassdisabled')) {
			this.customClassDisabled = this.getAttribute('customclassdisabled') as string;
			this.customClassState = this.customClassDisabled;
		}
		if (this.hasAttribute('formtype')) {
			this.formType = this.getAttribute('formtype') as TCh5ButtonActionType | null;
		}
		if (this.hasAttribute('halignlabel')) {
			this.hAlignLabel = this.getAttribute('halignlabel') as TCh5ButtonHorizontalAlignLabel;
		}
		if (this.hasAttribute('iconclass')) {
			this.iconClass = this.getAttribute('iconclass') as string;
		}
		if (this.hasAttribute('iconposition')) {
			this.iconPosition = this.getAttribute('iconposition') as TCh5ButtonIconPosition;
		}
		if (this.hasAttribute('iconurl')) {
			this.iconUrl = this.getAttribute('iconurl') as string;
		}
		if (this.hasAttribute('label')) {
			this.label = this.getAttribute('label') as string;
		}
		if (this.hasAttribute('mode')) {
			this.mode = Number(this.getAttribute('mode')); // TODO isNaN(this.getAttribute('mode')) ? 0 : Number(this.getAttribute('mode')) as number;
		}
		if (this.hasAttribute('orientation')) {
			this.orientation = this.getAttribute('orientation') as TCh5ButtonOrientation;
		}
		// let isSelected = false;
		// TODO - why is customclassselected checked?
		// if (this.hasAttribute('selected') && !this.hasAttribute('customclassselected')) {
		if (this.hasAttribute('selected')) {
			// 	const attrSelected = (this.getAttribute('selected') as string).toLowerCase();
			// if (attrSelected !== 'false' && attrSelected !== '0') {
			// 	isSelected = true;
			// }
			this.selected = this.toBoolean((this.getAttribute('selected')), true);
		}
		// this.selected = isSelected;

		if (this.hasAttribute('shape')) {
			this.shape = this.getAttribute('shape') as TCh5ButtonShape;
		}
		if (this.hasAttribute('size')) {
			this.size = this.getAttribute('size') as TCh5ButtonSize;
		}
		if (this.hasAttribute('stretch')) {
			this.stretch = this.getAttribute('stretch') as TCh5ButtonStretch | null;
		}
		if (this.hasAttribute('type')) {
			this.type = this.getAttribute('type') as TCh5ButtonType;
		}
		if (this.hasAttribute('valignlabel')) {
			this.vAlignLabel = this.getAttribute('valignlabel') as TCh5ButtonVerticalAlignLabel;
		}

		// signals
		if (this.hasAttribute('receivestateselected')) {
			this.receiveStateSelected = this.getAttribute('receivestateselected') as string;
		}
		if (this.hasAttribute('receivestatelabel')) {
			this.receiveStateLabel = this.getAttribute('receivestatelabel') as string;
		}
		if (this.hasAttribute('receivestatescriptlabelhtml')) {
			this.receiveStateScriptLabelHtml = this.getAttribute('receivestatescriptlabelhtml') as string;
		}
		if (this.hasAttribute('receivestateiconclass')) {
			this.receiveStateIconClass = this.getAttribute('receivestateiconclass') as string;
		}
		if (this.hasAttribute('receivestateiconurl')) {
			this.receiveStateIconUrl = this.getAttribute('receivestateiconurl');
		}
		if (this.hasAttribute('receivestatetype')) {
			this.receiveStateType = this.getAttribute('receivestatetype') as string;
		}
		if (this.hasAttribute('receivestatemode')) {
			this.receiveStateMode = this.getAttribute('receivestatemode') as string;
		}
		if (this.hasAttribute('sendeventonclick')) {
			this.sendEventOnClick = this.getAttribute('sendeventonclick') as string;
		}
		if (this.hasAttribute('sendeventontouch')) {
			this.sendEventOnTouch = this.getAttribute('sendeventontouch') as string;
		}
		this.updateInternalHtml();
		this.logger.stop();
	}

	protected attachEventListeners() {
		super.attachEventListeners();

		if (this._pressable !== null && this._pressable.ch5Component.gestureable === false) {
			this._hammerManager.on('tap', this._onTap);
		}

		this._elButton.addEventListener('mousedown', this._onPressClick);
		this._elButton.addEventListener('mouseup', this._onMouseUp);
		this._elButton.addEventListener('mousemove', this._onMouseMove);
		this._elButton.addEventListener('touchstart', this._onPress, { passive: true });
		this._elButton.addEventListener('mouseleave', this._onLeave);
		this._elButton.addEventListener('touchend', this._onPressUp);
		this._elButton.addEventListener('touchmove', this._onTouchMove, { passive: true });
		this._elButton.addEventListener('touchend', this._onTouchEnd);
		this._elButton.addEventListener('touchcancel', this._onTouchCancel);
		this._elButton.addEventListener('focus', this._onFocus);
		this._elButton.addEventListener('blur', this._onBlur);
	}


	protected removeEventListeners() {
		super.removeEventListeners();

		this._elButton.removeEventListener('touchstart', this._onPress);
		this._elButton.removeEventListener('touchend', this._onPressUp);
		this._hammerManager.off('tap', this._onTap);

		this._elButton.removeEventListener('touchend', this._onTouchEnd);
		this._elButton.removeEventListener('touchcancel', this._onTouchCancel);
		this._elButton.removeEventListener('touchmove', this._onTouchMove);
		this._elButton.removeEventListener('focus', this._onFocus);
		this._elButton.removeEventListener('blur', this._onBlur);
		this._elButton.removeEventListener('mousedown', this._onPressClick);
		this._elButton.removeEventListener('mouseup', this._onMouseUp);
		this._elButton.removeEventListener('mouseleave', this._onLeave);
	}

	protected updateForChangeInCustomCssClass() {
		const targetElement: HTMLElement = this.getTargetElementForCssClassesAndStyle();
		this.logger.start("updateForChangeInCustomCssClass()");
		this.logger.log("updateForChangeInCustomCssClass()", this._prevAddedCustomClasses);
		this.logger.log("from ch5button - updateForChangeInCustomCssClass()", this.customClass);

		this._prevAddedCustomClasses.forEach((className: string) => {
			if (className !== '') {
				targetElement.classList.remove(className);
			}
		});
		this._prevAddedCustomClasses = [];

		this.customClass.split(' ').forEach((className: string) => {
			if (className !== '') {
				this._prevAddedCustomClasses.push(className);
				targetElement.classList.add(className);
			}
		});
		this.logger.stop();
	}

	protected updateForChangeInStyleCss() {
		this.info("from button - updateForChangeInStyleCss()");
		const targetElement: HTMLElement = this.getTargetElementForCssClassesAndStyle();
		targetElement.style.cssText = this.customStyle;
	}

	/**
	 * Called when an HTML attribute is changed, added or removed
	 */
	public attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
		this.logger.start("attributeChangedCallback", this.COMPONENT_NAME);
		if (oldValue === newValue) {
			this.logger.stop();
			return;
		}

		this.info('ch5-button attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + ')"');

		switch (attr) {
			case 'customclass': // this is written to manage modes
				// super.attributeChangedCallback(attr, oldValue, newValue);
				// this.setButtonDisplay(this);
				this.customClass = Ch5ButtonUtils.getAttributeValue<string>(this, 'customclass', newValue, '');
				this.updateForChangeInCustomCssClass();
				break;

			case 'receivestatecustomclass': // this is written to manage modes
				// super.attributeChangedCallback(attr, oldValue, newValue);
				if (this.hasAttribute('receivestatecustomclass')) {
					this.receiveStateCustomClass = this.getAttribute('receivestatecustomclass') as string;
				} else {
					this.clearStringSignalSubscription(this._receiveStateCustomClass, this._subKeySigReceiveCustomClass);
					this._receiveStateCustomClass = '';
				}
				this.updateForChangeInCustomCssClass();
				break;

			case 'customstyle': // this is written to manage modes
				// super.attributeChangedCallback(attr, oldValue, newValue);
				// this.setButtonDisplay(this);
				this.customStyle = Ch5ButtonUtils.getAttributeValue<string>(this, 'customstyle', newValue, '');
				this.updateForChangeInStyleCss();
				break;

			case 'receivestatecustomstyle':
				if (this.hasAttribute('receivestatecustomstyle')) {
					this.receiveStateCustomStyle = this.getAttribute('receivestatecustomstyle') as string;
				} else {
					this.clearStringSignalSubscription(this._receiveStateCustomStyle, this._subKeySigReceiveCustomStyle);
					this._receiveStateCustomStyle = '';
				}
				this.updateForChangeInStyleCss();
				break;

			case 'label':
				this.label = Ch5ButtonUtils.getAttributeValue<string>(this, 'label', newValue, '');
				this.updateInternalHtml(); // TODO - commented for temporary purpose for testing
				break;

			case 'iconclass':
				this.iconClass = Ch5ButtonUtils.getAttributeValue<string>(this, 'iconclass', newValue, '');
				this.updateCssClasses();
				this.updateInternalHtml(); // TODO - commented for temporary purpose for testing
				break;

			case 'iconposition':
				this.iconPosition = Ch5ButtonUtils.getAttributeValue<TCh5ButtonIconPosition>(this, 'iconposition', newValue as TCh5ButtonIconPosition, Ch5Button.ICON_POSITIONS[0]);
				this.updateCssClasses();
				this.updateInternalHtml(); // TODO - commented for temporary purpose for testing
				break;

			case 'iconurl':
				this.iconUrl = Ch5ButtonUtils.getAttributeValue<string>(this, 'iconurl', newValue, '');
				this.updateCssClasses();
				this.updateInternalHtml(); // TODO - commented for temporary purpose for testing
				break;

			case 'mode':
				this.mode = Ch5ButtonUtils.getAttributeValue<number>(this, 'mode', Number(newValue), 0);
				this.updateCssClasses();
				this.updateInternalHtml(); // TODO - commented for temporary purpose for testing
				break;

			case 'orientation':
				this.orientation = Ch5ButtonUtils.getAttributeValue<TCh5ButtonOrientation>(this, 'orientation', newValue as TCh5ButtonOrientation, Ch5Button.ORIENTATIONS[0]);
				this.updateCssClasses();
				break;

			case 'type':
				this.type = Ch5ButtonUtils.getAttributeValue<TCh5ButtonType>(this, 'type', newValue as TCh5ButtonType, Ch5Button.TYPES[0]);
				this.updateCssClasses();
				break;

			case 'shape':
				this.shape = Ch5ButtonUtils.getAttributeValue<TCh5ButtonShape>(this, 'shape', newValue as TCh5ButtonShape, Ch5Button.SHAPES[0]);
				this.updateCssClasses();
				break;

			case 'halignlabel':
				this.hAlignLabel = Ch5ButtonUtils.getAttributeValue<TCh5ButtonHorizontalAlignLabel>(this, 'halignlabel', newValue as TCh5ButtonHorizontalAlignLabel, Ch5Button.HORIZONTAL_LABEL_ALIGNMENTS[0]);
				this.updateCssClasses();
				break;

			case 'valignlabel':
				this.vAlignLabel = Ch5ButtonUtils.getAttributeValue<TCh5ButtonVerticalAlignLabel>(this, 'valignlabel', newValue as TCh5ButtonVerticalAlignLabel, Ch5Button.VERTICAL_LABEL_ALIGNMENTS[0]);
				this.updateCssClasses();
				break;

			case 'size':
				this.size = Ch5ButtonUtils.getAttributeValue<TCh5ButtonSize>(this, 'size', newValue as TCh5ButtonSize, Ch5Button.SIZES[0]);
				this.updateCssClasses();
				break;

			case 'stretch':
				this.stretch = Ch5ButtonUtils.getAttributeValue<TCh5ButtonStretch | null>(this, 'stretch', newValue as TCh5ButtonStretch, null);
				this.updateForChangeInStretch();
				break;

			case 'selected':
				if (!this.hasAttribute('customclassselected')) {
					let isSelected = false;
					if (this.hasAttribute('selected')) {
						const attrSelected = (this.getAttribute('selected') as string).toLowerCase();
						if ('false' !== attrSelected && '0' !== attrSelected) {
							isSelected = true;
						}
					}
					this.selected = isSelected;
					this.updateCssClasses();
				}
				break;

			case 'checkboxshow':
				let isCheckboxShow = false;
				if (this.hasAttribute('checkboxshow')) {
					isCheckboxShow = this.toBoolean(this.getAttribute('checkboxshow'));
				}
				this.checkboxShow = isCheckboxShow;
				this.checkboxDisplay();
				break;

			case 'checkboxposition':
				this.checkboxPosition = Ch5ButtonUtils.getAttributeValue<TCh5ButtonCheckboxPosition>(this, 'checkboxposition', newValue as TCh5ButtonCheckboxPosition, Ch5Button.CHECKBOX_POSITIONS[0]);
				this.checkboxDisplay();
				break;

			case 'formtype':
				if (this.hasAttribute('formtype')) {
					this.formType = this.getAttribute('formtype') as TCh5ButtonActionType | null;
				}
				break;

			case 'customclassselected':
				this.customClassState = Ch5ButtonUtils.getAttributeValue<string>(this, 'customclassselected', newValue, '');
				this.updateCssClassesForCustomState();
				break;

			case 'customclasspressed':
				this.customClassPressed = Ch5ButtonUtils.getAttributeValue<string>(this, 'customclasspressed', newValue, '');
				this.customClassState = this.customClassPressed;
				this.updatePressedClass(this.customClassState);
				break;

			case 'customclassdisabled':
				this.customClassDisabled = Ch5ButtonUtils.getAttributeValue<string>(this, 'customclassdisabled', newValue, '');
				this.customClassState = this.customClassDisabled;
				this.updateCssClassesForCustomState();
				break;

			case 'receivestateselected':
				this.receiveStateSelected = Ch5ButtonUtils.getAttributeValue<string>(this, 'receivestateselected', newValue, '');
				break;

			case 'receivestatelabel':
				this.receiveStateLabel = Ch5ButtonUtils.getAttributeValue<string>(this, 'receivestatelabel', newValue, '');
				break;

			case 'receivestatescriptlabelhtml':
				this.receiveStateScriptLabelHtml = Ch5ButtonUtils.getAttributeValue<string>(this, 'receivestatescriptlabelhtml', newValue, '');
				break;

			case 'sendeventonclick':
				this.sendEventOnClick = Ch5ButtonUtils.getAttributeValue<string>(this, 'sendeventonclick', newValue, '');
				break;

			case 'sendeventontouch':
				this.sendEventOnTouch = Ch5ButtonUtils.getAttributeValue<string>(this, 'sendeventontouch', newValue, '');
				break;

			case 'receivestateiconclass':
				this.receiveStateIconClass = Ch5ButtonUtils.getAttributeValue<string>(this, 'receivestateiconclass', newValue, '');
				break;

			case 'receivestateiconurl':
				this.receiveStateIconUrl = Ch5ButtonUtils.getAttributeValue<string>(this, 'receivestateiconurl', newValue, '');
				break;

			case 'receivestatetype':
				this.receiveStateType = Ch5ButtonUtils.getAttributeValue<string>(this, 'receivestatetype', newValue, '');
				break;

			case 'receivestatemode':
				this.receiveStateMode = Ch5ButtonUtils.getAttributeValue<string>(this, 'receivestatemode', newValue, '');
				break;

			default:
				super.attributeChangedCallback(attr, oldValue, newValue);
				break;
		}
		this.logger.stop();
	}

	/**
	 * Called when the ch5-button component is disconnected from the DOM
	 */
	public disconnectedCallback() {
		this.logger.start('disconectedCallback()', this.COMPONENT_NAME);
		this.removeEventListeners();
		this.unsubscribeFromSignals();

		// destroy pressable
		if (null !== this._pressable) {
			this._pressable.destroy();
		}

		// disconnect common mutation observer
		this.disconnectCommonMutationObserver();
		this.logger.stop();
	}

	//#endregion

	//#region 4. Other Methods

	/**
	 * Called when pressed class will be available
	 * @param pressedClass is class name. it will add after press the ch5 button
	 */
	private updatePressedClass(pressedClass: string) {
		this._pressable = new Ch5Pressable(this, {
			cssTargetElement: this.getTargetElementForCssClassesAndStyle(),
			cssPressedClass: pressedClass
		});
	}

	/**
	 * Called this method if you have to wrap the element
	 * @param el html elemen which you have to wrap
	 * @param wrapper wrapper html element
	 */
	private wrap(el: any, wrapper: HTMLElement) {
		el.parentNode.insertBefore(wrapper, el);
		wrapper.appendChild(el);
	}

	private generateListOfAllPossibleComponentCssClasses(): string[] {
		const cssClasses: string[] = this._listOfAllPossibleComponentCssClasses;
		cssClasses.push(this.primaryCssClass);

		// shapes
		Ch5Button.SHAPES.forEach((shape: TCh5ButtonShape) => {
			const newClass = this.cssClassPrefix + '--' + shape;
			cssClasses.push(newClass);
		});

		// types
		Ch5Button.TYPES.forEach((type: TCh5ButtonType) => {
			const newCssClass = this.cssClassPrefix + '--' + type;
			cssClasses.push(newCssClass);
		});

		// horizontal align label
		Ch5Button.HORIZONTAL_LABEL_ALIGNMENTS.forEach((type: TCh5ButtonHorizontalAlignLabel) => {
			const newCssClass = this.cssClassPrefix + '--horizontal-' + type;
			cssClasses.push(newCssClass);
		});

		// vertical align label
		Ch5Button.VERTICAL_LABEL_ALIGNMENTS.forEach((type: TCh5ButtonVerticalAlignLabel) => {
			const newCssClass = this.cssClassPrefix + '--vertical-' + type;
			cssClasses.push(newCssClass);
		});

		// sizes
		Ch5Button.SIZES.forEach((size: TCh5ButtonSize) => {
			cssClasses.push(this.cssClassPrefix + '--size-' + size);
		});

		// stretches
		Ch5Button.STRETCHES.forEach((stretch: TCh5ButtonStretch) => {
			cssClasses.push(this.cssClassPrefix + '--stretch-' + stretch);
		});

		// orientation
		Ch5Button.ORIENTATIONS.forEach((orientation: TCh5ButtonOrientation) => {
			cssClasses.push(this.cssClassPrefix + '--' + orientation);
		});

		// selected
		cssClasses.push(this.cssClassPrefix + this.selectedCssClassPostfix);

		return cssClasses;
	}

	public unsubscribeFromSignals() {
		this.info('unsubscribeFromSignals()');
		super.unsubscribeFromSignals();

		const csf = Ch5SignalFactory.getInstance();
		this.clearSignalValue(csf, this, "_subReceiveLabel", "_sigNameReceiveLabel");
		this.clearSignalValue(csf, this, "_subReceiveSignalType", "_sigNameReceiveStateType");
		this.clearSignalValue(csf, this, "_subReceiveSignalMode", "_sigNameReceiveStateMode");
		this.clearSignalValue(csf, this, "_subReceiveSelected", "_sigNameReceiveSelected");
		this.clearSignalValue(csf, this, "_subReceiveScriptLabelHtml", "_sigNameReceiveScriptLabelHtml");
		this.info('unsubscribeFromSignals() end');
	}

	private clearSignalValue(csf: Ch5SignalFactory, obj: any, receiveAttribute: string, signalReceiveAttribute: string) {
		if (obj[receiveAttribute] !== '' && obj[signalReceiveAttribute] !== '') {
			const receiveValueSigName: string = Ch5Signal.getSubscriptionSignalName(obj[signalReceiveAttribute]);
			const sigLabel: Ch5Signal<string> | null = csf.getStringSignal(receiveValueSigName);
			if (null !== sigLabel) {
				sigLabel.unsubscribe(obj[receiveAttribute]);
				obj[signalReceiveAttribute] = '';
			}
		}
	}

	public imgToSvg(img: HTMLImageElement) {
		const imgID: string = img.id;
		const imgClass: string = img.className;
		const imgURL: string = img.src;
		const imgType = imgURL.split('.').pop();
		const SVG = "svg";
		if (!isNil(imgURL) && (imgType === SVG)) {
			const xmlHttpObject = new XMLHttpRequest();
			xmlHttpObject.onreadystatechange = function () {
				if (this.readyState === 4) {
					const parser = new DOMParser();
					const xmlDoc = parser.parseFromString(this.responseText, 'text/xml');
					const svg = xmlDoc.getElementsByTagName(SVG)[0];
					if (!isNil(svg)) {
						if (!isNil(imgID)) {
							svg.setAttribute('id', imgID);
						}
						if (!isNil(imgClass)) {
							svg.setAttribute('class', imgClass);
						}
						svg.removeAttribute('xmlns:a');
						if (!svg.getAttribute('viewBox') && svg.getAttribute('height') && svg.getAttribute('width')) {
							svg.setAttribute('viewBox', `0 0 ${svg.getAttribute('height')} ${svg.getAttribute('width')}`);
						}
						if (img.parentNode) {
							img.parentNode.replaceChild(svg, img);
						}
					}
				}
			};
			xmlHttpObject.open('GET', imgURL, true);
			xmlHttpObject.send();
		}
	}

	private updateIconClassAndPath() {
		this.logger.start("updateIconClassAndPath");
		if (!isNil(this.iconClass) && this.iconClass !== '') {
			this.iconClass.split(' ').forEach((className: string) => {
				className = className.trim();
				if (className !== '') {
					this._elIcon.classList.add(className); // adds the new icon class if present
				}
			});
		}

		this.logger.stop();
	}

	private clearIconUrlAndClass() {
		if (!isNil(this.iconUrl) && this.iconUrl !== '') {
			this.iconUrl.split(' ').forEach((className: string) => {
				className = className.trim();
				if (this._elImg && this._elImg.classList) {
					this._elImg.classList.remove(className); // remove the icon class if present
				}
			});
		}
		if (!isNil(this.iconClass) && this.iconClass !== '') {
			this.iconClass.split(' ').forEach((className: string) => {
				className = className.trim();
				if (this._elIcon && this._elIcon.classList) {
					this._elIcon.classList.remove(className); // remove the icon class if present
				}
			});
		}
	}

	// TODO - method is not correct below - uses iconclass instead of url
	private updateIconUrlAndPath() {
		this.logger.start("updateIconUrlAndPath");
		if (!isNil(this.iconClass) && this.iconClass !== '') {
			this.iconClass.split(' ').forEach((className: string) => {
				className = className.trim();
				if (className !== '') {
					this._elImg.classList.add(className); // adds the new icon class if present
				}
			});
		}
		this.logger.stop();
	}

	public setLabel(labelHtml: string) {
		this.activeLabel = labelHtml;
	}

	public setMode(modeId: number) {
		this.mode = modeId;
	}

	protected createInternalHtml() {
		this.logger.start('createInternalHtml', this.COMPONENT_NAME);
		this.clearComponentContent();
		this._elContainer = document.createElement('div');
		this._elContainer.classList.add(this.CSS_CLASS_LIST.CONTAINER_CLASS);
		this._elButton = document.createElement('button');
		this._elButton.classList.add(this.CSS_CLASS_LIST.BUTTON_PRIMARY_CLASS);
		this._elCheckboxIcon = document.createElement('i');
		this._elCheckboxIcon.classList.add('cb-icon');
		this._elSpanForLabelIconImg = document.createElement('span');
		this._elSpanForLabelIconImg.classList.add('cb-lbl');
		this._elSpanForLabelOnly = document.createElement('span');
		this._elSpanForLabelOnly.classList.add('cb-lbl');
		this._elIcon = document.createElement('i');
		this._elIcon.classList.add('cb-icon');
		this._elImg = document.createElement('img');
		this._elImg.classList.add('cb-img');

		this._elContainer.classList.add(this.primaryCssClass);
		this._elButton.setAttribute('data-ch5-id', this.getCrId());
		this._elIcon.classList.add(this.cssClassPrefix + '--icon');
		this._elImg.classList.add(this.cssClassPrefix + '--img');
		this._elCheckboxIcon.classList.add(this.cssClassPrefix + '--icon');
		this._elSpanForLabelOnly.classList.add(this.cssClassPrefix + '--label');
		this._elSpanForLabelIconImg.classList.add(this.cssClassPrefix + '--span');

		// The icon and label elements are not appended here since they might not always be displayed and the default
		// css ( like padding ... ) would be applied without having an actual icon or label
		// The elements are appended (if needed) in the updateInternalHtml method

		this._elContainer.appendChild(this._elButton);
		this.logger.stop();
	}

	// adding ellipsis in iOS device with vertical button
	protected createIosEllipsis() {
		if (isSafariMobile()) {
			const btnNodes: any = this._elButton.childNodes;
			btnNodes.forEach((node: any) => {
				if (node.className === (this.primaryCssClass + '--ios-label')) {
					node.remove();
				}
			});

			if (this.isLabelLoaded) {
				this.createEllipsisTpl();
			} else {
				let timer: any;
				clearTimeout(timer);
				timer = setTimeout(() => {
					this.createEllipsisTpl();
					this.isLabelLoaded = true;
				}, 2000);
			}
		}
	}

	// creating three dots for iOS
	private createEllipsisTpl() {
		if (this._elSpanForLabelOnly.scrollHeight > this._elSpanForLabelOnly.clientHeight) {
			this._elContainer.classList.add(this.primaryCssClass + this.iosCssClassPostfix);
			this._elIosDots = document.createElement('i');
			this._elIosDots.classList.add('dots');
			this._elIosDots.innerHTML = '...';
			this._elSpanForLabelOnly.appendChild(this._elIosDots);
			const wrapper: HTMLElement = document.createElement('span');
			wrapper.classList.add(this.primaryCssClass + '--ios-label');
			if (!this._elSpanForLabelOnly.closest('.ch5-button--ios-label')) {
				this.wrap(this._elSpanForLabelOnly, wrapper);
			}
		}
	}

	/**
	 * Clear the button content in order to avoid duplication of buttons
	 * @return {void}
	 */
	protected clearComponentContent() {
		const containers = this.getElementsByClassName(this.CSS_CLASS_LIST.CONTAINER_CLASS);
		Array.from(containers).forEach((container) => {
			container.remove();
		});
	}

	protected updateCssClasses(): void {
		this.logger.start('updateCssClasses()', this.COMPONENT_NAME);
		// apply css classes for attrs inherited from common (e.g. customClass, customStyle )
		super.updateCssClasses();

		const setOfCssClassesToBeApplied = new Set<string>();

		// primary
		setOfCssClassesToBeApplied.add(this.primaryCssClass);

		// shape
		setOfCssClassesToBeApplied.add(this.cssClassPrefix + '--' + this.shape);

		// type
		setOfCssClassesToBeApplied.add(this.cssClassPrefix + '--' + this.type);

		// size
		if (this.stretch === null) {
			setOfCssClassesToBeApplied.add(this.cssClassPrefix + '--size-' + this.size);
		}

		// stretch
		if (this.stretch !== null) {
			setOfCssClassesToBeApplied.add(this.cssClassPrefix + '--stretch-' + this.stretch);
		}

		// orientation
		setOfCssClassesToBeApplied.add(this.cssClassPrefix + '--' + this.orientation);

		const targetEl: HTMLElement = this.getTargetElementForCssClassesAndStyle();
		if (typeof targetEl.classList !== 'undefined') {
			this._listOfAllPossibleComponentCssClasses.forEach((cssClass: string) => {
				if (setOfCssClassesToBeApplied.has(cssClass)) {
					targetEl.classList.add(cssClass);
				} else {
					targetEl.classList.remove(cssClass);
				}
			});
		}

		const setOfCssClassesToBeAppliedForLabelAlignment = new Set<string>();

		// horizontal align
		setOfCssClassesToBeAppliedForLabelAlignment.add(this.cssClassPrefix + '--horizontal-' + this.hAlignLabel);

		// vertical align
		setOfCssClassesToBeAppliedForLabelAlignment.add(this.cssClassPrefix + '--vertical-' + this.vAlignLabel);

		// const targetBtn: HTMLElement = this._elLabelIconImage();
		// if (typeof targetBtn.classList !== 'undefined') {
		this._listOfAllPossibleComponentCssClasses.forEach((cssClass: string) => {
			if (setOfCssClassesToBeAppliedForLabelAlignment.has(cssClass)) {
				this._elSpanForLabelIconImg.classList.add(cssClass);
			} else {
				this._elSpanForLabelIconImg.classList.remove(cssClass);
			}
		});
		// }

		this.updateCssClassesForSelected();
		this.logger.stop();
	}

	protected updateForChangeInStretch() {
		const parentEl = this.parentElement as HTMLElement;
		const targetEl = this.getTargetElementForCssClassesAndStyle();
		if (!parentEl) {
			this.info('updateForChangeInStretch() - parent element not found');
			return;
		}
		let stretchCssClassNameToAdd = '';
		switch (this.stretch) {
			case 'width':
				stretchCssClassNameToAdd = this.cssClassPrefix + '--stretch-width';
				break;
			case 'height':
				stretchCssClassNameToAdd = this.cssClassPrefix + '--stretch-height';
				break;
			case 'both':
				stretchCssClassNameToAdd = this.cssClassPrefix + '--stretch-both';
				break;
		}
		Ch5Button.STRETCHES.forEach((stretch: TCh5ButtonStretch) => {
			const cssClass = this.cssClassPrefix + '--stretch-' + stretch;
			if (cssClass !== stretchCssClassNameToAdd) {
				targetEl.classList.remove(cssClass);
			}
		});

		if (stretchCssClassNameToAdd !== '') {
			Ch5Button.SIZES.forEach((size: TCh5ButtonSize) => {
				const cssClass = this.cssClassPrefix + '--size-' + size;
				if (cssClass !== stretchCssClassNameToAdd) {
					targetEl.classList.remove(cssClass);
				}
			});
			targetEl.classList.add(stretchCssClassNameToAdd);
		} else {
			Ch5Button.SIZES.forEach((size: TCh5ButtonSize) => {
				const cssClass = this.cssClassPrefix + '--size-' + size;
				if (size === this.size) {
					targetEl.classList.add(cssClass);
				}
			});
		}
	}

	protected updateCssClassesForSelected() {
		const targetEl: HTMLElement = this.getTargetElementForCssClassesAndStyle();
		if (typeof targetEl.classList === 'undefined') {
			return;
		}
		const selectedCssClass = this.cssClassPrefix + this.selectedCssClassPostfix;
		if (this._selected) {
			targetEl.classList.add(selectedCssClass);
		} else {
			targetEl.classList.remove(selectedCssClass);
		}
	}

	protected updateCssClassesForCustomState() {
		const targetEl: HTMLElement = this.getTargetElementForCssClassesAndStyle();
		if (typeof targetEl.classList === 'undefined') {
			return;
		}
		const customStateCssClass = this.customClassState;
		if (this._customClassState) {
			targetEl.classList.add(customStateCssClass);
		}
	}

	private getModes() {
		return this.getElementsByTagName("ch5-button-mode");
	}

	private stopRepeatDigital() {
		this.info("stopRepeatDigital", this._intervalIdForRepeatDigital);
		if (this._intervalIdForRepeatDigital) {
			window.clearInterval(this._intervalIdForRepeatDigital);
			this.sendValueForRepeatDigital(false);
			this._intervalIdForRepeatDigital = null;
			return;
		}
		this.sendValueForRepeatDigital(true);

		this._intervalIdForRepeatDigital = window.setInterval(() => {
			this.sendValueForRepeatDigital(true);
		}, this.TOUCH_TIMEOUT);
	}

	/**
	 * If type node is updated via html or js or signal, the change set attribue of type;
	 * if receivestate is true, then even if type attribute chagnes, just use receivestatevalue
	 * if receivestate is false, then
	 * if mode attribute is updated, always call this method, and update all attributes 
	 * @param fromNode 
	 * @param isModeAttributeUpdated 
	 * @param attibuteName 
	 */
	public setButtonDisplay(fromNode: Ch5Button | Ch5ButtonMode | Ch5ButtonModeState) {
		// this.debounceSetButtonDisplay();
		this.setButtonDisplayDetails(this);
	}

	private setButtonDisplayDetails(fromNode: Ch5Button | Ch5ButtonMode | Ch5ButtonModeState) {
		Ch5Button.VAR_FOR_NUMBER += 1;
		// console.log("Ch5Button.VAR_FOR_NUMBER: ", Ch5Button.VAR_FOR_NUMBER);

		this.logger.start("changeAttributesOnModeChange");
		// Applicable on Mode change and Selected change
		// We need not worry about this. ch5-button-label is immediate child , and no change in attribute
		// affects the data from immediate child.


		const extendedProperties: Ch5ButtonExtendedProperties = new Ch5ButtonExtendedProperties();

		let isButtonModePressedAvailable: boolean = false;

		// Priority 1: ReceiveState Signals
		if (this.receiveStateType && this.receiveStateType !== '') {
			if (!isNil(this._receiveStateTypeResponseValue) && Ch5Button.TYPES.indexOf(this._receiveStateTypeResponseValue) >= 0) {
				extendedProperties.type = this._receiveStateTypeResponseValue as TCh5ButtonType;
			} else {
				extendedProperties.type = Ch5Button.TYPES[0];
				this._receiveStateTypeResponseValue = Ch5Button.TYPES[0];
			}
		}

		if (this.receiveStateIconClass && this.receiveStateIconClass !== '') {
			extendedProperties.iconClass = this._receiveStateIconClassResponseValue;
		}

		if (this.receiveStateIconUrl && this.receiveStateIconUrl !== '') {
			extendedProperties.iconUrl = this._receiveStateIconUrlResponseValue;
		}

		if (this.receiveStateCustomClass && this.receiveStateCustomClass !== '') {
			extendedProperties.customClass = this._receiveStateCustomClassResponseValue;
		}

		if (this.receiveStateCustomStyle && this.receiveStateCustomStyle !== '') {
			extendedProperties.customStyle = this._receiveStateCustomStyleResponseValue;
		}

		this.logger.log("updatedNodes Signals: ", extendedProperties);

		// TODO - recieve state for label
		// TODO - update nodes cannot be on pressed becos it cannot take debounce

		// Priority 2: Button Mode State Attributes for Selected Mode
		const buttonModesArray = this.getElementsByTagName("ch5-button-mode");
		if (buttonModesArray && buttonModesArray.length > 0) {
			const selectedButtonMode = buttonModesArray[this.mode];
			if (selectedButtonMode) {
				const buttonModeStatesArray = selectedButtonMode.getElementsByTagName("ch5-button-mode-state");
				if (buttonModeStatesArray && buttonModeStatesArray.length > 0) {
					let selectedButtonModeState = null;
					if (this._pressed === false && this._buttonPressedInPressable === false) {
						selectedButtonModeState = Array.from(buttonModeStatesArray).find(buttonModeState => {
							return ((buttonModeState.getAttribute("state") === "selected" && this.selected === true) ||
								(buttonModeState.getAttribute("state") === "normal" && this.selected === false));
						});
					} else {
						selectedButtonModeState = Array.from(buttonModeStatesArray).find(buttonModeState => {
							return (buttonModeState.getAttribute("state") === "pressed");
						});
					}
					if (selectedButtonModeState) {
						if (!(this._pressed === false && this._buttonPressedInPressable === false)) {
							isButtonModePressedAvailable = true;
						}

						if (isNil(extendedProperties.type) && !isNil(selectedButtonModeState.getAttribute("type"))) {
							extendedProperties.type = selectedButtonModeState.getAttribute("type") as TCh5ButtonType;
						}
						if (isNil(extendedProperties.iconUrl) && !isNil(selectedButtonModeState.getAttribute("iconurl"))) {
							extendedProperties.iconUrl = selectedButtonModeState.getAttribute("iconurl") as string;
						}
						if (isNil(extendedProperties.iconClass) && !isNil(selectedButtonModeState.getAttribute("iconclass"))) {
							extendedProperties.iconClass = selectedButtonModeState.getAttribute("iconclass") as string;
						}
						if (isNil(extendedProperties.iconPosition) && !isNil(selectedButtonModeState.getAttribute("iconposition"))) {
							extendedProperties.iconPosition = selectedButtonModeState.getAttribute("iconposition") as TCh5ButtonIconPosition;
						}
						if (isNil(extendedProperties.checkboxPosition) && !isNil(selectedButtonModeState.getAttribute("checkboxposition"))) {
							extendedProperties.checkboxPosition = selectedButtonModeState.getAttribute("checkboxposition") as TCh5ButtonCheckboxPosition;
						}
						if (isNil(extendedProperties.customClass) && !isNil(selectedButtonModeState.getAttribute("customclass"))) {
							extendedProperties.customClass = selectedButtonModeState.getAttribute("customclass") as string;
						}
						if (isNil(extendedProperties.customStyle) && !isNil(selectedButtonModeState.getAttribute("customstyle"))) {
							extendedProperties.customStyle = selectedButtonModeState.getAttribute("customstyle") as string;
						}
						if (isNil(extendedProperties.hAlignLabel) && !isNil(selectedButtonModeState.getAttribute("halignlabel"))) {
							extendedProperties.hAlignLabel = selectedButtonModeState.getAttribute("halignlabel") as TCh5ButtonHorizontalAlignLabel;
						}
						if (isNil(extendedProperties.vAlignLabel) && !isNil(selectedButtonModeState.getAttribute("valignlabel"))) {
							extendedProperties.vAlignLabel = selectedButtonModeState.getAttribute("valignlabel") as TCh5ButtonVerticalAlignLabel;
						}

						const selectedButtonModeStateLabelButton = selectedButtonModeState.getElementsByTagName("ch5-button-label");
						if (selectedButtonModeStateLabelButton && selectedButtonModeStateLabelButton.length > 0 &&
							(selectedButtonModeStateLabelButton[0].children[0])) {
							extendedProperties.label = selectedButtonModeStateLabelButton[0].children[0].innerHTML as string;
						}
					}
					this.logger.log("updatedNodes Mode States: ", extendedProperties);
				}

				// Priority 3: Button Mode Attributes for Selected Mode
				if (this._pressed === false && this._buttonPressedInPressable === false) {
					if (isNil(extendedProperties.type) && !isNil(selectedButtonMode.getAttribute("type"))) {
						extendedProperties.type = selectedButtonMode.getAttribute("type") as TCh5ButtonType;
					}
					if (isNil(extendedProperties.iconUrl) && !isNil(selectedButtonMode.getAttribute("iconurl"))) {
						extendedProperties.iconUrl = selectedButtonMode.getAttribute("iconurl") as string;
					}
					if (isNil(extendedProperties.iconClass) && !isNil(selectedButtonMode.getAttribute("iconclass"))) {
						extendedProperties.iconClass = selectedButtonMode.getAttribute("iconclass") as string;
					}
					if (isNil(extendedProperties.iconPosition) && !isNil(selectedButtonMode.getAttribute("iconposition"))) {
						extendedProperties.iconPosition = selectedButtonMode.getAttribute("iconposition") as TCh5ButtonIconPosition;
					}
					if (isNil(extendedProperties.checkboxPosition) && !isNil(selectedButtonMode.getAttribute("checkboxposition"))) {
						extendedProperties.checkboxPosition = selectedButtonMode.getAttribute("checkboxposition") as TCh5ButtonCheckboxPosition;
					}
					if (isNil(extendedProperties.customClass) && !isNil(selectedButtonMode.getAttribute("customclass"))) {
						extendedProperties.customClass = selectedButtonMode.getAttribute("customclass") as string;
					}
					if (isNil(extendedProperties.customStyle) && !isNil(selectedButtonMode.getAttribute("customstyle"))) {
						extendedProperties.customStyle = selectedButtonMode.getAttribute("customstyle") as string;
					}
					if (isNil(extendedProperties.hAlignLabel) && !isNil(selectedButtonMode.getAttribute("halignlabel"))) {
						extendedProperties.hAlignLabel = selectedButtonMode.getAttribute("halignlabel") as TCh5ButtonHorizontalAlignLabel;
					}
					if (isNil(extendedProperties.vAlignLabel) && !isNil(selectedButtonMode.getAttribute("valignlabel"))) {
						extendedProperties.vAlignLabel = selectedButtonMode.getAttribute("valignlabel") as TCh5ButtonVerticalAlignLabel;
					}

					const selectedButtonModeLabelButton = selectedButtonMode.getElementsByTagName("ch5-button-label");
					if (selectedButtonModeLabelButton && selectedButtonModeLabelButton.length > 0 &&
						!isNil(selectedButtonModeLabelButton[0].children[0]) && isNil(extendedProperties.label)) {
						extendedProperties.label = selectedButtonModeLabelButton[0].children[0].innerHTML as string;
					}
					this.logger.log("updatedNodes Mode: ", extendedProperties);
				}
			}
		}

		// Priority 4: Button Attributes
		if (this._pressed === false && this._buttonPressedInPressable === false) {
			if (isNil(extendedProperties.type) && !isNil(this.getAttribute("type"))) {
				extendedProperties.type = this.getAttribute("type") as TCh5ButtonType;
			}
			if (isNil(extendedProperties.iconUrl) && this.getAttribute("iconurl") && this.getAttribute("iconurl") !== '') {
				extendedProperties.iconUrl = this.getAttribute("iconurl") as string;
			}
			if (isNil(extendedProperties.iconClass) && this.getAttribute("iconclass") && this.getAttribute("iconclass") !== '') {
				extendedProperties.iconClass = this.getAttribute("iconclass") as string;
			}
			if (isNil(extendedProperties.iconPosition) && !isNil(this.getAttribute("iconposition"))) {
				extendedProperties.iconPosition = this.getAttribute("iconposition") as TCh5ButtonIconPosition;
			}
			if (isNil(extendedProperties.checkboxPosition) && !isNil(this.getAttribute("checkboxposition"))) {
				extendedProperties.checkboxPosition = this.getAttribute("checkboxposition") as TCh5ButtonCheckboxPosition;
			}
			if (isNil(extendedProperties.customClass) && !isNil(this.getAttribute("customclass"))) {
				extendedProperties.customClass = this.getAttribute("customclass") as string;
			}
			if (isNil(extendedProperties.customStyle) && !isNil(this.getAttribute("customstyle"))) {
				extendedProperties.customStyle = this.getAttribute("customstyle") as string;
			}
			if (isNil(extendedProperties.hAlignLabel) && !isNil(this.getAttribute("halignlabel"))) {
				extendedProperties.hAlignLabel = this.getAttribute("halignlabel") as TCh5ButtonHorizontalAlignLabel;
			}
			if (isNil(extendedProperties.vAlignLabel) && !isNil(this.getAttribute("valignlabel"))) {
				extendedProperties.vAlignLabel = this.getAttribute("valignlabel") as TCh5ButtonVerticalAlignLabel;
			}
			if (isNil(extendedProperties.label)) {
				const templateData = this.getElementsByTagName("ch5-button-label");
				if (templateData && templateData.length > 0 && templateData[0].children) {
					extendedProperties.label = templateData[0].children[0].innerHTML as string;
				}
			}
			this.logger.log("updatedNodes Button: ", extendedProperties);
		}

		if (this._pressed === false && this._buttonPressedInPressable === false) {
			this.updatePropertiesObject(extendedProperties);
		} else {
			if (isButtonModePressedAvailable === true) {
				// TODO - set only if applicable and avoid defaults
				this.updatePropertiesObject(extendedProperties);
			}
		}

		this.logger.log("updatedNodes Final: ", extendedProperties);
		this.previousExtendedProperties = extendedProperties;
		this.logger.stop();
	}

	private updatePropertiesObject(updatedNodes: any) {
		this.logger.start("updatePropertiesObject");
		if (!isNil(updatedNodes.type)) {
			if (Ch5Button.TYPES.indexOf(updatedNodes.type) >= 0) {
				this._type = updatedNodes.type as TCh5ButtonType;
			} else {
				this._type = Ch5Button.TYPES[0];
			}
			if (this.previousExtendedProperties.type !== updatedNodes.type) {
				this.updateCssClasses();
			}
		} else {
			this._type = Ch5Button.TYPES[0];
			if (this.previousExtendedProperties.type !== updatedNodes.type) {
				this.updateCssClasses();
			}
		}

		this.clearIconUrlAndClass();
		if (!isNil(updatedNodes.iconUrl) || !isNil(updatedNodes.iconClass)) {
			if (!isNil(updatedNodes.iconUrl)) {
				this._iconUrl = updatedNodes.iconUrl;
				this._elImg.src = this._iconUrl;
			}
			if (!isNil(updatedNodes.iconClass)) {
				this._iconClass = updatedNodes.iconClass;
			}

			if (!isNil(updatedNodes.iconUrl)) {
				if (this.previousExtendedProperties.iconUrl !== updatedNodes.iconUrl) {
					this.updateIconUrlAndPath();
				}
			} else if (!isNil(updatedNodes.iconClass)) {
				this.updateIconClassAndPath();
			}

			if (!isNil(updatedNodes.iconPosition)) {
				this._iconPosition = updatedNodes.iconPosition;
			} else {
				this._iconPosition = Ch5Button.ICON_POSITIONS[0];
			}
			if (this.previousExtendedProperties.iconPosition !== updatedNodes.iconPosition) {
				this.updateCssClasses();
				this.updateInternalHtml(); // TODO - commented for temporary purpose for testing
			}
		} else {
			// We do not require iconPosition, so remove it			
			this.removeAttribute("iconPosition");
		}

		if (!isNil(updatedNodes.checkboxPosition)) {
			this._checkboxPosition = updatedNodes.checkboxPosition;
			// TODO - do we need to udpate anything?
		}

		if (!isNil(updatedNodes.customClass)) {
			this._customClass = updatedNodes.customClass;
			this.updateForChangeInCustomCssClass();
		}

		if (!isNil(updatedNodes.customStyle)) {
			this._customStyle = updatedNodes.customStyle;
			this.updateForChangeInStyleCss();
		}

		if (!isNil(updatedNodes.hAlignLabel)) {
			if (Ch5Button.HORIZONTAL_LABEL_ALIGNMENTS.indexOf(updatedNodes.hAlignLabel) >= 0) {
				this._hAlignLabel = updatedNodes.hAlignLabel as TCh5ButtonHorizontalAlignLabel;
			} else {
				this._hAlignLabel = Ch5Button.HORIZONTAL_LABEL_ALIGNMENTS[0];
			}
			this.updateCssClasses();
		} else {
			this._hAlignLabel = Ch5Button.HORIZONTAL_LABEL_ALIGNMENTS[0];
			this.updateCssClasses();
		}

		if (!isNil(updatedNodes.vAlignLabel)) {
			if (Ch5Button.VERTICAL_LABEL_ALIGNMENTS.indexOf(updatedNodes.vAlignLabel) >= 0) {
				this._vAlignLabel = updatedNodes.vAlignLabel as TCh5ButtonVerticalAlignLabel;
			} else {
				this._vAlignLabel = Ch5Button.VERTICAL_LABEL_ALIGNMENTS[0];
			}
			this.updateCssClasses();
		} else {
			this._vAlignLabel = Ch5Button.VERTICAL_LABEL_ALIGNMENTS[0];
			this.updateCssClasses();
		}

		if (!isNil(updatedNodes.label)) {
			if (!((this.receiveStateLabel && this.receiveStateLabel !== '') || (this.receiveStateScriptLabelHtml && this.receiveStateScriptLabelHtml !== ''))) {
				if (!(this.receiveStateLabel !== '' || this.receiveStateScriptLabelHtml !== '')) {
					this.activeLabel = updatedNodes.label;
				}
			}
		}
		this.logger.stop();
	}

	/**
	 * Reorders ( if needed ) the position of the label and the icon inside the button
	 */
	protected updateInternalHtml() {
		this.logger.start("updateInternalHtml()");
		if (!(typeof this._elButton.insertBefore === "undefined"
			|| typeof this._elIcon.classList === "undefined")) {

			this._elCheckboxIcon.classList.remove('cx-button-checkbox-pos-left');
			this._elCheckboxIcon.classList.remove('cx-button-checkbox-pos-right');
			if (this.checkboxShow === true) {
				this._elCheckboxIcon.classList.add('cx-button-checkbox-pos-' + this.checkboxPosition);
			}

			this._elIcon.classList.remove('cx-button-icon-pos-first');
			this._elIcon.classList.remove('cx-button-icon-pos-last');
			this._elIcon.classList.remove('cx-button-icon-pos-top');
			this._elIcon.classList.remove('cx-button-icon-pos-bottom');
			this._elIcon.classList.add('cx-button-icon-pos-' + this.iconPosition); 

			this._elImg.classList.remove('cx-button-icon-pos-first');
			this._elImg.classList.remove('cx-button-icon-pos-last');
			this._elImg.classList.remove('cx-button-icon-pos-top');
			this._elImg.classList.remove('cx-button-icon-pos-bottom');
			this._elImg.classList.add('cx-button-icon-pos-' + this.iconPosition); 

			// Handle vertical button with iconPosition top or bottom
			if (['top', 'bottom'].indexOf(this.iconPosition) >= 0 && this.orientation === Ch5Button.ORIENTATIONS[1]) {
				this._elButton.classList.add(`ch5-button--vertical--icon-${this.iconPosition}`);
			}

			Ch5Button.ICON_POSITIONS.forEach((iconPositionObj, i) => {
				if (this.iconPosition === iconPositionObj) {
					this._elContainer.classList.add(`ch5-button--iconposition-${iconPositionObj}`);
				} else {
					this._elContainer.classList.remove(`ch5-button--iconposition-${iconPositionObj}`);
				}
			});

			let hasIcon = false;
			let hasLabel = false;
			let hasImage = false;
			let hasAriaLabel = false;
			let hasCheckboxIcon = false;

			if (!isNil(this.iconClass) && this.iconClass !== "") {
				hasIcon = true;
			}
			if (!isNil(this.iconUrl) && this.iconUrl !== "") {
				hasImage = true;
			}

			if ((this.hasAttribute('label') && '' !== this.getAttribute('label')) || (this.activeLabel !== "") ||
				(this.hasAttribute('receivestatescriptlabelhtml') && '' !== this.getAttribute('receivestatescriptlabelhtml'))) {
				hasLabel = true;
			}
			if (this.hasAttribute('aria-label') && '' !== this.getAttribute('aria-label')) {
				hasAriaLabel = true;
			}

			// TODO - not clear on the below point
			// updates the iconposition ( otherwise it might use the previous value of the attribute )
			// if (this.hasAttribute('iconposition')) {
			// 	this.iconPosition = this.getAttribute('iconposition') as TCh5ButtonIconPosition;
			// }

			if (this.hasAttribute("checkboxShow") === true) {
				hasCheckboxIcon = true;
			}

			this.info("hasIcon", hasIcon);
			this.info("hasLabel", hasLabel);
			this.info("hasImage", hasImage);
			this.info("hasAriaLabel", hasAriaLabel);
			this.info("hasCheckboxIcon", hasCheckboxIcon);

			if (!hasLabel && hasAriaLabel && hasImage) {
				const ariaLabel = this.getAttribute('aria-label');
				if (ariaLabel) {
					this._elImg.setAttribute('alt', ariaLabel);
				}
			}

			this._elButton.appendChild(this._elSpanForLabelIconImg);
			this._elSpanForLabelIconImg.appendChild(this._elSpanForLabelOnly);

			if (hasLabel && hasIcon) {
				if ((this._elSpanForLabelOnly as any).isConnected === false) {
					this._elSpanForLabelIconImg.appendChild(this._elSpanForLabelOnly);
				} else if (this._elIcon.parentNode !== (this._elSpanForLabelOnly as Node)) {
					this._elSpanForLabelIconImg.appendChild(this._elSpanForLabelOnly);
				}

				if (hasCheckboxIcon) {
					this.setCheckboxPositon();
				} else {
					if (this._elCheckboxIcon.parentNode) {
						this._elCheckboxIcon.remove();
					}
				}

				if (['last', 'bottom'].indexOf(this.iconPosition) >= 0) {
					this.info('insert icon after label');
					if (this._elIcon.parentNode !== (this._elButton as Node)) {
						// if the icon element was not yet added to the button
						this._elSpanForLabelIconImg.appendChild(this._elIcon);
						// this._elButton.appendChild(this._elIcon);
					} else {
						// if the icon element was already added and needs to be switched with the label element
						this._elSpanForLabelIconImg.insertBefore(this._elSpanForLabelOnly as Node, this._elIcon as Node);
						// this._elButton.insertBefore(this._elLabel as Node, this._elIcon as Node);
					}
				} else if (['first', 'top'].indexOf(this.iconPosition) >= 0) {
					this.info('insert icon before label');
					if ((this._elSpanForLabelOnly as any).isConnected === true) {
						// this._elButton.insertBefore(this._elIcon as Node, this._elLabel as Node);
						this._elSpanForLabelIconImg.insertBefore(this._elIcon as Node, this._elSpanForLabelOnly as Node);
					}
				}
			} else if (hasLabel && !hasIcon) {
				// this._elButton.appendChild(this._elSpan);
				// this._elSpan.appendChild(this._elLabel);

				if (hasCheckboxIcon) {
					this.setCheckboxPositon();
				} else {
					if (this._elCheckboxIcon.parentNode) {
						this._elCheckboxIcon.remove();
					}
				}

				if (this._elIcon.parentNode) {
					this._elIcon.remove();
				}
			} else if (!hasLabel && hasIcon) {
				if (hasCheckboxIcon) {
					this.setCheckboxPositon();
				} else {
					if (this._elCheckboxIcon.parentNode) {
						this._elCheckboxIcon.remove();
					}
				}

				this._elSpanForLabelIconImg.appendChild(this._elIcon);
				// this._elButton.appendChild(this._elIcon);
				if (this._elSpanForLabelOnly.parentNode) {
					this._elSpanForLabelOnly.remove();
				}
			} else { // if no icon and no label
				if (hasCheckboxIcon) {
					this.setCheckboxPositon();
				} else {
					if (this._elCheckboxIcon.parentNode) {
						this._elCheckboxIcon.remove();
					}
				}

				if (this._elIcon.parentNode) {
					this._elIcon.remove();
				}
				if (this._elSpanForLabelOnly.parentNode) {
					this._elSpanForLabelOnly.remove();
				}
			}

			if (hasImage) {
				const hasSvg = this.querySelectorAll(`svg.${this.cssClassPrefix}--img`);
				if (hasSvg.length) {
					hasSvg[0].remove();
				}
				if (this._elIcon.parentNode) {
					this._elIcon.remove();
				}
				if (hasLabel) {
					this._elImg.setAttribute('alt', "");
					if ((this._elSpanForLabelOnly as any).isConnected === false) {
						this._elSpanForLabelIconImg.appendChild(this._elSpanForLabelOnly);
					} else if (this._elImg.parentNode !== (this._elButton as Node)) {
						this._elSpanForLabelIconImg.appendChild(this._elSpanForLabelOnly);
					}

					if (['last', 'bottom'].indexOf(this.iconPosition) >= 0) {
						this.info('insert icon after label');
						if (this._elImg.parentNode !== (this._elButton as Node)) {
							// if the icon element was not yet added to the button
							this._elSpanForLabelIconImg.appendChild(this._elImg);
						} else {
							// if the icon element was already added and needs to be switched with the label element
							this._elSpanForLabelIconImg.insertBefore(this._elSpanForLabelOnly as Node, this._elImg as Node);
						}
					} else if (['first', 'top'].indexOf(this.iconPosition) >= 0) {
						this.info('insert icon before label');
						if ((this._elSpanForLabelOnly as any).isConnected === true) {
							this._elSpanForLabelIconImg.insertBefore(this._elImg as Node, this._elSpanForLabelOnly as Node);
						}
					}
				} else {
					this._elSpanForLabelIconImg.appendChild(this._elImg);

					if (this._elSpanForLabelOnly.parentNode) {
						this._elSpanForLabelOnly.remove();
					}
				}
				this.imgToSvg(this._elImg);
			}

			if (this.orientation === 'vertical' && this.shape !== 'circle') {
				this.createIosEllipsis();
			}

		}
		this.logger.stop();
	}

	private setCheckboxPositon() {
		if (['right'].indexOf(this.checkboxPosition) >= 0) {
			this.info('insert icon after label');
			if (this._elCheckboxIcon.parentNode !== (this._elButton as Node)) {
				// if the icon element was not yet added to the button
				this._elButton.appendChild(this._elCheckboxIcon);
			} else {
				// if the icon element was already added and needs to be switched with the label element
				this._elButton.insertBefore(this._elSpanForLabelIconImg as Node, this._elCheckboxIcon as Node);
			}

		} else if (['left'].indexOf(this.checkboxPosition) >= 0) {
			this.info('insert checkbox before label');
			if ((this._elSpanForLabelIconImg as any).isConnected === true) {
				this._elButton.insertBefore(this._elCheckboxIcon as Node, this._elSpanForLabelIconImg as Node);
			}
		}
	}

	protected getTargetElementForCssClassesAndStyle(): HTMLElement {
		return this._elContainer;
	}

	public getCssClassDisabled() {
		return this.cssClassPrefix + '--disabled';
	}

	//#endregion

	//#region 5. Events

	/**
	 * Events
	 * click - inherited
	 * focus - inherited
	 * blur - inherited
	 * press - custom
	 * release - custom
	 */

	private sendValueForRepeatDigital(value: boolean): void {
		if (!this._sigNameSendOnTouch && !this._sigNameSendOnClick) { return; }

		this.buttonPressed = value; // TODO - use this._pressed 

		const touchSignal: Ch5Signal<object | boolean> | null = Ch5SignalFactory.getInstance().getObjectAsBooleanSignal(this._sigNameSendOnTouch);
		const clickSignal: Ch5Signal<object | boolean> | null = Ch5SignalFactory.getInstance().getObjectAsBooleanSignal(this._sigNameSendOnClick);

		if (clickSignal && touchSignal && clickSignal.name === touchSignal.name) {
			// send signal only once if it has the same value
			clickSignal.publish({ [Ch5SignalBridge.REPEAT_DIGITAL_KEY]: value });
			return;
		}

		if (touchSignal && touchSignal.name) {
			touchSignal.publish({ [Ch5SignalBridge.REPEAT_DIGITAL_KEY]: value });
		}

		if (clickSignal && clickSignal.name) {
			clickSignal.publish({ [Ch5SignalBridge.REPEAT_DIGITAL_KEY]: value });
		}
	}

	private _onTap(): void {
		this.info('Ch5Button._onTap()');
		this._onTapAction();
	}

	private _onTapAction() {
		if (null !== this._intervalIdForRepeatDigital) {
			window.clearInterval(this._intervalIdForRepeatDigital);
			this.sendValueForRepeatDigital(false);
			this._intervalIdForRepeatDigital = null;
		} else {
			this._sendOnClickSignal(false, false);
		}
	}

	private _onTouchMove(event: TouchEvent) {
		// The event must be cancelable
		if (event.cancelable) {
			event.preventDefault();
		}
		const normalizedEvent = normalizeEvent(event);

		this._pressInfo.saveEnd(
			normalizedEvent.x,
			normalizedEvent.y
		);

		const validPress = this._pressInfo.valid();

		if (!validPress) {
			window.clearTimeout(this._pressTimeout);
			if (this._intervalIdForRepeatDigital !== null) {
				this.stopRepeatDigital();
			}
			return;
		}
	}

	private _onLeave() {
		if (this._intervalIdForRepeatDigital) {
			this.stopRepeatDigital();
		}
	}

	private async _onPressClick(event: MouseEvent) {
		if (this.isTouch) {
			return;
		}

		clearTimeout(this.allowPressTimeout);
		await this.pressHandler();

		this._pressHorizontalStartingPoint = event.clientX;
		this._pressVerticalStartingPoint = event.clientY;

		this._lastTapTime = new Date().valueOf();

		if (!this.allowPress) {
			return;
		}

		this.allowPress = false;
		this.stopRepeatDigital();
	}

	private _onMouseUp() {
		if (this.isTouch) {
			((btnObj) => {
				setTimeout(() => {
					if (btnObj._intervalIdForRepeatDigital != null) {
						clearTimeout(btnObj._intervalIdForRepeatDigital);
						btnObj._intervalIdForRepeatDigital = null;
					}
					btnObj.sendValueForRepeatDigital(false);
				}, 200);
			})(this);
			return;
		}

		this.cancelPress();
		this.reactivatePress();

		if (this._intervalIdForRepeatDigital) {
			this.stopRepeatDigital();
		} else if (this._pressed) {
			// this._onTapAction();
		}

		const timeSinceLastPress = new Date().valueOf() - this._lastTapTime;
		if (this._lastTapTime && timeSinceLastPress < this.DEBOUNCE_PRESS_TIME) {
			// sometimes a both click and press can happen on iOS/iPadOS, don't publish both
			this.info('Ch5Button debouncing duplicate press/hold and click ' + timeSinceLastPress);
		}
	}

	private _onMouseMove(event: MouseEvent) {
		if (!this.isTouch
			&& this._intervalIdForRepeatDigital
			&& this._pressHorizontalStartingPoint
			&& this._pressVerticalStartingPoint
			&& this.isExceedingPressMoveThreshold(
				this._pressHorizontalStartingPoint,
				this._pressVerticalStartingPoint,
				event.clientX,
				event.clientY)
		) {
			this.stopRepeatDigital();
		}
	}

	private async _onPress(event: TouchEvent) {
		const normalizedEvent = normalizeEvent(event);
		this.isTouch = true;
		clearTimeout(this.allowPressTimeout);
		this._pressInfo.saveStart(
			normalizedEvent.x,
			normalizedEvent.y
		);
		await this.pressHandler();
		if (!this.allowPress) {
			return;
		}
		this.allowPress = false;
		this.stopRepeatDigital();
	}

	private _onPressUp(): void {
		window.clearTimeout(this._pressTimeout);
		this.reactivatePress();
		if (this._pressed) {
			this.info("Ch5Button._onPressUp()");

			this._pressed = false;

			if (this._intervalIdForRepeatDigital) {
				window.clearInterval(this._intervalIdForRepeatDigital);
				this.sendValueForRepeatDigital(false);
				this._intervalIdForRepeatDigital = null;
			}
		}
	}

	private _onTouchEnd(inEvent: Event): void {
		this.info("Ch5Button._onTouchEnd()");
		if (this._intervalIdForRepeatDigital) {
			this.stopRepeatDigital();
		}
	}

	private _onTouchCancel(inEvent: Event): void {
		this.info("Ch5Button._onTouchCancel()");
		if (this._intervalIdForRepeatDigital) {
			this.stopRepeatDigital();
		}
	}

	private _onBlur(inEvent: Event): void {
		this.info("Ch5Button._onBlur()");
		let clonedEvent: Event;

		this.reactivatePress();

		clonedEvent = new Event(inEvent.type, inEvent);
		this.dispatchEvent(clonedEvent);

		inEvent.preventDefault();
		inEvent.stopPropagation();

	}

	private _onFocus(inEvent: Event): void {
		this.info("Ch5Button._onFocus()");
		let clonedEvent: Event;
		clonedEvent = new Event(inEvent.type, inEvent);
		this.dispatchEvent(clonedEvent);

		inEvent.preventDefault();
		inEvent.stopPropagation();
	}

	/**
	 * Sends the signal passed via sendEventOnClick or sendEventOnTouch
	 */
	private _sendOnClickSignal(preventTrue: boolean = false, preventFalse: boolean = false): void {
		let sigClick: Ch5Signal<boolean> | null = null;
		if (this._sigNameSendOnClick) {
			sigClick = Ch5SignalFactory.getInstance().getBooleanSignal(this._sigNameSendOnClick);

			if (sigClick !== null) {
				if (!preventTrue) {
					this.sendValueForRepeatDigital(true);
				}
				if (!preventFalse) {
					this.sendValueForRepeatDigital(false);
				}
			}
		}
	}

	private cancelPress() {
		window.clearTimeout(this._pressTimeout);
		this._pressed = false;
	}

	/**
	 * Press Handler
	 *
	 * @return {Promise}
	 */
	private pressHandler(): Promise<boolean> {
		const pressHandler = () => {
			this.info("Ch5Button._onPress()");
			this._pressed = true;
		}

		const pressPromise = new Promise<boolean>((resolve, reject) => {
			this._pressTimeout = window.setTimeout(() => {
				pressHandler();
				resolve(this._pressed);
			}, this.TOUCH_TIMEOUT);
		});

		return pressPromise;
	}

	private isExceedingPressMoveThreshold(x1: number, y1: number, x2: number, y2: number) {
		const startingPoint = x2 - x1;
		const endingPoint = y2 - y1;
		const distance = Math.sqrt(startingPoint ** 2 + endingPoint ** 2);

		return distance > this.PRESS_MOVE_THRESHOLD;
	}

	private checkboxDisplay() {
		// TODO - there is code fo checkbox icon in other methods, keep in one place
		let classForCheckboxRemove: string[] = [];
		let classForCheckboxAdd: string[] = [];
		classForCheckboxRemove = ["ch5-button__checkbox", "ch5-button__checkbox--unchecked", "ch5-button__checkbox--checked"];
		if (this._checkboxShow === true && this._selected === true) {
			classForCheckboxAdd = ["ch5-button__checkbox", "ch5-button__checkbox--checked"];
		} else if (this._checkboxShow === false) {
			// TODO - check
		} else if (this._checkboxShow === true) {

			classForCheckboxAdd = ["ch5-button__checkbox", "ch5-button__checkbox--unchecked"];
		}

		classForCheckboxRemove.forEach((className: string) => {
			className = className.trim();
			if (className !== '') {
				this._elCheckboxIcon.classList.remove(className);
			}
		});

		classForCheckboxAdd.forEach((className: string) => {
			className = className.trim();
			if (className !== '') {
				this._elCheckboxIcon.classList.add(className);
			}
		});
		this.updateInternalHtml(); // TODO - commented for temporary purpose for testing
	}

	private reactivatePress(): void {
		clearTimeout(this.allowPressTimeout);
		this.allowPressTimeout = setTimeout(() => {
			this.allowPress = true;
		}, this.DEBOUNCE_PRESS_TIME) as never as number;
	}

	// private getAllCheckboxPositions(): TCh5ButtonCheckboxPosition[] {
	//    const output:TCh5ButtonCheckboxPosition[] = [];
	//     Object.keys(Ch5Alignments).forEach(key => {
	//         output.push(Ch5Alignments[key]);
	//     });
	//     return output;
	// }
	//#endregion

}

if (typeof window === "object"
	&& typeof window.customElements === "object"
	&& typeof window.customElements.define === "function") {

	window.customElements.define('ch5-button', Ch5Button);
}
