class DataTransferDragDrop {
    private _dropEffect: any;
    private _effectAllowed: any;
    private _data: any;
    constructor() {
        this._dropEffect = 'move';
        this._effectAllowed = 'all';
        this._data = {};
    }

    set dropEffect(value: any) {
        this._dropEffect = value;
    }
    get dropEffect() {
        return this._dropEffect;
    }


    set effectAllowed(value: any) {
        this._effectAllowed = value;
    }
    get effectAllowed() {
        return this._effectAllowed;
    }

    get types() {
        return Object.keys(this._data)
    }

    /**
     * Removes the data associated with a given type.
     *
     * The type argument is optional. If the type is empty or not specified, the data
     * associated with all types is removed. If data for the specified type does not exist,
     * or the data transfer contains no data, this method will have no effect.
     *
     * @param type Type of data to remove.
     */
    clearData(type: any) {
        if (type != null) {
            delete this._data[type];
        }
        else {
            this._data = null;
        }
    };
    /**
     * Retrieves the data for a given type, or an empty string if data for that type does
     * not exist or the data transfer contains no data.
     *
     * @param type Type of data to retrieve.
     */
    getData(type: any) {
        return this._data[type] || '';
    };
    /**
     * Set the data for a given type.
     *
     * For a list of recommended drag types, please see
     * https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Recommended_Drag_Types.
     *
     * @param type Type of data to add.
     * @param value Data to add.
     */
    setData(type: any, value: any) {
        this._data[type] = value;
    };
    /**
     * Set the image to be used for dragging if a custom one is desired.
     *
     * @param img An image element to use as the drag feedback image.
     * @param offsetX The horizontal offset within the image.
     * @param offsetY The vertical offset within the image.
     */
    setDragImage(img: any, offsetX: any, offsetY: any) {
        const ddt = DragDropTouch.getInstance();
        ddt._imgCustom = img;
        ddt._imgOffset = { x: offsetX, y: offsetY };
    }
}

export class DragDropTouch {
    public _imgCustom: any;
    public _imgOffset: any;
    private static instance: DragDropTouch;
    private _lastClick: any;
    private static _THRESHOLD = 5; // pixels to move before drag starts
    private static _OPACITY = 0.5; // drag image opacity
    private static _DBLCLICK = 500; // max ms between clicks in a double click
    private static _CTXMENU = 900; // ms to hold before raising 'contextmenu' event
    private static _ISPRESSHOLDMODE = false; // decides of press & hold mode presence
    private static _PRESSHOLDAWAIT = 400; // ms to wait before press & hold is detected
    private static _PRESSHOLDMARGIN = 25; // pixels that finger might shiver while pressing
    private static _PRESSHOLDTHRESHOLD = 0; // pixels to move before drag starts
    // copy styles/attributes from drag source to drag image element
    private static _rmvAtts = 'id,class,style,draggable'.split(',');
    // synthesize and dispatch an event
    // returns true if the event has been handled (e.preventDefault == true)
    private static _kbdProps = 'altKey,ctrlKey,metaKey,shiftKey'.split(',');
    private static _ptProps = 'pageX,pageY,clientX,clientY,screenX,screenY'.split(',');

    private _dragSource: any;
    private _lastTouch: any;
    private _lastTarget: any;
    private _ptDown: any;
    private _isDragEnabled: any;
    private _isDropZone: any;
    private _dataTransfer = new DataTransferDragDrop();
    private _pressHoldInterval: any;
    private _img: any;

    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new DragDropTouch();
        return this.instance;
    }
    constructor() {
        this._lastClick = 0;
        // enforce singleton pattern

        // detect passive event support
        // https://github.com/Modernizr/Modernizr/issues/1894
        let supportsPassive = false;
        document.addEventListener('test', function () { }, {
            get passive() {
                supportsPassive = true;
                return true;
            }
        });
        // listen to touch events
        if ('ontouchstart' in document) {
            const opt = supportsPassive ? { passive: false, capture: false } : false;
            document.addEventListener('touchstart', this._touchstart.bind(this), opt);
            document.addEventListener('touchmove', this._touchmove.bind(this), opt);
            document.addEventListener('touchend', this._touchend.bind(this));
            document.addEventListener('touchcancel', this._touchend.bind(this));
        }
    }
    private _touchstart(e: TouchEvent) {
        const _this = this;
        if (this._shouldHandle(e)) {
            // raise double-click and prevent zooming
            if (Date.now() - this._lastClick < DragDropTouch._DBLCLICK) {
                if (this._dispatchEvent(e, 'dblclick', e.target)) {
                    if (e.cancelable) {
                        e.preventDefault();
                    }
                    this._reset();
                    return;
                }
            }
            // clear all variables
            this._reset();
            // get nearest draggable element
            const src = this._closestDraggable(e.target);
            if (src) {
                // give caller a chance to handle the hover/move events
                if (!this._dispatchEvent(e, 'mousemove', e.target) &&
                    !this._dispatchEvent(e, 'mousedown', e.target)) {
                    // get ready to start dragging
                    this._dragSource = src;
                    this._ptDown = this._getPoint(e);
                    this._lastTouch = e;
                    if (e.cancelable) {
                        e.preventDefault();
                    }
                    // show context menu if the user hasn't started dragging after a while
                    setTimeout(function () {
                        if (_this._dragSource == src && _this._img == null) {
                            if (_this._dispatchEvent(e, 'contextmenu', src)) {
                                _this._reset();
                            }
                        }
                    }, DragDropTouch._CTXMENU);
                    if (DragDropTouch._ISPRESSHOLDMODE) {
                        this._pressHoldInterval = setTimeout(function () {
                            _this._isDragEnabled = true;
                            _this._touchmove(e);
                        }, DragDropTouch._PRESSHOLDAWAIT);
                    }
                }
            }
        }
    };
    private _touchmove(e: any) {
        if (this._shouldCancelPressHoldMove(e)) {
            this._reset();
            return;
        }
        if (this._shouldHandleMove(e) || this._shouldHandlePressHoldMove(e)) {
            // see if target wants to handle move
            const target = this._getTarget(e);
            if (this._dispatchEvent(e, 'mousemove', target)) {
                this._lastTouch = e;
                if (e.cancelable) {
                    e.preventDefault();
                }
                return;
            }
            // start dragging
            if (this._dragSource && !this._img && this._shouldStartDragging(e)) {
                this._dispatchEvent(e, 'dragstart', this._dragSource);
                this._createImage(e);
                this._dispatchEvent(e, 'dragenter', target);
            }
            // continue dragging
            if (this._img) {
                this._lastTouch = e;
                if (e.cancelable) {
                    e.preventDefault(); // prevent scrolling
                }
                if (target != this._lastTarget) {
                    this._dispatchEvent(this._lastTouch, 'dragleave', this._lastTarget);
                    this._dispatchEvent(e, 'dragenter', target);
                    this._lastTarget = target;
                }
                this._moveImage(e);
                this._isDropZone = this._dispatchEvent(e, 'dragover', target);
            }
        }
    };
    private _touchend(e: any) {
        if (this._shouldHandle(e)) {
            // see if target wants to handle up
            if (this._dispatchEvent(this._lastTouch, 'mouseup', e.target)) {
                if (e.cancelable) {
                    e.preventDefault();
                }
                return;
            }
            // user clicked the element but didn't drag, so clear the source and simulate a click
            if (!this._img) {
                this._dragSource = null;
                this._dispatchEvent(this._lastTouch, 'click', e.target);
                this._lastClick = Date.now();
            }
            // finish dragging
            this._destroyImage();
            if (this._dragSource) {
                if (e.type.indexOf('cancel') < 0 && this._isDropZone) {
                    this._dispatchEvent(this._lastTouch, 'drop', this._lastTarget);
                }
                this._dispatchEvent(this._lastTouch, 'dragend', this._dragSource);
                this._reset();
            }
        }
    };
    // ** utilities
    // ignore events that have been handled or that involve more than one touch
    private _shouldHandle(e: any) {
        return e &&
            !e.defaultPrevented &&
            e.touches && e.touches.length < 2;
    };

    // use regular condition outside of press & hold mode
    private _shouldHandleMove(e: any) {
        return !DragDropTouch._ISPRESSHOLDMODE && this._shouldHandle(e);
    };

    // allow to handle moves that involve many touches for press & hold
    private _shouldHandlePressHoldMove(e: any) {
        return DragDropTouch._ISPRESSHOLDMODE &&
            this._isDragEnabled && e && e.touches && e.touches.length;
    };

    // reset data if user drags without pressing & holding
    private _shouldCancelPressHoldMove(e: any) {
        return DragDropTouch._ISPRESSHOLDMODE && !this._isDragEnabled &&
            this._getDelta(e) > DragDropTouch._PRESSHOLDMARGIN;
    };

    // start dragging when specified delta is detected
    private _shouldStartDragging(e: any) {
        const delta = this._getDelta(e);
        return delta > DragDropTouch._THRESHOLD ||
            (DragDropTouch._ISPRESSHOLDMODE && delta >= DragDropTouch._PRESSHOLDTHRESHOLD);
    }

    // clear all members
    private _reset() {
        this._destroyImage();
        this._dragSource = null;
        this._lastTouch = null;
        this._lastTarget = null;
        this._ptDown = null;
        this._isDragEnabled = false;
        this._isDropZone = false;
        this._dataTransfer = new DataTransferDragDrop();
        clearInterval(this._pressHoldInterval);
    };
    // get point for a touch event
    private _getPoint(e: any) {
        if (e && e.touches) {
            e = e.touches[0];
        }
        return { x: e.clientX, y: e.clientY };
    };
    // get distance between the current touch event and the first one
    private _getDelta(e: any) {
        if (DragDropTouch._ISPRESSHOLDMODE && !this._ptDown) { return 0; }
        const p = this._getPoint(e);
        return Math.abs(p.x - this._ptDown.x) + Math.abs(p.y - this._ptDown.y);
    };
    // get the element at a given touch event
    private _getTarget(e: any) {
        const pt = this._getPoint(e);
        let el = document.elementFromPoint(pt.x, pt.y);
        while (el && getComputedStyle(el).pointerEvents == 'none') {
            el = el.parentElement;
        }
        return el;
    };
    // create drag image from source element
    private _createImage(e: any) {
        // just in case...
        if (this._img) {
            this._destroyImage();
        }
        // create drag image from custom element or drag source
        const src = this._imgCustom || this._dragSource;
        this._img = src.cloneNode(true);
        this._copyStyle(src, this._img);
        this._img.style.top = this._img.style.left = '-9999px';
        // if creating from drag source, apply offset and opacity
        if (!this._imgCustom) {
            const rc = src.getBoundingClientRect(), pt = this._getPoint(e);
            this._imgOffset = { x: pt.x - rc.left, y: pt.y - rc.top };
            this._img.style.opacity = DragDropTouch._OPACITY.toString();
        }
        // add image to document
        this._moveImage(e);
        document.body.appendChild(this._img);
    };
    // dispose of drag image element
    private _destroyImage() {
        if (this._img && this._img.parentElement) {
            this._img.parentElement.removeChild(this._img);
        }
        this._img = null;
        this._imgCustom = null;
    };
    // move the drag image element
    private _moveImage(e: any) {
        const _this = this;
        requestAnimationFrame(function () {
            if (_this._img) {
                const pt = _this._getPoint(e), s = _this._img.style;
                s.position = 'absolute';
                s.pointerEvents = 'none';
                s.zIndex = '999999';
                s.left = Math.round(pt.x - _this._imgOffset.x) + 'px';
                s.top = Math.round(pt.y - _this._imgOffset.y) + 'px';
            }
        });
    };
    // copy properties from an object to another
    private _copyProps(dst: any, src: any, props: any) {
        for (let i = 0; i < props.length; i++) {
            const p = props[i];
            dst[p] = src[p];
        }
    };
    private _copyStyle(src: any, dst: any) {
        // remove potentially troublesome attributes
        DragDropTouch._rmvAtts.forEach(function (att) {
            dst.removeAttribute(att);
        });
        // copy canvas content
        if (src instanceof HTMLCanvasElement) {
            const cSrc = src, cDst = dst;
            cDst.width = cSrc.width;
            cDst.height = cSrc.height;
            cDst.getContext('2d').drawImage(cSrc, 0, 0);
        }
        // copy style (without transitions)
        const cs = getComputedStyle(src);
        for (let i = 0; i < cs.length; i++) {
            const key: any = cs[i];
            if (key.indexOf('transition') < 0) {
                dst.style[key] = cs[key];
            }
        }
        dst.style.pointerEvents = 'none';
        // and repeat for all children
        for (let i = 0; i < src.children.length; i++) {
            this._copyStyle(src.children[i], dst.children[i]);
        }
    };
    private _dispatchEvent(e: any, type: any, target: any) {
        if (e && target) {
            const evt: any = document.createEvent('Event');
            const t = e.touches ? e.touches[0] : e;
            evt.initEvent(type, true, true);
            evt.button = 0;
            evt.which = evt.buttons = 1;
            this._copyProps(evt, e, DragDropTouch._kbdProps);
            this._copyProps(evt, t, DragDropTouch._ptProps);
            evt.dataTransfer = this._dataTransfer;
            target.dispatchEvent(evt);
            return evt.defaultPrevented;
        }
        return false;
    };
    // gets an element's closest draggable ancestor
    private _closestDraggable(e: any) {
        for (; e; e = e.parentElement) {
            if (e.hasAttribute('draggable') && e.draggable) {
                return e;
            }
        }
        return null;
    };
}
