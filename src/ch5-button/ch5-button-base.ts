// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5Common, ICh5AttributeAndPropertySettings } from "../ch5-common/ch5-common";
import { Ch5Signal, Ch5SignalBridge, Ch5SignalFactory } from "../ch5-core/index";
import { Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { subscribeInViewPortChange, unSubscribeInViewPortChange } from '../ch5-core';
import isNil from 'lodash/isNil';
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";

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
	TCh5ButtonVerticalAlignLabel,
	TCh5ButtonBackgroundImageFillType,
	TCh5ButtonIconUrlFillType,
	TCh5ButtonSgIconTheme
} from './interfaces/t-ch5-button';
import { ICh5ButtonListContractObj } from "./interfaces/t-for-ch5-button-list-contract"
import { ICh5ButtonAttributes } from "./interfaces/i-ch5-button-attributes";
import { Ch5Pressable } from "../ch5-common/ch5-pressable";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { Subscription } from "rxjs";
import { ICh5ButtonExtendedProperties, Ch5ButtonUtils } from "./ch5-button-utils";
import { Ch5ButtonSignal } from "./ch5-button-signal";
import _ from "lodash";
import { Ch5ButtonMode } from "./ch5-button-mode";
import { Ch5ButtonModeState } from "./ch5-button-mode-state";
import { Ch5AugmentVarSignalsNames } from "../ch5-common/ch5-augment-var-signals-names";
import { resizeObserver } from "../ch5-core/resize-observer";

export class Ch5ButtonBase extends Ch5Common implements ICh5ButtonAttributes {

	//#region 1. Variables

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
	public static readonly BACKGROUND_IMAGE_FILL_TYPE: TCh5ButtonBackgroundImageFillType[] = ['stretch-aspect', 'stretch', 'center', 'tile'];

	/**
	 * The first value is in the array is the default value 
	 */
	public static readonly ICON_URL_FILL_TYPE: TCh5ButtonIconUrlFillType[] = ['stretch', 'stretch-aspect', 'center', 'tile', 'initial'];

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

	public static readonly SG_ICON_THEME: TCh5ButtonSgIconTheme[] = ['icons-lg', 'icons-sm', 'media-transports-accents', 'media-transports-light', 'media-transports-dark'];

	public static readonly MODES: {
		MIN_LENGTH: number,
		MAX_LENGTH: number
	} = {
			MIN_LENGTH: 0,
			MAX_LENGTH: 99
		};

	public static readonly MAX_SG_NUMERIC: number = 214;

	public static readonly COMPONENT_DATA: any = {
		TYPES: {
			default: Ch5ButtonBase.TYPES[0],
			values: Ch5ButtonBase.TYPES,
			key: 'type',
			attribute: 'type',
			classListPrefix: '--'
		},
		SHAPES: {
			default: Ch5ButtonBase.SHAPES[0],
			values: Ch5ButtonBase.SHAPES,
			key: 'shape',
			attribute: 'shape',
			classListPrefix: '--'
		},
		SIZES: {
			default: Ch5ButtonBase.SIZES[0],
			values: Ch5ButtonBase.SIZES,
			key: 'size',
			attribute: 'size',
			classListPrefix: '--size-'
		},
		STRETCH: {
			default: null,
			values: Ch5ButtonBase.STRETCHES,
			key: 'stretch',
			attribute: 'stretch',
			classListPrefix: '--stretch-'
		},
		ICON_POSITIONS: {
			default: Ch5ButtonBase.ICON_POSITIONS[0],
			values: Ch5ButtonBase.ICON_POSITIONS,
			key: 'iconposition',
			attribute: 'iconPosition',
			classListPrefix: '--iconposition-'
		},
		CHECKBOX_POSITIONS: {
			default: Ch5ButtonBase.CHECKBOX_POSITIONS[0],
			values: Ch5ButtonBase.CHECKBOX_POSITIONS,
			key: 'checkboxposition',
			attribute: 'checkboxPosition',
			classListPrefix: 'cx-button-checkbox-pos-'
		},
		HORIZONTAL_LABEL_ALIGNMENTS: {
			default: Ch5ButtonBase.HORIZONTAL_LABEL_ALIGNMENTS[0],
			values: Ch5ButtonBase.HORIZONTAL_LABEL_ALIGNMENTS,
			key: 'halignlabel',
			attribute: 'hAlignLabel',
			classListPrefix: '--horizontal-'
		},
		VERTICAL_LABEL_ALIGNMENTS: {
			default: Ch5ButtonBase.VERTICAL_LABEL_ALIGNMENTS[0],
			values: Ch5ButtonBase.VERTICAL_LABEL_ALIGNMENTS,
			key: 'valignlabel',
			attribute: 'vAlignLabel',
			classListPrefix: '--vertical-'
		},
		ORIENTATIONS: {
			default: Ch5ButtonBase.ORIENTATIONS[0],
			values: Ch5ButtonBase.ORIENTATIONS,
			key: 'orientation',
			classListPrefix: '--'
		},
		BACKGROUND_IMAGE_FILL_TYPE: {
			default: Ch5ButtonBase.BACKGROUND_IMAGE_FILL_TYPE[0],
			values: Ch5ButtonBase.BACKGROUND_IMAGE_FILL_TYPE,
			key: 'backgroundImageFillType',
			attribute: 'backgroundImageFillType',
			classListPrefix: '--background-image-fill-type-'
		},
		ICON_URL_FILL_TYPE: {
			default: Ch5ButtonBase.ICON_URL_FILL_TYPE[0],
			values: Ch5ButtonBase.ICON_URL_FILL_TYPE,
			key: 'iconUrlFillType',
			attribute: 'iconUrlFillType',
			classListPrefix: '--icon-url-fill-type-'
		},
		SG_ICON_THEME: {
			default: Ch5ButtonBase.SG_ICON_THEME[0],
			values: Ch5ButtonBase.SG_ICON_THEME,
			key: 'sgIconTheme',
			attribute: 'sgIconTheme',
			classListPrefix: '--sg-icon-theme-'
		}
	};

	public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
		...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
		receivestatemode: { direction: "state", numericJoin: 1, contractName: true },
		receivestateselected: { direction: "state", booleanJoin: 1, contractName: true },
		receivestatelabel: { direction: "state", stringJoin: 1, contractName: true },
		receivestatescriptlabelhtml: { direction: "state", stringJoin: 1, contractName: true },
		receivestateiconclass: { direction: "state", stringJoin: 1, contractName: true },
		receivestateiconurl: { direction: "state", stringJoin: 1, contractName: true },
		receivestatetype: { direction: "state", stringJoin: 1, contractName: true },
		receivestatesgiconnumeric: { direction: "state", numericJoin: 1, contractName: true },
		receivestatesgiconstring: { direction: "state", stringJoin: 1, contractName: true },

		sendeventonclick: { direction: "event", booleanJoin: 1, contractName: true },
		sendeventontouch: { direction: "event", booleanJoin: 1, contractName: true },
		contractname: { contractName: true },
		booleanjoinoffset: { booleanJoin: 1 },
		numericjoinoffset: { numericJoin: 1 },
		stringjoinoffset: { stringJoin: 1 },
		receivestatebackgroundimageurl: { direction: "state", stringJoin: 1, contractName: true }
	};

	public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
		{
			default: "",
			name: "backgroundImageUrl",
			nameForSignal: "receiveStateBackgroundImageUrl",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true,
		},
		{
			default: Ch5ButtonBase.BACKGROUND_IMAGE_FILL_TYPE[0],
			enumeratedValues: Ch5ButtonBase.BACKGROUND_IMAGE_FILL_TYPE,
			name: "backgroundImageFillType",
			removeAttributeOnNull: true,
			type: "enum",
			valueOnAttributeEmpty: Ch5ButtonBase.BACKGROUND_IMAGE_FILL_TYPE[0],
			isObservableProperty: true
		},
		{
			default: null,
			enumeratedValues: Ch5ButtonBase.ICON_URL_FILL_TYPE,
			name: "iconUrlFillType",
			removeAttributeOnNull: true,
			type: "enum",
			valueOnAttributeEmpty: null,
			isObservableProperty: true,
			isNullable: true
		},
		{
			default: "",
			isSignal: true,
			name: "receiveStateBackgroundImageUrl",
			signalType: "string",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true,
		},
		{
			default: Ch5ButtonBase.SG_ICON_THEME[0],
			enumeratedValues: Ch5ButtonBase.SG_ICON_THEME,
			name: "sgIconTheme",
			removeAttributeOnNull: true,
			type: "enum",
			valueOnAttributeEmpty: Ch5ButtonBase.SG_ICON_THEME[0],
			isObservableProperty: true,
		},
		{
			default: "",
			isSignal: true,
			name: "receiveStateSGIconNumeric",
			signalType: "number",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true,
		},
		{
			default: "",
			isSignal: true,
			name: "receiveStateSGIconString",
			signalType: "string",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true,
		},
	];

	private readonly BUTTON_PROPERTIES: {
		CHECKBOX_SHOW: ICh5AttributeAndPropertySettings,
		SELECTED: ICh5AttributeAndPropertySettings,
		VALIGN_LABEL: ICh5AttributeAndPropertySettings,
		PRESSED: ICh5AttributeAndPropertySettings
	} = {
			CHECKBOX_SHOW: {
				default: false,
				valueOnAttributeEmpty: true,
				variableName: "_checkboxShow",
				attributeName: "checkboxShow",
				propertyName: "checkboxShow",
				type: "boolean",
				removeAttributeOnNull: true,
				enumeratedValues: ['true', 'false', '', true, false],
				componentReference: this,
				callback: this.checkboxDisplay.bind(this)
			},
			SELECTED: {
				default: false,
				valueOnAttributeEmpty: true,
				variableName: "_selected",
				attributeName: "selected",
				propertyName: "selected",
				removeAttributeOnNull: true,
				type: "boolean",
				enumeratedValues: ['true', 'false', '', true, false],
				componentReference: this,
				callback: this.setSelectionMethods.bind(this)
			},
			VALIGN_LABEL: {
				default: Ch5ButtonBase.VERTICAL_LABEL_ALIGNMENTS[0],
				valueOnAttributeEmpty: Ch5ButtonBase.VERTICAL_LABEL_ALIGNMENTS[0],
				variableName: "_vAlignLabel",
				attributeName: "vAlignLabel",
				propertyName: "vAlignLabel",
				removeAttributeOnNull: false,
				type: "enum",
				enumeratedValues: Ch5ButtonBase.VERTICAL_LABEL_ALIGNMENTS,
				componentReference: this,
				callback: this.setButtonDisplay.bind(this)
			},
			PRESSED: {
				default: false,
				valueOnAttributeEmpty: true,
				variableName: "_pressed",
				attributeName: "pressed",
				propertyName: "pressed",
				removeAttributeOnNull: true,
				type: "boolean",
				enumeratedValues: ['true', 'false', '', true, false],
				componentReference: this
			}
		};

	private readonly STATE_CHANGE_TIMEOUTS: number = 500;
	private readonly BUTTON_PRIMARY_CLASS: string = 'cb-btn';

	private readonly pressedCssClassPostfix: string = '--pressed';
	private readonly selectedCssClassPostfix: string = '--selected';

	private repeatFlag: boolean = false;

	//#endregion

	//#region 1.2 private / protected variables

	private isResizeInProgress: boolean = false;
	private readonly RESIZE_DEBOUNCE: number = 500;

	public readonly ELEMENT_NAME: string = 'ch5-button';
	public primaryCssClass: string = 'ch5-button'; // These are not readonly because they can be changed in extended components

	private DEBOUNCE_BUTTON_DISPLAY: number = 25;

	private _elContainer: HTMLElement = {} as HTMLElement;
	private _elButton: HTMLElement = {} as HTMLElement;
	private _elSpanForLabelOnly: HTMLElement = {} as HTMLElement;
	private _elSpanForLabelIconImg: HTMLElement = {} as HTMLElement;
	private _elIcon: HTMLElement = {} as HTMLElement;
	private _elCheckboxIcon: HTMLElement = {} as HTMLElement;
	protected _ch5Properties: Ch5Properties;

	private _isPressedSubscription: Subscription | null = null;

	private _mode: number = 0;
	private isModeSetUsingJavascript: boolean = false;

	private _label: string = '';
	private _labelInnerHTML: string = '';
	private isLabelSetUsingJavascript: boolean = false;
	private labelSetByJavascriptValue: string = "";

	/**
	 * The icon's CSS class name as defined in the iconClass HTML attribute
	 */
	private _iconClass: string = '';
	private _previousIconClass: string = '';
	private _previousSgIconNumeric: number = -1;
	private _previousSgIconString: string = '';

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

	private isButtonInitiated: boolean = false;
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
	 * Same if stretch both is used. 
	 */
	private _stretch: TCh5ButtonStretch | null = null;

	/**
	 * Valid values: default, info, text, danger, warning, success, primary, secondary.
	 * Overrides the appearance of the button with alternative css defined in classes defined with ch5-button--type
	 * where type is the value of the property. If no "type" is provided, type of 'default' is used.
	 */
	private _type: TCh5ButtonType = 'default';

	/**
	 * Valid values: null, stretch, stretch-aspect, tile, center, initial.
	 * Sets the fill type of the image set in iconUrl. Uses the css property background-size for the implementation. 
	 * The attribute type is Enum.
	 */
	private _iconUrlFillType: TCh5ButtonIconUrlFillType | null = null;

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
	 * Changing the button mode through signal
	 *
	 * @type {string | null}
	 */
	private _sigNameReceiveStateMode: string | null = null;

	/**
	 * Subscription reference for mode signal
	 *
	 * @type {string | null}
	 */
	private _subReceiveSignalMode: string | null = null;

	private _repeatDigitalInterval: number | null = null;

	private _ch5ButtonSignal: Ch5ButtonSignal;

	private _pressable: Ch5Pressable | null = null;

	// private _hammerManager: HammerManager = {} as HammerManager;

	/**
	 * image URL. Must be a supported image format, including JPEG, GIF, PNG, SVG, and BMP.
	 */
	private _iconUrl: string = '';
	private _previousIconUrl: string = '';

	/**
	 * CSS class applied while the button is pressed by user.
	 */
	private _customClassPressed: string | null = null;

	/**
	 * CSS class applied while the button is disabled.
	 */
	private _customClassDisabled: string | null = null;

	private sgIconNumeric: number = -1;
	private sgIconString: string = "";

	private buttonListContract: ICh5ButtonListContractObj = {
		clickHoldTime: 0,
		index: -1,
		contractName: "",
		parentComponent: ""
	};

	private previousExtendedProperties: ICh5ButtonExtendedProperties = {};

	private debounceSetButtonDisplay = this.debounce(() => {
		this.setButtonDisplayDetails();
	}, this.DEBOUNCE_BUTTON_DISPLAY);

	//#endregion

	//#endregion

	//#region 2. Setters and Getters

	public set label(value: string) {
		this.logger.log('set label("' + value + '")');

		if (isNil(value)) {
			value = '';
		}

		const trValue: string = this._getTranslatedValue('label', value);
		if (trValue !== this.label) {
			this.setAttribute('label', trValue);
			this.setButtonDisplay();
		}
	}
	public get label() {
		return this._label;
	}

	public set labelInnerHTML(value: string) {
		this.logger.log('set labelInnerHTML("' + value + '")');

		if (isNil(value)) {
			value = '';
		}

		if (value !== this.labelInnerHTML) {
			this.setAttribute('labelInnerHTML', value);
			this._labelInnerHTML = value;
			this.createButtonLabel(this);
			this.setButtonDisplay();
		}
	}
	public get labelInnerHTML() {
		return this._labelInnerHTML;
	}

	public set formType(value: TCh5ButtonActionType | null) {
		this.logger.log('set formType("' + value + '")');
		if (!isNil(value)) {
			this.setAttribute('formType', value);
		} else {
			this.removeAttribute('formType');
		}
		// Note that _formType is not set anywhere
	}
	public get formType(): TCh5ButtonActionType | null {
		return this._formType;
	}

	public set customClass(value: string) {
		this.setButtonAttribute('customClass', value);
	}
	public get customClass(): string {
		return this._customClass;
	}

	public set customStyle(value: string) {
		this.setButtonAttribute('customStyle', value);
	}
	public get customStyle(): string {
		return this._customStyle;
	}

	public set iconClass(value: string) {
		this.setButtonAttribute('iconClass', value);
	}
	public get iconClass(): string {
		return this._iconClass;
	}

	public set hAlignLabel(value: TCh5ButtonHorizontalAlignLabel) {
		this.setButtonAttribute('hAlignLabel', value, Ch5ButtonBase.HORIZONTAL_LABEL_ALIGNMENTS, Ch5ButtonBase.HORIZONTAL_LABEL_ALIGNMENTS[0]);
	}
	public get hAlignLabel(): TCh5ButtonHorizontalAlignLabel {
		return this._hAlignLabel;
	}

	/**
	 * @param attribute 
	 * @param value 
	 * @param enumeratedMasterData 
	 */
	private setButtonAttribute<T>(attribute: keyof Ch5ButtonBase, value: T, enumeratedMasterData: T[] = [], defaultValue?: T) {
		this.logger.log('setButtonAttribute: ' + attribute + ' - "' + value + '"');
		if (this[attribute] !== value) {
			if (enumeratedMasterData.length === 0) {
				// Implies that the content can be any string
				if (_.isNil(value) || String(value).trim() === "") {
					this.removeAttribute(attribute);
					this.setButtonDisplay();
				} else {
					this.setAttribute(attribute, String(value));
					this.setButtonDisplay();
				}
			} else {
				// Implies that the content has to be an enumerated value ONLY
				if (enumeratedMasterData.indexOf(value) >= 0) {
					this.setAttribute(attribute, String(value).trim());
					this.setButtonDisplay();
				} else {
					if (!_.isNil(defaultValue)) {
						this.setAttribute(attribute, String(defaultValue).trim());
						this.setButtonDisplay();
					} else {
						this.removeAttribute(attribute);
						this.setButtonDisplay();
					}
				}
			}
		}
	}

	public set vAlignLabel(value: TCh5ButtonVerticalAlignLabel) {
		// this.setButtonAttribute('vAlignLabel', value, Ch5ButtonBase.VERTICAL_LABEL_ALIGNMENTS, Ch5ButtonBase.VERTICAL_LABEL_ALIGNMENTS[0]);
		this.setAttributeAndProperty(this.BUTTON_PROPERTIES.VALIGN_LABEL, value);
	}
	public get vAlignLabel(): TCh5ButtonVerticalAlignLabel {
		return this._vAlignLabel;
	}

	public set mode(value: number) {
		this.logger.log('set mode("' + value + '")');
		if (this._mode !== value) {
			if (Number.isNaN(value)) {
				this._mode = 0;
			} else {
				if (value >= Ch5ButtonBase.MODES.MIN_LENGTH && value <= Ch5ButtonBase.MODES.MAX_LENGTH) {
					const buttonModesArray = this.getElementsByTagName("ch5-button-mode");
					if (buttonModesArray && buttonModesArray.length > 0) {
						if (value < buttonModesArray.length) {
							this._mode = value;
						} else {
							this._mode = 0;
						}
					} else {
						this._mode = 0;
					}
				} else {
					this._mode = 0;
				}
			}
			this.setAttribute('mode', String(this._mode));
			this.setButtonDisplay();
		}
	}
	public get mode(): number {
		return this._mode;
	}

	public set checkboxPosition(value: TCh5ButtonCheckboxPosition) {
		this.setButtonAttribute('checkboxPosition', value, Ch5ButtonBase.CHECKBOX_POSITIONS, Ch5ButtonBase.CHECKBOX_POSITIONS[0]);
	}
	public get checkboxPosition(): TCh5ButtonCheckboxPosition {
		return this._checkboxPosition;
	}

	public set checkboxShow(value: boolean) {
		this.logger.log('set checkboxShow("' + value + '")');
		this.setAttributeAndProperty(this.BUTTON_PROPERTIES.CHECKBOX_SHOW, value);
	}

	public get checkboxShow(): boolean {
		return this._checkboxShow;
	}

	public set iconPosition(value: TCh5ButtonIconPosition) {
		this.setButtonAttribute('iconPosition', value, Ch5ButtonBase.ICON_POSITIONS, Ch5ButtonBase.ICON_POSITIONS[0]);
	}
	public get iconPosition(): TCh5ButtonIconPosition {
		return this._iconPosition;
	}

	public set iconUrl(value: string) {
		this.setButtonAttribute('iconUrl', value);
	}
	public get iconUrl(): string {
		return this._iconUrl;
	}

	public set orientation(value: TCh5ButtonOrientation) {
		this.logger.log('set orientation("' + value + '")');
		if (this._orientation !== value) {
			this._orientation = Ch5ButtonUtils.getValidInputValue(Ch5ButtonBase.ORIENTATIONS, value);
			this.setAttribute('orientation', this._orientation);
		}
	}
	public get orientation(): TCh5ButtonOrientation {
		return this._orientation;
	}

	public set type(value: TCh5ButtonType) {
		this.logger.log('set type("' + value + '")');
		if (this._type !== value) {
			this.setAttribute('type', Ch5ButtonUtils.getValidInputValue(Ch5ButtonBase.TYPES, value));
			this.setButtonDisplay();
		}
	}
	public get type(): TCh5ButtonType {
		return this._type;
	}

	public set shape(value: TCh5ButtonShape) {
		this.logger.log('set shape("' + value + '")');
		if (this._shape !== value && value !== null) {
			if (Ch5ButtonBase.SHAPES.indexOf(value) >= 0) {
				this._shape = value;
			} else {
				this._shape = Ch5ButtonBase.SHAPES[0];
			}
			this.setAttribute('shape', this._shape);
		}
	}
	public get shape() {
		return this._shape;
	}

	public set size(value: TCh5ButtonSize) {
		this.logger.log('set size("' + value + '")');
		if (this._size !== value && null !== value) {
			if (Ch5ButtonBase.SIZES.indexOf(value) >= 0) {
				this._size = value;
			} else {
				this._size = Ch5ButtonBase.SIZES[0];
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
		this.logger.log('set stretch("' + value + '")');
		if (value !== null) {
			if (this._stretch !== value) {
				if (Ch5ButtonBase.STRETCHES.indexOf(value) >= 0) {
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
		this.updateCssClasses();
	}
	public get stretch(): TCh5ButtonStretch | null {
		return this._stretch;
	}

	public set selected(value: boolean) {
		this.logger.log('set selected("' + value + '")');
		if (_.isNil(this.receiveStateSelected) || this.receiveStateSelected === "") {
			this.setAttributeAndProperty(this.BUTTON_PROPERTIES.SELECTED, value);
		}
	}
	public get selected(): boolean {
		return this._selected;
	}

	public set pressed(value: boolean) {
		this.logger.log('set pressed("' + value + '")');
		this.setAttributeAndProperty(this.BUTTON_PROPERTIES.PRESSED, value);

		let valueToSet: boolean = false;
		if (typeof value === "boolean") {
			valueToSet = value;
		} else {
			if (this.hasAttribute("pressed")) {
				if ([true, false, "true", "false", "0", "1", 0, 1, '', null].indexOf(value) < 0) {
					valueToSet = false;
				} else {
					valueToSet = this.toBoolean(value, true);
				}
			} else {
				valueToSet = false;
			}
		}

		if (this._pressable) {
			if (this._pressable?._pressed !== valueToSet) {
				this._pressable.setPressed(valueToSet);
			}
		}
		this.updateCssClasses();
	}
	public get pressed(): boolean {
		if (this._pressable) {
			return this._pressable._pressed;
		} else {
			return false;
		}
	}

	public set customClassState(value: string) {
		this.logger.log('set customclassstate("' + value + '")');
		if (this._customClassState !== value) {
			this._customClassState = value;
		}
	}
	public get customClassState(): string {
		return this._customClassState;
	}

	public set customClassPressed(value: string | null) {
		this.logger.log('set customClassPressed("' + value + '")');
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
		this.logger.log('set customClassDisabled("' + value + '")');
		if (this._customClassDisabled !== value) {
			this._customClassDisabled = value;
		}
	}
	public get customClassDisabled(): string | null {
		return this._customClassDisabled;
	}

	public set backgroundImageUrl(value: string) {
		this._ch5Properties.set<string>("backgroundImageUrl", value, () => {
			this.backgroundImageURLHandler();
		});
	}
	public get backgroundImageUrl(): string {
		return this._ch5Properties.get<string>("backgroundImageUrl");
	}

	public set backgroundImageFillType(value: TCh5ButtonBackgroundImageFillType) {
		this._ch5Properties.set<TCh5ButtonBackgroundImageFillType>("backgroundImageFillType", value, () => {
			this.updateCssClasses();
		});
	}
	public get backgroundImageFillType(): TCh5ButtonBackgroundImageFillType {
		return this._ch5Properties.get<TCh5ButtonBackgroundImageFillType>("backgroundImageFillType");
	}

	public set iconUrlFillType(value: TCh5ButtonIconUrlFillType | null) {
		this._ch5Properties.set<TCh5ButtonIconUrlFillType | null>("iconUrlFillType", value, () => {
			if (this._iconUrlFillType !== value) {
				this.setButtonDisplay();
				this.updateCssClasses();
			}
		});
	}
	public get iconUrlFillType(): TCh5ButtonIconUrlFillType | null {
		return this._iconUrlFillType;
		// return this._ch5Properties.get<TCh5ButtonIconUrlFillType | null>("iconUrlFillType");
	}

	public set receiveStateBackgroundImageUrl(value: string) {
		this._ch5Properties.set("receiveStateBackgroundImageUrl", value, null, (newValue: string) => {
			this._ch5Properties.setForSignalResponse<string>("backgroundImageUrl", newValue, () => {
				this.backgroundImageURLHandler();
			});
		});
	}
	public get receiveStateBackgroundImageUrl(): string {
		return this._ch5Properties.get<string>('receiveStateBackgroundImageUrl');
	}

	//#region 2.1. Signals

	public set sendEventOnClick(value: string) {
		this.logger.log('set sendEventOnClick("' + value + '")');
		if ((value !== '') && (value !== this._sigNameSendOnClick)) {
			this._sigNameSendOnClick = value;
			this.setAttribute('sendeventonclick', value);
		}
	}
	public get sendEventOnClick(): string {
		return this._sigNameSendOnClick;
	}

	public set sendEventOnTouch(value: string) {
		this.logger.log('set sendEventOnTouch("' + value + '")');
		if ((value !== '') && (value !== this._sigNameSendOnTouch)) {
			this._sigNameSendOnTouch = value;
			this.setAttribute('sendeventontouch', value);
		}
	}
	public get sendEventOnTouch(): string {
		return this._sigNameSendOnTouch;
	}

	public set receiveStateSelected(value: string) {
		this.logger.log('set receiveStateSelected("' + value + '")');
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
		// the condition at the start of the method stops an infinite loop ( property change <-> attribute changed callback)
		this.setAttribute('receiveStateSelected', value);

		// setup new subscription.
		const receiveSelectedSigName: string = Ch5Signal.getSubscriptionSignalName(this._sigNameReceiveSelected);
		const receiveSignal: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance().getBooleanSignal(receiveSelectedSigName);

		if (receiveSignal === null) {
			return;
		}

		this._subReceiveSelected = receiveSignal.subscribe((newValue: boolean) => {
			if (newValue !== this.selected) {
				this.setAttributeAndProperty(this.BUTTON_PROPERTIES.SELECTED, newValue as unknown as boolean, true);
			}
		});
	}
	public get receiveStateSelected(): string {
		// The internal property is changed if/when the element is removed from DOM
		// Returning the attribute instead of the internal property preserves functionality
		return this._attributeValueAsString('receivestateselected');
	}

	public set receiveStateLabel(inputValue: string) {
		this.receiveSignalAsString(this, "receiveStateLabel", inputValue);
	}
	public get receiveStateLabel(): string {
		// The internal property is changed if/when the element is removed from DOM
		// Returning the attribute instead of the internal property preserves functionality
		return this._attributeValueAsString('receivestatelabel');
	}

	public set receiveStateScriptLabelHtml(inputValue: string) {
		this.receiveSignalAsString(this, "receiveStateScriptLabelHtml", inputValue);
	}
	public get receiveStateScriptLabelHtml(): string {
		// The internal property is changed if/when the element is removed from DOM
		// Returning the attribute instead of the internal property preserves functionality
		return this._attributeValueAsString('receivestatescriptlabelhtml');
	}

	public set receiveStateIconClass(inputValue: string) {
		this.receiveSignalAsString(this, "receiveStateIconClass", inputValue);
	}
	public get receiveStateIconClass(): string {
		return this._attributeValueAsString('receivestateiconclass');
	}

	public set receiveStateIconUrl(inputValue: string) {
		this.receiveSignalAsString(this, "receiveStateIconUrl", inputValue);
	}
	public get receiveStateIconUrl(): string {
		return this._attributeValueAsString('receivestateiconurl');
	}

	public set receiveStateMode(signalName: string) {
		this.logger.log('set receiveStateMode(\'' + signalName + '\')');
		this.logger.log('this._sigNameReceiveStateMode' + this._sigNameReceiveStateMode);

		if (this._sigNameReceiveStateMode === signalName || signalName === null) {
			return;
		}

		// clean up old subscription
		if (this._sigNameReceiveStateMode) {
			this.logger.log('_sigNameReceiveStateMode exists');

			const oldReceiveStateSigName: string = Ch5Signal.getSubscriptionSignalName(this._sigNameReceiveStateMode);
			const oldSignal: Ch5Signal<number> | null = Ch5SignalFactory.getInstance().getNumberSignal(oldReceiveStateSigName);

			this.logger.log('oldReceiveStateSigName', oldReceiveStateSigName);
			this.logger.log('oldSignal', oldSignal);
			if (oldSignal !== null) {
				oldSignal.unsubscribe(this._subReceiveSignalMode as string);
			}
		}

		this._sigNameReceiveStateMode = signalName;
		this.setAttribute('receivestatemode', signalName);

		// setup new subscription.
		const receiveLabelSigName: string = Ch5Signal.getSubscriptionSignalName(this._sigNameReceiveStateMode);
		const receiveSignal: Ch5Signal<number> | null = Ch5SignalFactory.getInstance().getNumberSignal(receiveLabelSigName);
		if (receiveSignal === null) {
			return;
		}

		this._subReceiveSignalMode = receiveSignal.subscribe((newValue: number) => {
			if (this.isModeSetUsingJavascript === false) {
				this.mode = Number(newValue) as number;
				this.setButtonDisplay();
			}
		});
	}
	public get receiveStateMode(): string {
		return this._attributeValueAsString('receivestatemode');
	}

	public set receiveStateType(inputValue: string) {
		this.receiveSignalAsString(this, "receiveStateType", inputValue);
	}
	public get receiveStateType(): string {
		return this._attributeValueAsString('receivestatetype');
	}

	public set sgIconTheme(value: TCh5ButtonSgIconTheme) {
		this._ch5Properties.set<TCh5ButtonSgIconTheme>("sgIconTheme", value, () => {
			Array.from(Ch5ButtonBase.SG_ICON_THEME).forEach((theme) => this._elIcon.classList.remove('sg-' + theme));
			this._elIcon.classList.add('sg-' + this.sgIconTheme);
		});
	}
	public get sgIconTheme(): TCh5ButtonSgIconTheme {
		return this._ch5Properties.get<TCh5ButtonSgIconTheme>("sgIconTheme");
	}

	public set receiveStateSGIconNumeric(value: string) {
		this._ch5Properties.set("receiveStateSGIconNumeric", value, null, (newValue: number) => {
			if (newValue >= 0 && newValue <= Ch5ButtonBase.MAX_SG_NUMERIC) {
				this.sgIconNumeric = newValue;
				this.setButtonDisplay();
			}
		});
	}
	public get receiveStateSGIconNumeric(): string {
		return this._ch5Properties.get<string>('receiveStateSGIconNumeric');
	}

	public set receiveStateSGIconString(value: string) {
		this._ch5Properties.set("receiveStateSGIconString", value, null, (newValue: string) => {
			this.sgIconString = newValue.trim().toLowerCase().split(' ').join('-');
			this.setButtonDisplay();
		});
	}
	public get receiveStateSGIconString(): string {
		return this._ch5Properties.get<string>('receiveStateSGIconString');
	}

	// Rewriting this property from base class since it has to follow more features for button like buttonmode and state
	public set receiveStateCustomClass(inputValue: string) {
		this.receiveSignalAsString(this, "receiveStateCustomClass", inputValue);
	}
	/**
	 * The internal property is changed if/when the element is removed from dom
	 * Returning the attribute instead of the internal property preserves functionality
	 */
	public get receiveStateCustomClass(): string {
		return this._attributeValueAsString('receivestatecustomclass');
	}

	// Rewriting this property from base class since it has to follow more features for button like buttonmode and state
	public set receiveStateCustomStyle(inputValue: string) {
		this.receiveSignalAsString(this, "receiveStateCustomStyle", inputValue);
	}
	public get receiveStateCustomStyle(): string {
		// The internal property is changed if/when the element is removed from dom
		// Returning the attribute instead of the internal property preserves functionality
		return this._attributeValueAsString('receivestatecustomstyle');
	}

	//#endregion

	//#endregion

	//#region 3. Lifecycle Hooks

	public constructor(public buttonListContractObj?: ICh5ButtonListContractObj) {
		super();
		this.logger.start('constructor()', this.primaryCssClass);
		if (!this._wasInstatiated) {
			this.createInternalHtml();
		}
		if (buttonListContractObj) { this.buttonListContract = buttonListContractObj; }
		this._wasInstatiated = true;
		this._ch5ButtonSignal = new Ch5ButtonSignal();
		this._onBlur = this._onBlur.bind(this);
		this._onFocus = this._onFocus.bind(this);
		this._ch5Properties = new Ch5Properties(this, Ch5ButtonBase.COMPONENT_PROPERTIES);
		this.updateCssClasses();
		this.logger.stop();
	}

	/**
	 * Called when the ch5-button component is first connected to the DOM
	 */
	public connectedCallback() {
		this.logger.start('connectedCallback()', this.primaryCssClass);
		subscribeInViewPortChange(this, () => {
			if (this.elementIsInViewPort) {
				this.verticalOrientationHandler();
			} else {
				this.setAttribute("pressed", "false");
				if (this._pressable) {

					this._pressable.resetPressAndReleaseActions();
				}
			}
		});
		this.isButtonInitiated = false;
		this.previousExtendedProperties = {}; // Very important - for pages hidden with buttons and shown back with noshowtype remove

		this._listOfAllPossibleComponentCssClasses = this.generateListOfAllPossibleComponentCssClasses();
		if (this.buttonListContract?.parentComponent === "ch5-tab-button" || this.buttonListContract?.parentComponent === "ch5-button-list") {
			this.updatePressedClass(this.primaryCssClass + this.pressedCssClassPostfix + ' ' + this.buttonListContract?.parentComponent + this.pressedCssClassPostfix);
		} else {
			this.updatePressedClass(this.primaryCssClass + this.pressedCssClassPostfix);
		}

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

		// this._hammerManager = new Hammer(this._elContainer);
		this.attachEventListeners();

		this.initAttributes();
		this.initCommonMutationObserver(this);
		if (!this.hasAttribute('customclasspressed')) {
			this.updateCssClassesForCustomState();
		}
		customElements.whenDefined('ch5-button').then(() => {
			this.isButtonInitiated = true;
			this.setButtonDisplay(); // This is to handle specific case where the setButtonDisplay isn't called as all button attributes are set to "default" values.
			this.updateCssClasses(); // Temporary fix for the previousExtendedProperties mentioned above
			this.componentLoadedEvent(this.ELEMENT_NAME, this.id);
			// publishEvent('object', `component`, { tagName: 'ch5-button', loaded: true, id: this.id });
			// publishEvent('object', `ch5-button:${this.id}`, { loaded: true, id: this.id });
		});
		this.logger.stop();
	}

	private onWindowResizeHandler() {
		// since stretch has no default value, should fire stretchHandler only if required
		if (!this.isResizeInProgress) {
			this.isResizeInProgress = true;
			setTimeout(() => {
				this.verticalOrientationHandler();
				this.isResizeInProgress = false; // reset debounce once completed
			}, this.RESIZE_DEBOUNCE);
		}
	}

	private verticalOrientationHandler() {
		if (!_.isNil(this.stretch) && this.shape === "circle" && this.parentElement) {
			const { offsetHeight: parentHeight, offsetWidth: parentWidth } = this.parentElement;
			const setValue = parentWidth <= parentHeight ? parentWidth : parentHeight;
			if (setValue !== 0) {
				this.style.height = setValue + 'px';
				this.style.width = setValue + 'px';
			}
		}
		if (this.orientation === "vertical") {
			if (!_.isNil(this.stretch) && this.parentElement) {
				const { height, width } = this.parentElement.getBoundingClientRect();
				if (this.stretch === 'height') {
					this._elButton.style.width = height + "px";
					this._elButton.style.height = this._elContainer.getBoundingClientRect().width + "px";
				} else if (this.stretch === 'width') {
					this._elButton.style.height = width + "px";
					this._elButton.style.width = this._elContainer.getBoundingClientRect().height + "px";
				} else if (this.stretch === 'both') {
					this._elButton.style.height = width + "px";
					this._elButton.style.width = height + "px";
				}
			} else if (_.isNil(this.stretch) && this.shape !== "circle") {
				const { height, width } = this._elContainer.getBoundingClientRect();
				this._elButton.style.width = height + "px";
				this._elButton.style.height = width + "px";
			} else if (this.shape === "circle") {
				this._elButton.style.removeProperty('width');
				this._elButton.style.removeProperty('height');
			}
		} else {
			this._elButton.style.removeProperty('width');
			this._elButton.style.removeProperty('height');
		}
	}

	public static get observedAttributes() {
		const inheritedObsAttrs = Ch5Common.observedAttributes;
		const newObsAttrs = [
			'label',
			'labelinnerhtml',

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

			'pressed',
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
			'sendeventontouch',
			'iconurlfilltype',
			'backgroundimageurl',
			'backgroundimagefilltype',
			'receivestatebackgroundimageurl'
		];
		for (let i: number = 0; i < Ch5ButtonBase.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5ButtonBase.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				newObsAttrs.push(Ch5ButtonBase.COMPONENT_PROPERTIES[i].name.toLowerCase());
			}
		}
		return inheritedObsAttrs.concat(newObsAttrs);
	}

	protected initAttributes() {
		super.initAttributes();

		const thisRef: any = this;
		for (let i: number = 0; i < Ch5ButtonBase.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5ButtonBase.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				if (this.hasAttribute(Ch5ButtonBase.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
					const key = Ch5ButtonBase.COMPONENT_PROPERTIES[i].name;
					thisRef[key] = this.getAttribute(key);
				}
			}
		}
		this.logger.start("initAttributes", this.primaryCssClass);

		if (this.hasAttribute('checkboxposition')) {
			this.checkboxPosition = this.getAttribute('checkboxposition') as TCh5ButtonCheckboxPosition;
		}
		if (this.hasAttribute('checkboxshow')) {
			this.checkboxShow = this.getAttribute('checkboxshow') as unknown as boolean;
		}
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
		// TODO - why is customclassselected checked?
		// if (this.hasAttribute('selected') && !this.hasAttribute('customclassselected')) {
		if (this.hasAttribute('selected')) {
			this.selected = this.getAttribute('selected') as unknown as boolean;
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
		if (this.hasAttribute('valignlabel')) {
			this.vAlignLabel = this.getAttribute('valignlabel') as TCh5ButtonVerticalAlignLabel;
		}
		if (this.hasAttribute('pressed')) {
			this.pressed = this.getAttribute('pressed') as unknown as boolean;
		}
		if (this.hasAttribute('labelInnerHTML')) {
			this.labelInnerHTML = this.getAttribute('labelInnerHTML') as string;
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
			this.receiveStateIconUrl = this.getAttribute('receivestateiconurl') as string;
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

		this.updateCssClasses();
		this.updateInternalHtml();
		this.logger.stop();
	}

	protected attachEventListeners() {
		super.attachEventListeners();

		this._elButton.addEventListener('focus', this._onFocus);
		this._elButton.addEventListener('blur', this._onBlur);
		// init pressable before initAttributes because pressable subscribe to gestureable attribute
		if (!isNil(this._pressable)) {
			this._pressable.init();
			this._subscribeToPressableIsPressed();
		}
		resizeObserver(this._elContainer, this.onWindowResizeHandler.bind(this));
	}

	protected removeEventListeners() {
		super.removeEventListeners();
		this._elButton.removeEventListener('focus', this._onFocus);
		this._elButton.removeEventListener('blur', this._onBlur);
		if (this.style) {
			this.style.removeProperty('height');
			this.style.removeProperty('width');
		}
		if (!isNil(this._pressable)) {
			this._unsubscribeFromPressableIsPressed();
		}
	}

	protected _onFocus(inEvent: Event): void {
		this.logger.start("_onFocus");
		const clonedEvent: Event = new Event(inEvent.type, inEvent);
		this.dispatchEvent(clonedEvent);
		inEvent.preventDefault();
		inEvent.stopPropagation();
		this.logger.stop();
	}

	protected _onBlur(inEvent: Event): void {
		this.logger.start("_onBlur");
		this.pressed = false;
		const clonedEvent: Event = new Event(inEvent.type, inEvent);
		this.dispatchEvent(clonedEvent);
		inEvent.preventDefault();
		inEvent.stopPropagation();
		this.logger.stop();
	}
	/**
	 * Called when an HTML attribute is changed, added or removed
	 */
	public attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
		this.logger.start("attributeChangedCallback", this.primaryCssClass);
		if (oldValue === newValue) {
			this.logger.stop();
			return;
		}

		this.logger.log('ch5-button attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');

		const attributeChangedProperty = Ch5ButtonBase.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
		if (attributeChangedProperty) {
			const thisRef: any = this;
			const key = attributeChangedProperty.name;
			thisRef[key] = newValue;
		}

		switch (attr) {
			case 'customclass':
				this.customClass = Ch5ButtonUtils.getAttributeValue<string>(this, 'customclass', newValue, '');
				break;

			case 'labelinnerhtml':
				this.labelInnerHTML = Ch5ButtonUtils.getAttributeValue<string>(this, 'labelinnerhtml', newValue, '');
				break;

			case 'receivestatecustomclass':
				if (this.hasAttribute('receivestatecustomclass')) {
					this.receiveStateCustomClass = this.getAttribute('receivestatecustomclass') as string;
				} else {
					this.clearStringSignalSubscription(this._receiveStateCustomClass, this._subKeySigReceiveCustomClass);
					this._receiveStateCustomClass = '';
				}
				break;

			case 'customstyle':
				this.customStyle = Ch5ButtonUtils.getAttributeValue<string>(this, 'customstyle', newValue, '');
				break;

			case 'receivestatecustomstyle':
				if (this.hasAttribute('receivestatecustomstyle')) {
					this.receiveStateCustomStyle = this.getAttribute('receivestatecustomstyle') as string;
				} else {
					this.clearStringSignalSubscription(this._receiveStateCustomStyle, this._subKeySigReceiveCustomStyle);
					this._receiveStateCustomStyle = '';
				}
				break;

			case 'label':
				this.label = Ch5ButtonUtils.getAttributeValue<string>(this, 'label', newValue, '');
				break;

			case 'iconclass':
				this.iconClass = Ch5ButtonUtils.getAttributeValue<string>(this, 'iconclass', newValue, '');
				break;

			case 'iconposition':
				this.iconPosition = Ch5ButtonUtils.getAttributeValue<TCh5ButtonIconPosition>(this, 'iconposition', newValue as TCh5ButtonIconPosition, Ch5ButtonBase.ICON_POSITIONS[0]);
				break;

			case 'iconurl':
				this.iconUrl = Ch5ButtonUtils.getAttributeValue<string>(this, 'iconurl', newValue, '');
				break;

			case 'mode':
				this.mode = Ch5ButtonUtils.getAttributeValue<number>(this, 'mode', Number(newValue), 0);
				this.updateCssClasses();
				this.updateInternalHtml();
				break;

			case 'orientation':
				this.orientation = Ch5ButtonUtils.getAttributeValue<TCh5ButtonOrientation>(this, 'orientation', newValue as TCh5ButtonOrientation, Ch5ButtonBase.ORIENTATIONS[0]);
				this.updateCssClasses();
				break;

			case 'type':
				this.type = Ch5ButtonUtils.getAttributeValue<TCh5ButtonType>(this, 'type', newValue as TCh5ButtonType, Ch5ButtonBase.TYPES[0]);
				break;

			case 'shape':
				this.shape = Ch5ButtonUtils.getAttributeValue<TCh5ButtonShape>(this, 'shape', newValue as TCh5ButtonShape, Ch5ButtonBase.SHAPES[0]);
				this.updateCssClasses();
				break;

			case 'halignlabel':
				this.hAlignLabel = Ch5ButtonUtils.getAttributeValue<TCh5ButtonHorizontalAlignLabel>(this, 'halignlabel', newValue as TCh5ButtonHorizontalAlignLabel, Ch5ButtonBase.HORIZONTAL_LABEL_ALIGNMENTS[0]);
				break;

			case 'valignlabel':
				this.vAlignLabel = Ch5ButtonUtils.getAttributeValue<TCh5ButtonVerticalAlignLabel>(this, 'valignlabel', newValue as TCh5ButtonVerticalAlignLabel, Ch5ButtonBase.VERTICAL_LABEL_ALIGNMENTS[0]);
				break;

			case 'size':
				this.size = Ch5ButtonUtils.getAttributeValue<TCh5ButtonSize>(this, 'size', newValue as TCh5ButtonSize, Ch5ButtonBase.SIZES[0]);
				this.updateCssClasses();
				break;

			case 'stretch':
				this.stretch = Ch5ButtonUtils.getAttributeValue<TCh5ButtonStretch | null>(this, 'stretch', newValue as TCh5ButtonStretch, null);
				this.updateCssClasses();
				break;

			case 'selected':
				// if (!this.hasAttribute('customclassselected')) {
				// if (this.hasAttribute('selected')) {
				// 	this.selected = this.toBoolean(newValue, true);
				// }	
				// this.updateCssClasses();
				this.selected = newValue as unknown as boolean;
				// }
				break;

			case 'pressed':
				this.pressed = newValue as unknown as boolean;
				break;

			case 'checkboxshow':
				this.checkboxShow = newValue as unknown as boolean;
				this.updateInternalHtml();
				break;

			case 'checkboxposition':
				this.checkboxPosition = Ch5ButtonUtils.getAttributeValue<TCh5ButtonCheckboxPosition>(this, 'checkboxposition', newValue as TCh5ButtonCheckboxPosition, Ch5ButtonBase.CHECKBOX_POSITIONS[0]);
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


	protected updateSwipeGesture() {
		if (this._pressable !== null && !_.isNil(this._pressable.options)) {
			this._pressable.options.enableSwipe = this.swipeGestureEnabled;
		}
	}
	public createButtonLabel(selectedObject: Ch5ButtonBase | Ch5ButtonMode | Ch5ButtonModeState) {
		const buttonLabelList = selectedObject.getElementsByTagName("ch5-button-label");
		const findButtonLabel = Array.prototype.slice.call(buttonLabelList).filter((x: { parentNode: { nodeName: { toString: () => string; }; }; }) => x.parentNode.nodeName.toString().toLowerCase() === selectedObject.nodeName.toString().toLowerCase());
		let childButtonLabel: any = null;
		if (findButtonLabel && findButtonLabel.length > 0 && !isNil(findButtonLabel[0].children[0])) {
			childButtonLabel = findButtonLabel[0];
		} else {
			childButtonLabel = document.createElement('ch5-button-label');
			selectedObject.appendChild(childButtonLabel);
		}
		let templateEl = childButtonLabel.querySelector('template');
		if (templateEl !== null) {
			childButtonLabel.removeChild(templateEl);
		}
		templateEl = document.createElement('template');
		templateEl.innerHTML = this.decodeInnerHTMLForAttribute(selectedObject.labelInnerHTML);
		// templateEl.content.appendChild(document.createTextNode(this.decodeInnerHTMLForAttribute(selectedObject.labelInnerHTML)));
		childButtonLabel.appendChild(templateEl);

	}

	private backgroundImageURLHandler() {
		if (this.backgroundImageUrl !== "" && !_.isNil(this.backgroundImageUrl)) {
			this._elButton.style.backgroundImage = "url(" + this.backgroundImageUrl + ")";
		}
	}

	private _subscribeToPressableIsPressed() {
		if (this.buttonListContract.contractName.trim() !== "" && this.buttonListContract.parentComponent.trim() === 'ch5-button-list') { return this._subscribeToPressableIsPressedForButtonList(); }
		if (this.buttonListContract.contractName.trim() !== "" && this.buttonListContract.parentComponent.trim() === 'ch5-tab-button') { return this._subscribeToPressableIsPressedForTabButton(); }
		const REPEAT_DIGITAL_PERIOD = 200;
		// const MAX_REPEAT_DIGITALS = 30000 / REPEAT_DIGITAL_PERIOD;
		if (this._isPressedSubscription === null && this._pressable !== null) {
			this._isPressedSubscription = this._pressable.observablePressed.subscribe((value: boolean) => {
				this.logger.log(`Ch5Button.pressableSubscriptionCb(${value})`, this.pressed);
				if (value === false) {
					if (this._repeatDigitalInterval !== null) {
						window.clearInterval(this._repeatDigitalInterval as number);
					}
					this.sendValueForRepeatDigitalWorking(false);
					this.repeatFlag = false;
					try {
						this.removeEventListener('touchmove', this._onTouchMove);
						this.style.touchAction = '';
						this._elContainer.style.touchAction = '';
					} catch {
						console.info('removeEventListener');
					}
					setTimeout(() => {
						this.setButtonDisplay();
					}, this.STATE_CHANGE_TIMEOUTS);
				} else {
					this.sendValueForRepeatDigitalWorking(true);
					if (this._repeatDigitalInterval !== null) {
						window.clearInterval(this._repeatDigitalInterval as number);
					}
					// let numRepeatDigitals = 0;
					this._repeatDigitalInterval = window.setInterval(() => {
						this.sendValueForRepeatDigitalWorking(true);
						if (!this.repeatFlag) {
							this.style.touchAction = 'none';
							this._elContainer.style.touchAction = 'none';
							this.addEventListener('touchmove', this._onTouchMove, { passive: false });
							this.repeatFlag = true;
						}
						// if (++numRepeatDigitals >= MAX_REPEAT_DIGITALS) {
						// 	console.warn("Ch5Button MAXIMUM Repeat digitals sent");
						// 	window.clearInterval(this._repeatDigitalInterval as number);
						// 	this.sendValueForRepeatDigitalWorking(false);
						// }
					}, REPEAT_DIGITAL_PERIOD);
					this.setButtonDisplay();
				}
				// }
			});
		}
	}

	private _onTouchMove(event: Event) {
		event.preventDefault();

	}

	private _subscribeToPressableIsPressedForTabButton() {
		if (this._isPressedSubscription === null && this._pressable !== null) {
			this._isPressedSubscription = this._pressable.observablePressed.subscribe((value: boolean) => {
				this.logger.log(`Ch5Button.pressableSubscriptionCb(${value})`, this.pressed);
				if (value === false) {
					Ch5SignalFactory.getInstance().getBooleanSignal(this.buttonListContract.contractName + `.Tab${this.buttonListContract.index}_Press`)?.publish(value);
					setTimeout(() => {
						this.setButtonDisplay();
					}, this.STATE_CHANGE_TIMEOUTS);
				} else {
					Ch5SignalFactory.getInstance().getBooleanSignal(this.buttonListContract.contractName + `.Tab${this.buttonListContract.index}_Press`)?.publish(value);
					this.setButtonDisplay();
				}
			});
		}
	}

	private _subscribeToPressableIsPressedForButtonList() {
		if (this._isPressedSubscription === null && this._pressable !== null) {
			let isHeld = false;
			this._isPressedSubscription = this._pressable.observablePressed.subscribe((value: boolean) => {
				this.logger.log(`Ch5Button.pressableSubscriptionCb(${value})`, this.pressed);
				if (value === false) {
					Ch5SignalFactory.getInstance().getBooleanSignal(this.buttonListContract.contractName + `.Button${this.buttonListContract.index}ItemPress`)?.publish(value);
					if (isHeld === false) {
						Ch5SignalFactory.getInstance().getNumberSignal(this.buttonListContract.contractName + '.ListItemClicked')?.publish(this.buttonListContract.index);
					}
					if (this._repeatDigitalInterval !== null) {
						window.clearInterval(this._repeatDigitalInterval as number);
						isHeld = false;
					}
					setTimeout(() => {
						this.setButtonDisplay();
					}, this.STATE_CHANGE_TIMEOUTS);
				} else {
					Ch5SignalFactory.getInstance().getBooleanSignal(this.buttonListContract.contractName + `.Button${this.buttonListContract.index}ItemPress`)?.publish(value);
					if (this._repeatDigitalInterval !== null) {
						window.clearInterval(this._repeatDigitalInterval as number);
					}
					if (this.buttonListContract.clickHoldTime === 0) {
						isHeld = true;
						Ch5SignalFactory.getInstance().getNumberSignal(this.buttonListContract.contractName + '.ListItemHeld')?.publish(this.buttonListContract.index);
					} else {
						this._repeatDigitalInterval = window.setInterval(() => {
							isHeld = true;
							Ch5SignalFactory.getInstance().getNumberSignal(this.buttonListContract.contractName + '.ListItemHeld')?.publish(this.buttonListContract.index);
							window.clearInterval(this._repeatDigitalInterval as number);
						}, this.buttonListContract.clickHoldTime);
					}
					this.setButtonDisplay();
				}
			});
		}
	}

	private _unsubscribeFromPressableIsPressed() {
		if (this._repeatDigitalInterval !== null) {
			window.clearInterval(this._repeatDigitalInterval as number);
		}
		if (this._isPressedSubscription !== null) {
			this._isPressedSubscription.unsubscribe();
			this._isPressedSubscription = null;
		}
	}

	/**
	 * Called when the ch5-button component is disconnected from the DOM
	 */
	public disconnectedCallback() {
		this.logger.start('disconnectedCallback()');
		this.removeEventListeners();
		this.unsubscribeFromSignals();
		unSubscribeInViewPortChange(this);
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
			cssPressedClass: pressedClass,
			enableSwipe: this.swipeGestureEnabled
		});
	}

	protected updateForChangeInCustomCssClass() {
		const targetElement: HTMLElement = this.getTargetElementForCssClassesAndStyle();
		this.logger.start("updateForChangeInCustomCssClass()");

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
		this.logger.start("updateForChangeInStyleCss()");
		const targetElement: HTMLElement = this.getTargetElementForCssClassesAndStyle();
		targetElement.style.cssText = this.customStyle;
		this.logger.stop();
	}


	private generateListOfAllPossibleComponentCssClasses(): string[] {
		const cssClasses: string[] = [];
		cssClasses.push(this.primaryCssClass);

		// shapes
		Ch5ButtonBase.SHAPES.forEach((shape: TCh5ButtonShape) => {
			const newClass = this.primaryCssClass + '--' + shape;
			cssClasses.push(newClass);
		});

		// types
		Ch5ButtonBase.TYPES.forEach((type: TCh5ButtonType) => {
			const newCssClass = this.primaryCssClass + '--' + type;
			cssClasses.push(newCssClass);
		});

		// horizontal align label
		Ch5ButtonBase.HORIZONTAL_LABEL_ALIGNMENTS.forEach((type: TCh5ButtonHorizontalAlignLabel) => {
			const newCssClass = this.primaryCssClass + '--horizontal-' + type;
			cssClasses.push(newCssClass);
		});

		// vertical align label
		Ch5ButtonBase.VERTICAL_LABEL_ALIGNMENTS.forEach((type: TCh5ButtonVerticalAlignLabel) => {
			const newCssClass = this.primaryCssClass + '--vertical-' + type;
			cssClasses.push(newCssClass);
		});

		// sizes
		Ch5ButtonBase.SIZES.forEach((size: TCh5ButtonSize) => {
			cssClasses.push(this.primaryCssClass + '--size-' + size);
		});

		// stretches
		Ch5ButtonBase.STRETCHES.forEach((stretch: TCh5ButtonStretch) => {
			cssClasses.push(this.primaryCssClass + '--stretch-' + stretch);
		});

		// backgroundImageFillType
		Ch5ButtonBase.BACKGROUND_IMAGE_FILL_TYPE.forEach((backgroundImageFillType: TCh5ButtonBackgroundImageFillType) => {
			cssClasses.push(this.primaryCssClass + '--background-image-fill-type-' + backgroundImageFillType);
		});

		// iconUrlFillType
		Ch5ButtonBase.ICON_URL_FILL_TYPE.forEach((iconUrlFillType: TCh5ButtonIconUrlFillType) => {
			cssClasses.push(this.primaryCssClass + '--icon-url-fill-type-' + iconUrlFillType);
		});

		// orientation
		Ch5ButtonBase.ORIENTATIONS.forEach((orientation: TCh5ButtonOrientation) => {
			cssClasses.push(this.primaryCssClass + '--' + orientation);
		});

		// selected
		cssClasses.push(this.primaryCssClass + this.selectedCssClassPostfix);
		if (this.buttonListContract?.parentComponent === "ch5-tab-button" || this.buttonListContract?.parentComponent === "ch5-button-list") {
			cssClasses.push(this.buttonListContract?.parentComponent + this.selectedCssClassPostfix);
		}

		return cssClasses;
	}

	public unsubscribeFromSignals() {
		super.unsubscribeFromSignals();
		this._ch5ButtonSignal.unsubscribeAll();
	}

	private updateIconDisplay() {
		this.logger.start("updateIconDisplay");
		if (!isNil(this._previousIconUrl) && this._previousIconUrl !== '') {
			this._elIcon.style.backgroundImage = '';
		}
		if (!isNil(this._previousIconClass) && this._previousIconClass !== '') {
			this._previousIconClass.split(' ').forEach((className: string) => {
				className = className.trim();
				if (this._elIcon && this._elIcon.classList && className !== "") {
					this._elIcon.classList.remove(className);
				}
			});
		}
		if (this._previousSgIconNumeric !== -1) {
			this._elIcon.classList.remove('sg-' + this._previousSgIconNumeric + '');
		}
		if (this._previousSgIconString !== '') {
			this._elIcon.classList.remove('sg-' + this._previousSgIconString);
		}

		this._elIcon.classList.remove('sg');
		Array.from(Ch5ButtonBase.SG_ICON_THEME).forEach((theme) => this._elIcon.classList.remove('sg-' + theme));

		if (!isNil(this.sgIconString) && this.sgIconString !== '') {
			this._elIcon.classList.add('sg-' + this.sgIconString);
			this._previousSgIconString = this.sgIconString;
			this._elIcon.classList.add('sg');
			this._elIcon.classList.add('sg-' + this.sgIconTheme);
		} else if (!isNil(this.sgIconNumeric) && this.sgIconNumeric !== -1) {
			this._elIcon.classList.add('sg-' + this.sgIconNumeric + '');
			this._previousSgIconNumeric = this.sgIconNumeric;
			this._elIcon.classList.add('sg');
			this._elIcon.classList.add('sg-' + this.sgIconTheme);
		} else if (!isNil(this.iconUrl) && this.iconUrl !== '' && this.iconUrl === this._ch5ButtonSignal.getSignal('receiveStateIconUrl')?.currentValue) {
			this._elIcon.style.backgroundImage = this.iconUrl;
		} else if (!isNil(this.iconClass) && this.iconClass !== '' && this.iconClass === this._ch5ButtonSignal.getSignal('receiveStateiconClass')?.currentValue) {
			this.iconClass.split(' ').forEach((className: string) => {
				className = className.trim();
				if (className !== '') {
					this._elIcon.classList.add(className);
				}
			});
		} else if (!isNil(this.iconUrl) && this.iconUrl !== '') {
			this._elIcon.style.backgroundImage = this.iconUrl;
		} else if (!isNil(this.iconClass) && this.iconClass !== '') {
			this.iconClass.split(' ').forEach((className: string) => {
				className = className.trim();
				if (className !== '') {
					this._elIcon.classList.add(className);
				}
			});
		}
		this.logger.stop();
	}

	public setLabel(labelHtml: string) {
		this.labelSetByJavascriptValue = labelHtml;
		this.isLabelSetUsingJavascript = true;
		this.setButtonDisplay();
	}

	public setMode(modeId: number) {
		this.mode = modeId;
		this.isModeSetUsingJavascript = true;
		this.setButtonDisplay();
	}

	protected createInternalHtml() {
		this.logger.start('createInternalHtml()');
		this.clearComponentContent();
		this._elContainer = document.createElement('div');
		this._elButton = document.createElement('button');
		this._elButton.classList.add(this.BUTTON_PRIMARY_CLASS);
		this._elCheckboxIcon = document.createElement('i');
		this._elCheckboxIcon.classList.add('cb-checkbox-icon');
		this._elSpanForLabelIconImg = document.createElement('span');
		this._elSpanForLabelIconImg.classList.add('cb-lbl');
		this._elSpanForLabelOnly = document.createElement('span');
		this._elSpanForLabelOnly.classList.add('cb-lbl');
		this._elIcon = document.createElement('i');
		this._elIcon.classList.add('cb-icon');

		this._elContainer.classList.add(this.primaryCssClass);
		this._elButton.setAttribute('data-ch5-id', this.getCrId());
		this._elIcon.classList.add(this.primaryCssClass + '--icon');
		this._elSpanForLabelOnly.classList.add(this.primaryCssClass + '--label');
		// this._elSpanForLabelIconImg.classList.add(this.primaryCssClass + '--span');

		// The icon and label elements are not appended here since they might not always be displayed and the default
		// css ( like padding ... ) would be applied without having an actual icon or label
		// The elements are appended (if needed) in the updateInternalHtml method

		this._elContainer.appendChild(this._elButton);
		this.logger.stop();
	}

	public addContainerClass(input: string) {
		if (!this._elContainer.classList.contains(input)) {
			this._elContainer.classList.add(input);
		}
	}

	public removeContainerClass(input: string) {
		if (this._elContainer.classList.contains(input)) {
			this._elContainer.classList.remove(input);
		}
	}


	/**
	 * Clear the button content in order to avoid duplication of buttons
	 */
	protected clearComponentContent() {
		const containers = this.getElementsByTagName("div");
		Array.from(containers).forEach((container) => {
			container.remove();
		});
	}

	protected getTargetElementForCssClassesAndStyle(): HTMLElement {
		return this._elContainer;
	}

	// DO NOT Remove this method
	public getCssClassDisabled(): string {
		return this.primaryCssClass + '--disabled';
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
	private sendValueForRepeatDigitalWorking(value: boolean): void {
		this.info(`Ch5Button.sendValueForRepeatDigital(${value})`);
		if (!this._sigNameSendOnTouch && !this._sigNameSendOnClick) { return; }

		const touchSignal: Ch5Signal<object | boolean> | null = Ch5SignalFactory.getInstance()
			.getObjectAsBooleanSignal(this._sigNameSendOnTouch);

		const clickSignal: Ch5Signal<object | boolean> | null = Ch5SignalFactory.getInstance()
			.getObjectAsBooleanSignal(this._sigNameSendOnClick);

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

	private checkboxDisplay() {
		this.logger.start("checkboxDisplay");
		//if (this.isCheckboxVisible()) {
		let classForCheckboxRemove: string[] = [];
		let classForCheckboxAdd: string[] = [];
		const checkboxCssClass: string = this.primaryCssClass + "__checkbox";
		classForCheckboxRemove = [checkboxCssClass, checkboxCssClass + "--unchecked", checkboxCssClass + "--checked"];
		if (this._checkboxShow === true && this._selected === true) {
			classForCheckboxAdd = [checkboxCssClass, checkboxCssClass + "--checked"];
		} else if (this._checkboxShow === false) {
			// This case is addressed.
		} else if (this._checkboxShow === true) {
			classForCheckboxAdd = [checkboxCssClass, checkboxCssClass + "--unchecked"];
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

		this._elCheckboxIcon.classList.remove('cx-button-checkbox-pos-left');
		this._elCheckboxIcon.classList.remove('cx-button-checkbox-pos-right');
		if (this.checkboxShow === true) {
			this._elCheckboxIcon.classList.add('cx-button-checkbox-pos-' + this.checkboxPosition);
		}

		let hasCheckboxIcon = false;

		if (this.hasAttribute("checkboxShow") && this.toBoolean((this.hasAttribute('checkboxshow') && this.getAttribute('checkboxshow') !== "false")) === true) {
			hasCheckboxIcon = true;
		}
		this.logger.log("hasCheckboxIcon", hasCheckboxIcon);
		// TODO - remove twice usage after testing valign and halign
		if (this._elCheckboxIcon.parentNode) {
			this._elCheckboxIcon.remove();
		}

		if (hasCheckboxIcon) {
			if (this.checkboxPosition === 'right') {
				if (this._elCheckboxIcon.parentNode !== (this._elButton as Node)) {
					// if the icon element was not yet added to the button
					this._elButton.appendChild(this._elCheckboxIcon);
				} else {
					// if the icon element was already added and needs to be switched with the label element
					this._elButton.insertBefore(this._elSpanForLabelIconImg as Node, this._elCheckboxIcon as Node);
				}

			} else if (this.checkboxPosition === 'left') {
				if ((this._elSpanForLabelIconImg as any).isConnected === true) {
					this._elButton.insertBefore(this._elCheckboxIcon as Node, this._elSpanForLabelIconImg as Node);
				}
			}
		} else {
			if (this._elCheckboxIcon.parentNode) {
				this._elCheckboxIcon.remove();
			}
		}
		//}
		this.logger.stop();
	}

	//#endregion

	//#region 6. Button UI changes

	/**
	 * If type node is updated via html or js or signal, the change set attribue of type;
	 * if receivestate* is true, then even if type attribute chagnes, just use receivestate*
	 * if receivestate* is false, then
	 * if mode attribute is updated, always call this method, and update all attributes
	 */
	public setButtonDisplay(): void {
		if (this.DEBOUNCE_BUTTON_DISPLAY === 0) {
			this.setButtonDisplayDetails();
		} else if (this.isButtonInitiated === true) {
			this.setButtonDisplayDetails();
		} else {
			this.debounceSetButtonDisplay();
		}
	}

	protected encodeInnerHTMLForAttribute(innerHTML: string) {
		return innerHTML.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&apos;');
	}

	protected decodeInnerHTMLForAttribute(innerHTML: string) {
		return innerHTML.replace('&amp;', "&")
			.replace('&lt;', "<")
			.replace('&gt;', ">")
			.replace('&quot;', '/"')
			.replace("&apos;", "/'");
	}

	protected setButtonDisplayDetails(parentComponent: string = "ch5-button"): void {
		this.logger.start("setButtonDisplayDetails");
		this.DEBOUNCE_BUTTON_DISPLAY = 0;
		// Applicable on Mode change and Selected change
		// We need not worry about this. ch5-button-label is immediate child, and no change in attribute
		// affects the data from immediate child.

		const extendedProperties: ICh5ButtonExtendedProperties = {};

		// let isButtonModePressedAvailable: boolean = false;

		// Priority 1: ReceiveState Signals
		if (this.receiveStateType && this.receiveStateType !== '') {
			const receiveStateTypeResponseValue: TCh5ButtonType = this._ch5ButtonSignal.getVariable<TCh5ButtonType>("receiveStateType");
			if (!isNil(receiveStateTypeResponseValue) && Ch5ButtonBase.TYPES.indexOf(receiveStateTypeResponseValue) >= 0) {
				extendedProperties.type = receiveStateTypeResponseValue;
			} else {
				extendedProperties.type = Ch5ButtonBase.TYPES[0];
				this._ch5ButtonSignal.setVariable("receiveStateType", Ch5ButtonBase.TYPES[0]);
			}
		}

		if (this.receiveStateIconClass && this.receiveStateIconClass !== '') {
			extendedProperties.iconClass = this._ch5ButtonSignal.getVariable<string>("receiveStateIconClass");
		}

		if (this.receiveStateIconUrl && this.receiveStateIconUrl !== '') {
			extendedProperties.iconUrl = this._ch5ButtonSignal.getVariable<string>("receiveStateIconUrl");
		}

		if (this.receiveStateCustomClass && this.receiveStateCustomClass !== '') {
			extendedProperties.customClass = this._ch5ButtonSignal.getVariable<string>("receiveStateCustomClass");
		}

		if (this.receiveStateCustomStyle && this.receiveStateCustomStyle !== '') {
			extendedProperties.customStyle = this._ch5ButtonSignal.getVariable<string>("receiveStateCustomStyle");
		}

		if (this.isLabelSetUsingJavascript === true) {
			extendedProperties.labelHtml = this.labelSetByJavascriptValue;
		} else if (this.receiveStateScriptLabelHtml && this.receiveStateScriptLabelHtml !== '') {
			extendedProperties.labelHtml = this._ch5ButtonSignal.getVariable<string>("receiveStateScriptLabelHtml");
		} else if (this.receiveStateLabel && this.receiveStateLabel !== '') {
			extendedProperties.label = this._ch5ButtonSignal.getVariable<string>("receiveStateLabel");
		}

		// this.logger.log("extendedProperties Signals: ", extendedProperties);

		// TODO - update nodes cannot be on pressed becos it cannot take debounce

		// Priority 2: Button Mode State Attributes for Selected Mode
		const buttonModesArray = this.getElementsByTagName("ch5-button-mode");
		if (buttonModesArray && buttonModesArray.length > 0) {
			const selectedButtonMode = buttonModesArray[this.mode];
			if (selectedButtonMode) {
				const buttonModeStatesArray = selectedButtonMode.getElementsByTagName("ch5-button-mode-state");
				if (buttonModeStatesArray && buttonModeStatesArray.length > 0) {
					let selectedButtonModeState: any = null;
					if (this._pressable?._pressed === true) {
						selectedButtonModeState = Array.from(buttonModeStatesArray).find(buttonModeState => {
							return (buttonModeState.getAttribute("state") === "pressed");
						});
					} else if (this.selected === true) {
						selectedButtonModeState = Array.from(buttonModeStatesArray).find(buttonModeState => {
							return (buttonModeState.getAttribute("state") === "selected");
						});
					} else {
						selectedButtonModeState = Array.from(buttonModeStatesArray).find(buttonModeState => {
							return (buttonModeState.getAttribute("state") === "normal");
						});
					}

					if (selectedButtonModeState) {
						// if (this._buttonPressedInPressable === true) {
						// 	isButtonModePressedAvailable = true;
						// }

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

						if (isNil(extendedProperties.iconUrlFillType) && !isNil(selectedButtonModeState.getAttribute("iconurlfilltype"))) {
							extendedProperties.iconUrlFillType = selectedButtonModeState.getAttribute("iconurlfilltype") as TCh5ButtonIconUrlFillType | null;
						}

						const selectedButtonModeStateLabelButton = selectedButtonModeState.getElementsByTagName("ch5-button-label");
						if ((isNil(extendedProperties.labelHtml) && isNil(extendedProperties.label)) && selectedButtonModeStateLabelButton && selectedButtonModeStateLabelButton.length > 0 &&
							(selectedButtonModeStateLabelButton[0].children[0])) {
							extendedProperties.labelHtml = selectedButtonModeStateLabelButton[0].children[0].innerHTML as string;
						}
					}
					// this.logger.log("extendedProperties Mode States: ", JSON.parse(JSON.stringify(extendedProperties)));
				}

				// Priority 3: Button Mode Attributes for Selected Mode
				// if (this._buttonPressedInPressable === false) {
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

				if (isNil(extendedProperties.iconUrlFillType) && !isNil(selectedButtonMode.getAttribute("iconurlfilltype"))) {
					extendedProperties.iconUrlFillType = selectedButtonMode.getAttribute("iconurlfilltype") as TCh5ButtonIconUrlFillType | null;
				}

				const selectedButtonModeLabelButton = selectedButtonMode.getElementsByTagName("ch5-button-label");
				if ((isNil(extendedProperties.labelHtml) && isNil(extendedProperties.label) &&
					selectedButtonModeLabelButton && selectedButtonModeLabelButton.length > 0)) {
					const checkDirectSelectedButtonModeLabelButton = Array.prototype.slice.call(selectedButtonModeLabelButton).filter((x: { parentNode: { nodeName: { toString: () => string; }; }; }) => x.parentNode.nodeName.toString().toLowerCase() === "ch5-button-mode");
					if (checkDirectSelectedButtonModeLabelButton && checkDirectSelectedButtonModeLabelButton.length > 0 && !isNil(checkDirectSelectedButtonModeLabelButton[0].children[0])) {
						extendedProperties.labelHtml = checkDirectSelectedButtonModeLabelButton[0].children[0].innerHTML as string;
					}
				}

				// this.logger.log("extendedProperties Mode: ", JSON.parse(JSON.stringify(extendedProperties)));
				// }
			}
		}

		// Priority 4: Button Attributes
		// if (this._buttonPressedInPressable === false) {
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
		if (isNil(extendedProperties.iconUrlFillType) && !isNil(this.getAttribute("iconurlfilltype"))) {
			extendedProperties.iconUrlFillType = this.getAttribute("iconurlfilltype") as TCh5ButtonIconUrlFillType | null;
		}
		if (isNil(extendedProperties.labelHtml) && isNil(extendedProperties.label)) {
			const templateData = this.getElementsByTagName(parentComponent + "-label");
			if (templateData && templateData.length > 0) {
				const checkDirectSelectedButtonModeLabelButton = Array.prototype.slice.call(templateData).filter((x: { parentNode: { nodeName: { toString: () => string; }; }; }) => x.parentNode.nodeName.toString().toLowerCase() === parentComponent);
				if (checkDirectSelectedButtonModeLabelButton && checkDirectSelectedButtonModeLabelButton.length > 0 && !isNil(checkDirectSelectedButtonModeLabelButton[0].children[0])) {
					if (checkDirectSelectedButtonModeLabelButton && checkDirectSelectedButtonModeLabelButton.length > 0 && checkDirectSelectedButtonModeLabelButton[0].children) {
						extendedProperties.labelHtml = checkDirectSelectedButtonModeLabelButton[0].children[0].innerHTML as string;
					} else if (!isNil(this.getAttribute("label"))) {
						extendedProperties.label = this.getAttribute("label") as string
					}
				}
			} else if (!isNil(this.getAttribute("label"))) {
				extendedProperties.label = this.getAttribute("label") as string
			}
		}
		// this.logger.log("extendedProperties Button: ", JSON.parse(JSON.stringify(extendedProperties)));
		// }

		if (isNil(extendedProperties.labelHtml) && isNil(extendedProperties.label)) {
			extendedProperties.labelHtml = "";
		}

		this.updatePropertiesObject(extendedProperties);
		// if (this._buttonPressedInPressable === false) {
		// 	this.updatePropertiesObject(extendedProperties);
		// } else {
		// 	if (isButtonModePressedAvailable === true) {
		// 		this.updatePropertiesObject(extendedProperties);
		// 	}
		// }

		// this.logger.log("extendedProperties Final: ", JSON.parse(JSON.stringify(extendedProperties)));

		// update templateContent attributes to increment join numbers and prefix contract name
		Ch5AugmentVarSignalsNames.differentiateTmplElemsAttrs(this, this.getAttribute("contractname") || '',
			parseInt(this.getAttribute("booleanjoinoffset") || '0', 10) || 0,
			parseInt(this.getAttribute("numericJoinOffset") || '0', 10) || 0,
			parseInt(this.getAttribute("stringJoinOffset") || '0', 10) || 0);

		this.logger.stop();
	}

	private updatePropertiesObject(updatedNodes: ICh5ButtonExtendedProperties): void {
		this.logger.start("updatePropertiesObject");

		// Updating necessary UI
		const updateUIMethods: any = {
			updateCssClasses: false,
			updateIconDisplay: false,
			updateInternalHtml: false,
			checkboxDisplay: false,
			updateForChangeInCustomCssClass: false,
			updateForChangeInStyleCss: false,
		}

		// type
		if (!isNil(updatedNodes.type)) {
			if (Ch5ButtonBase.TYPES.indexOf(updatedNodes.type) === -1) {
				updatedNodes.type = Ch5ButtonBase.TYPES[0];
			}
		} else {
			updatedNodes.type = Ch5ButtonBase.TYPES[0];
		}
		this._type = updatedNodes.type as TCh5ButtonType;
		if (this.previousExtendedProperties.type !== this.type) {
			updateUIMethods.updateCssClasses = true;
		}

		// iconUrl, iconClass
		this._previousIconUrl = this._iconUrl;
		this._previousIconClass = this._iconClass;
		if (isNil(updatedNodes.iconUrl)) {
			updatedNodes.iconUrl = "";
		}
		this._iconUrl = updatedNodes.iconUrl;

		if (isNil(updatedNodes.iconClass)) {
			updatedNodes.iconClass = "";
		}
		this._iconClass = updatedNodes.iconClass;

		if (this._previousSgIconNumeric !== this.sgIconNumeric) {
			updateUIMethods.updateIconDisplay = true;
			updateUIMethods.updateInternalHtml = true;
		} else if (this._previousSgIconString !== this.sgIconString) {
			updateUIMethods.updateIconDisplay = true;
			updateUIMethods.updateInternalHtml = true;
		} else if (this.previousExtendedProperties.iconUrl !== this.iconUrl) {
			updateUIMethods.updateIconDisplay = true;
			updateUIMethods.updateInternalHtml = true; // Applicable when iconUrl changes and iconclass and url combines
		} else if (this.previousExtendedProperties.iconClass !== this.iconClass) {
			updateUIMethods.updateIconDisplay = true;
			updateUIMethods.updateInternalHtml = true; // Applicable when iconUrl changes and iconclass and url combines
		}

		// iconPosition
		if (isNil(updatedNodes.iconPosition)) {
			updatedNodes.iconPosition = Ch5ButtonBase.ICON_POSITIONS[0];
		}
		this._iconPosition = updatedNodes.iconPosition;
		if (this.previousExtendedProperties.iconPosition !== this.iconPosition) {
			updateUIMethods.updateCssClasses = true;
			updateUIMethods.updateInternalHtml = true;
		}

		// checkboxPosition
		if (isNil(updatedNodes.checkboxPosition)) {
			updatedNodes.checkboxPosition = Ch5ButtonBase.CHECKBOX_POSITIONS[0];
		}
		this._checkboxPosition = updatedNodes.checkboxPosition;
		if (this.previousExtendedProperties.checkboxPosition !== this.checkboxPosition) {
			updateUIMethods.checkboxDisplay = true;
		}

		// customClass
		if (isNil(updatedNodes.customClass)) {
			updatedNodes.customClass = "";
		}
		this._customClass = updatedNodes.customClass;
		if (this.previousExtendedProperties.customClass !== this.customClass) {
			updateUIMethods.updateForChangeInCustomCssClass = true;
		}

		// customStyle
		if (isNil(updatedNodes.customStyle)) {
			updatedNodes.customStyle = "";
		}
		this._customStyle = updatedNodes.customStyle;
		if (this.previousExtendedProperties.customStyle !== this.customStyle) {
			// isNil is accounted for first time change to style css
			updateUIMethods.updateForChangeInStyleCss = true;
		}

		// hAlignLabel
		if (!isNil(updatedNodes.hAlignLabel)) {
			if (Ch5ButtonBase.HORIZONTAL_LABEL_ALIGNMENTS.indexOf(updatedNodes.hAlignLabel) === -1) {
				updatedNodes.hAlignLabel = Ch5ButtonBase.HORIZONTAL_LABEL_ALIGNMENTS[0];
			}
		} else {
			updatedNodes.hAlignLabel = Ch5ButtonBase.HORIZONTAL_LABEL_ALIGNMENTS[0];
		}
		this._hAlignLabel = updatedNodes.hAlignLabel;
		if (this.previousExtendedProperties.hAlignLabel !== this.hAlignLabel) {
			updateUIMethods.updateCssClasses = true;
		}

		// vAlignLabel
		if (!isNil(updatedNodes.vAlignLabel)) {
			if (Ch5ButtonBase.VERTICAL_LABEL_ALIGNMENTS.indexOf(updatedNodes.vAlignLabel) === -1) {
				updatedNodes.vAlignLabel = Ch5ButtonBase.VERTICAL_LABEL_ALIGNMENTS[0];
			}
		} else {
			updatedNodes.vAlignLabel = Ch5ButtonBase.VERTICAL_LABEL_ALIGNMENTS[0];
		}
		this._vAlignLabel = updatedNodes.vAlignLabel;
		if (this.previousExtendedProperties.vAlignLabel !== this.vAlignLabel) {
			updateUIMethods.updateCssClasses = true;
		}

		// iconUrlFillType
		if (!isNil(updatedNodes.iconUrlFillType)) {
			if (Ch5ButtonBase.ICON_URL_FILL_TYPE.indexOf(updatedNodes.iconUrlFillType) === -1) {
				updatedNodes.iconUrlFillType = null;
			}
		} else {
			updatedNodes.iconUrlFillType = null;
		}
		this._iconUrlFillType = updatedNodes.iconUrlFillType;
		if (this.previousExtendedProperties.iconUrlFillType !== this.iconUrlFillType) {
			updateUIMethods.updateCssClasses = true;
		}

		// label
		if (!isNil(updatedNodes.labelHtml)) {
			this._label = updatedNodes.labelHtml;
			updatedNodes.label = updatedNodes.labelHtml;
			this._elSpanForLabelOnly.innerHTML = this._label;
		} else if (!isNil(updatedNodes.label)) {
			this._label = updatedNodes.label;
			updatedNodes.labelHtml = updatedNodes.label;
			this._elSpanForLabelOnly.textContent = this._label;
		}
		if (!(this.previousExtendedProperties.labelHtml === this.label || this.previousExtendedProperties.label === this.label)) {
			updateUIMethods.updateInternalHtml = true;
		}

		// this.logger.log("updateUIMethods", (updateUIMethods));

		// Methods to be invoked
		if (updateUIMethods.updateCssClasses === true) {
			this.updateCssClasses();
		}
		if (updateUIMethods.updateIconDisplay === true) {
			this.updateIconDisplay();
		}
		if (updateUIMethods.updateForChangeInCustomCssClass === true) {
			this.updateForChangeInCustomCssClass();
		}
		if (updateUIMethods.updateForChangeInStyleCss === true) {
			this.updateForChangeInStyleCss();
		}
		if (updateUIMethods.checkboxDisplay === true) {
			this.checkboxDisplay();
		}
		if (updateUIMethods.updateInternalHtml === true) {
			this.updateInternalHtml();
		}

		this.previousExtendedProperties = updatedNodes;

		this.logger.stop();
	}

	private receiveSignalAsString(thisButton: Ch5ButtonBase, attributeName: string, attributeValue: string) {
		this.logger.log('set ' + attributeName + '("' + attributeValue + '")');
		const attributeNameLowerCase: string = attributeName.toLowerCase();
		if (!thisButton.hasAttribute(attributeNameLowerCase) || thisButton.getAttribute(attributeNameLowerCase) !== attributeValue) {
			thisButton.setAttribute(attributeNameLowerCase, attributeValue);
		}
		const signalResponse = thisButton._ch5ButtonSignal.setSignal(attributeName, attributeValue);
		if (!isNil(signalResponse)) {
			thisButton._ch5ButtonSignal.getSignal(attributeName).signalState = signalResponse.subscribe((newValue: string) => {
				thisButton._ch5ButtonSignal.getSignal(attributeName).currentValue = newValue;
				thisButton._ch5ButtonSignal.setVariable(attributeName, newValue);
				thisButton.setButtonDisplay();
			});
		}
	}

	private isCheckboxVisible() {
		if (this.hasAttribute("checkboxShow") && this.toBoolean((this.hasAttribute('checkboxshow') && this.getAttribute('checkboxshow') !== "false")) === true) {
			// if ((!isNil(this._checkboxShow) && this._checkboxShow === true)) {
			return true;
		}
		return false;
	}
	/**
	 * Reorders ( if needed ) the position of the label and the icon inside the button
	 */
	protected updateInternalHtml(): void {
		this.logger.start("updateInternalHtml()");

		if (!(typeof this._elButton.insertBefore === "undefined"
			|| typeof this._elIcon.classList === "undefined")) {

			Ch5ButtonBase.ICON_POSITIONS.forEach((iconPositionObj) => {
				if (this.iconPosition === iconPositionObj) {
					this._elContainer.classList.add(`${this.primaryCssClass}--iconposition-${iconPositionObj}`);
					this._elIcon.classList.add(`cx-button-icon-pos-${iconPositionObj}`);
				} else {
					this._elContainer.classList.remove(`${this.primaryCssClass}--iconposition-${iconPositionObj}`);
					this._elIcon.classList.remove(`cx-button-icon-pos-${iconPositionObj}`);
				}
			});

			// // Handle vertical button with iconPosition top or bottom
			// if (['top', 'bottom'].indexOf(this.iconPosition) >= 0 && this.orientation === Ch5ButtonBase.ORIENTATIONS[1]) {
			// 	this._elButton.classList.add(`${this.primaryCssClass}--vertical--icon-${this.iconPosition}`);
			// }

			let hasIcon = false;
			let hasLabel = false;
			let hasImage = false;
			let hasSgNumeric = false;
			let hasSgString = false;
			let hasAriaLabel = false;
			let hasCheckbox = false;

			if ((!isNil(this.iconClass) && this.iconClass !== "") || (this.receiveStateIconClass && this.receiveStateIconClass !== '')) {
				hasIcon = true;
			}

			if ((!isNil(this.iconUrl) && this.iconUrl !== "") || (this.receiveStateIconUrl && this.receiveStateIconUrl !== '')) {
				hasImage = true;
			}

			if ((!isNil(this.sgIconNumeric) && this.sgIconNumeric !== -1) || (this.receiveStateSGIconNumeric && this.receiveStateSGIconNumeric !== '')) {
				hasSgNumeric = true;
			}

			if ((!isNil(this.sgIconString) && this.sgIconString !== '') || (this.receiveStateSGIconString && this.receiveStateSGIconString !== '')) {
				hasSgString = true;
			}
			hasCheckbox = this.isCheckboxVisible();

			// TODO - check the below for empty<template> tag
			if ((!isNil(this.label) && this.label !== "") || (this.receiveStateLabel && this.receiveStateLabel !== '') || (this.receiveStateScriptLabelHtml && this.receiveStateScriptLabelHtml !== '')) {
				hasLabel = true;
			}
			if (this.hasAttribute('aria-label') && '' !== this.getAttribute('aria-label')) {
				hasAriaLabel = true;
			}

			this.logger.log("hasIcon", hasIcon);
			this.logger.log("hasLabel", hasLabel);
			this.logger.log("hasImage", hasImage);
			this.logger.log("hasAriaLabel", hasAriaLabel);
			this.logger.log("hasCheckbox", hasCheckbox);

			if (!hasLabel && hasAriaLabel && hasImage) {
				const ariaLabel = this.getAttribute('aria-label');
				if (ariaLabel) {
					this._elIcon.setAttribute('alt', ariaLabel);
				}
			}

			if (hasSgString) {
				this._elIcon.classList.remove(this.primaryCssClass + '--icon');
				Array.from(Ch5ButtonBase.ICON_URL_FILL_TYPE).forEach((cls) => {
					this._elSpanForLabelIconImg.classList.remove(this.primaryCssClass + '--icon-url-fill-type-' + cls);
				});
				if (this.iconUrlFillType !== null) {
					this._elSpanForLabelIconImg.classList.add(this.primaryCssClass + `--icon-url-fill-type-${this.iconUrlFillType}`);
				}
				this._elIcon.classList.add(this.primaryCssClass + '--img');

			} else if (hasSgNumeric) {
				this._elIcon.classList.remove(this.primaryCssClass + '--icon');
				Array.from(Ch5ButtonBase.ICON_URL_FILL_TYPE).forEach((cls) => {
					this._elSpanForLabelIconImg.classList.remove(this.primaryCssClass + '--icon-url-fill-type-' + cls);
				});
				if (this.iconUrlFillType !== null) {
					this._elSpanForLabelIconImg.classList.add(this.primaryCssClass + `--icon-url-fill-type-${this.iconUrlFillType}`);
				}
				this._elIcon.classList.add(this.primaryCssClass + '--img');

			} else if (hasImage && this.iconUrl === this._ch5ButtonSignal.getSignal('receiveStateIconUrl')?.currentValue) {
				this._elIcon.style.backgroundImage = `url(${this.iconUrl})`;
				this._elIcon.classList.remove(this.primaryCssClass + '--icon');
				Array.from(Ch5ButtonBase.ICON_URL_FILL_TYPE).forEach((cls) => {
					if (hasCheckbox === true) {
						this._elSpanForLabelIconImg.classList.remove(this.primaryCssClass + '--icon-url-fill-type-' + cls);
					} else {
						this._elButton.classList.remove(this.primaryCssClass + '--icon-url-fill-type-' + cls);
					}
				});
				this._elIcon.classList.add(this.primaryCssClass + '--img');
				if (this.iconUrlFillType !== null) {
					if (hasCheckbox === true) {
						this._elSpanForLabelIconImg.classList.add(this.primaryCssClass + `--icon-url-fill-type-${this.iconUrlFillType}`);
					} else {
						this._elButton.classList.add(this.primaryCssClass + `--icon-url-fill-type-${this.iconUrlFillType}`);
					}
				}
			} else if (hasIcon && this.iconClass === this._ch5ButtonSignal.getSignal('receiveStateiconClass')?.currentValue) {
				this._elIcon.classList.remove(this.primaryCssClass + '--img');
				Array.from(Ch5ButtonBase.ICON_URL_FILL_TYPE).forEach((cls) => {
					if (hasCheckbox === true) {
						this._elSpanForLabelIconImg.classList.remove(this.primaryCssClass + '--icon-url-fill-type-' + cls);
					} else {
						this._elButton.classList.remove(this.primaryCssClass + '--icon-url-fill-type-' + cls);
					}
				});
				this._elIcon.classList.add(this.primaryCssClass + '--icon');
			} else if (hasImage) {
				this._elIcon.style.backgroundImage = `url(${this.iconUrl})`;
				this._elIcon.classList.remove(this.primaryCssClass + '--icon');
				Array.from(Ch5ButtonBase.ICON_URL_FILL_TYPE).forEach((cls) => {
					if (hasCheckbox === true) {
						this._elSpanForLabelIconImg.classList.remove(this.primaryCssClass + '--icon-url-fill-type-' + cls);
					} else {
						this._elButton.classList.remove(this.primaryCssClass + '--icon-url-fill-type-' + cls);
					}
				});
				this._elIcon.classList.add(this.primaryCssClass + '--img');
				if (this.iconUrlFillType !== null) {
					if (hasCheckbox === true) {
						this._elSpanForLabelIconImg.classList.add(this.primaryCssClass + `--icon-url-fill-type-${this.iconUrlFillType}`);
					} else {
						this._elButton.classList.add(this.primaryCssClass + `--icon-url-fill-type-${this.iconUrlFillType}`);
					}
				}
			} else if (hasIcon) {
				this._elIcon.classList.remove(this.primaryCssClass + '--img');
				Array.from(Ch5ButtonBase.ICON_URL_FILL_TYPE).forEach((cls) => {
					if (hasCheckbox === true) {
						this._elSpanForLabelIconImg.classList.remove(this.primaryCssClass + '--icon-url-fill-type-' + cls);
					} else {
						this._elButton.classList.remove(this.primaryCssClass + '--icon-url-fill-type-' + cls);
					}
				});
				this._elIcon.classList.add(this.primaryCssClass + '--icon');
			}

			if (hasCheckbox === true) {
				this._elButton.appendChild(this._elSpanForLabelIconImg);
				this._elSpanForLabelIconImg.appendChild(this._elSpanForLabelOnly);
				this._elButton.classList.remove(this.primaryCssClass + '--span');
				this._elSpanForLabelIconImg.classList.add(this.primaryCssClass + '--span');
				this.updateCssClasses();
			} else {
				this._elButton.innerHTML = '';
				this._elButton.appendChild(this._elSpanForLabelOnly);
				this._elSpanForLabelIconImg?.classList.remove(this.primaryCssClass + '--span');
				this._elButton.classList.add(this.primaryCssClass + '--span');
				this.updateCssClasses();
			}
			if (hasLabel && (hasIcon || hasImage || hasSgNumeric || hasSgString)) {
				this.logger.log("Has Label and Icon");
				if ((this._elSpanForLabelOnly as any).isConnected === false) {
					if (hasCheckbox === true) {
						this._elSpanForLabelIconImg.appendChild(this._elSpanForLabelOnly);
					} else {
						this._elButton.appendChild(this._elSpanForLabelOnly);
					}
				} else if (this._elIcon.parentNode !== (this._elSpanForLabelOnly as Node)) {
					if (hasCheckbox === true) {
						this._elSpanForLabelIconImg.appendChild(this._elSpanForLabelOnly);
					} else {
						this._elButton.appendChild(this._elSpanForLabelOnly);
					}
				}

				if (['last', 'bottom'].indexOf(this.iconPosition) >= 0) {
					if (this._elIcon.parentNode !== (this._elButton as Node)) {
						// if the icon element was not yet added to the button
						if (hasCheckbox === true) {
							this._elSpanForLabelIconImg.appendChild(this._elIcon);
						} else {
							this._elButton.appendChild(this._elIcon);
						}
					} else {
						// if the icon element was already added and needs to be switched with the label element
						if (hasCheckbox === true) {
							this._elSpanForLabelIconImg.insertBefore(this._elSpanForLabelOnly as Node, this._elIcon as Node);
						} else {
							this._elButton.insertBefore(this._elSpanForLabelOnly as Node, this._elIcon as Node);
						}
					}
				} else if (['first', 'top'].indexOf(this.iconPosition) >= 0) {
					this.logger.log('insert icon before label');
					if ((this._elSpanForLabelOnly as any).isConnected === true) {
						if (hasCheckbox === true) {
							this._elSpanForLabelIconImg.insertBefore(this._elIcon as Node, this._elSpanForLabelOnly as Node);
						} else {
							this._elButton.insertBefore(this._elIcon as Node, this._elSpanForLabelOnly as Node);
						}
					}
				}
			} else if (hasLabel && !(hasIcon || hasImage || hasSgNumeric || hasSgString)) {
				this.logger.log("Has Label Only");
				if (this._elIcon.parentNode) {
					this._elIcon.remove();
				}
			} else if (!hasLabel && (hasIcon || hasImage || hasSgNumeric || hasSgString)) {
				this.logger.log("Has Icon Only");
				if (hasCheckbox === true) {
					this._elSpanForLabelIconImg.appendChild(this._elIcon);
					if (this._elSpanForLabelOnly.parentNode) {
						this._elSpanForLabelOnly.remove();
					}
				} else {
					this._elButton.appendChild(this._elIcon);
					if (this._elSpanForLabelOnly.parentNode) {
						this._elSpanForLabelOnly.remove();
					}
				}
			} else { // if no icon and no label
				this.logger.log("No Label and No Icon");
				if (this._elIcon.parentNode) {
					this._elIcon.remove();
				}
				if (this._elSpanForLabelOnly.parentNode) {
					this._elSpanForLabelOnly.remove();
				}
			}

		}

		this.checkboxDisplay(); // TODO - cehck if this can be removed - issue comes when values change for halign and valign
		this.logger.stop();
	}

	protected updateCssClasses(): void {
		this.logger.start('updateCssClasses()');
		// apply css classes for attrs inherited from common (e.g. customClass, customStyle )
		super.updateCssClasses();

		const setOfCssClassesToBeApplied = new Set<string>();

		// primary
		setOfCssClassesToBeApplied.add(this.primaryCssClass);

		// shape
		setOfCssClassesToBeApplied.add(this.primaryCssClass + '--' + this.shape);

		// backgroundImageFillType
		setOfCssClassesToBeApplied.add(this.primaryCssClass + '--background-image-fill-type-' + this.backgroundImageFillType);

		// type
		if (this.isButtonInitiated === true) {
			setOfCssClassesToBeApplied.add(this.primaryCssClass + '--' + this.type);
		}

		// size
		setOfCssClassesToBeApplied.add(this.primaryCssClass + '--size-' + this.size);
		if (!_.isNil(this.stretch)) {
			// stretch overrides size
			setOfCssClassesToBeApplied.add(this.primaryCssClass + '--stretch-' + this.stretch);
		}

		// orientation
		setOfCssClassesToBeApplied.add(this.primaryCssClass + '--' + this.orientation);

		const targetEl: HTMLElement = this.getTargetElementForCssClassesAndStyle();
		if (typeof targetEl.classList !== 'undefined') {
			this._listOfAllPossibleComponentCssClasses.forEach((cssClass: string) => {
				if (setOfCssClassesToBeApplied.has(cssClass)) {
					targetEl.classList.add(cssClass);
				} else {
					targetEl.classList.remove(cssClass);
				}
			});
			const selectedCssClass = this.primaryCssClass + this.selectedCssClassPostfix;
			if (this._selected) {
				targetEl.classList.add(selectedCssClass);
				if (this.buttonListContract?.parentComponent === "ch5-tab-button" || this.buttonListContract?.parentComponent === "ch5-button-list") {
					targetEl.classList.add(this.buttonListContract?.parentComponent + this.selectedCssClassPostfix);
				}
			} else {
				targetEl.classList.remove(selectedCssClass);
				if (this.buttonListContract?.parentComponent === "ch5-tab-button" || this.buttonListContract?.parentComponent === "ch5-button-list") {
					targetEl.classList.remove(this.buttonListContract?.parentComponent + this.selectedCssClassPostfix);
				}
			}
		}

		this.verticalOrientationHandler();

		const setOfCssClassesToBeAppliedForLabelAlignment = new Set<string>();

		// horizontal align
		setOfCssClassesToBeAppliedForLabelAlignment.add(this.primaryCssClass + '--horizontal-' + this.hAlignLabel);

		// vertical align
		setOfCssClassesToBeAppliedForLabelAlignment.add(this.primaryCssClass + '--vertical-' + this.vAlignLabel);

		// iconUrlFillType
		if (this.iconUrlFillType !== null) {
			setOfCssClassesToBeAppliedForLabelAlignment.add(this.primaryCssClass + `--icon-url-fill-type-${this.iconUrlFillType}`);
		}
		const arrayListTwo: string[] = [];

		if (this.hasAttribute("checkboxShow") && this.toBoolean((this.hasAttribute('checkboxshow') && this.getAttribute('checkboxshow') !== "false")) === true) {
			for (let i = 0; i < this._listOfAllPossibleComponentCssClasses.length; i++) {
				if (setOfCssClassesToBeAppliedForLabelAlignment.has(this._listOfAllPossibleComponentCssClasses[i])) {
					arrayListTwo.push(this._listOfAllPossibleComponentCssClasses[i]);
				}
			}
			this._elSpanForLabelIconImg.className = this.primaryCssClass + '--span' + ' ' + arrayListTwo.join(' ');
		} else {
			for (let i = 0; i < this._listOfAllPossibleComponentCssClasses.length; i++) {
				if (setOfCssClassesToBeAppliedForLabelAlignment.has(this._listOfAllPossibleComponentCssClasses[i])) {
					arrayListTwo.push(this._listOfAllPossibleComponentCssClasses[i]);
				}
			}
			this._elButton.className = this.BUTTON_PRIMARY_CLASS + ' ' + this.primaryCssClass + '--span' + ' ' + arrayListTwo.join(' ');//.add(this._listOfAllPossibleComponentCssClasses[i]);
		}
		this.logger.stop();
	}

	protected updateCssClassesForCustomState(): void {
		const targetEl: HTMLElement = this.getTargetElementForCssClassesAndStyle();
		if (typeof targetEl.classList === 'undefined') {
			return;
		}
		const customStateCssClass = this.customClassState;
		if (this._customClassState) {
			targetEl.classList.add(customStateCssClass);
		}
	}

	private setSelectionMethods() {
		this.setButtonDisplay();
		this.checkboxDisplay();
		this.updateCssClasses();
	}

	//#endregion

}