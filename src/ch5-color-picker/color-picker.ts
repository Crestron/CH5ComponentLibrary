import * as mycolorpicker from "@raghavendradabbir/mycolorpicker";
import { Subject } from "rxjs";
import Ch5ColorUtils from "../ch5-common/utils/ch5-color-utils";

const LOG_PREFIX = "[ch5-color-picker]";

export class ColorPicker {

  /**
   * Underlying third-party picker instance. Typed as `any` because the
   * upstream `@raghavendradabbir/mycolorpicker` package ships no type
   * declarations. (Replacing this dependency with a maintained color
   * picker is tracked separately.)
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _picker: any = null;

  /**
   * An RxJs observable for the colorChanged property.
   */
  public colorChanged: Subject<number[]>;

  /**
   * True iff the underlying picker was successfully initialised. False
   * here means `setColor()` and `picker` are non-functional — UI should
   * surface that rather than ignoring user input silently.
   */
  public get isReady(): boolean {
    return this._picker !== null;
  }

  constructor(public pickerId: string, newColor: string) {
    this.colorChanged = new Subject<number[]>();
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this._picker = mycolorpicker.hsl(this.pickerId, newColor, []).on('change', (c: any) => {
        const thisColorDiv = document.getElementById(this.pickerId);
        if (thisColorDiv) {
          const queryObj = thisColorDiv.querySelectorAll<HTMLElement>('.oned')[0]?.querySelectorAll<HTMLElement>('.shape')[0];
          if (queryObj) {
            queryObj.style.backgroundColor = "#d8d8d8";
            queryObj.style.borderColor = "#696969";
          }
          const extrasObject = thisColorDiv.querySelectorAll<HTMLElement>('.extras')[0];
          if (extrasObject) extrasObject.style.display = "none";
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const colorObj: any = Ch5ColorUtils.rgbToObj(c.css());
        this.colorChanged?.next([colorObj.red, colorObj.green, colorObj.blue]);
      }).update();
    } catch (e) {
      // Surface the failure. Historical behaviour silently left _picker = null,
      // which made setColor() a no-op and produced no UI feedback. Logging here
      // gives QA and field engineers something to grep for when the picker
      // doesn't render.
      // eslint-disable-next-line no-console
      console.warn(`${LOG_PREFIX} failed to initialise picker for id="${this.pickerId}":`, e);
    }
  }

  public setColor(newColor: string): boolean {
    if (this._picker === null) {
      // eslint-disable-next-line no-console
      console.warn(`${LOG_PREFIX} setColor() called on uninitialised picker id="${this.pickerId}"; ignoring`);
      return false;
    }
    try {
      this._picker.set(newColor);
      return true;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(`${LOG_PREFIX} setColor("${newColor}") threw on picker id="${this.pickerId}":`, e);
      return false;
    }
  }

  public get picker() {
    return this._picker;
  }

}
