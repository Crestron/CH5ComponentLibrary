// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5CommonInput } from "../ch5-common-input";
import { Ch5Signal, Ch5SignalFactory } from "../ch5-core";
import { target, Options, create, API } from "nouislider";

import { Ch5Pressable } from "../ch5-common/ch5-pressable";
import HtmlCallback from "../ch5-common/utils/html-callback";
import isNil from "lodash/isNil";
import { Ch5RoleAttributeMapping } from "../utility-models";
import { ICh5SliderAttributes, TCh5SliderShape, TCh5SliderOrientation, TCh5SliderSize, TCh5SliderStretch, TCh5SliderDirection, TCh5SliderTooltipType, TCh5SliderTooltipDisplay, TCh5SliderHandle } from "./interfaces";
import _ from "lodash";
import { Ch5SignalElementAttributeRegistryEntries } from '../ch5-common/ch5-signal-attribute-registry';

export interface IRcbSignal {
	rcb: {
		time: number,
		value: number,
		startt?: number,
		startv?: number
	}
}

export interface IRcbUpdateValue {
	oldValue?: number;
	newValue: number;
}

export class Ch5Slider extends Ch5CommonInput implements ICh5SliderAttributes {

	public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
		...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
		receivestatevalue: { direction: "state", numericJoin: 1, contractName: true },
		receivestatevaluehigh: { direction: "state", numericJoin: 1, contractName: true },

		sendeventonchange: { direction: "event", booleanJoin: 1, contractName: true },
		sendeventonchangehigh: { direction: "event", booleanJoin: 1, contractName: true }
	};

	//#region "Variables"

	public static readonly MIN_VALUE: number = 0;
	public static readonly MAX_VALUE: number = 65535;
	public static readonly DEFAULT_STEP: number = 1;

	/**
	 * The first value is considered the default one
	 */
	public static readonly SHAPES: TCh5SliderShape[] = ['rounded-rectangle', 'rectangle', 'circle', 'oval'];

	/**
	 * The first value is considered the default one
	 */
	public static readonly ORIENTATIONS: TCh5SliderOrientation[] = ['horizontal', 'vertical'];

	/**
	 * The first value is considered the default one
	 */
	public static readonly SIZES: TCh5SliderSize[] = ['regular', 'x-small', 'small', 'large', 'x-large'];

	/**
	 * The first value is considered the default one
	 */
	public static readonly STRETCHES: TCh5SliderStretch[] = ['both', 'width', 'height'];

	/**
	 * The first value is considered the default one
	 */
	public static readonly DIRECTION: TCh5SliderDirection[] = ['ltr', 'rtl'];

	/**
	 * The first value is considered the default one
	 */
	public static readonly TOOLTIPS: TCh5SliderTooltipType[] = ['off', 'on', 'auto'];

	public static readonly TDISPLAY: TCh5SliderTooltipDisplay[] = ['%', 'value'];

	public static readonly COMPONENT_DATA: any = {
		SHAPES: {
			default: Ch5Slider.SHAPES[0],
			values: Ch5Slider.SHAPES,
			key: 'shape',
			classListPrefix: 'ch5-slider--shape--'
		},
		ORIENTATIONS: {
			default: Ch5Slider.ORIENTATIONS[0],
			values: Ch5Slider.ORIENTATIONS,
			key: 'orientation',
			classListPrefix: 'ch5-slider--orientation'
		},
		SIZES: {
			default: Ch5Slider.SIZES[0],
			values: Ch5Slider.SIZES,
			key: 'size',
			classListPrefix: 'ch5-slider--size'
		},
		HANDLE_SIZE: {
			default: Ch5Slider.SIZES[0],
			values: Ch5Slider.SIZES,
			key: 'handle_size',
			classListPrefix: 'ch5-slider--handle-size--'
		},
		STRETCH: {
			default: Ch5Slider.STRETCHES[0],
			values: Ch5Slider.STRETCHES,
			key: 'stretch',
			classListPrefix: 'ch5-slider--stretch'
		},
		DIRECTION: {
			default: Ch5Slider.DIRECTION[0],
			values: Ch5Slider.DIRECTION,
			key: 'direction',
			classListPrefix: 'ch5-slider--direction'
		},
		TOOLTIPS: {
			default: Ch5Slider.TOOLTIPS[0],
			values: Ch5Slider.TOOLTIPS,
			key: 'tooltip',
			classListPrefix: 'ch5-slider--tooltip'
		},
		TDISPLAY: {
			default: Ch5Slider.TDISPLAY[0],
			values: Ch5Slider.TDISPLAY,
			key: 'tdisplay',
			classListPrefix: 'ch5-slider--'
		},
	};

	public static readonly OFFSET_THRESHOLD: number = 30;

	/**
	 * Component internal HTML elements
	 */
	private _elSlider: HTMLElement = {} as HTMLElement;
	private _tgtEls: NodeListOf<HTMLElement>[] = [];
	private _tooltip: NodeListOf<HTMLElement> = {} as NodeListOf<HTMLElement>;

	/**
	 * CSS classes
	 */
	public primaryCssClass = 'ch5-slider';
	public cssClassPrefix = 'ch5-slider';

	/**
	 * Reflects render state
	 * Used to avoid calling _render() multiple times in setter methods
	 */
	private _wasRendered: boolean = false;

	/**
	 * COMPONENT ATTRIBUTES
	 *
	 * - handleShape
	 * - value
	 * - valueHigh
	 * - max
	 * - min
	 * - orientation
	 * - size
	 * - handleSize
	 * - step
	 * - stretch
	 * - ticks
	 * - showTickValues
	 * - toolTipShowType
	 * - toolTipDisplayType
	 * - signalValueSyncTimeout
	 * - feedbackMode
	 * - tapSettable
	 * - noHandle
	 */

	/**
	 * Default: rounded-rectangle. Valid Values: rectangle, circle, oval, rounded-rectangle. Defines the handle shape.
	 *
	 * @type {TCh5SliderShape}
	 * @private
	 */
	private _handleShape: TCh5SliderShape = 'rounded-rectangle';

	/**
	 * Initial values of single value or lower value if range=true
	 *
	 * @private
	 * @type {number}
	 */
	protected _value: number = Ch5Slider.MIN_VALUE;

	/**
	 * Initial values of single value or lower value if range=true
	 *
	 * @private
	 * @type {boolean}
	 */
	private _range: boolean = false;

	/**
	 * Higher value only applicable if range=true
	 *
	 * @private
	 * @type {number}
	 */
	private _valueHigh: number = Ch5Slider.MAX_VALUE;

	/**
	 * Maximum value.
	 *
	 * @private
	 * @type {number}
	 */
	private _max: number = Ch5Slider.MAX_VALUE;

	/**
	 * Minimum value.
	 *
	 * @private
	 * @type {number}
	 */
	private _min: number = Ch5Slider.MIN_VALUE;

	/**
	 * Default horizontal. Valid values: horizontal, vertical
	 *
	 * @private
	 * @type {TCh5SliderOrientation}
	 */
	private _orientation: TCh5SliderOrientation = 'horizontal';

	/**
	 * Size of the slider
	 * Default regular. Valid values: x-small, small, regular, large, x-large
	 */
	private _size: TCh5SliderSize = 'regular';

	/**
	 * Size of the handle
	 * Default regular. Valid values: x-small, small, regular, large, x-large
	 */
	private _handleSize: TCh5SliderSize = 'regular';

	/**
	 * Default 100. Maximum 100.
	 * Defines the number of steps values in the slider. If you want quarters 0, 25, 50, 75, 100 then 5 is the numbers of steps.
	 *
	 * @private
	 * @type {number}
	 */
	private _step: number = Ch5Slider.DEFAULT_STEP;

	/**
	 * Default both.
	 * Valid Values: width, height, both When stretch property is set, the slider inherits the width or/and height of the container.
	 * @private
	 * @type {TCh5SliderStretch}
	 */
	private _stretch: TCh5SliderStretch | null = null;

	/**
	 * Defines the ticks on the slider.
	 * It will be an advanced tick scales: non-linear or logarithmic.
	 * You can create sliders with ever-increasing increments by specifying the value for the slider at certain intervals.
	 *  - The first value define the % position along the length of the slider scale to place a tick mark.
	 *  - The second value will be the label value to place next to the tick at that position.
	 * An example would be ticks='{"0":"-60", "25":"-40", "50":"-20", "75":"-10", "100": "0" }'
	 *
	 * @private
	 * @type {string}
	 */
	private _ticks: string = '';

	/**
	 * Default false.
	 * Option to display value labels next to tick marks at each tick increment.
	 * @private
	 * @type {boolean}
	 */
	private _showTickValues: boolean = false;

	/**
	 * Default "off".  Option to display a tooltip above (horizontal), right(vertical) of the handle.  Valid values are 
	 * "off" not displayed
	 * "on" always displayed
	 * "auto" displayed while user interact with the slider
	 *
	 * @private
	 * @type {TCh5SliderTooltipType}
	 */
	private _toolTipShowType: TCh5SliderTooltipType = "off"

	/**
	 * Default: percent.  Option of what is displayed in the tooltip.  Valid values are:
	 * "%" - displayed as percent.  Math.round((100*(v-min))/(max - min))
	 * "value" - actual value provided
	 *
	 * @private
	 * @type {TCh5SliderTooltipDisplay}
	 */
	private _toolTipDisplayType: TCh5SliderTooltipDisplay = "%";

	/**
	 * Default: false. If true Mmake the closest handle when the slider gets tapped.
	 */
	private _tapSettable: boolean = false;

	/**
	 * slider direction
	 */
	private _direction: TCh5SliderDirection = Ch5Slider.DIRECTION[0];

	/**
	 * COMPONENT SEND SIGNALS
	 *
	 * - sendEventOnChange
	 * - sendEventOnChangeHigh
	 */

	/**
	 * The name of the number signal that will be sent to native on change event
	 *
	 * HTML attribute name: sendEventOnChange or sendEventOnChange
	 */
	private _sendEventOnChangeSigName: string = '';

	/**
	 * The name of the number signal that will be sent to native on change event if range slider is set to true
	 *
	 * HTML attribute name: sendEventOnChangeHigh or sendEventOnChangeHigh
	 */
	private _sendEventOnChangeHighSigName: string = ''

	/**
	 * COMPONENT RECEIVE SIGNALS
	 *
	 * - receiveStateValue
	 * - receiveStateValueHigh
	 */

	/**
	 * The name of a string signal that will be applied to the value
	 *
	 * HTML attribute name: receiveStateValue or receivestatevalue
	 */
	private _receiveStateValueSignal: string = '';

	/**
	 * The subscription id for the receiveStateValue signal
	 */
	private _subReceiveValueId: string = '';
	private _subReceiveAnalogValueId: string = '';

	/**
	 * The name of a string signal that will be applied to the value
	 *
	 * HTML attribute name: receiveStateValueHigh or receiveStateValueHigh
	 */
	private _receiveStateValueSignalHigh: string = '';

	/**
	 * The subscription id for the receiveStateValueHigh signal
	 */
	private _subReceiveValueHighId: string = '';
	private _subReceiveAnalogValueHighId: string = '';

	/**
	 * Option to hide the slider toggle
	 *
	 * @private
	 * @type {boolean}
	 */
	private _noHandle: boolean = false;

	/**
	 * COMPONENT EVENTS
	 *
	 * slider - custom event.
	 * slidestart - custom event
	 * slideend - custom event
	 * focus - custom
	 * blur - custom
	 * change - custom
	 * dirty - custom
	 * press - custom
	 * release - custom
	 */

	/**
	 * Ch5Pressable manager
	 *
	 * @private
	 * @type {(Ch5Pressable | null)}
	 * @memberof Ch5Image
	 */
	private _pressable: Ch5Pressable | null = null;

	/**
	 * This event is useful when you specifically want to listen to a handle being dragged, but want to ignore other updates to the slider value.
	 * This event also fires on a change by a 'tap'. In most cases, the 'update' is the better choice.
	 *
	 * @type {Event}
	 */
	public sliderEvent: Event = {} as Event;

	/**
	 * This event fires when a handle is clicked (mousedown, or the equivalent touch events).
	 *
	 * @type {Event}
	 */
	public slidestartEvent: Event = {} as Event;

	/**
	 * This event is the opposite of the 'start' event.
	 * If fires when a handle is released (mouseup etc), or when a slide is canceled due to other reasons (such as mouse cursor leaving the browser window).
	 *
	 * @type {Event}
	 */
	public slideendEvent: Event = {} as Event;

	/**
	 * If fires when a handle is focus
	 *
	 * @type {Event}
	 */
	public focusEvent: Event = {} as Event;

	/**
	 * If fires when a handle loses focus
	 *
	 * @type {Event}
	 */
	public blurEvent: Event = {} as Event;

	/**
	 * Event change: Fires when the component's value changes due to user interaction.
	 *
	 * @type {Event}
	 */
	public changeEvent: Event = {} as Event;

	/**
	 * Event dirty: Fires when the component is on feedbackMode='submit' and displayed value is different than the actual value
	 * @type {Event}
	 */
	public dirtyEvent: Event = {} as Event;

	/**
	 * Event dirty: Fires when the component is on feedbackMode='submit' and displayed value is the actual value
	 * @type {Event}
	 */
	public cleanEvent: Event = {} as Event;

	/**
	 * This property stores the valueHigh which comes from signal or initial valueHigh
	 *
	 * @type {string | number}
	 * @protected
	 */
	protected _cleanValueHigh: (string | number) = '' as (string | number);

	/**
	 * Contains the changed valueHigh
	 *
	 * @type {string | number}
	 * @protected
	 */
	protected _dirtyValueHigh: (string | number) = '' as (string | number);

	/**
	 * Defines the timeout between the user change the high handle(second handle) and the time the slider will check if the value is equal with the value from the signal
	 * @protected
	 * @type {(number|null)}
	 */
	protected _dirtyTimerHandleHigh: number | null = null;

	protected _cleanLow: boolean = true;
	protected _dirtyLow: boolean = false;
	protected _cleanHigh: boolean = true;
	protected _dirtyHigh: boolean = false;

	/**
	 * rcb properties
	 */
	private _animationTimer: number | undefined = undefined;
	private _tooltipValueFromSignal: number | undefined = undefined;
	private _tooltipHighValueFromSignal: number | undefined = undefined;
	private _rcbSignalValue: IRcbSignal | undefined = undefined;
	private _rcbSignalValueHigh: IRcbSignal | undefined = undefined;
	private _animatingHandle = {
		0: false,
		1: false
	};

	public ready: Promise<void>;

	//#endregion

	//#region "Attribute Getters and Setters"

	/**
	 * Getter handleShape
	 * @return {TCh5SliderShape }
	 */
	public get handleShape(): TCh5SliderShape {
		return this._handleShape;
	}
	/**
	 * Setter handleShape
	 * @param {TCh5SliderShape } value
	 */
	public set handleShape(value: TCh5SliderShape) {
		if (this._handleShape !== value && value !== null) {
			if (Ch5Slider.SHAPES.indexOf(value) >= 0) {
				this._handleShape = value;
			} else {
				this._handleShape = Ch5Slider.SHAPES[0];
			}
			this.setAttribute('handleshape', this._handleShape);
		}
	}

	/**
	 * Getter value
	 */
	public get value() {
		return this._value;
	}

	/**
	 * Setter value
	 * @param {number|string } value
	 */
	public set value(value: number | string) {
		value = Number(value);

		// prevent infinite loop
		if (value !== this.value) {
			if (isNaN(value) || value > this._max || value < this._min) {
				value = this._min;
			}

			if (this._range && value >= this._valueHigh && this._valueHigh !== Ch5Slider.MAX_VALUE) {
				value = this._valueHigh - 1;
			}

			if (this._value !== value) {
				this._value = value;
				this.setAttribute('value', value.toString());

				if (this._dirtyTimerHandle !== null) {
					clearTimeout(this._dirtyTimerHandle);
					this._dirtyTimerHandle = null;
				}

				if (this._wasRendered && !isNil((this._elSlider as target).noUiSlider)) {
					(this._elSlider as target)?.noUiSlider?.set(value);
				}
			}
		}
	}

	/**
	 * Getter range
	 */
	public get range() {
		return this._range;
	}
	/**
	 * Setter range
	 */
	public set range(value: boolean) {
		const booleanValue = this._toBoolean(value);

		if (this._range !== booleanValue) {
			this._range = booleanValue;
			this.setAttribute('range', booleanValue.toString());

			if (this._wasRendered) { this._render(); }
		}
	}

	/**
	 * Getter valueHigh
	 */
	public get valueHigh() {
		return this._valueHigh;
	}
	/**
	 * Setter valueHigh
	 * @param {number|string } value
	 */
	public set valueHigh(value: number | string) {
		value = Number(value);

		// prevent infinite loop
		if (value === this.valueHigh) {
			return;
		}

		// not allowing valueHigh to be greater than this._max
		if (isNaN(value) || value > this._max) {
			value = this._max;
		}

		if (value <= this._value) {
			value = this._value + 1;
		}

		if (this._valueHigh !== value) {
			this._valueHigh = value;
			this.setAttribute('valuehigh', value.toString());

			if (this._dirtyTimerHandleHigh !== null) {
				clearTimeout(this._dirtyTimerHandleHigh);
				this._dirtyTimerHandleHigh = null;
			}
			const nouislider = this._elSlider as target;

			// @ts-ignore
			if (this._wasRendered && !isNil((this._elSlider as target).noUiSlider)) {
				(this._elSlider as target)?.noUiSlider?.set([this._value, value]);
			}
		}
	}

	/**
	 * Getter noHandle
	 */
	public get noHandle() {
		return this._noHandle;
	}

	/**
	 * Getter max
	 */
	public get max() {
		return this._max;
	}
	/**
	 * Setter max
	 * @param {number|string } value
	 */
	public set max(value: number | string) {
		value = Number(value);

		// prevent infinite loop
		if (value === this.max) {
			return;
		}

		if (isNaN(value) || value > Ch5Slider.MAX_VALUE) {
			value = Ch5Slider.MAX_VALUE;
		}

		if (value <= this._min) {
			value = this._min + 1;
		}

		// step should be honored over max when not an even divisor of max
		const numberOfSteps = (value - this._min) / this._step;
		const modulus = (value - this._min) % this._step;

		if (modulus !== 0) {
			value = this._min + (Math.floor(numberOfSteps) * this._step);
		}

		if (value !== this._max) {
			this._max = value;
			this.setAttribute('max', value.toString());

			if (this._wasRendered) { this._render(); }
		}
	}

	/**
	 * Getter min
	 */
	public get min() {
		return this._min;
	}

	/**
	 * Setter min
	 * @param {number|string } value
	 */
	public set min(value: number | string) {
		value = Number(value);

		// prevent infinite loop
		if (value === this.min) {
			return;
		}

		if (isNaN(value) || value > Ch5Slider.MAX_VALUE) {
			value = Ch5Slider.MIN_VALUE;
		}

		if (value >= this._max) {
			value = this._max - 1;
		}

		if (value !== this._min) {
			this._min = value;
			this.setAttribute('min', value.toString());

			if (this._wasRendered) { this._render(); }
		}
	}

	/**
	 * Getter orientation
	 * @return { TCh5SliderOrientation }
	 */
	public get orientation(): TCh5SliderOrientation {
		return this._orientation;
	}

	/**
	 * Setter orientation
	 * @param { TCh5SliderOrientation }
	 */
	public set orientation(value: TCh5SliderOrientation) {
		if (this._orientation !== value) {
			if (Ch5Slider.ORIENTATIONS.indexOf(value) >= 0) {
				this._orientation = value;
			} else {
				this._orientation = Ch5Slider.ORIENTATIONS[0];
			}

			this.setAttribute('orientation', this.orientation);

			if (this._wasRendered) { this._render(); }
		}
	}

	/**
	 * Getter size
	 * @type { TCh5SliderSize }
	 */
	public get size(): TCh5SliderSize {
		return this._size;
	}

	/**
	 * Setter size
	 * @param { TCh5SliderSize } value
	 */
	public set size(value: TCh5SliderSize) {
		if (this._size !== value && null !== value) {
			if (Ch5Slider.SIZES.indexOf(value) >= 0) {
				this._size = value;
			} else {
				this._size = Ch5Slider.SIZES[0];
			}

			this.setAttribute('size', this.size);

			if (this._wasRendered) { this._render(); }
		}
	}

	/**
	 * Getter handleSize
	 * @type {TCh5SliderSize}
	 */
	public get handleSize(): TCh5SliderSize {
		return this._handleSize;
	}

	/**
	 * Setter handleSize
	 * @param {TCh5SliderSize } value
	 */
	public set handleSize(value: TCh5SliderSize) {
		if (this._handleSize !== value && null !== value) {
			if (Ch5Slider.SIZES.indexOf(value) >= 0) {
				this._handleSize = value;
			} else {
				this._handleSize = Ch5Slider.SIZES[0];
			}

			this.setAttribute('handleSize', this.handleSize);

			if (this._wasRendered) { this._render(); }
		}
	}

	/**
	 * Getter step
	 */
	public get step() {
		return this._step;
	}

	/**
	 * Setter step
	 * @param {number|string } value
	 */
	public set step(value: number | string) {
		value = Number(value);

		// prevent infinite loop
		if (value === this.step) {
			return;
		}

		if (isNaN(value) || value > Ch5Slider.MAX_VALUE) {
			value = Ch5Slider.DEFAULT_STEP;
		}

		if (this._step !== value) {
			this._step = value;
			this.setAttribute('step', value.toString());

			if (this._wasRendered) { this._render(); }
		}
	}

	/**
	 * Getter stretch
	 * @type {TCh5SliderStretch | null}
	 */
	public get stretch(): TCh5SliderStretch | null {
		return this._stretch;
	}

	/**
	 * Setter step
	 * @param {TCh5SliderStretch | null} value
	 */
	public set stretch(value: TCh5SliderStretch | null) {
		if (value !== null) {
			if (this._stretch !== value) {
				if (Ch5Slider.STRETCHES.indexOf(value) >= 0) {
					this._stretch = value;
					this.setAttribute('stretch', this._stretch);
				} else {
					this._stretch = null;
				}
				if (this._wasRendered) { this._render(); }
			}
		} else {
			this._stretch = null;
		}
	}

	/**
	 * Getter ticks
	 * @return {string }
	 */
	public get ticks(): string {
		return this._ticks;
	}

	/**
	 * Setter ticks
	 * @param {string } value
	 */
	public set ticks(value: string) {
		if (this._ticks !== value) {
			if (value === undefined || value === null) {
				value = '';
			}

			this._ticks = value;
			this.setAttribute('ticks', value);

			if (this._wasRendered) { this._render(); }
		}
	}

	/**
	 * Getter showTickValues
	 */
	public get showTickValues() {
		return this._showTickValues;
	}

	/**
	 * Setter showTickValues
	 * @param {boolean} value
	 */
	public set showTickValues(value: boolean) {
		const booleanValue = this._toBoolean(value);

		if (this._showTickValues !== booleanValue) {
			this._showTickValues = booleanValue;
			this.setAttribute('showtickvalues', booleanValue.toString());

			if (this._wasRendered) { this._render(); }
		}
	}

	/**
	 * Getter toolTipShowType
	 * @return {TCh5SliderTooltipType }
	 */
	public get toolTipShowType(): TCh5SliderTooltipType {
		return this._toolTipShowType;
	}

	/**
	 * Setter toolTipShowType
	 * @param {TCh5SliderOrientation } value
	 */
	public set toolTipShowType(value: TCh5SliderTooltipType) {
		if (this._toolTipShowType !== value) {
			if (Ch5Slider.TOOLTIPS.indexOf(value) >= 0) {
				this._toolTipShowType = value;
			} else {
				this._toolTipShowType = Ch5Slider.TOOLTIPS[0];
			}

			this.setAttribute('tooltipshowtype', this.toolTipShowType);

			if (this._wasRendered) { this._render(); }
		}

		// subscribe to analog value if tooltip is on
		if (this.toolTipShowType === Ch5Slider.TOOLTIPS[1]) {
			this._susbscribeToAnalogSignal();
			this._susbscribeToAnalogHighSignal();
		} else {
			this._unsusbscribeFromAnalogSignals();
		}
	}

	/**
	 * Getter toolTipShowType
	 * @return {TCh5SliderTooltipDisplay }
	 */
	public get toolTipDisplayType(): TCh5SliderTooltipDisplay {
		return this._toolTipDisplayType;
	}

	/**
	 * Setter toolTipShowType
	 * @param {TCh5SliderOrientation } value
	 */
	public set toolTipDisplayType(value: TCh5SliderTooltipDisplay) {
		if (this._toolTipDisplayType !== value) {
			if (Ch5Slider.TDISPLAY.indexOf(value) >= 0) {
				this._toolTipDisplayType = value;
			} else {
				this._toolTipDisplayType = Ch5Slider.TDISPLAY[0];
			}

			this.setAttribute('tooltipdisplaytype', this.toolTipDisplayType);
			if (this._wasRendered) { this._render(); }
		}
	}

	/**
	 * Getter tapsettable
	 * @return {boolean }
	 */
	public get tapSettable() {
		return this._tapSettable;
	}

	/**
	 * Setter tapsettable
	 */
	public set tapSettable(value: boolean) {
		const booleanValue = this._toBoolean(value);

		if (this._tapSettable !== booleanValue) {
			this._tapSettable = booleanValue;
			this.setAttribute('tapsettable', booleanValue.toString());

			if (this._wasRendered) { this._render(); }
		}
	}

	public get direction() {
		return this._direction;
	}

	public set direction(value: TCh5SliderDirection) {
		if (value == null) {
			value = Ch5Slider.DIRECTION[0];
		}
		if (Ch5Slider.DIRECTION.indexOf(value) >= 0) {
			this._direction = value;
		}
		else {
			this._direction = Ch5Slider.DIRECTION[0];
		}
		if (this._wasRendered) { this._render(); }
	}
	/**
	 * SEND SIGNALS GETTERS AND SETTERS
	 */

	/**
	 * Getter sendEventOnChange
	 */
	public get sendEventOnChange(): string {
		return this._sendEventOnChangeSigName;
	}

	/**
	 * Setter sendEventOnChange
	 */
	public set sendEventOnChange(value: string) {
		this.info('set sendEventOnChange(\'' + value + '\')');

		if ('' === value) {
			return;
		}

		if (this._sendEventOnChangeSigName !== value) {
			this._sendEventOnChangeSigName = value;

			this.setAttribute('sendeventonchange', value);
		}
	}

	/**
	 * Getter sendEventOnChangeHigh
	 */
	public get sendEventOnChangeHigh(): string {
		return this._sendEventOnChangeHighSigName;
	}

	/**
	 * Setter sendEventOnChangeHigh
	 */
	public set sendEventOnChangeHigh(value: string) {
		this.info('set sendEventOnChangeHigh(\'' + value + '\')');

		if ('' === value) {
			return;
		}

		if (this._sendEventOnChangeHighSigName !== value) {
			this._sendEventOnChangeHighSigName = value;

			this.setAttribute('sendeventonchangehigh', value);
		}
	}

	/**
	 * RECEIVED SIGNALS GETTERS AND SETTERS
	 */

	/**
	 * Getter receiveStateValue
	 * @type {string}
	 */
	get receiveStateValue(): string {
		// The internal property is changed if/when the element is removed from DOM
		// Returning the attribute instead of the internal property preserves functionality
		return this._attributeValueAsString('receivestatevalue');
	}

	/**
	 * Setter receiveStateValue
	 */
	set receiveStateValue(value: string) {
		if ('' === value
			|| this._receiveStateValueSignal === value
			|| null === value
			|| undefined === value) {
			return;
		}

		// clean up old subscription
		if (this._receiveStateValueSignal !== ''
			&& this._receiveStateValueSignal !== undefined
			&& this._receiveStateValueSignal !== null) {


			const oldSignalName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateValueSignal);
			const oldSignal: Ch5Signal<object> | null = Ch5SignalFactory.getInstance()
				.getObjectSignal(oldSignalName);

			if (oldSignal !== null) {
				oldSignal.unsubscribe(this._subReceiveValueId);
			}
		}

		// setup new subscription.
		this._receiveStateValueSignal = value;
		this.setAttribute('receivestatevalue', value);

		const recSignalName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateValueSignal);
		const receiveSignal: Ch5Signal<object> | null = Ch5SignalFactory.getInstance()
			.getObjectSignal(recSignalName);


		if (receiveSignal === null) {
			return;
		}

		this._subReceiveValueId = receiveSignal.subscribe((object: any) => {
			if (undefined === object ||
				!object.hasOwnProperty('rcb') ||
				!object.rcb.hasOwnProperty('value') ||
				!receiveSignal.hasChangedSinceInit()) {
				return;
			}

			const rcb = (object as IRcbSignal).rcb;
			const animationDuration = rcb.time;
			let newValue: number = rcb.value;
			if (this._min < 0 && newValue > 0x7FFF) {
				newValue -= 0x10000;
			}

			this._rcbSignalValue = {
				'rcb': {
					'value': newValue,
					'time': animationDuration,
					'startv': undefined !== rcb.startv ? rcb.startv : this._value,
					'startt': undefined !== rcb.startt ? rcb.startt : Date.now()
				}
			};


			this.setCleanValue(newValue);

			if (this._dirtyTimerHandle === null) {
				this._wasRendered = false;
				this.setAttribute('value', newValue.toString());
				this._wasRendered = true;

				this._setSliderValue(newValue, TCh5SliderHandle.VALUE, animationDuration);

				// set first handle as clean
				this._setCleanLow();

				// set component state as clean
				this.setClean();
			}
		});
	}

	/**
	 * Getter receiveStateValueHigh
	 * @type {string}
	 */
	get receiveStateValueHigh(): string {
		// The internal property is changed if/when the element is removed from DOM
		// Returning the attribute instead of the internal property preserves functionality
		return this._attributeValueAsString('receivestatevaluehigh');
	}

	/**
	 * Setter receiveStateValueHigh
	 */
	set receiveStateValueHigh(value: string) {
		if ('' === value
			|| this._receiveStateValueSignalHigh === value
			|| null === value
			|| undefined === value) {
			return;
		}

		// clean up old subscription
		if (this._receiveStateValueSignalHigh !== ''
			&& this._receiveStateValueSignalHigh !== undefined
			&& this._receiveStateValueSignalHigh !== null) {

			const oldSignalName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateValueSignalHigh);
			const oldSignal: Ch5Signal<object> | null = Ch5SignalFactory.getInstance().getObjectSignal(oldSignalName);

			if (oldSignal !== null) {
				oldSignal.unsubscribe(this._subReceiveValueHighId);
			}
		}

		// setup new subscription.
		this._receiveStateValueSignalHigh = value;
		this.setAttribute('receivestatevaluehigh', value);
		const recSignalName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateValueSignalHigh);
		const receiveSignal: Ch5Signal<object> | null = Ch5SignalFactory.getInstance().getObjectSignal(recSignalName);

		if (receiveSignal === null) {
			return;
		}

		this._subReceiveValueHighId = receiveSignal.subscribe((object: any) => {
			if (undefined === object ||
				!object.hasOwnProperty('rcb') ||
				!object.rcb.hasOwnProperty('value') ||
				!receiveSignal.hasChangedSinceInit()) {
				return;
			}

			const rcb = (object as IRcbSignal).rcb;
			const animationDuration = rcb.time;
			let newValue: number = rcb.value;
			if (this._min < 0 && newValue > 0x7FFF) {
				newValue -= 0x10000;
			}

			this._rcbSignalValueHigh = {
				'rcb': {
					'value': newValue,
					'time': animationDuration,
					'startv': undefined !== rcb.startv ? rcb.startv : this._valueHigh,
					'startt': undefined !== rcb.startt ? rcb.startt : Date.now()
				}
			};

			this._cleanValueHigh = newValue;

			if (this._dirtyTimerHandleHigh === null) {

				this._wasRendered = false;
				this.setAttribute('valueHigh', newValue.toString());
				this._wasRendered = true;

				this._setSliderValue(newValue, TCh5SliderHandle.HIGHVALUE, animationDuration);

				// set first handle as clean
				this._setCleanHigh();

				// set component state as clean
				this.setClean();
			}
		});
	}

	//#endregion

	//#region "Life Cycle Hooks"

	constructor() {
		super();
		this.info('Ch5Slider.constructor()');

		this._listOfAllPossibleComponentCssClasses = this._generateListOfAllPossibleComponentCssClasses();

		// events binding
		this._onFocus = this._onFocus.bind(this);
		this._onBlur = this._onBlur.bind(this);
		this._onSliderSlide = this._onSliderSlide.bind(this);
		this._onSliderStart = this._onSliderStart.bind(this);
		this._onSliderStop = this._onSliderStop.bind(this);
		this._onSliderChange = this._onSliderChange.bind(this);
		this._stopRcbAnimation = this._stopRcbAnimation.bind(this);
		this._onMouseLeave = this._onMouseLeave.bind(this);

		this._pressable = new Ch5Pressable(this, {
			cssTargetElement: this.getTargetElementForCssClassesAndStyle(),
			cssPressedClass: this.cssClassPrefix + '--pressed'
		});

		if (!this._wasInstatiated) {
			this.createInternalHtml();
		}
		this._wasInstatiated = true;

		// set ready property as promise
		this.ready = Promise.all([
			customElements.whenDefined('ch5-slider')
		]).then(done => {
			//
		});
	}

	/**
	 * 	Called every time the element is inserted into the DOM.
	 *  Useful for running setup code, such as fetching resources or rendering.
	 */
	public connectedCallback() {
		this.info('Ch5Slider.connectedCallback()');

		// WAI-ARIA Attributes
		if (!this.hasAttribute('role')) {
			this.setAttribute('role', Ch5RoleAttributeMapping.ch5Slider);
		}

		// set data-ch5-id
		this.setAttribute('data-ch5-id', this.getCrId());

		// init pressable
		if (null !== this._pressable) {
			this._pressable.init();
		}

		this.ready.then(() => {
			this.cacheComponentChildrens();
			const existingSliderElement = this.querySelector('.noUi-target');

			if (existingSliderElement instanceof HTMLElement) {
				existingSliderElement.remove();
			}

			if (this._elSlider.parentElement !== this) {
				this.appendChild(this._elSlider);
			}

			this.initAttributes();
			this.updateCssClasses();

			if (!this._wasRendered ||
				'undefined' === typeof (this._elSlider as target).noUiSlider ||
				null === (this._elSlider as target).noUiSlider) {
				this._render()
					.then(() => {
						this._wasRendered = true;
						window.setTimeout(() => { this._applySignalReceivedBeforeRender() }, 0);
					});
			}

			// attach event listeners
			this.attachEventListeners();

			this.initCommonMutationObserver(this);

			// init clean values
			this.setCleanValue(this.value);
			this._cleanValueHigh = this.valueHigh;
		});
	}

	private setCleanValue(value: string | number) {
		this._cleanValue = value;
	}

	/**
	 * Called every time the element is removed from the DOM.
	 * Useful for running clean up code.
	 */
	public disconnectedCallback() {
		this.info('Ch5Slider.disconnectedCallback()');
		this.removeEvents();
		this.unsubscribeFromSignals();

		// destroy slider
		if ((this._elSlider as target).noUiSlider !== undefined) {
			(this._elSlider as target)?.noUiSlider?.destroy();
		}

		// remove press events from pressable
		if (null !== this._pressable) {
			this._pressable.destroy();
		}

		// disconnect common mutation observer
		this.disconnectCommonMutationObserver();
	}

	/**
	 * Respond to attribute changes.
	 * @readonly
	 */
	static get observedAttributes() {
		const commonAttributes = Ch5Common.observedAttributes;
		const ch5SliderAttributes: string[] = [
			'handleshape',
			'range',
			'value',
			'valuehigh',
			'max',
			'min',
			'orientation',
			'size',
			'handlesize',
			'step',
			'stretch',
			'ticks',
			'showtickvalues',
			'tooltipshowtype',
			'tooltipdisplaytype',
			'tapsettable',
			'feedbackmode',
			'signalvaluesynctimeout',
			'dir',

			'sendeventonchange',
			'sendeventonchangehigh',

			'receivestatevalue',
			'receivestatevaluehigh'
		];

		return commonAttributes.concat(ch5SliderAttributes);
	}

	/**
	 * Called when an HTML attribute is changed, added or removed
	 */
	public attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
		if (oldValue === newValue) {
			return;
		}

		this.info('attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + ')"');

		switch (attr) {
			case 'handleshape':
				if (this.hasAttribute('handleshape')) {
					this.handleShape = newValue as TCh5SliderShape;
				} else {
					this.handleShape = Ch5Slider.SHAPES[0];
				}
				this.updateCssClasses();
				break;

			case 'range':
				if (this.hasAttribute('range')) {
					this.range = this.checkIfValueIsTruey(newValue);
				} else {
					this.range = false;
				}
				break;

			case 'value':
				if (this.hasAttribute('value')) {
					this.value = newValue;
				} else {
					this.value = 0;
				}
				break;

			case 'valuehigh':
				if (this.hasAttribute('valuehigh')) {
					this.valueHigh = newValue;
				} else {
					this.valueHigh = Ch5Slider.MAX_VALUE;
				}
				break;

			case 'max':
				if (this.hasAttribute('max')) {
					this.max = newValue;
					// set again value and valueHigh since they are depending on max
					this.value = this.getAttribute('value') as string;
					this.valueHigh = this.getAttribute('valueHigh') as string;
				} else {
					this.max = Ch5Slider.MAX_VALUE;
				}
				break;

			case 'min':
				if (this.hasAttribute('min')) {
					this.min = newValue;
					// set again value and valueHigh since they are depending on max
					this.value = this.getAttribute('value') as string;
					this.valueHigh = this.getAttribute('valueHigh') as string;
				} else {
					this.min = 0;
				}
				break;

			case 'orientation':
				if (this.hasAttribute('orientation')) {
					this.orientation = newValue as TCh5SliderOrientation;
				} else {
					this.orientation = Ch5Slider.ORIENTATIONS[0];
				}
				this.updateCssClasses();
				break;

			case 'size':
				if (this.hasAttribute('size')) {
					this.size = newValue as TCh5SliderSize;
				} else {
					this.size = Ch5Slider.SIZES[0];
				}
				this.updateCssClasses();
				break;

			case 'handlesize':
				if (this.hasAttribute('handlesize')) {
					this.handleSize = newValue as TCh5SliderSize;
				} else {
					this.handleSize = Ch5Slider.SIZES[0];
				}
				this.updateCssClasses();
				break;

			case 'step':
				if (this.hasAttribute('step')) {
					this.step = newValue;
				} else {
					this.step = Ch5Slider.DEFAULT_STEP;
				}
				break;

			case 'stretch':
				if (this.hasAttribute('stretch')) {
					this.stretch = newValue as TCh5SliderStretch | null;
				} else {
					this.stretch = null;
				}
				this.updateCssClasses();
				break;

			case 'ticks':
				if (this.hasAttribute('ticks')) {
					this.ticks = newValue;
					// this can't be set from CSS files since there is no way in CSS to detect if ticks are set
					this.style.setProperty('padding-bottom', '2.5em');
				} else {
					this.ticks = '';
					this.style.setProperty('padding-bottom', '0');
				}
				break;

			case 'showtickvalues':
				if (this.hasAttribute('showtickvalues')) {
					this.showTickValues = this.checkIfValueIsTruey(newValue);
				} else {
					this.showTickValues = false;
				}
				break;

			case 'tapsettable':
				if (this.hasAttribute('tapsettable')) {
					this.tapSettable = this.checkIfValueIsTruey(newValue);
				} else {
					this.tapSettable = false;
				}
				break;

			case 'sendeventonchange':
				if (this.hasAttribute('sendeventonchange')) {
					this.sendEventOnChange = newValue;
				} else {
					this.sendEventOnChange = '';
				}
				break;

			case 'sendeventonchangehigh':
				if (this.hasAttribute('sendeventonchangehigh')) {
					this.sendEventOnChangeHigh = newValue;
				} else {
					this.sendEventOnChangeHigh = '';
				}
				break;

			case 'receivestatevalue':
				if (this.hasAttribute('receivestatevalue')) {
					this.receiveStateValue = newValue;
				} else {
					this.receiveStateValue = '';
				}
				break;

			case 'receivestatevaluehigh':
				if (this.hasAttribute('receivestatevaluehigh')) {
					this.receiveStateValueHigh = newValue;
				} else {
					this.receiveStateValueHigh = '';
				}
				break;

			case 'tooltipshowtype':
				if (this.hasAttribute('tooltipshowtype')) {
					this.toolTipShowType = newValue as TCh5SliderTooltipType;
					// this can't be set from CSS files since there is no way in CSS to detect if tooltips are set
					if (this.toolTipShowType !== 'off') {
						this.style.setProperty('padding-top', '2.5em');
					}
				} else {
					this.toolTipShowType = Ch5Slider.TOOLTIPS[0];
					this.style.setProperty('padding-top', '0em');
				}
				this.updateCssClasses();
				break;

			case 'tooltipdisplaytype':
				if (this.hasAttribute('tooltipdisplaytype')) {
					this.toolTipDisplayType = newValue as TCh5SliderTooltipDisplay;
				} else {
					this.toolTipDisplayType = Ch5Slider.TDISPLAY[0];
				}
				break;

			case 'dir':
				if (this.hasAttribute('dir')) {
					this.direction = newValue.toLowerCase() as TCh5SliderDirection;
				} else {
					this.direction = Ch5Slider.DIRECTION[0];
				}
				break;

			default:
				super.attributeChangedCallback(attr, oldValue, newValue);
				break;
		}
	}

	/**
	 * Unsubscribe signals
	 */
	public unsubscribeFromSignals() {
		super.unsubscribeFromSignals();

		this._unsubscribeFromObjectSignals();
		this._unsusbscribeFromAnalogSignals();
	}

	//#endregion

	//#region "Other Methods"

	/**
	 * Returns css class when disabled
	 *
	 * @return {string }
	 */
	public getCssClassDisabled(): string {
		return this.cssClassPrefix + '--disabled';
	}

	/**
	 * METHODS
	 *
	 * - submit
	 * - reset
	 * - getDirty - inerhit
	 */

	/**
	 * Submit the value ( send a signal )
	 */
	public submit(): void {
		this.info('Ch5Slider.submit()');

		// send signal for first handle
		if (this.feedbackMode === 'submit' && this._dirtyLow === true) {
			this._submitted = true;

			this._setDirtyHandler(TCh5SliderHandle.VALUE);
			this._sendValueForChangeSignal(this._value);
		}

		// send signal for second handle
		if (this.feedbackMode === 'submit' && this._range === true && this._dirtyHigh === true) {
			this._submitted = true;

			this._setDirtyHandler(TCh5SliderHandle.HIGHVALUE);
			this._sendHighValueForChangeSignal(this._valueHigh);
		}
	}

	/**
	 * Reset value | valueHigh property and set component as clean
	 */
	public reset(): void {
		this.info('Ch5Slider.reset()');

		if (this._dirtyLow) {
			this._setSliderValue(
				Number(this._cleanValue),
				TCh5SliderHandle.VALUE
			);
			this._value = Number(this._cleanValue);
			this._setCleanLow()
		}

		if (this._dirtyHigh) {
			this._setSliderValue(
				Number(this._cleanValueHigh),
				TCh5SliderHandle.HIGHVALUE
			);
			this._valueHigh = Number(this._cleanValueHigh);
			this._setCleanHigh();
		}

		this.setClean();
	}

	/**
	 * Set component as clean
	 * If range=true then the component is set to clean state if both handles are clean
	 *
	 * @return {void}
	 */
	public setClean(): void {
		if (this._cleanLow && this._cleanHigh) {
			this._clean = true;
			this._dirty = false;
			this._submitted = false;

			// fire clean event
			if (this.feedbackMode === 'submit') {
				/**
				 * Fired when the component's becomes clean.
				 *
				 * @event clean
				 */
				this.dispatchEvent(
					this.cleanEvent = new CustomEvent('clean', {
						bubbles: true,
						cancelable: false
					})
				);

				if (this.onclean instanceof HtmlCallback) {
					this.onclean.run({} as Event);
				} else if (this.onclean instanceof Function) {
					this.onclean();
				}
			}
		}
	}

	/**
	 * Make input dirty, in generally when the input value is changed
	 *
	 * @fires dirty
	 * @return {void}
	 */
	public setDirty(): void {
		super.setDirty();

		if (this.feedbackMode === 'submit') {
			/**
			 * Fired when the component's value changes due to user interaction.
			 *
			 * @event dirty
			 */
			this.dispatchEvent(
				this.dirtyEvent = new CustomEvent('dirty', {
					bubbles: true,
					cancelable: false
				})
			);

			if (this.ondirty instanceof HtmlCallback) {
				this.ondirty.run({} as Event);
			} else if (this.ondirty instanceof Function) {
				this.ondirty();
			}
		}
	}

	/**
	 * Set dirty value based on handle
	 * @param handle
	 * @param value
	 */
	protected setDirtyValue(handle: TCh5SliderHandle, value: (number | string)[]): void {
		switch (handle) {
			case TCh5SliderHandle.VALUE:
				this._setDirtyLow();
				this._dirtyValue = Number(value[handle]);
				break;
			case TCh5SliderHandle.HIGHVALUE:
				this._setDirtyHigh();
				this._dirtyValueHigh = Number(value[handle]);
				break;

			default:
				break;
		}
	}

	// empty function since in this component is not needed
	protected setInputValue() {
		return;
	}

	protected updateForChangeInDisabledStatus() {
		super.updateForChangeInDisabledStatus();

		if (true === this._disabled) {
			this._elSlider.setAttribute('disabled', 'true');
		} else {
			this._elSlider.removeAttribute('disabled');
		}
	}

	/**
	 * Creates the internal html element of the component
	 *
	 * @protected
	 */
	protected createInternalHtml() {
		// element slider
		this._elSlider = document.createElement('div');
	}

	/**
	 * Called to initialize all attributes
	 * @protected
	 */
	protected initAttributes(): void {
		super.initAttributes();

		this._upgradeProperty('handleShape');
		this._upgradeProperty('range');
		this._upgradeProperty('step');
		this._upgradeProperty('min');
		this._upgradeProperty('max');
		this._upgradeProperty('value');
		this._upgradeProperty('valueHigh');
		this._upgradeProperty('orientation');
		this._upgradeProperty('size');
		this._upgradeProperty('handleSize');
		this._upgradeProperty('stretch');
		this._upgradeProperty('ticks');
		this._upgradeProperty('showTickValues');
		this._upgradeProperty('toolTipShowType');
		this._upgradeProperty('toolTipDisplayType');
		this._upgradeProperty('dir');
		this._upgradeProperty('_sendEventOnChangeSigName');
		this._upgradeProperty('_sendEventOnChangeHighSigName');
		this._upgradeProperty('receiveStateValue');
		this._upgradeProperty('receiveStateValueHigh');
	}

	/**
	 * Apply css classes for attrs inherited from common (e.g. customClass, customStyle )
	 * @protected
	 */
	protected updateCssClasses(): void {
		// apply css classes for attrs inherited from common (e.g. customClass, customStyle )
		super.updateCssClasses();

		const setOfCssClassesToBeApplied = new Set<string>();

		// primary
		setOfCssClassesToBeApplied.add(this.primaryCssClass);

		// shape
		setOfCssClassesToBeApplied.add(this.cssClassPrefix + '--shape--' + this.handleShape);

		// size
		setOfCssClassesToBeApplied.add(this.cssClassPrefix + '--size--' + this.size);

		// handleSize
		setOfCssClassesToBeApplied.add(this.cssClassPrefix + '--handle-size--' + this.handleSize);

		// strech
		setOfCssClassesToBeApplied.add(this.cssClassPrefix + '--stretch--' + this.stretch);

		// orientation
		setOfCssClassesToBeApplied.add(this.cssClassPrefix + '--orientation--' + this.orientation);

		// tooltip
		setOfCssClassesToBeApplied.add(this.cssClassPrefix + '--tooltip--' + this.toolTipShowType);

		const targetEl: HTMLElement = this.getTargetElementForCssClassesAndStyle();
		if (typeof targetEl.classList !== 'undefined') {
			this._listOfAllPossibleComponentCssClasses.forEach((cssClass: string) => {
				if (setOfCssClassesToBeApplied.has(cssClass)) {
					targetEl.classList.add(cssClass);
					// this.classList.add(cssClass);
					this.info('add CSS class', cssClass);
				} else {
					targetEl.classList.remove(cssClass);
					// this.classList.remove(cssClass);
					this.info('remove CSS class', cssClass);
				}
			});
		}
	}

	/**
	 * Called to bind proper listeners
	 * @protected
	 */
	protected attachEventListeners() {
		super.attachEventListeners();

		// Focus | Blur events
		if (null !== this._elSlider.querySelector('.noUi-handle')) {
			const noUiHandle = this._elSlider.querySelector('.noUi-handle') as HTMLElement;

			noUiHandle.addEventListener('focus', this._onFocus);
			noUiHandle.addEventListener('blur', this._onBlur);
			this._elSlider.addEventListener('mouseleave', this._onMouseLeave);
		}
	}

	/**
	 * Removes listeners
	 * @protected
	 */
	protected removeEvents() {
		super.removeEventListeners();

		// Focus | Blur events
		// TODO: remove tabindex from handle(.noUi-handle)
		if (null !== this._elSlider.querySelector('.noUi-handle')) {
			const noUiHandle = this._elSlider.querySelector('.noUi-handle') as HTMLElement;


			noUiHandle.removeEventListener('focus', this._onFocus);
			noUiHandle.removeEventListener('blur', this._onBlur);
		}
	}

	/**
	 * @private
	 * @returns {HTMLElement}
	 */
	protected getTargetElementForCssClassesAndStyle(): HTMLElement {
		return this;
	}

	/**
	 * Generates a list of all possible components css classes
	 *
	 * @private
	 * @returns {string[]}
	 */
	private _generateListOfAllPossibleComponentCssClasses(): string[] {
		const cssClasses: string[] = this._listOfAllPossibleComponentCssClasses;

		// primary class
		cssClasses.push(this.primaryCssClass);

		// shapes
		Ch5Slider.SHAPES.forEach((shape: TCh5SliderShape) => {
			cssClasses.push(this.cssClassPrefix + '--shape--' + shape);
		});

		// sizes
		Ch5Slider.SIZES.forEach((size: TCh5SliderSize) => {
			cssClasses.push(this.cssClassPrefix + '--size--' + size);
		});

		// handle sizes
		Ch5Slider.SIZES.forEach((size: TCh5SliderSize) => {
			cssClasses.push(this.cssClassPrefix + '--handle-size--' + size);
		});

		// stretches
		Ch5Slider.STRETCHES.forEach((stretch: TCh5SliderStretch) => {
			cssClasses.push(this.cssClassPrefix + '--stretch--' + stretch);
		});

		// orientation
		Ch5Slider.ORIENTATIONS.forEach((orientation: TCh5SliderOrientation) => {
			cssClasses.push(this.cssClassPrefix + '--orientation--' + orientation);
		});

		// orientation
		Ch5Slider.TOOLTIPS.forEach((tooltip: TCh5SliderTooltipType) => {
			cssClasses.push(this.cssClassPrefix + '--tooltip--' + tooltip);
		});


		return cssClasses;
	}

	/**
	 * Render the slide
	 *
	 * @private
	 * @returns {Promise<void>}
	 * @memberof Ch5Slider
	 */
	private _render(): Promise<API> {
		// TODO: find a way to not render the slider again when an attribute is changing and just update slider options
		this.info('Ch5Slider._render()');

		return new Promise((resolve, reject) => {
			if (this._elSlider === null || this._elSlider === undefined) {
				return reject(false);
			}

			if (this._orientation === 'vertical') {
				this._elSlider.style.width = '';
				this._elSlider.style.height = 'inherit';
			} else { // horizontal
				this._elSlider.style.width = 'inherit';
				this._elSlider.style.height = '';
			}

			// noUiSlider.Options
			const options = this._parsedSliderOptions();

			// create noUiSlider
			try {
				// @ts-ignore
				if (!isNil((this._elSlider as target).noUiSlider)) {
					(this._elSlider as target)?.noUiSlider?.destroy();
				}
				const slider = create(this._elSlider, options);

				// Slide related events
				(this._elSlider as target)?.noUiSlider?.on('slide', this._onSliderChange);
				(this._elSlider as target)?.noUiSlider?.on('start', this._onSliderStart);
				(this._elSlider as target)?.noUiSlider?.on('end', this._onSliderStop);

				// store internal slider elements
				this._tgtEls = [];
				this._tgtEls.push(this._elSlider.querySelectorAll('.noUi-connect'));
				this._tgtEls.push(this._elSlider.querySelectorAll('.noUi-origin'));

				this._tooltip = this._elSlider.querySelectorAll('.noUi-tooltip');

				resolve(slider);
			} catch (error) {
				reject(error);
			}
		});
	}

	/**
	 * Set slider value
	 *
	 * @private
	 * @param {number} value
	 * @param {TCh5SliderHandle} [handle]
	 */
	private _setSliderValue(value: number, handle: TCh5SliderHandle, time?: number): void {
		if (this._elSlider === undefined || (this._elSlider as target).noUiSlider === undefined) { return; }

		const animationLength: number = time !== undefined ? Math.round(time) : 0;
		let slideValue: number | (null | number)[] = [value, null];

		if (handle === TCh5SliderHandle.HIGHVALUE) {
			slideValue = [null, value];
		}

		if (isNaN(animationLength) || animationLength <= 0 || animationLength > 120000) {
			// set value, no animation.
			this._stopRcbAnimation(handle);
			(this._elSlider as target)?.noUiSlider?.set(slideValue as (number | string)[]);
		} else {
			(this._elSlider as target)?.noUiSlider?.set(slideValue as (number | string)[]);

			// this is needed because when slider value is set also tooltip value is set
			// so we need to keep tooltip value from analog singal in order for animation to be consistent
			this._adjustTooltipValue(handle)

			this._startRcbAnimation(animationLength, handle);
		}
	}

	/**
	 * COMPONENT EVENTS HANDLERS
	 */

	/**
	 * Runs when user slides the handle
	 *
	 * @private
	 * @param {string[]} value
	 * @param {number} handle
	 *
	 * @fires slider
	 */
	private _onSliderSlide(value: string[], handle: number): void {
		this.info('Ch5Slider._onSliderSlide()');

		/**
		 * Fired when the component's handle start to slide.
		 *
		 * @event slider
		 */
		this.dispatchEvent(
			this.sliderEvent = new CustomEvent('slider', {
				bubbles: true,
				cancelable: false,
				detail: {
					handle,
					value
				}
			})
		);
	}

	/**
	 * Runs when user start to slide the handle
	 *
	 * @private
	 * @param {string[]} value
	 * @param {number} handle
	 *
	 * @fires slidestart
	 */
	private _onSliderStart(value: (number | string)[], handle: number): void {
		this.info('Ch5Slider._onSliderStart()');

		/**
		 * Fired when the component's handle start to slide.
		 *
		 * @event slidestart
		 */
		this.dispatchEvent(
			this.slidestartEvent = new CustomEvent('slidestart', {
				bubbles: true,
				cancelable: false,
				detail: {
					handle,
					value
				}
			})
		);
	}

	/**
	 * Runs when user ends sliding the handle
	 *
	 * @private
	 * @param {string[]} value
	 * @param {number} handle
	 *
	 * @fires slideend
	 */
	private _onSliderStop(value: (number | string)[], handle: number): void {
		this.info('Ch5Slider._onSliderStop()');
		// this.sliderInProgress = false;
		/**
		 * Fired when the component's handle end to slide.
		 *
		 * @event slideend
		 */
		this.dispatchEvent(
			this.slideendEvent = new CustomEvent('slideend', {
				bubbles: true,
				cancelable: false,
				detail: {
					handle,
					value
				}
			})
		);
	}

	/**
	 * Runs when user interacts with component in a way that changes the value
	 *
	 * Set component value based on handle value and send value signal.
	 * Fires 'slider' and 'dirty' events
	 *
	 * @param value
	 * @param handle
	 *
	 * @fires change
	 * @fires dirty
	 *
	 * @private
	 */
	private _onSliderChange(value: (number | string)[], handle: number): void {
		this.info('Ch5Slider._onSliderChange()');

		// set component value | valueHigh based on handle
		this._applyHandleValueToComponent(handle, value);

		// send value signal
		if (undefined !== value
			&& this._feedbackMode === 'direct'
		) {
			this._sendHandleValueSignal(handle, value);
		}

		// temporarily disabled
		/**
		 * Fired when the component's handle changes due to user interaction.
		 *
		 * @event change
		 */
		// this.dispatchEvent(
		//     this.changeEvent = new CustomEvent('change', {
		//         detail: {
		//             handle,
		//             value
		//         },
		//         bubbles: true,
		//         cancelable: false,
		//     })
		// );

		/**
		 * Fired when the component's handle start to slide.
		 *
		 * @event slider
		 */
		this.dispatchEvent(
			this.sliderEvent = new CustomEvent('slider', {
				bubbles: true,
				cancelable: false,
				detail: {
					handle,
					value
				}
			})
		);

		// set dirty flag and fire dirty event
		if (!this._dirty) {
			// set dirty flag and fire dirty event
			this.setDirty();
		}

		// set dirty value based on handle
		if (this._dirty) {
			/* coverity[var_deref_model] */
			this.setDirtyValue(handle, value);
		}

		// set component as clean if handle/handles are back to inital state
		this._maybeSetComponentClean();
	}

	/**
	 *
	 * @private
	 * @param {Event} inEvent
	 */
	private _onFocus(inEvent: Event): void {
		this.info('Ch5Slider._onFocus()');

		inEvent.preventDefault();
		inEvent.stopPropagation();

		this.dispatchEvent(
			this.focusEvent = new CustomEvent('focus', {
				bubbles: true,
				cancelable: false,
			})
		);

	}

	private _getAbsoluteOffsetFromBodyForSlider() {
		let offsetX = 0;
		let offsetY = 0;
		let sliderElement = this._elSlider as unknown as any;
		while (sliderElement && !isNaN(sliderElement.offsetLeft) && !isNaN(sliderElement.offsetTop)) {
			offsetX += sliderElement.offsetLeft - sliderElement.scrollLeft + sliderElement.clientLeft;
			offsetY += sliderElement.offsetTop - sliderElement.scrollTop + sliderElement.clientTop;
			sliderElement = sliderElement.offsetParent;
		}

		return {
			offsetX,
			offsetY
		}
	}

	_onMouseLeave(inEvent: any): void {
		const { offsetX, offsetY } = this._getAbsoluteOffsetFromBodyForSlider();
		const noUiHandle = this._elSlider.querySelector('.noUi-handle') as HTMLElement;

		if (this._orientation === 'vertical') {
			const maxOffsetLeft = offsetY - Ch5Slider.OFFSET_THRESHOLD;
			const maxOffsetRight = offsetY + this._elSlider.clientWidth + Ch5Slider.OFFSET_THRESHOLD;
			const maxOffestTop = offsetX - Ch5Slider.OFFSET_THRESHOLD;
			const maxOffestBottom = offsetX + this._elSlider.clientHeight + Ch5Slider.OFFSET_THRESHOLD;

			if (inEvent.clientX < maxOffsetLeft ||
				inEvent.clientX > maxOffsetRight ||
				inEvent.clientY < maxOffestTop ||
				inEvent.clientY > maxOffestBottom
			) {
				this.dispatchEvent(
					this.blurEvent = new CustomEvent('mouseup', {
						bubbles: true,
						cancelable: false,
					})
				);

				noUiHandle.blur();
			}
		} else {
			const maxOffsetLeft = offsetY - Ch5Slider.OFFSET_THRESHOLD;
			const maxOffsetRight = offsetX + this._elSlider.clientWidth + Ch5Slider.OFFSET_THRESHOLD;
			const maxOffestTop = offsetX - Ch5Slider.OFFSET_THRESHOLD;
			const maxOffestBottom = offsetY + this._elSlider.clientHeight + Ch5Slider.OFFSET_THRESHOLD;

			if (inEvent.clientX < maxOffsetLeft ||
				inEvent.clientX > maxOffsetRight ||
				inEvent.clientY < maxOffestTop ||
				inEvent.clientY > maxOffestBottom
			) {
				this.dispatchEvent(
					this.blurEvent = new CustomEvent('mouseup', {
						bubbles: true,
						cancelable: false,
					})
				);

				noUiHandle.blur();
			}
		}
	}

	/**
	 *
	 * @private
	 * @param {Event} inEvent
	 */
	private _onBlur(inEvent: Event): void {
		this.info('Ch5Slider._onBlur()');

		inEvent.preventDefault();
		inEvent.stopPropagation();

		this.dispatchEvent(
			this.blurEvent = new CustomEvent('blur', {
				bubbles: true,
				cancelable: false,
			})
		);
	}

	/**
	 * Apply components value based on handle number
	 * @param handle
	 * @param value
	 */
	private _applyHandleValueToComponent(handle: TCh5SliderHandle, value: (number | string)[]): void {
		switch (handle) {
			case TCh5SliderHandle.VALUE:
				this._value = Number(value[handle]);
				break;
			case TCh5SliderHandle.HIGHVALUE:
				this._valueHigh = Number(value[handle]);
				break;
			default:
				break;
		}
	}

	/**
	 * Send signal value on change
	 *
	 * @private
	 * @param {string[]} value
	 * @param {number} handle
	 */
	private _sendHandleValueSignal(handle: TCh5SliderHandle, value: (number | string)[]): void {
		const numberVal: number = Math.round(
			Number(value[handle])
		);

		switch (handle) {
			case TCh5SliderHandle.VALUE:
				// set dirty handler and send signal value for value
				this._setDirtyHandler(handle);
				this._sendValueForChangeSignal(numberVal);
				break;
			case TCh5SliderHandle.HIGHVALUE:
				// set drity handler send signal value for high value
				this._setDirtyHandler(handle);
				this._sendHighValueForChangeSignal(numberVal);
				break;
			default:
				break;
		}
	};

	/**
	 * Send signal value on slider change
	 * @private
	 */
	private _sendValueForChangeSignal(value: number): void {
		let sigChange: Ch5Signal<number> | null = null;

		if ('' !== this._sendEventOnChangeSigName
			&& undefined !== this._sendEventOnChangeSigName
			&& null !== this._sendEventOnChangeSigName) {

			sigChange = Ch5SignalFactory.getInstance()
				.getNumberSignal(this._sendEventOnChangeSigName);

			if (sigChange !== null && sigChange.value !== value) {
				sigChange.publish(value);
			}
		}
	}

	/**
	 * Send signal high value on slider change
	 * @private
	 */
	private _sendHighValueForChangeSignal(value: number): void {
		let sigChange: Ch5Signal<number> | null = null;

		if (this._range
			&& '' !== this._sendEventOnChangeHighSigName
			&& undefined !== this._sendEventOnChangeHighSigName
			&& null !== this._sendEventOnChangeHighSigName

		) {
			sigChange = Ch5SignalFactory.getInstance()
				.getNumberSignal(this._sendEventOnChangeHighSigName);

			if (sigChange !== null) {
				sigChange.publish(value);
			}
		}
	}

	/**
	 * Dirty handler, only set dirty handle if component has a receivestatevalue attribute
	 * @private
	 */
	private _setDirtyHandler(handle: TCh5SliderHandle) {
		this.info('Ch5Slider._setDirtyHandler');

		switch (handle) {
			// dirty handler for value
			case TCh5SliderHandle.VALUE:
				if (this._dirtyTimerHandle !== null) {
					clearTimeout(this._dirtyTimerHandle);
				}

				this._dirtyTimerHandle = window.setTimeout(
					() => this._onDirtyTimerFinished(handle),
					this._signalValueSyncTimeout
				);

				break;
			// dirty handler for valueHigh
			case TCh5SliderHandle.HIGHVALUE:
				if (this._dirtyTimerHandleHigh !== null) {
					clearTimeout(this._dirtyTimerHandleHigh);
				}

				this._dirtyTimerHandleHigh = window.setTimeout(
					() => this._onDirtyTimerFinished(handle),
					this._signalValueSyncTimeout
				);
			default:
				break;
		}
	}

	/**
	 * This will run when no value is receive and signalValueSyncTimeout is fulfill
	 * Reset component value to cleanValue and clean state
	 *
	 * @private
	 * @param {TCh5SliderHandle} handle
	 */
	private _onDirtyTimerFinished(handle: TCh5SliderHandle) {
		this.info('Ch5Slider._onDirtyTimerFinished');

		switch (handle) {
			case TCh5SliderHandle.VALUE:
				this._dirtyTimerHandle = null;

				if (this._dirtyValue !== this._cleanValue) {
					const nrCleanValue = Number(this._cleanValue);

					// set ui view value
					this._setSliderValue(nrCleanValue, TCh5SliderHandle.VALUE);

					this._setCleanLow();
					this._applyTooltipValue(this._tooltip[TCh5SliderHandle.VALUE], nrCleanValue);
				}
				break;
			case TCh5SliderHandle.HIGHVALUE:
				this._dirtyTimerHandleHigh = null;

				if (this._dirtyValueHigh !== this._cleanValueHigh) {
					const nrCleanValue = Number(this._cleanValueHigh);

					// set ui view value
					this._setSliderValue(nrCleanValue, TCh5SliderHandle.HIGHVALUE);

					this._setCleanHigh();

					this._applyTooltipValue(this._tooltip[TCh5SliderHandle.HIGHVALUE], nrCleanValue);
				}
				break;
			default:
				break;
		}
		this.setClean();
	}

	/**
	 * Set component as clean if handle/handles are back to initial state
	 *
	 * @private
	 */
	private _maybeSetComponentClean(): void {
		// check if component dirty value is same as initial value(clean value)
		// if so set component value as clean
		if ((this._dirtyValue === this._cleanValue)) {
			this._setCleanLow();
		}

		// check if component dirty valueHigh is same as initial valueHigh(clean valueHigh)
		// if so set component valueHigh as clean
		if ((this._dirtyValueHigh === this._cleanValueHigh)) {
			this._setCleanHigh();
		}

		// finaly check if component can be set as clean
		this.setClean();
	}

	/**
	 * Verify component attributes and set slider options
	 *
	 * @private
	 */
	private _parsedSliderOptions() {
		const behaviour = this._tapSettable ? 'tap' : 'none';

		// default setup of noUiSlider is top to bottom for vertical which is 'ltr'
		// in our case is bottom to top so we need to change it to 'rtl'
		const verticalDirection = this.direction === 'rtl' ? 'ltr' : 'rtl';
		const direction: TCh5SliderDirection = (this.orientation) === 'vertical' ? verticalDirection : this.direction;

		// The connect option can be used to control the bar between the handles or the edges of the slider.
		const connect = this._connectDisplayFormater();

		// Defines the number of steps values in the slider. If you want quarters 0, 25, 50, 75, 100 then 25 is the number for step.
		// const step = Math.round( (Math.abs(this._min) + this._max) / this._step );
		const step = this._step;

		// All values on the slider are part of a range. The range has a minimum and maximum value. The minimum value cannot be equal to the maximum value.
		let range: { [key: string]: number } = { 'min': this._min, 'max': this._max };

		// This feature allows you to generate non-linear sliders
		const pips = this._parsedTicks();

		// pips options
		let pipsOptions = {};

		// override range if pips are declared. setRangeFromPisp will also override min and max
		if (typeof pips === 'object') {
			// this is called before this._getRangeFromPips because it can change min and max values
			this._maybeSetMinAndMaxFromPips(pips);

			// create range object from pips
			range = this._getRangeFromPips(pips);

			pipsOptions = {
				mode: 'positions',
				density: 100,
				values: Object.keys(pips).map(value => Number(value)),
				format: {
					to: (value: any) => {
						return this._showTickValues ? value : '';
					}
				}
			}

			// set again value since min and max can be changed after runing _setRangeFromPips
			if (this.hasAttribute('value')) {
				this.value = this.getAttribute('value') as string;
			}

			// set again valueHigh since min and max can be changed after runing _setRangeFromPips
			if (this.hasAttribute('valuehigh')) {
				this.valueHigh = this.getAttribute('valuehigh') as string;
			}
		}

		//  basic tooltip
		const tooltips =
			this._toolTipShowType === "off"
				? false
				: this._range ? [{ to: this._toolTipDisplayTypeFormatter.bind(this) }, { to: this._toolTipDisplayTypeFormatter.bind(this) }] : [{ to: this._toolTipDisplayTypeFormatter.bind(this) }];

		// The start option sets the number of handles and corresponding start positions.
		const start = this._getStartValue();

		// noUiSlider.Options
		return {
			start,
			animate: false,
			step,
			behaviour,
			connect,
			direction,
			range,
			orientation: this.orientation,
			pips: Object.getOwnPropertyNames(pips).length !== 0 ? pipsOptions : undefined,
			tooltips,
		} as Options
	}

	/**
	 * Returns slider formated range from a pips object
	 * This will set min and max accordingly
	 *
	 * @param {[key:number]:string } pips
	 */
	private _getRangeFromPips(pips: { [key: number]: string }): { [key: string]: number } {
		const range: { [key: string]: number; } = {};

		for (const key in pips) {
			if (pips.hasOwnProperty(key)) {
				// map min entry
				if ((Object.keys(pips)[0]) === key) {
					if (Number(key) === 0) {
						range.min = Number(this.min)
						continue;
					}
					range.min = Number(this.min);
				}

				// map max entry
				if (Object.keys(pips)[Object.keys(pips).length - 1] === key) {
					if (Number(key) === 100) {
						range.max = Number(this.max)
						continue;
					}
					range.max = Number(this.max);
				}

				range[key + '%'] = Number(pips[key]);
			}
		}

		return range;
	}

	private _maybeSetMinAndMaxFromPips(pips: { [key: number]: string }) {
		for (const key in pips) {
			if (pips.hasOwnProperty(key)) {
				// if ticks object contain entry for key = 0 then set min from key value
				if ((Object.keys(pips)[0]) === key &&
					Number(key) === 0) {
					this.min = Number(pips[key]);
				}

				// if ticks object contain entry for key = 100 then set max from key value
				if (Object.keys(pips)[Object.keys(pips).length - 1] === key &&
					Number(key) === 100) {
					this.max = Number(pips[key]);
				}
			}
		}
	}

	/**
	 * Converts _ticks into object
	 *
	 * @private
	 * @returns {(boolean| object)}
	 */
	private _parsedTicks(): boolean | { [key: number]: string } {
		if ('' !== this._ticks
			&& null !== this._ticks
			&& undefined !== this._ticks
		) {
			try {
				const ticksObj = JSON.parse(this._ticks);

				if (ticksObj && typeof ticksObj === "object") {
					return ticksObj;
				}
			} catch (e) {
				return false;
			}
		}

		return false;
	}

	/**
	 * Set valueHigh as dirty
	 *
	 * @private
	 */
	private _setDirtyHigh(): void {
		this._dirtyHigh = true;
		this._cleanHigh = false;
	}

	/**
	 * Set value as dirty
	 *
	 * @private
	 */
	private _setDirtyLow(): void {
		this._dirtyLow = true;
		this._cleanLow = false;
	}

	/**
	 * Set value as clean
	 *
	 * @private
	 */
	private _setCleanLow(): void {
		this._cleanLow = true;
		this._dirtyLow = false;
	}

	/**
	 * Set valueHigh as clean
	 *
	 * @private
	 */
	private _setCleanHigh(): void {
		this._cleanHigh = true;
		this._dirtyHigh = false;
	}

	/**
	 * Format ch5-slider tooltips displayed value
	 *
	 * @private
	 * @param {*} value
	 * @returns {string}
	 */
	private _toolTipDisplayTypeFormatter(value: any): string {
		if (this.toolTipDisplayType === '%') {
			return this._tooltipValueToPercent(value);
		}

		return Math.round(value).toString();
	}

	/**
	 * Format tooltip value as percent of slider range
	 *
	 * @private
	 * @param {*} value
	 * @returns {string}
	 */
	private _tooltipValueToPercent(value: any): string {
		const v: number = Math.round(value);
		if (isNaN(v)) { return value; }

		const percent: number = Math.round((100 * (v - this._min)) / (this._max - this._min));
		return percent.toString() + '%';
	}

	/**
	 * Format 'connect' noUiSlider option
	 *
	 * @private
	 * @returns {boolean[]}
	 */
	private _connectDisplayFormater(): boolean[] {
		if (this.range === true) {
			return [false, true, false];
		}

		// default
		return [true, false]
	}

	/**
	 * Start rcb animation
	 *
	 * @private
	 * @param {number} animationLength
	 * @param {IRcbUpdateValue} value
	 * @param {TCh5SliderHandle} [handle]
	 * @memberof Ch5Slider
	 */
	private _startRcbAnimation(animationLength: number, handle: TCh5SliderHandle): void {
		const styleParams: { [key: string]: string } = {
			'transitionProperty': 'transform',
			'transitionTimingFunction': 'linear'
		};
		styleParams.transitionDuration = animationLength.toString() + 'ms';

		this._setStyleParameters(styleParams);

		// on timer, unset the style properties.
		if (this._animationTimer !== undefined) {
			clearTimeout(this._animationTimer);
			this._animationTimer = undefined;
		}

		// set a flag for what handle is animation
		this._animatingHandle[handle] = true;

		this._animationTimer = window.setTimeout(
			() => this._stopRcbAnimation(handle),
			animationLength
		);
	}

	/**
	 * Stop rcb animation
	 */
	private _stopRcbAnimation(handle: TCh5SliderHandle): void {
		if (this._animationTimer === undefined) {
			return;
		}

		this._animatingHandle[handle] = false;

		clearTimeout(this._animationTimer);
		this._animationTimer = undefined;

		const styleParams: { [key: string]: string } = {
			'transitionProperty': 'none',
			'transitionDuration': '0ms',
			'transitionTimingFunction': 'ease'
		};

		this._setStyleParameters(styleParams);
	}

	private _setStyleParameters(styleParams: { [key: string]: string }) {
		for (const elList of this._tgtEls) {
			for (const itemList of Array.from(elList)) {
				for (const styleName in styleParams) {
					if (styleParams.hasOwnProperty(styleName)) {
						const styleVal: string = styleParams[styleName];
						(itemList.style as any)[styleName] = styleVal;
					}
				}
			}
		}
	}

	/**
	 * Check if both handles animation is stopped
	 *
	 * @private
	 * @returns {boolean}
	 * @memberof Ch5Slider
	 */
	private _canStopAnimation(): boolean {
		if (this._animatingHandle[0] === false && this._animatingHandle[1] === false) {
			return true;
		}

		return false;
	}

	/**
	 * Subscribe to analog signal. This is used for tooltip animation
	 *
	 * @private
	 * @returns
	 * @memberof Ch5Slider
	 */
	private _susbscribeToAnalogSignal() {
		if ('' !== this._subReceiveAnalogValueId || '' === this._receiveStateValueSignal) {
			return;
		}

		const receiveAnalogSignalName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateValueSignal);
		const receiveAnalogSignal: Ch5Signal<number> | null = Ch5SignalFactory.getInstance()
			.getNumberSignal(receiveAnalogSignalName);

		if (null !== receiveAnalogSignal) {
			this._subReceiveAnalogValueId = receiveAnalogSignal.subscribe((value) => {
				if (this._dirtyTimerHandle === null) {
					this._applyTooltipValue(this._tooltip[TCh5SliderHandle.VALUE], value);
				}
				this._tooltipValueFromSignal = value;
			});
		}
	}

	/**
	 * Subscribe to high analog signal. This is used for tooltip animation
	 *
	 * @private
	 * @returns
	 * @memberof Ch5Slider
	 */
	private _susbscribeToAnalogHighSignal() {
		if ('' !== this._subReceiveAnalogValueHighId
			|| '' === this._receiveStateValueSignalHigh
			|| this.range === false) {
			return;
		}

		const receiveAnalogSignalName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateValueSignalHigh);
		const receiveAnalogSignal: Ch5Signal<number> | null = Ch5SignalFactory.getInstance()
			.getNumberSignal(receiveAnalogSignalName);

		if (null !== receiveAnalogSignal) {
			this._subReceiveAnalogValueHighId = receiveAnalogSignal.subscribe((value) => {
				if (this._dirtyTimerHandleHigh === null) {
					this._applyTooltipValue(this._tooltip[TCh5SliderHandle.HIGHVALUE], value);
				}
				this._tooltipHighValueFromSignal = value;
			});
		}
	}

	/**
	 * Unsubscribe from analog signal
	 *
	 * @private
	 * @memberof Ch5Slider
	 */
	private _unsusbscribeFromAnalogSignals() {
		const csf = Ch5SignalFactory.getInstance();
		if ('' !== this._subReceiveAnalogValueId && '' !== this._receiveStateValueSignal) {
			const recSigValName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateValueSignal);
			const sigSelected: Ch5Signal<number> | null = csf.getNumberSignal(recSigValName);

			if (null !== sigSelected) {
				sigSelected.unsubscribe(this._subReceiveAnalogValueId);
				this._subReceiveAnalogValueId = ''
			}
		}

		if ('' !== this._subReceiveAnalogValueHighId && '' !== this._receiveStateValueSignalHigh) {
			const recSigValHighName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateValueSignalHigh);
			const sigSelected: Ch5Signal<number> | null = csf.getNumberSignal(recSigValHighName);

			if (null !== sigSelected) {
				sigSelected.unsubscribe(this._subReceiveAnalogValueHighId);
				this._subReceiveAnalogValueHighId = ''
			}
		}
	}

	/**
	 * Unsubscribe from object signal
	 *
	 * @private
	 * @memberof Ch5Slider
	 */
	private _unsubscribeFromObjectSignals() {
		const csf = Ch5SignalFactory.getInstance();
		if ('' !== this._subReceiveValueId && '' !== this._receiveStateValueSignal) {
			const recSigValName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateValueSignal);
			const sigSelected: Ch5Signal<object> | null = csf.getObjectSignal(recSigValName);

			if (null !== sigSelected) {
				sigSelected.unsubscribe(this._subReceiveValueId);
				this._receiveStateValueSignal = '';
			}
		}

		if ('' !== this._subReceiveValueHighId && '' !== this._receiveStateValueSignalHigh) {
			const recSigHighValName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateValueSignalHigh);
			const sigSelected: Ch5Signal<object> | null = csf.getObjectSignal(recSigHighValName);

			if (null !== sigSelected) {
				sigSelected.unsubscribe(this._subReceiveValueHighId);
				this._receiveStateValueSignalHigh = '';
			}
		}
	}

	private _applyTooltipValue(tooltip: Element, value: number) {
		if (undefined !== tooltip
			&& null !== tooltip
		) {
			tooltip.textContent = this._toolTipDisplayTypeFormatter(value);
		}
	}

	/**
	 * purpose of this function is to calculate the visual value of the slider
	 * while in a ramp.
	 */
	private _calculatedValueWhileInRamp(): number {
		let scalarValue = this._value;

		/*
		* Computing the scalarValue considering a linear progression
		* A line equation is y=mx+b
		* where m is the slope and b is the y intercept
		* Knowing 2 points (x1,y1) and (x2,y2) the slope is m=(y2-y1)/(x2-x1)
		*
		* In our case:
		* y2-y1 is (this._rcbSignalValue.rcb.value-this._rcbSignalValue.rcb.startv)
		* x2-x1 is rcb.time
		* x is currentTime-starttime
		* b is this._rcbSignalValue.rcb.startv
		* y is the value we want to determine ( scalarValue )
		*/
		if (undefined !== this._rcbSignalValue && undefined !== this._rcbSignalValue.rcb.startv && undefined !== this._rcbSignalValue.rcb.startt) {
			const slope = (this._rcbSignalValue.rcb.value - this._rcbSignalValue.rcb.startv) / this._rcbSignalValue.rcb.time;
			const x = (Date.now() - this._rcbSignalValue.rcb.startt);
			scalarValue = Math.round(slope * x + this._rcbSignalValue.rcb.startv);
		}

		return scalarValue;
	}

	/**
	 * purpose of this function is to calculate the visual highValue of the slider
	 * while in a ramp.
	 */
	private _calculatedHighValueWhileInRamp(): number {
		let scalarValue = this._value;

		/*
		* Computing the scalarValue considering a linear progression
		* A line equation is y=mx+b
		* where m is the slope and b is the y intercept
		* Knowing 2 points (x1,y1) and (x2,y2) the slope is m=(y2-y1)/(x2-x1)
		*
		* In our case:
		* y2-y1 is (this._rcbSignalValueHigh.rcb.value-this._rcbSignalValueHigh.rcb.startv)
		* x2-x1 is rcb.time
		* x is currentTime-starttime
		* b is this._rcbSignalValueHigh.rcb.startv
		* y is the value we want to determine ( scalarValue )
		*/
		if (undefined !== this._rcbSignalValueHigh && undefined !== this._rcbSignalValueHigh.rcb.startv && undefined !== this._rcbSignalValueHigh.rcb.startt) {
			const slope = (this._rcbSignalValueHigh.rcb.value - this._rcbSignalValueHigh.rcb.startv) / this._rcbSignalValueHigh.rcb.time;
			const x = (Date.now() - this._rcbSignalValueHigh.rcb.startt);
			scalarValue = Math.round(slope * x + this._rcbSignalValueHigh.rcb.startv);
		}

		return scalarValue;
	}

	private _isRcbValueReceived() {
		return this._rcbSignalValue !== undefined
			&& this._rcbSignalValue.rcb.startv !== undefined
			&& this._rcbSignalValue.rcb.startt !== undefined
	}

	private _isRcbHighValueReceived() {
		return this._rcbSignalValueHigh !== undefined
			&& this._rcbSignalValueHigh.rcb.startv !== undefined
			&& this._rcbSignalValueHigh.rcb.startt !== undefined
	}

	/**
	 * Apply last value received from signal
	 * This is used if in connectedCallback in case that value signal is received before rendering the slider
	 *
	 * @private
	 * @memberof Ch5Slider
	 */
	private _applySignalReceivedBeforeRender() {
		// apply for value
		if (this._rcbSignalValue !== undefined
			&& this._rcbSignalValue.rcb.time !== 0
			&& this._rcbSignalValue.rcb.startv !== undefined
			&& this._rcbSignalValue.rcb.startt !== undefined
		) {
			this._setSliderValue(
				this._rcbSignalValue.rcb.value,
				TCh5SliderHandle.VALUE,
				this._rcbSignalValue.rcb.time - (Date.now() - this._rcbSignalValue.rcb.startt)
			);
		}

		// apply for value high
		if (this._rcbSignalValueHigh !== undefined
			&& this._rcbSignalValueHigh.rcb.time !== 0
			&& this._rcbSignalValueHigh.rcb.startv !== undefined
			&& this._rcbSignalValueHigh.rcb.startt !== undefined
		) {
			this._setSliderValue(
				this._rcbSignalValueHigh.rcb.value,
				TCh5SliderHandle.HIGHVALUE,
				this._rcbSignalValueHigh.rcb.time - (Date.now() - this._rcbSignalValueHigh.rcb.startt)
			);
		}
	}

	private _adjustTooltipValue(handle: TCh5SliderHandle) {
		// this is needed because when slider value is set also tooltip value is set
		// so we need to keep tooltip value from analog singal in order for animation to be consistent
		const index = (handle === TCh5SliderHandle.VALUE) ? TCh5SliderHandle.VALUE : TCh5SliderHandle.HIGHVALUE

		if (undefined !== this._tooltipValueFromSignal && handle === TCh5SliderHandle.VALUE) {
			this._applyTooltipValue(this._tooltip[index], this._tooltipValueFromSignal);
		}

		if (undefined !== this._tooltipHighValueFromSignal && handle === TCh5SliderHandle.HIGHVALUE) {
			this._applyTooltipValue(this._tooltip[index], this._tooltipHighValueFromSignal);
		}
	}

	/**
	 * Get start value of the slider
	 */
	private _getStartValue(): number | number[] {
		let start = (this.range === false) ? this._value : [this._value, this._valueHigh];

		// this is a edge case when signals are received before component is created
		if (!this._wasRendered) {
			start = this._getStartValueWhileInRamp();
		}

		return start;
	}

	/**
	 * Get start slider value while in ramp
	 */
	private _getStartValueWhileInRamp(): number | number[] {
		let value: number;
		let valueHigh: number;

		// received signal for value
		if (undefined !== this._rcbSignalValue
			&& undefined !== this._rcbSignalValue.rcb.startv
			&& this._rcbSignalValue.rcb.time !== 0
		) {
			value = this._calculatedValueWhileInRamp();
		} else {
			value = this._value;
		}

		// received signal for valuehigh
		if (undefined !== this._rcbSignalValueHigh
			&& undefined !== this._rcbSignalValueHigh.rcb.startv
			&& this._rcbSignalValueHigh.rcb.time !== 0
		) {
			valueHigh = this._calculatedHighValueWhileInRamp();
		} else {
			valueHigh = this._valueHigh;
		}

		return this.range ? [value, valueHigh] : value;
	}

	/**
	 * Upgrade the property on this element with the given name.
	 *
	 * @private
	 * @param {string} prop
	 *   The name of a property.
	 */
	private _upgradeProperty(prop: string) {
		if (this.constructor.prototype.hasOwnProperty(prop)) {
			const val = (this as any)[prop];
			delete (this as any)[prop];
			(this as any)[prop] = val;
		}
	}

	//#endregion

}


if (typeof window === "object" && typeof window.customElements === "object"
	&& typeof window.customElements.define === "function") {
	window.customElements.define('ch5-slider', Ch5Slider);
}
