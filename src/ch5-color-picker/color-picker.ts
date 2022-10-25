import * as colorjoe from "colorjoe";

export class ColorPicker {

  private joe: any = null; // colorjoe;

  private _isPickerReady: boolean = false;

  constructor(public pickerId: string) {
    // this.joe.set = function (c:any) {
    //   console.log("C", c);
    // }
  }

  public initialize(newColor: string) {
    this._isPickerReady = true;
    try {
      // 'currentColor',
      // 'hex'
      this.joe = colorjoe.hsl(this.pickerId, newColor, [
      ]).on('change', (c: any) => {
        const complement = this.invertHex(c.hex());
        const thisColorDiv = document.getElementById(this.pickerId);
        if (thisColorDiv) {
          const queryObj = thisColorDiv.querySelectorAll<HTMLElement>('.oned')[0].querySelectorAll<HTMLElement>('.shape')[0];
          // console.log("queryObj", c.hex(), c.css(), c.hsl(), c.hsv());
          queryObj.style.backgroundColor = "#d8d8d8"; // c.css();
          queryObj.style.borderColor = "#696969"; // complement;
          const extrasObject = thisColorDiv.querySelectorAll<HTMLElement>('.extras')[0];
          extrasObject.style.display = "none";
        }
      }).update();
      // this.joe.set =  (c: any) => {
      //   console.log("C", c);
      // }
    } catch (e) {
      // Do Nothing
    }
  }

  private invertHex(hex: string) {
    return '#' + hex.match(/[a-f0-9]{2}/ig)?.map(e => (255 - parseInt(e, 16) || 0).toString(16).replace(/^([a-f0-9])$/, '0$1')).join(''); // (Number(`0x1${hex}`) ^ 0xFFFFFF).toString(16).substr(1).toUpperCase()
  }

  public setColor(newColor: string): Promise<boolean> {
    return new Promise(resolve => {
      try {
        // this.colorPickerObject.set(newColor);
        this.joe.set(newColor);
      } catch (e) {
        // Do Nothing
      }
      resolve(true);
    });
  }
  public get isPickerReady() {
    return this._isPickerReady;
  }

  public get picker() {
    return this.joe;
  }

}