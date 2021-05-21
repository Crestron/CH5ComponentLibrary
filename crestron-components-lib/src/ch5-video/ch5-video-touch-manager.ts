import { TVideoTouchManagerParams } from "../_interfaces/ch5-video/types";

/**
 * This class is designed to handle the touch events on document and update the video component as required
 */
export class Ch5VideoTouchManager {

    private customOnTouchHandlers: TVideoTouchManagerParams;

    public constructor(params: TVideoTouchManagerParams) {
        this._onTouchStart = this._onTouchStart.bind(this);
        document.addEventListener('touchstart', this._onTouchStart);
        this._onTouchMove = this._onTouchMove.bind(this);
        document.addEventListener('touchmove', this._onTouchMove);
        this._onTouchEnd = this._onTouchEnd.bind(this);
        document.addEventListener('touchend', this._onTouchEnd);
        this._onTouchCancel = this._onTouchCancel.bind(this);
        document.addEventListener('touchcancel', this._onTouchCancel);
        this.customOnTouchHandlers = this.updateHandlersIfUnavailable(params);
    }

    /**
     * Function to update the usable custom onTouchHandlers if any
     * @param params params passed while creating usable objects
     * @returns 
     */
    private updateHandlersIfUnavailable(params: TVideoTouchManagerParams): TVideoTouchManagerParams {
        const retObj: TVideoTouchManagerParams = {
            pollingDuration: this.checkAndReturnDefault(params.pollingDuration, 300),
            onTouchStartHandler: this.checkAndReturnDefault(params.onTouchStartHandler, () => { console.log('empty onTouchStartHandler'); }),
            onTouchMoveHandler: this.checkAndReturnDefault(params.onTouchMoveHandler, () => { console.log('empty onTouchMoveHandler'); }),
            onTouchEndHandler: this.checkAndReturnDefault(params.onTouchEndHandler, () => { console.log('empty onTouchEndHandler'); }),
            onTouchCancelHandler: this.checkAndReturnDefault(params.onTouchCancelHandler, () => { console.log('empty onTouchCancelHandler'); }),
            componentID: params.componentID
        };

        return retObj;
    }

    /**
     * Function to handle the touch start on document node
     * @param event Event object
     */
    private _onTouchStart(event: Event): void {
        console.log('Ch5VideoTouch ', `_onTouchStart(${event.type})`);
        this.customOnTouchHandlers.onTouchStartHandler();
    }

    /**
     * Function to handle the touch move on document node
     * @param event Event object
     */
    private _onTouchMove(event: Event): void {
        console.log('Ch5VideoTouch ', `_onTouchMove(${event.type})`);
        this.customOnTouchHandlers.onTouchMoveHandler();
    }

    /**
     * Function to handle the touch end on document node
     * @param event Event object
     */
    private _onTouchEnd(event: Event): void {
        console.log('Ch5VideoTouch ', `_onTouchEnd(${event.type})`);
        this.customOnTouchHandlers.onTouchEndHandler();
    }

    /**
     * Function to handle the touch cancel on document node
     * @param event Event object
     */
    private _onTouchCancel(event: Event): void {
        console.log('Ch5VideoTouch ', `_onTouchCancel(${event.type})`);
        this.customOnTouchHandlers.onTouchCancelHandler();
    }

    /**
     * Function to check if param exists, otherwsie returns a default value.
     * @param item is the param to be compared with
     * @param defaultVal is the value assigned as a return element if item was unavailable
     * @returns the default or item based on the checks
     */
    private checkAndReturnDefault(item: any, defaultVal: any) {
        if (item !== null && typeof (item) !== 'undefined' && !!item) {
            return item;
        } else {
            return defaultVal;
        }
    }

    /**
     * Function to unbind event handlers from touch
     */
    public destructor() {
        document.removeEventListener('touchstart', this._onTouchStart);
        document.removeEventListener('touchmove', this._onTouchMove);
        document.removeEventListener('touchend', this._onTouchEnd);
        document.removeEventListener('touchcancel', this._onTouchCancel);
    }
}