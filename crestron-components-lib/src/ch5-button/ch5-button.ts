// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
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

	//#region 1.1 readonly variables

	// TODO - Check the possibility of Enums
	/**
	 * The first value is considered the default one
	 */
	public static readonly TYPES: TCh5ButtonType[] = ['default', 'primary', 'info', 'text', 'danger', 'warning', 'success', 'secondary'];

	/**
	 * The first value is considered the default one
	 */
	public static readonly SHAPES: TCh5ButtonShape[] = ['rounded-rectangle', 'rectangle', 'tab', 'circle', 'oval'];

	/**
	 * The first value is considered the default one
	 */
	public static readonly SIZES: TCh5ButtonSize[] = ['regular', 'x-small', 'small', 'large', 'x-large'];

	/**
	 * No default value for Stretch
	 */
	public static readonly STRETCHES: TCh5ButtonStretch[] = ['both', 'width', 'height'];

	/**
	 * The first value is considered the default one
	 */
	public static readonly ICON_POSITIONS: TCh5ButtonIconPosition[] = ['first', 'last', 'top', 'bottom'];

	/**
	 * The first value is considered the default one
	 */
	public static readonly CHECKBOX_POSITIONS: TCh5ButtonCheckboxPosition[] = ['left', 'right']; // this.getAllCheckboxPositions() // ['left', 'right'];

	/**
	 * The first value is considered the default one
	 */
	public static readonly HORIZONTAL_LABEL_ALIGNMENTS: TCh5ButtonHorizontalAlignLabel[] = ['center', 'left', 'right'];

	/**
	 * The first value is considered the default one
	 */
	public static readonly VERTICAL_LABEL_ALIGNMENTS: TCh5ButtonVerticalAlignLabel[] = ['middle', 'top', 'bottom'];

	/**
	 * The first value is considered the default one
	 */
	public static readonly ORIENTATIONS: TCh5ButtonOrientation[] = ['horizontal', 'vertical'];

	public readonly primaryCssClass: string = 'ch5-button'; // TODO - Check if we need this in baseclass. Also check if it needs to be public.
	public readonly cssClassPrefix: string = 'ch5-button'; // TODO - Check if we need this in baseclass. Also check if it needs to be public.

	// Time needed for the sendOnTouch to trigger/reinforce
	private readonly TOUCH_TIMEOUT: number = 250;
	private readonly DEBOUNCE_PRESS_TIME: number = 200;
	private readonly PRESS_MOVE_THRESHOLD: number = 10;
	private readonly STATE_CHANGE_TIMEOUTS: number = 500;

	// TODO - Add more CSS_CLASSES as required / used
	private readonly CSS_CLASS_LIST = {
		CONTAINER_CLASS: 'cb-cntr',
		BUTTON_PRIMARY_CLASS: 'cb-btn'
	};
	private readonly COMPONENT_NAME: string = "ch5-button";

	private readonly pressedCssClassPostfix: string = '--pressed';
	private readonly selectedCssClassPostfix: string = '--selected';
	private readonly iosCssClassPostfix: string = '--ios-vertical';

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

	private _mode: number = 0;

	private _pressableIsPressedSubscription: Subscription | null = null;

	/**
	 * Time after that press will be triggered
	 *
	 * @type {number}
	 * @private
	 */
	private _pressTimeout: number = 0;

	/**
	 * Information about start and end position
	 * Including the threshold of px for valid presses
	 *
	 * @type {Ch5ButtonPressInfo}
	 */
	private _pressInfo: Ch5ButtonPressInfo = {} as Ch5ButtonPressInfo;

	/**
	 * State of the button ( pressed or not )
	 *
	 * @type {boolean}
	 */
	private _pressed: boolean = false;
	private _buttonPressed: boolean = false;
	private _buttonPressedInPressable: boolean = false;

	private _label: string = '';
	private _activeLabel: string = '';

	/**
	 * The icon's CSS class name as defined in the iconClass HTML attribute
	 */
	private _iconClass: string = '';
	private _activeIconClass: string = '';
	private _activeIconUrl: string = '';

	/**
	 * Icon position relative to label
	 */
	private _iconPosition: TCh5ButtonIconPosition = 'first';
	private _activeIconPosition: TCh5ButtonIconPosition = 'first';

	/**
	 * Icon position relative to label
	 *
	 * HTML attribute name: iconPosition or iconposition
	 */
	private _checkboxPosition: TCh5ButtonCheckboxPosition = "left"; // Ch5Alignments.Left;
	private _activeCheckboxPosition: TCh5ButtonCheckboxPosition = "left"; // Ch5Alignments.Left;

	/**
	 * Reflects the checkbox display part of the component. If set to true, a checkbox is displayed and a CSS class named 'ch5-button__checkbox' will be applied
	 * on the button component
	 */
	private _checkboxShow: boolean = false;

	/**
	 * Horizontal Alignment for Label
	 */
	private _hAlignLabel: TCh5ButtonHorizontalAlignLabel = 'center';
	private _activeHAlignLabel: TCh5ButtonHorizontalAlignLabel = 'center';

	/**
	 * Vertical Alignment for Label
	 *
	 * HTML attribute name: vAlignLabel or valignlabel
	 */
	private _vAlignLabel: TCh5ButtonVerticalAlignLabel = 'middle';
	private _activeVAlignLabel: TCh5ButtonVerticalAlignLabel = 'middle';

	/**
	 * Lays out the elements of the ch5-button in a horizontal or vertical manner.
	 * For vertical alignment it will apply a CSS class that will rotate the component -90 degrees ( 270 deg clockwise,
	 * 90 degrees counter clockwise )
	 *
	 * HTML attribute name: orientation
	 */
	private _orientation: TCh5ButtonOrientation = 'horizontal';

	/**
	 * Shape of the button
	 *
	 * HTML attribute name: shape
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
	private _activeType: TCh5ButtonType = 'default';

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
	 *
	 * @private
	 * @type {(Ch5Pressable | null)}
	 * @memberof Ch5Image
	 */
	private _pressable: Ch5Pressable | null = null;

	private _hammerManager: HammerManager = {} as HammerManager;

	/**
	 * image URL. Must be a supported image format, including JPEG, GIF, PNG, SVG, and BMP.
	 */
	private _iconSvgUrl: string = '';

	private _activeCustomClass: string = "";
	private _activeCustomStyle: string = "";

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

	private isComponentLoaded: boolean = false;
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

		this._elSpanForLabelOnly.textContent = trValue;
		this._label = trValue;
		this.setAttribute('label', trValue);
		this.changeAttributesOnModeChange(this);
	}
	public get label() {
		return this._label;
	}

	public set activeLabel(value: string) {
		this.info('set activeLabel("' + value + '")');
		this._activeLabel = value;
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
	}
	public get formType(): TCh5ButtonActionType | null {
		return this._formType;
	}

	public set iconClass(value: string) {
		if (typeof this._elIcon.classList === "undefined") {
			return;
		}
		this.info('set iconClass("' + value + '")');
		if (this._iconClass !== null && this._iconClass !== value) {
			// this.updateIconUrlAndPath(value);
			this.setAttribute('iconclass', value);
			this.changeAttributesOnModeChange(this);
		}
	}
	public get iconClass(): string {
		return this._iconClass;
	}

	public set activeIconClass(value: string) {
		this.info('set activeIconClass("' + value + '")');
		this._activeIconClass = value;
		this.changeAttributesOnModeChange(this);
	}
	public get activeIconClass(): string {
		return this._activeIconClass;
	}

	public set hAlignLabel(value: TCh5ButtonHorizontalAlignLabel) {
		this.info('set hAlignLabel("' + value + '")');
		if (this._hAlignLabel !== value) {
			if (Ch5Button.HORIZONTAL_LABEL_ALIGNMENTS.indexOf(value) >= 0) {
				this._hAlignLabel = value;
			} else {
				this._hAlignLabel = Ch5Button.HORIZONTAL_LABEL_ALIGNMENTS[0];
			}
			this.setAttribute('hAlignLabel', this._hAlignLabel);
			this.changeAttributesOnModeChange(this);
		}
	}
	public get hAlignLabel(): TCh5ButtonHorizontalAlignLabel {
		return this._hAlignLabel;
	}

	public set activeHAlignLabel(value: TCh5ButtonHorizontalAlignLabel) {
		this.info('set activeHAlignLabel("' + value + '")');
		if (this._activeHAlignLabel !== value && value !== null) {
			if (Ch5Button.HORIZONTAL_LABEL_ALIGNMENTS.indexOf(value) >= 0) {
				this._activeHAlignLabel = value;
			}
			this.updateCssClasses();
		}
	}
	public get activeHAlignLabel(): TCh5ButtonHorizontalAlignLabel {
		return this._activeHAlignLabel;
	}

	public set vAlignLabel(value: TCh5ButtonVerticalAlignLabel) {
		this.info('set vAlignLabel("' + value + '")');
		if (this._vAlignLabel !== value) {
			if (Ch5Button.VERTICAL_LABEL_ALIGNMENTS.indexOf(value) >= 0) {
				this._vAlignLabel = value;
			} else {
				this._vAlignLabel = Ch5Button.VERTICAL_LABEL_ALIGNMENTS[0];
			}
			this.setAttribute('vAlignLabel', this._vAlignLabel);
			this.changeAttributesOnModeChange(this);
		}
	}
	public get vAlignLabel(): TCh5ButtonVerticalAlignLabel {
		return this._vAlignLabel;
	}

	public set activeVAlignLabel(value: TCh5ButtonVerticalAlignLabel) {
		this.info('set activeVAlignLabel("' + value + '")');
		if (this._activeVAlignLabel !== value && value !== null) {
			if (Ch5Button.VERTICAL_LABEL_ALIGNMENTS.indexOf(value) >= 0) {
				this._activeVAlignLabel = value;
			}
			this.updateCssClasses();
		}
	}
	public get activeVAlignLabel(): TCh5ButtonVerticalAlignLabel {
		return this._activeVAlignLabel;
	}

	public set mode(value: number) {
		this.info('set mode("' + value + '")');
		if (this._mode !== value) {
			if (isNaN(value)) {
				this._mode = 0;
			} else {
				if (value >= this.getModes().length) {
					this._mode = 0;
				} else {
					this._mode = value;
				}
			}
		}
		this.setAttribute('mode', String(this._mode));
	}
	public get mode(): number {
		return this._mode;
	}

	public set checkboxPosition(value: TCh5ButtonCheckboxPosition) {
		this.info('set checkboxPosition("' + value + '")');
		if (this._checkboxPosition !== value) {
			if (Ch5Button.CHECKBOX_POSITIONS.indexOf(value) >= 0) {
				this._checkboxPosition = value;
			} else {
				this._checkboxPosition = Ch5Button.CHECKBOX_POSITIONS[0];
			}
			this.setAttribute('checkboxPosition', this._checkboxPosition);
			this.changeAttributesOnModeChange(this);
		}
	}
	public get checkboxPosition(): TCh5ButtonCheckboxPosition {
		return this._checkboxPosition;
	}

	public set activeCheckboxPosition(value: TCh5ButtonCheckboxPosition) {
		this.info('set checkboxPosition("' + value + '")');
		this._activeCheckboxPosition = value;
	}
	public get activeCheckboxPosition(): TCh5ButtonCheckboxPosition {
		return this._activeCheckboxPosition;
	}

	public set checkboxShow(value: boolean) {
		this.info('set checkboxShow("' + value + '")');

		if (typeof this._elCheckboxIcon.classList === "undefined") {
			return;
		}
		if (this._checkboxShow !== value) {
			this._checkboxShow = value;
			if (this._checkboxShow === true) {
				this.setAttribute('checkboxShow', 'true');
			} else {
				this.removeAttribute('checkboxShow');
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
					this.changeAttributesOnModeChange(this);
				}, this.STATE_CHANGE_TIMEOUTS);
			} else {
				this.changeAttributesOnModeChange(this);
			}
		}
	}
	private get buttonPressed(): boolean {
		return this._buttonPressed;
	}

	public set iconPosition(value: TCh5ButtonIconPosition) {
		this.info('set iconPosition("' + value + '")');
		if (this._iconPosition !== value) {
			if (Ch5Button.ICON_POSITIONS.indexOf(value) >= 0) {
				this._iconPosition = value;
			} else {
				this._iconPosition = Ch5Button.ICON_POSITIONS[0];
			}
			this.setAttribute('iconposition', this._iconPosition);
			this.changeAttributesOnModeChange(this);
		}
	}
	public get iconPosition(): TCh5ButtonIconPosition {
		return this._iconPosition;
	}

	public set activeIconPosition(value: TCh5ButtonIconPosition) {
		this.info('set activeIconPosition("' + value + '")');
		if (this._activeIconPosition !== value) {
			this._activeIconPosition = value;
		}
		this.setAttribute("activeIconPosition", value); // this condition must get set becos there is a default value for active position
	}
	public get activeIconPosition(): TCh5ButtonIconPosition {
		return this._activeIconPosition;
	}

	public set iconUrl(value: string) {
		if (!isNil(value) && this._iconSvgUrl !== value) {
			// this._iconSvgUrl = value || '';
			// this._elImg.src = this._iconSvgUrl;
			this.setAttribute('iconurl', value);
			this.changeAttributesOnModeChange(this);
		}
	}
	public get iconUrl(): string {
		return this._iconSvgUrl;
	}

	public set activeIconUrl(value: string) {
		this._activeIconUrl = value;
		// this.setAttribute("activeIconUrl", this._activeIconUrl);
	}
	public get activeIconUrl(): string {
		return this._activeIconUrl;
	}

	public set orientation(value: TCh5ButtonOrientation) {
		this.info('set orientation("' + value + '")');
		if (this._orientation !== value) {
			if (Ch5Button.ORIENTATIONS.indexOf(value) >= 0) {
				this._orientation = value;
			} else {
				this._orientation = Ch5Button.ORIENTATIONS[0];
			}
			this.setAttribute('orientation', this._orientation);
		}
	}
	public get orientation(): TCh5ButtonOrientation {
		return this._orientation;
	}

	public set type(value: TCh5ButtonType) {
		this.info('set type("' + value + '")');
		if (this._type !== value && value !== null) {
			if (Ch5Button.TYPES.indexOf(value) >= 0) {
				this._type = value;
			} else {
				this._type = Ch5Button.TYPES[0];
			}
			this.setAttribute('type', this._type);
			this.changeAttributesOnModeChange(this);
		}
	}
	public get type(): TCh5ButtonType {
		return this._type;
	}

	public set activeType(value: TCh5ButtonType) {
		this.info('set activeType("' + value + '")');
		if (this._activeType !== value && value !== null) {
			if (Ch5Button.TYPES.indexOf(value) >= 0) {
				this._activeType = value;
			}
			this.updateCssClasses();
		}
	}
	public get activeType(): TCh5ButtonType {
		return this._activeType;
	}

	public set activeCustomClass(value: string) {
		this.info('set activeCustomClass("' + value + '")');
		if (this._activeCustomClass !== value && value !== '') {
			this._activeCustomClass = value;
			this.updateForChangeInCustomCssClass();
		}
	}
	public get activeCustomClass(): string {
		return this._activeCustomClass;
	}

	public set activeCustomStyle(value: string) {
		this.info('set activeCustomStyle("' + value + '")');
		if (this._activeCustomStyle !== value && value !== '') {
			this._activeCustomStyle = value;
			this.updateCssClasses();
			this.updateForChangeInStyleCss();
		}
	}
	public get activeCustomStyle(): string {
		return this._activeCustomStyle;
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
				}
			}
		} else {
			this._stretch = null;
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
			if (newValue !== this.label) {
				this.setAttribute('label', newValue);
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
			if ('' !== newValue && newValue !== this._elSpanForLabelOnly.innerHTML) {
				this._elSpanForLabelOnly.innerHTML = newValue;
			}
		});
	}
	public get receiveStateScriptLabelHtml(): string {
		// The internal property is changed if/when the element is removed from DOM
		// Returning the attribute instead of the internal property preserves functionality
		return this._attributeValueAsString('receivestatescriptlabelhtml');
	}

	public get labelHtml(): string {
		return this._elSpanForLabelOnly.innerHTML;
	}
	public set labelHtml(value: string) {
		if (value !== '' && value !== this._elSpanForLabelOnly.innerHTML) {
			this._elSpanForLabelOnly.innerHTML = value;
			this.updateInternalHtml();
		}
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
			this.info("subReceiveSignalIconClass: ", newValue);
			this.iconClass = newValue;
			this.updateIconClassAndPath(newValue);
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
		this.info('set receivestateiconurl(\'' + signalName + '\')');
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
			this.iconUrl = newValue;
			this.updateIconClassAndPath(newValue);
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
			this.type = newValue as TCh5ButtonType;
			this.activeType = newValue as TCh5ButtonType;
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
		});
	}
	public get receiveStateMode(): string {
		return this._attributeValueAsString('receivestatemode');
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
							this.changeAttributesOnModeChange(this);
						}, this.STATE_CHANGE_TIMEOUTS);
					} else {
						this.changeAttributesOnModeChange(this);
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
		const ready = Promise.all([
			// customElements.whenDefined('ch5-button'),
			customElements.whenDefined('ch5-button-mode'),
			customElements.whenDefined('ch5-button-mode-state'),
			customElements.whenDefined('ch5-button-label')
		])
			.then(_ => {
				// (document.styleSheets[document.styleSheets.length - 1] as CSSStyleSheet).insertRule(".ch5-button--danger.ch5-button--pressed { background: green !important;}", 0);;
				this.isComponentLoaded = true;
			});

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

		// TODO - the below is not done for ch5-button-mode etc
		if (this.hasAttribute('label')) {
			this.label = this.getAttribute('label') as string;
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
		if (this.hasAttribute('mode')) {
			this.mode = Number(this.getAttribute('mode')); // TODO isNaN(this.getAttribute('mode')) ? 0 : Number(this.getAttribute('mode')) as number;
		}
		let isCheckboxShow = false;
		if (this.hasAttribute('checkboxshow')) {
			const attrSelected = (this.getAttribute('checkboxshow') as string).toLowerCase();
			if (attrSelected !== 'false' && attrSelected !== '0') {
				isCheckboxShow = true;
			}
		}
		this.checkboxShow = isCheckboxShow;
		if (this.hasAttribute('checkboxposition')) {
			this.checkboxPosition = this.getAttribute('checkboxposition') as TCh5ButtonCheckboxPosition;
		}
		if (this.hasAttribute('halignlabel')) {
			this.hAlignLabel = this.getAttribute('halignlabel') as TCh5ButtonHorizontalAlignLabel;
		}
		if (this.hasAttribute('valignlabel')) {
			this.vAlignLabel = this.getAttribute('valignlabel') as TCh5ButtonVerticalAlignLabel;
		}
		if (this.hasAttribute('orientation')) {
			this.orientation = this.getAttribute('orientation') as TCh5ButtonOrientation;
		}
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
		if (this.hasAttribute('formtype')) {
			this.formType = this.getAttribute('formtype') as TCh5ButtonActionType | null;
		}
		let isSelected = false;
		if (this.hasAttribute('selected') && !this.hasAttribute('customclassselected')) {
			const attrSelected = (this.getAttribute('selected') as string).toLowerCase();
			if (attrSelected !== 'false' && attrSelected !== '0') {
				isSelected = true;
			}
		}
		this.selected = isSelected;

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
		this.logger.log("from ch5button - updateForChangeInCustomCssClass()", this.activeCustomClass);

		this._prevAddedCustomClasses.forEach((className: string) => {
			if ('' !== className) {
				targetElement.classList.remove(className);
			}
		});
		this._prevAddedCustomClasses = [];

		this.activeCustomClass.split(' ').forEach((className: string) => {
			if ('' !== className) {
				this._prevAddedCustomClasses.push(className);
				targetElement.classList.add(className);
			}
		});
		this.logger.stop();
	}

	protected updateForChangeInStyleCss() {
		const targetElement: HTMLElement = this.getTargetElementForCssClassesAndStyle();
		this.info("from button - updateForChangeInStyleCss()");

		targetElement.style.cssText = this.activeCustomStyle;
	}

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
		let hasSignalChanged = false;

		this._subKeySigReceiveCustomClass = recSig.subscribe((newVal: string) => {
				this.info('subs callback for signalReceiveCustomClass: ', this._receiveStateCustomClass, ' Signal has value ', newVal);
				if ('' !== newVal) {
						hasSignalChanged = true;
				}
				if (newVal !== this.customClass && hasSignalChanged) {
						// this.setAttribute('customclass', newVal);
						this.activeCustomClass = newVal;
				}
		});
}

public get receiveStateCustomClass(): string {
		// The internal property is changed if/when the element is removed from dom
		// Returning the attribute instead of the internal property preserves functionality
		return this._attributeValueAsString('receivestatecustomclass');
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
				super.attributeChangedCallback(attr, oldValue, newValue);
				this.changeAttributesOnModeChange(this);
				this.updateForChangeInCustomCssClass();
				break;
			case 'receivestatecustomclass': // this is written to manage modes
				super.attributeChangedCallback(attr, oldValue, newValue);
				this.changeAttributesOnModeChange(this);
				this.updateForChangeInCustomCssClass();
				
				break;
			case 'customstyle': // this is written to manage modes
				super.attributeChangedCallback(attr, oldValue, newValue);
				this.changeAttributesOnModeChange(this);
				this.updateForChangeInStyleCss();
				break;
			case 'label':
				if (this.hasAttribute('label')) {
					this.label = newValue;
				} else {
					this.label = '';
				}
				this.updateInternalHtml(); // updates label and icon elements if needed
				break;
			case 'iconclass':
				if (this.hasAttribute('iconclass')) {
					this.iconClass = newValue;
				} else {
					this.iconClass = '';
				}
				this.refreshComponent();  // updates classes and html content if needed
				break;
			case 'iconposition':
				if (this.hasAttribute('iconposition')) {
					this.iconPosition = newValue as TCh5ButtonIconPosition;
				} else {
					this.iconPosition = Ch5Button.ICON_POSITIONS[0];
				}
				this.refreshComponent();  // updates classes and html content if needed
				break;
			case 'iconurl':
				if (this.hasAttribute('iconurl')) {
					this.iconUrl = newValue;
				} else {
					this.iconUrl = '';
				}
				this.refreshComponent();  // updates classes and html content if needed
				break;
			case 'mode':
				if (this.hasAttribute('mode')) { // TODO && !isNaN(Number(newValue))) {
					this.mode = Number(newValue);
				} else {
					this.mode = 0;
				}
				this.changeAttributesOnModeChange(this, true);
				this.refreshComponent();  // updates classes and html content if needed
				break;
			case 'orientation':
				if (this.hasAttribute('orientation')) {
					this.orientation = newValue as TCh5ButtonOrientation;
				} else {
					this.orientation = Ch5Button.ORIENTATIONS[0];
				}
				this.updateCssClasses();
				break;
			case 'type':
				if (this.hasAttribute('type')) {
					this.type = newValue as TCh5ButtonType;
				} else {
					this.type = Ch5Button.TYPES[0];
				}
				this.updateCssClasses();
				break;
			case 'shape':
				if (this.hasAttribute('shape')) {
					this.shape = newValue as TCh5ButtonShape;
				} else {
					this.shape = Ch5Button.SHAPES[0];
				}
				this.updateCssClasses();
				break;
			case 'halignlabel':
				if (this.hasAttribute('halignlabel')) {
					this.hAlignLabel = newValue as TCh5ButtonHorizontalAlignLabel;
				} else {
					this.hAlignLabel = Ch5Button.HORIZONTAL_LABEL_ALIGNMENTS[0];
				}
				this.updateCssClasses();
				break;
			case 'valignlabel':
				if (this.hasAttribute('valignlabel')) {
					this.vAlignLabel = newValue as TCh5ButtonVerticalAlignLabel;
				} else {
					this.vAlignLabel = Ch5Button.VERTICAL_LABEL_ALIGNMENTS[0];
				}
				this.updateCssClasses();
				break;
			case 'size':
				if (this.hasAttribute('size')) {
					this.size = newValue as TCh5ButtonSize;
				} else {
					this.size = Ch5Button.SIZES[0];
				}
				this.updateCssClasses();
				break;
			case 'stretch':
				if (this.hasAttribute('stretch')) {
					this.stretch = newValue as TCh5ButtonStretch | null;
				} else {
					this.stretch = null;
				}
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
					this.changeAttributesOnModeChange(this);
					this.updateCssClasses();
				}
				break;
			case 'checkboxshow':
				let isCheckboxShow = false;
				if (this.hasAttribute('checkboxshow')) {
					const attrSelected = (this.getAttribute('checkboxshow') as string).toLowerCase();
					if ('false' !== attrSelected && '0' !== attrSelected) {
						isCheckboxShow = true;
					}
				}
				this.checkboxShow = isCheckboxShow;
				this.updateCssClassesForCheckboxShow();
				this.updateInternalHtml();
				break;
			case 'checkboxposition':
				if (this.hasAttribute('checkboxposition')) {
					this.checkboxPosition = newValue as TCh5ButtonCheckboxPosition;
				} else {
					this.checkboxPosition = Ch5Button.CHECKBOX_POSITIONS[0];
				}
				this.updateCssClassesForCheckboxShow();
				this.updateInternalHtml();
				break;
			case 'formtype':
				if (this.hasAttribute('formtype')) {
					this.formType = this.getAttribute('formtype') as TCh5ButtonActionType | null;
				}
				break;
			case 'customclassselected':
				if (this.hasAttribute('customclassselected')) {
					this.customClassState = newValue;
				} else {
					this.customClassState = '';
				}
				this.updateCssClassesForCustomState();
				break;
			case 'customclasspressed':
				if (this.hasAttribute('customclasspressed')) {
					this.customClassPressed = newValue;
				} else {
					this.customClassPressed = '';
				}
				this.customClassState = this.customClassPressed;
				this.updatePressedClass(this.customClassState);
				break;
			case 'customclassdisabled':
				if (this.hasAttribute('customclassdisabled')) {
					this.customClassDisabled = newValue;
				} else {
					this.customClassDisabled = '';
				}
				this.customClassState = this.customClassDisabled;
				this.updateCssClassesForCustomState();
				break;
			case 'receivestateselected':
				if (this.hasAttribute('receivestateselected')) {
					this.receiveStateSelected = newValue;
				} else {
					this.receiveStateSelected = '';
				}
				break;
			case 'receivestatelabel':
				if (this.hasAttribute('receivestatelabel')) {
					this.receiveStateLabel = newValue;
				} else {
					this.receiveStateLabel = '';
				}
				break;
			case 'receivestatescriptlabelhtml':
				if (this.hasAttribute('receivestatescriptlabelhtml')) {
					this.receiveStateScriptLabelHtml = newValue;
				} else {
					this.receiveStateScriptLabelHtml = '';
				}
				break;
			case 'sendeventonclick':
				if (this.hasAttribute('sendeventonclick')) {
					this.sendEventOnClick = newValue;
				} else {
					this.sendEventOnClick = '';
				}
				break;
			case 'sendeventontouch':
				if (this.hasAttribute('sendeventontouch')) {
					this.sendEventOnTouch = newValue;
				} else {
					this.sendEventOnTouch = '';
				}
				break;
			case 'receivestateiconclass':
				if (this.hasAttribute('receivestateiconclass')) {
					this.receiveStateIconClass = newValue;
				} else {
					this.receiveStateIconClass = '';
				}
				break;
			case 'receivestateiconurl':
				if (this.hasAttribute('receivestateiconurl')) {
					this.receiveStateIconUrl = newValue;
				} else {
					this.receiveStateIconUrl = '';
				}
				break;
			case 'receivestatetype':
				if (this.hasAttribute('receivestatetype')) {
					this.receiveStateType = newValue;
				} else {
					this.receiveStateType = '';
				}
				break;
			case 'receivestatemode':
				if (this.hasAttribute('receivestatemode')) {
					this.receiveStateMode = newValue;
				} else {
					this.receiveStateMode = '';
				}
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
		// TODO - this need not be passed as parameter
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

	public updateIconClassAndPath(value: string) {
		this.logger.start("updateIconUrlAndPath");
		this.info("this.activeIconClass", this.activeIconClass);
		this.info("value", value);
		if (this.activeIconClass !== value) {
			this._activeIconClass.split(' ').forEach((className: string) => {
				className = className.trim();
				if (className !== '') {
					if (this.activeIconUrl !== '') {
						// if (this.hasAttribute('iconurl')) {
						this._elImg.classList.remove(className); // adds the new icon class if present
					} else {
						this._elIcon.classList.remove(className); // adds the new icon class if present
					}
				}
			});
		}
		this._activeIconClass = value;
		if (this.activeIconClass !== '') {
			this._activeIconClass.split(' ').forEach((className: string) => {
				className = className.trim();
				if (className !== '') {
					if (this.activeIconUrl !== '') {
						this._elImg.classList.add(className); // adds the new icon class if present
					} else {
						this._elIcon.classList.add(className); // adds the new icon class if present
					}
				}
			});
		}
		this.logger.stop();
	}

	public setLabel(labelHtml: string) {
		this.labelHtml = labelHtml;
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

	protected refreshComponent() {
		this.updateCssClasses();
		this.updateInternalHtml();
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
		setOfCssClassesToBeApplied.add(this.cssClassPrefix + '--' + this.activeType);

		// size
		if (this.stretch === null) {
			setOfCssClassesToBeApplied.add(this.cssClassPrefix + '--size-' + this.size);
		}

		// stretch
		if (this.stretch !== null) {
			setOfCssClassesToBeApplied.add(this.cssClassPrefix + '--stretch-' + this.stretch);
		}

		// orientation
		if ('vertical' === this.orientation) {
			setOfCssClassesToBeApplied.add(this.cssClassPrefix + '--' + this.orientation);
		}

		const targetEl: HTMLElement = this.getTargetElementForCssClassesAndStyle();
		if (typeof targetEl.classList !== 'undefined') {
			this._listOfAllPossibleComponentCssClasses.forEach((cssClass: string) => {
				if (setOfCssClassesToBeApplied.has(cssClass)) {
					this.info("cssClass to add", cssClass);
					targetEl.classList.add(cssClass);
				} else {
					this.info("cssClass to remove", cssClass);
					targetEl.classList.remove(cssClass);
				}
			});
		}

		const setOfCssClassesToBeAppliedForLabelAlignment = new Set<string>();

		// horizontal align
		setOfCssClassesToBeAppliedForLabelAlignment.add(this.cssClassPrefix + '--horizontal-' + this.activeHAlignLabel);

		// vertical align
		setOfCssClassesToBeAppliedForLabelAlignment.add(this.cssClassPrefix + '--vertical-' + this.activeVAlignLabel);

		// const targetBtn: HTMLElement = this._elLabelIconImage();
		// if (typeof targetBtn.classList !== 'undefined') {
		this._listOfAllPossibleComponentCssClasses.forEach((cssClass: string) => {
			if (setOfCssClassesToBeAppliedForLabelAlignment.has(cssClass)) {
				this._elSpanForLabelIconImg.classList.add(cssClass);
				this.info('add CSS class', cssClass);
			} else {
				this._elSpanForLabelIconImg.classList.remove(cssClass);
				this.info('remove CSS class', cssClass);
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

	protected updateCssClassesForCheckboxShow() {
		this.logger.start("updateCssClassesForCheckboxShow", this.COMPONENT_NAME);
		const targetEl: HTMLElement = this.getTargetElementForCssClassesAndStyle();
		if (typeof targetEl.classList !== 'undefined') {
			const checkboxShowCssClass: string = this.cssClassPrefix + "__checkbox";
			// if (this._checkboxShow) {
			targetEl.classList.add(checkboxShowCssClass);
			// } else {
			// targetEl.classList.remove(checkboxShowCssClass);
			// }
		}
		this.logger.stop();
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

	public changeAttributesOnButtonModePressedState() {
		this.logger.start("changeAttributesOnButtonModePressedState");
		let isButtonModePressedAvailable: boolean = false;
		const keyId = ['type', 'iconClass', 'iconPosition', 'iconUrl', 'checkboxPosition', 'customClass', 'customStyle', 'hAlignLabel', 'vAlignLabel', 'label'];
		type KeyID = typeof keyId[number]; // === 'type' | 'iconClass' | 'iconPosition' ....
		const updatedNodes: Record<KeyID, any> = {
			type: null,
			iconClass: null,
			iconPosition: null,
			iconUrl: null,
			checkboxPosition: null,
			customClass: null,
			customStyle: null,
			hAlignLabel: null,
			vAlignLabel: null,
			label: null
		};
		const buttonModesArray = this.getElementsByTagName("ch5-button-mode");
		if (buttonModesArray && buttonModesArray.length > 0) {
			const selectedButtonMode = buttonModesArray[this.mode];
			const buttonModeStatesArray = selectedButtonMode.getElementsByTagName("ch5-button-mode-state");
			if (buttonModeStatesArray && buttonModeStatesArray.length > 0) {
				const selectedButtonModeState = Array.from(buttonModeStatesArray).find(buttonModeState => {
					return (buttonModeState.getAttribute("state") === "pressed");
				});
				this.logger.log("selectedButtonModeState", selectedButtonModeState);
				if (selectedButtonModeState) {
					isButtonModePressedAvailable = true;

					if (!isNil(selectedButtonModeState.getAttribute("type"))) {
						updatedNodes.type = selectedButtonModeState.getAttribute("type") as TCh5ButtonType;
					}
					if (!isNil(selectedButtonModeState.getAttribute("iconclass"))) {
						updatedNodes.iconClass = selectedButtonModeState.getAttribute("iconclass") as string;
					}
					if (!isNil(selectedButtonModeState.getAttribute("iconposition"))) {
						updatedNodes.iconPosition = selectedButtonModeState.getAttribute("iconposition") as TCh5ButtonIconPosition;
					}
					if (!isNil(selectedButtonModeState.getAttribute("iconurl"))) {
						updatedNodes.iconUrl = selectedButtonModeState.getAttribute("iconurl") as string;
					}
					if (!isNil(selectedButtonModeState.getAttribute("checkboxposition"))) {
						updatedNodes.checkboxPosition = selectedButtonModeState.getAttribute("checkboxposition") as TCh5ButtonCheckboxPosition;
					}
					if (!isNil(selectedButtonModeState.getAttribute("customclass"))) {
						updatedNodes.customClass = selectedButtonModeState.getAttribute("customclass") as string;
					}
					if (!isNil(selectedButtonModeState.getAttribute("customclass"))) {
						updatedNodes.customStyle = selectedButtonModeState.getAttribute("customstyle") as string;
					}
					if (!isNil(selectedButtonModeState.getAttribute("halignlabel"))) {
						updatedNodes.hAlignLabel = selectedButtonModeState.getAttribute("halignlabel") as TCh5ButtonHorizontalAlignLabel;
					}
					if (!isNil(selectedButtonModeState.getAttribute("valignlabel"))) {
						updatedNodes.vAlignLabel = selectedButtonModeState.getAttribute("valignlabel") as TCh5ButtonVerticalAlignLabel;
					}

					const selectedButtonModeStateLabelButton = selectedButtonModeState.getElementsByTagName("ch5-button-label");
					if (selectedButtonModeStateLabelButton && selectedButtonModeStateLabelButton.length > 0 &&
						(selectedButtonModeStateLabelButton[0].children[0])) {
						updatedNodes.label = selectedButtonModeStateLabelButton[0].children[0].innerHTML as string;
					}
				}
				this.logger.log("updatedNodes Mode States: ", updatedNodes);
			}

			this.logger.log("updatedNodes Mode: ", updatedNodes);
		}

		// TODO - test cases for mode and state too
		if (!isNil(updatedNodes.type)) {
			if (isButtonModePressedAvailable === true) {
				if (!(this.receiveStateType && this.receiveStateType !== '')) {
					this.activeType = updatedNodes.type;
				}
			}
		}

		if (!isNil(updatedNodes.iconClass)) {
			if (isButtonModePressedAvailable === true) {
				if (!(this.receiveStateIconClass && this.receiveStateIconClass !== '')) {
					this.updateIconClassAndPath(updatedNodes.iconClass);
					// this.activeIconClass = updatedNodes.iconClass;
					this.refreshComponent();
				}
			}
		}

		if (!isNil(updatedNodes.iconPosition)) {
			if (isButtonModePressedAvailable === true) {
				this.activeIconPosition = updatedNodes.iconPosition;
			}
		}

		if (!isNil(updatedNodes.iconUrl)) {
			if (isButtonModePressedAvailable === true) {
				if (!(this.receiveStateIconUrl && this.receiveStateIconUrl !== '')) {
					this.activeIconUrl = updatedNodes.iconUrl;
					this.refreshComponent();
				}
			}
		}

		if (!isNil(updatedNodes.checkboxPosition)) {
			if (isButtonModePressedAvailable === true) {
				this.activeCheckboxPosition = updatedNodes.checkboxPosition;
			}
		}

		if (!isNil(updatedNodes.customClass)) {
			if (isButtonModePressedAvailable === true) {
				if (!(this.receiveStateCustomClass && this.receiveStateCustomClass !== '')) {
					this.activeCustomClass = updatedNodes.customClass;
				}
			}
		}

		if (!isNil(updatedNodes.customStyle)) {
			if (isButtonModePressedAvailable === true) {
				if (!(this.receiveStateCustomStyle && this.receiveStateCustomStyle !== '')) {
					this.activeCustomStyle = updatedNodes.customStyle;
				}
			}
		}

		if (!isNil(updatedNodes.hAlignLabel)) {
			if (isButtonModePressedAvailable === true) {
				this.activeHAlignLabel = updatedNodes.hAlignLabel;
			}
		}

		if (!isNil(updatedNodes.vAlignLabel)) {
			if (isButtonModePressedAvailable === true) {
				this.activeVAlignLabel = updatedNodes.vAlignLabel;
			}
		}

		if (!isNil(updatedNodes.label)) {
			if (isButtonModePressedAvailable === true) {
				if (!((this.receiveStateLabel && this.receiveStateLabel !== '') || (this.receiveStateLabel && this.receiveStateLabel !== ''))) {
					this.labelHtml = updatedNodes.label;
				}
			}
		}
		this.logger.log("updatedNodes Final: ", updatedNodes);
		this.logger.stop();
	}

	public changeAttributesOnModeChange(fromNode: Ch5Button | Ch5ButtonMode | Ch5ButtonModeState, updateMandatory: boolean = false, attibuteName?: string) {
		this.logger.start("changeAttributesOnModeChange");
		this.logger.log("this._intervalIdForRepeatDigital", this._intervalIdForRepeatDigital);
		this.logger.log("this.buttonPressed", this.buttonPressed);

		this.info("this._pressed", this._pressed);
		this.info("this._buttonPressed", this._buttonPressed);
		this.info("this._buttonPressedInPressable", this._buttonPressedInPressable);

		// let isPressedByOnPressEvent: boolean = false;
		// if (this._pressable) {
		// 	isPressedByOnPressEvent = this._pressable.isPressed();
		// 	this.info("this._pressable.isPressed()", this._pressable.isPressed());
		// } else {
		// 	isPressedByOnPressEvent = false;
		// 	this.info("this._pressable.isPressed() is NULL");
		// }
		if (this._pressed === false && (this._buttonPressedInPressable === false)) {

			// Applicable on Mode change and Selected change
			// We need not worry about this. ch5-button-label is immediate child , and no change in attribute
			// affects the data from immediate child.
			// this.info("changeAttributesOnModeChange called");
			const keyId = ['type', 'iconClass', 'iconPosition', 'iconUrl', 'checkboxPosition', 'customClass', 'customStyle', 'hAlignLabel', 'vAlignLabel', 'label'];
			type KeyID = typeof keyId[number]; // === 'type' | 'iconClass' | 'iconPosition' ....
			const updatedNodes: Record<KeyID, any> = {
				type: null,
				iconClass: null,
				iconPosition: null,
				iconUrl: null,
				checkboxPosition: null,
				customClass: null,
				customStyle: null,
				hAlignLabel: null,
				vAlignLabel: null,
				label: null
			};
			// TODO receive state label and pressed
			// TODO - check why this get called twice ech time we remove an attribute from child
			// TODO - Must be called once all is loaded - whendefined
			const buttonModesArray = this.getElementsByTagName("ch5-button-mode");
			if (buttonModesArray && buttonModesArray.length > 0) {
				const selectedButtonMode = buttonModesArray[this.mode];
				if (selectedButtonMode) { // This condition is to check that the mode value set is not in the list of modes i.e. mode=5 but number of modes=2
					// TODO - missing pressed
					const buttonModeStatesArray = selectedButtonMode.getElementsByTagName("ch5-button-mode-state");
					if (buttonModeStatesArray && buttonModeStatesArray.length > 0) {
						const selectedButtonModeState = Array.from(buttonModeStatesArray).find(buttonModeState => {
							return ((buttonModeState.getAttribute("state") === "selected" && this.selected === true) ||
								(buttonModeState.getAttribute("state") === "normal" && this.selected === false));
						});
						this.logger.log("selectedButtonModeState", selectedButtonModeState);
						if (selectedButtonModeState) {
							if (!isNil(selectedButtonModeState.getAttribute("type"))) {
								updatedNodes.type = selectedButtonModeState.getAttribute("type") as TCh5ButtonType;
							}
							if (!isNil(selectedButtonModeState.getAttribute("iconclass")) && !isNil(selectedButtonModeState.getAttribute("iconurl"))) {
								updatedNodes.iconUrl = selectedButtonModeState.getAttribute("iconurl") as string;
							} else {
								if (!isNil(selectedButtonModeState.getAttribute("iconclass"))) {
									updatedNodes.iconClass = selectedButtonModeState.getAttribute("iconclass") as string;
								}
								if (!isNil(selectedButtonModeState.getAttribute("iconurl"))) {
									updatedNodes.iconUrl = selectedButtonModeState.getAttribute("iconurl") as string;
								}
							}
							if (!isNil(selectedButtonModeState.getAttribute("iconposition"))) {
								updatedNodes.iconPosition = selectedButtonModeState.getAttribute("iconposition") as TCh5ButtonIconPosition;
							}
							if (!isNil(selectedButtonModeState.getAttribute("checkboxposition"))) {
								updatedNodes.checkboxPosition = selectedButtonModeState.getAttribute("checkboxposition") as TCh5ButtonCheckboxPosition;
							}
							if (!isNil(selectedButtonModeState.getAttribute("customclass"))) {
								updatedNodes.customClass = selectedButtonModeState.getAttribute("customclass") as string;
							}
							if (!isNil(selectedButtonModeState.getAttribute("customclass"))) {
								updatedNodes.customStyle = selectedButtonModeState.getAttribute("customstyle") as string;
							}
							if (!isNil(selectedButtonModeState.getAttribute("halignlabel"))) {
								updatedNodes.hAlignLabel = selectedButtonModeState.getAttribute("halignlabel") as TCh5ButtonHorizontalAlignLabel;
							}
							if (!isNil(selectedButtonModeState.getAttribute("valignlabel"))) {
								updatedNodes.vAlignLabel = selectedButtonModeState.getAttribute("valignlabel") as TCh5ButtonVerticalAlignLabel;
							}

							const selectedButtonModeStateLabelButton = selectedButtonModeState.getElementsByTagName("ch5-button-label");
							if (selectedButtonModeStateLabelButton && selectedButtonModeStateLabelButton.length > 0 &&
								(selectedButtonModeStateLabelButton[0].children[0])) {
								updatedNodes.label = selectedButtonModeStateLabelButton[0].children[0].innerHTML as string;
							}
						}
						this.logger.log("updatedNodes Mode States: ", updatedNodes);
					}
					if (isNil(updatedNodes.type) && !isNil(selectedButtonMode.getAttribute("type"))) {
						updatedNodes.type = selectedButtonMode.getAttribute("type") as TCh5ButtonType;
					}
					if (isNil(updatedNodes.iconClass) && isNil(updatedNodes.iconUrl)) {
						if (selectedButtonMode.getAttribute("iconurl") && selectedButtonMode.getAttribute("iconurl") !== '') {
							updatedNodes.iconUrl = selectedButtonMode.getAttribute("iconurl") as string;
						} else if (selectedButtonMode.getAttribute("iconclass") && selectedButtonMode.getAttribute("iconclass") !== '') {
							updatedNodes.iconClass = selectedButtonMode.getAttribute("iconclass") as string;
						}
					}
					if (isNil(updatedNodes.iconPosition) && !isNil(selectedButtonMode.getAttribute("iconposition"))) {
						updatedNodes.iconPosition = selectedButtonMode.getAttribute("iconposition") as TCh5ButtonIconPosition;
					}
					if (isNil(updatedNodes.checkboxPosition) && !isNil(selectedButtonMode.getAttribute("checkboxposition"))) {
						updatedNodes.checkboxPosition = selectedButtonMode.getAttribute("checkboxposition") as TCh5ButtonCheckboxPosition;
					}
					if (isNil(updatedNodes.customClass) && !isNil(selectedButtonMode.getAttribute("customclass"))) {
						updatedNodes.customClass = selectedButtonMode.getAttribute("customclass") as string;
					}
					if (isNil(updatedNodes.customStyle) && !isNil(selectedButtonMode.getAttribute("customstyle"))) {
						updatedNodes.customStyle = selectedButtonMode.getAttribute("customstyle") as string;
					}
					if (isNil(updatedNodes.hAlignLabel) && !isNil(selectedButtonMode.getAttribute("halignlabel"))) {
						updatedNodes.hAlignLabel = selectedButtonMode.getAttribute("halignlabel") as TCh5ButtonHorizontalAlignLabel;
					}
					if (isNil(updatedNodes.vAlignLabel) && !isNil(selectedButtonMode.getAttribute("valignlabel"))) {
						updatedNodes.vAlignLabel = selectedButtonMode.getAttribute("valignlabel") as TCh5ButtonVerticalAlignLabel;
					}

					const selectedButtonModeLabelButton = selectedButtonMode.getElementsByTagName("ch5-button-label");
					if (selectedButtonModeLabelButton && selectedButtonModeLabelButton.length > 0 &&
						!isNil(selectedButtonModeLabelButton[0].children[0]) && isNil(updatedNodes.label)) {
						updatedNodes.label = selectedButtonModeLabelButton[0].children[0].innerHTML as string;
					}
					this.logger.log("updatedNodes Mode: ", updatedNodes);
				}
			}

			// this.info("updatedNodes", updatedNodes);

			// &&			(attibuteName !== null || attibuteName != "" || attibuteName.toString().toLowerCase() === "type")

			// ----- ch5-button Attributes and corresponding ch5-button-label inside ch5-button
			if (isNil(updatedNodes.type) && !isNil(this.getAttribute("type"))) {
				updatedNodes.type = this.getAttribute("type") as TCh5ButtonType;
			}
			if (isNil(updatedNodes.iconClass) && isNil(updatedNodes.iconUrl)) {
				if (this.getAttribute("iconurl") && this.getAttribute("iconurl") !== '') {
					updatedNodes.iconUrl = this.getAttribute("iconurl") as string;
				} else if (this.getAttribute("iconclass") && this.getAttribute("iconclass") !== '') {
					updatedNodes.iconClass = this.getAttribute("iconclass") as string;
				}
			}
			if (isNil(updatedNodes.iconPosition) && !isNil(this.getAttribute("iconposition"))) {
				updatedNodes.iconPosition = this.getAttribute("iconposition") as TCh5ButtonIconPosition;
			}
			if (isNil(updatedNodes.checkboxPosition) && !isNil(this.getAttribute("checkboxposition"))) {
				updatedNodes.checkboxPosition = this.getAttribute("checkboxposition") as TCh5ButtonCheckboxPosition;
			}
			if (isNil(updatedNodes.customClass) && !isNil(this.getAttribute("customclass"))) {
				updatedNodes.customClass = this.getAttribute("customclass") as string;
			}
			if (isNil(updatedNodes.customStyle) && !isNil(this.getAttribute("customstyle"))) {
				updatedNodes.customStyle = this.getAttribute("customstyle") as string;
			}
			if (isNil(updatedNodes.hAlignLabel) && !isNil(this.getAttribute("halignlabel"))) {
				updatedNodes.hAlignLabel = this.getAttribute("halignlabel") as TCh5ButtonHorizontalAlignLabel;
			}
			if (isNil(updatedNodes.vAlignLabel) && !isNil(this.getAttribute("valignlabel"))) {
				updatedNodes.vAlignLabel = this.getAttribute("valignlabel") as TCh5ButtonVerticalAlignLabel;
			}
			if (isNil(updatedNodes.label)) {
				const templateData = this.getElementsByTagName("ch5-button-label");
				if (templateData && templateData.length > 0 && templateData[0].children) {
					updatedNodes.label = templateData[0].children[0].innerHTML as string;
				}
			}
			this.logger.log("updatedNodes Button: ", updatedNodes);

			if (!isNil(updatedNodes.type)) {
				if (!(this.receiveStateType && this.receiveStateType !== '')) {
					if (updateMandatory === true) {
						this.activeType = updatedNodes.type;
					} else {
						if (fromNode instanceof Ch5Button) {
							if (this.isComponentLoaded === false || this.getModes().length === 0) {
								this.activeType = updatedNodes.type;
							} else if (this.isComponentLoaded === true && this.getModes().length > 0) {
								this.activeType = updatedNodes.type;
							}
						} else {
							this.activeType = updatedNodes.type;
						}
					}
				}
			}

			if (!isNil(updatedNodes.iconClass)) {
				if (!(this.receiveStateIconClass && this.receiveStateIconClass !== '')) {
					if (updateMandatory === true) {
						this.updateIconClassAndPath(updatedNodes.iconClass);
						// this.activeIconClass = updatedNodes.iconClass;
						this.refreshComponent();
					} else {
						if (fromNode instanceof Ch5Button) {
							if (this.isComponentLoaded === false || this.getModes().length === 0) {
								this.updateIconClassAndPath(updatedNodes.iconClass);
								// this.activeIconClass = updatedNodes.iconClass;
								this.refreshComponent();
							} else if (this.isComponentLoaded === true && this.getModes().length > 0) {
								this.updateIconClassAndPath(updatedNodes.iconClass);
								// this.activeIconClass = updatedNodes.iconClass;
								this.refreshComponent();
							}
						} else {
							this.updateIconClassAndPath(updatedNodes.iconClass);
							// this.activeIconClass = updatedNodes.iconClass;
							this.refreshComponent();
						}
					}
				}
			}

			if (!isNil(updatedNodes.iconPosition)) {
				if (updateMandatory === true) {
					this.activeIconPosition = updatedNodes.iconPosition;
				} else {
					if (fromNode instanceof Ch5Button) {
						if (this.isComponentLoaded === false || this.getModes().length === 0) {
							this.activeIconPosition = updatedNodes.iconPosition;
						} else if (this.isComponentLoaded === true && this.getModes().length > 0) {
							this.activeIconPosition = updatedNodes.iconPosition;
						}
					} else {
						this.activeIconPosition = updatedNodes.iconPosition;
					}
				}
			}

			if (!isNil(updatedNodes.iconUrl)) {
				if (!(this.receiveStateIconUrl && this.receiveStateIconUrl !== '')) {
					if (updateMandatory === true) {
						this.activeIconUrl = updatedNodes.iconUrl;
						this.setIconUrlRefresh();
						this.refreshComponent();
					} else {
						if (fromNode instanceof Ch5Button) {
							if (this.isComponentLoaded === false || this.getModes().length === 0) {
								this.activeIconUrl = updatedNodes.iconUrl;
								this.setIconUrlRefresh();
								this.refreshComponent();
							} else if (this.isComponentLoaded === true && this.getModes().length > 0) {
								this.activeIconUrl = updatedNodes.iconUrl;
								this.setIconUrlRefresh();
								this.refreshComponent();
							}
						} else {
							this.activeIconUrl = updatedNodes.iconUrl;
							this.setIconUrlRefresh();
							this.refreshComponent();
						}
					}
				}
			}

			if (!isNil(updatedNodes.checkboxPosition)) {
				if (updateMandatory === true) {
					this.activeCheckboxPosition = updatedNodes.checkboxPosition;
				} else {
					if (fromNode instanceof Ch5Button) {
						if (this.isComponentLoaded === false || this.getModes().length === 0) {
							this.activeCheckboxPosition = updatedNodes.checkboxPosition;
						} else if (this.isComponentLoaded === true && this.getModes().length > 0) {
							this.activeCheckboxPosition = updatedNodes.checkboxPosition;
						}
					} else {
						this.activeCheckboxPosition = updatedNodes.checkboxPosition;
					}
				}
			}

			if (!isNil(updatedNodes.customClass)) {
				if (!(this.receiveStateCustomClass && this.receiveStateCustomClass !== '')) {
					if (updateMandatory === true) {
						this.activeCustomClass = updatedNodes.customClass;
					} else {
						if (fromNode instanceof Ch5Button) {
							if (this.isComponentLoaded === false || this.getModes().length === 0) {
								this.activeCustomClass = updatedNodes.customClass;
							} else if (this.isComponentLoaded === true && this.getModes().length > 0) {
								this.activeCustomClass = updatedNodes.customClass;
							}
						} else {
							this.activeCustomClass = updatedNodes.customClass;
						}
					}
				}
			}

			if (!isNil(updatedNodes.customStyle)) {
				if (!(this.receiveStateCustomStyle && this.receiveStateCustomStyle !== '')) {
					if (updateMandatory === true) {
						this.activeCustomStyle = updatedNodes.customStyle;
					} else {
						if (fromNode instanceof Ch5Button) {
							if (this.isComponentLoaded === false || this.getModes().length === 0) {
								this.activeCustomStyle = updatedNodes.customStyle;
							} else if (this.isComponentLoaded === true && this.getModes().length > 0) {
								this.activeCustomStyle = updatedNodes.customStyle;
							}
						} else {
							this.activeCustomStyle = updatedNodes.customStyle;
						}
					}
				}
			}

			if (!isNil(updatedNodes.hAlignLabel)) {
				if (updateMandatory === true) {
					this.activeHAlignLabel = updatedNodes.hAlignLabel;
				} else {
					if (fromNode instanceof Ch5Button) {
						if (this.isComponentLoaded === false || this.getModes().length === 0) {
							this.activeHAlignLabel = updatedNodes.hAlignLabel;
						} else if (this.isComponentLoaded === true && this.getModes().length > 0) {
							this.activeHAlignLabel = updatedNodes.hAlignLabel;
						}
					} else {
						this.activeHAlignLabel = updatedNodes.hAlignLabel;
					}
				}
			}

			if (!isNil(updatedNodes.vAlignLabel)) {
				if (updateMandatory === true) {
					this.activeVAlignLabel = updatedNodes.vAlignLabel;
				} else {
					if (fromNode instanceof Ch5Button) {
						if (this.isComponentLoaded === false || this.getModes().length === 0) {
							this.activeVAlignLabel = updatedNodes.vAlignLabel;
						} else if (this.isComponentLoaded === true && this.getModes().length > 0) {
							this.activeVAlignLabel = updatedNodes.vAlignLabel;
						}
					} else {
						this.activeVAlignLabel = updatedNodes.vAlignLabel;
					}
				}
			}

			if (!isNil(updatedNodes.label)) {
				if (!((this.receiveStateLabel && this.receiveStateLabel !== '') || (this.receiveStateLabel && this.receiveStateLabel !== ''))) {
					if (updateMandatory === true) {
						this.labelHtml = updatedNodes.label;
					} else {
						if (fromNode instanceof Ch5Button) {
							if (this.isComponentLoaded === false || this.getModes().length === 0) {
								if (!(this.receiveStateLabel !== '' || this.receiveStateScriptLabelHtml !== '')) {
									this.labelHtml = updatedNodes.label;
								}
							} else if (this.isComponentLoaded === true && this.getModes().length > 0) {
								if (!(this.receiveStateLabel !== '' || this.receiveStateScriptLabelHtml !== '')) {
									this.labelHtml = updatedNodes.label;
								}
							}
						} else {
							this.labelHtml = updatedNodes.label;
						}
					}
				}
			}

			this.logger.log("updatedNodes Final: ", updatedNodes);
		} else {
			this.changeAttributesOnButtonModePressedState();
		}
		this.logger.stop();
	}

	private setIconUrlRefresh() {
		this._iconSvgUrl = this.activeIconUrl || '';
		this._elImg.src = this._iconSvgUrl;

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
			this._elCheckboxIcon.classList.add('cx-button-checkbox-pos-' + this.activeCheckboxPosition);

			this._elIcon.classList.remove('cx-button-icon-pos-first');
			this._elIcon.classList.remove('cx-button-icon-pos-last');
			this._elIcon.classList.remove('cx-button-icon-pos-top');
			this._elIcon.classList.remove('cx-button-icon-pos-bottom');
			this._elIcon.classList.add('cx-button-icon-pos-' + this.activeIconPosition);

			this._elImg.classList.remove('cx-button-icon-pos-first');
			this._elImg.classList.remove('cx-button-icon-pos-last');
			this._elImg.classList.remove('cx-button-icon-pos-top');
			this._elImg.classList.remove('cx-button-icon-pos-bottom');
			this._elImg.classList.add('cx-button-icon-pos-' + this.activeIconPosition);

			// Handle vertical button with iconPosition top or bottom
			if (['top', 'bottom'].indexOf(this.activeIconPosition) >= 0 && this.orientation === Ch5Button.ORIENTATIONS[1]) {
				this._elButton.classList.add(`ch5-button--vertical--icon-${this.activeIconPosition}`)
			}

			let hasIcon = false;
			let hasLabel = false;
			let hasImage = false;
			let hasAriaLabel = false;
			let hasCheckboxIcon = false;

			if (this.activeIconClass !== "") {
				// if ((this.hasAttribute('iconclass') && '' !== this.getAttribute('iconclass')) || (this.activeIconClass !== "")) {
				hasIcon = true;
			}
			if (this.activeIconUrl !== "") {
				// if ((this.hasAttribute('iconUrl') && '' !== this.getAttribute('iconUrl')) || (this.activeIconUrl !== "")) {
				hasImage = true;
			}

			if ((this.hasAttribute('label') && '' !== this.getAttribute('label')) || (this.labelHtml !== "") ||
				(this.hasAttribute('receivestatescriptlabelhtml') && '' !== this.getAttribute('receivestatescriptlabelhtml'))) {
				hasLabel = true;
			}
			if (this.hasAttribute('aria-label') && '' !== this.getAttribute('aria-label')) {
				hasAriaLabel = true;
			}

			// TODO - not clear on the below point
			// updates the iconposition ( otherwise it might use the previous value of the attribute )
			if (this.hasAttribute('iconposition')) {
				this.iconPosition = this.getAttribute('iconposition') as TCh5ButtonIconPosition;
			}

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
					if (['right'].indexOf(this.activeCheckboxPosition) >= 0) {
						this.info('insert checkbox after label');
						if (this._elCheckboxIcon.parentNode !== (this._elButton as Node)) {
							// if the icon element was not yet added to the button
							this._elButton.appendChild(this._elCheckboxIcon);
						} else {
							// if the icon element was already added and needs to be switched with the label element
							this._elButton.insertBefore(this._elSpanForLabelIconImg as Node, this._elCheckboxIcon as Node);
						}

					} else if (['left'].indexOf(this.activeCheckboxPosition) >= 0) {
						this.info('insert checkbox before label');
						if ((this._elSpanForLabelIconImg as any).isConnected === true) {
							this._elButton.insertBefore(this._elCheckboxIcon as Node, this._elSpanForLabelIconImg as Node);
						}
					}
				} else {
					if (this._elCheckboxIcon.parentNode) {
						this._elCheckboxIcon.remove();
					}
				}

				if (['last', 'bottom'].indexOf(this.activeIconPosition) >= 0) {
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
				} else if (['first', 'top'].indexOf(this.activeIconPosition) >= 0) {
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
					if (['right'].indexOf(this.activeCheckboxPosition) >= 0) {
						this.info('insert checkbox after label');
						if (this._elCheckboxIcon.parentNode !== (this._elButton as Node)) {
							// if the icon element was not yet added to the button
							this._elButton.appendChild(this._elCheckboxIcon);
						} else {
							// if the icon element was already added and needs to be switched with the label element
							this._elButton.insertBefore(this._elSpanForLabelIconImg as Node, this._elCheckboxIcon as Node);
						}

					} else if (['left'].indexOf(this.activeCheckboxPosition) >= 0) {
						this.info('insert checkbox before label');
						if ((this._elSpanForLabelIconImg as any).isConnected === true) {
							this._elButton.insertBefore(this._elCheckboxIcon as Node, this._elSpanForLabelIconImg as Node);
						}
					}
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
					if (['right'].indexOf(this.activeCheckboxPosition) >= 0) {
						this.info('insert checkbox after label');
						if (this._elCheckboxIcon.parentNode !== (this._elButton as Node)) {
							// if the icon element was not yet added to the button
							this._elButton.appendChild(this._elCheckboxIcon);
						} else {
							// if the icon element was already added and needs to be switched with the label element
							this._elButton.insertBefore(this._elSpanForLabelIconImg as Node, this._elCheckboxIcon as Node);
						}

					} else if (['left'].indexOf(this.activeCheckboxPosition) >= 0) {
						this.info('insert checkbox before label');
						if ((this._elSpanForLabelIconImg as any).isConnected === true) {
							this._elButton.insertBefore(this._elCheckboxIcon as Node, this._elSpanForLabelIconImg as Node);
						}
					}
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
					if (['right'].indexOf(this.activeCheckboxPosition) >= 0) {
						this.info('insert icon after label');
						if (this._elCheckboxIcon.parentNode !== (this._elButton as Node)) {
							// if the icon element was not yet added to the button
							this._elButton.appendChild(this._elCheckboxIcon);
						} else {
							// if the icon element was already added and needs to be switched with the label element
							this._elButton.insertBefore(this._elSpanForLabelIconImg as Node, this._elCheckboxIcon as Node);
						}

					} else if (['left'].indexOf(this.activeCheckboxPosition) >= 0) {
						this.info('insert checkbox before label');
						if ((this._elSpanForLabelIconImg as any).isConnected === true) {
							this._elButton.insertBefore(this._elCheckboxIcon as Node, this._elSpanForLabelIconImg as Node);
						}
					}
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

					if (['last', 'bottom'].indexOf(this.activeIconPosition) >= 0) {
						this.info('insert icon after label');
						if (this._elImg.parentNode !== (this._elButton as Node)) {
							// if the icon element was not yet added to the button
							this._elSpanForLabelIconImg.appendChild(this._elImg);
						} else {
							// if the icon element was already added and needs to be switched with the label element
							this._elSpanForLabelIconImg.insertBefore(this._elSpanForLabelOnly as Node, this._elImg as Node);
						}
					} else if (['first', 'top'].indexOf(this.activeIconPosition) >= 0) {
						this.info('insert icon before label');
						if ((this._elSpanForLabelOnly as any).isConnected === true) {
							this._elSpanForLabelIconImg.insertBefore(this._elImg as Node, this._elSpanForLabelOnly as Node);
						}
					}
				} else {
					// this._elButton.appendChild(this._elImg);
					this._elSpanForLabelIconImg.appendChild(this._elImg);

					if (this._elSpanForLabelOnly.parentNode) {
						this._elSpanForLabelOnly.remove();
					}
				}
				this.imgToSvg(this._elImg);
			}

			// orientation
			if (this.orientation === 'vertical') {
				if (this.shape !== 'circle') {
					this.createIosEllipsis();
				}
			}

		}
		this.logger.stop();
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
