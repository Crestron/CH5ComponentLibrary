export default class Ch5ColorUtils {
  /**
   * get Digital Value
   * @param color 
   * @param maxValue 
   * @returns Math.round(color/(maxValue/255)) 
   */
  static getDigitalValue = (analog: number, maxValue: number): number => {
    const digital = analog / (maxValue / 255);
    return Math.round(digital);
  };

  static getAnalogValue = (digital: number, maxValue: number): number => {
    const analog = digital * maxValue / 255;
    return Math.round(analog);
  };

  /**
   * color To RGB string[]
   * using String.prototype.substring() to retrieve
   * the substring between the indices of the opening
   * and closing parentheses.
   * We find the index of the opening
   * parenthesis, and add 1 to that index
   * so that the substring starts after that
   * parenthesis.
   * And terminating the substring at the
   * index of the closing parenthesis:
   * here we split that substring on occurrence
   * of a comma followed by zero or more white-space characters.
   * @param color RGB(255,255,255)
   * @returns [255,255,255]
   */
  static rgbFormat = (color: string): string[] => {
    const rgb: string[] = color.substring(color.indexOf('(') + 1, color.lastIndexOf(')')).split(/,\s*/);
    return rgb;
  };

  public static rgbToHex(red: number, green: number, blue: number) {
    let r = red.toString(16);
    let g = green.toString(16);
    let b = blue.toString(16);

    if (r.length === 1) {
      r = "0" + r;
    }
    if (g.length === 1) {
      g = "0" + g;
    }
    if (b.length === 1) {
      b = "0" + b;
    }
    return "#" + r + g + b;
  }

  public static checkHex(hex: string) {
    const hexRegex = /^[#]*([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i;
    if (hexRegex.test(hex)) {
      return true;
    }
    return false;
  }

  public static checkRgb(rgb: string) {
    const rgbRegex = /([R][G][B][A]?[(]\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])(\s*,\s*((0\.[0-9]{1})|(1\.0)|(1)))?[)])/i;
    if (rgbRegex.test(rgb)) {
      return true
    }
    return false;
  }

  public static modifyHex(hex: string) {
    if (hex.length === 4) {
      hex = hex.replace('#', '');
    }
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    return hex;
  }

  public static hexToRgb(hex: string) {
    const rgbValue: number[] = [];
    hex = hex.replace('#', '');
    if (hex.length !== 6) {
      hex = this.modifyHex(hex);
    }
    rgbValue.push(parseInt(hex.slice(0, 2), 16));
    rgbValue.push(parseInt(hex.slice(2, 4), 16));
    rgbValue.push(parseInt(hex.slice(4, 6), 16));
    return "rgb(" + rgbValue.toString() + ")";
  }

  public static validateColorName(color: string) {
    try {
      const validator = new Option().style;
      validator.color = color;

      // Check if the computed color is the same as the input color
      return typeof validator.color === "string" && validator.color.length > 0;
    } catch (e) {
      //
    }
    return false;
  }

  public static convert(color: string) {
    const fakeDiv = document.createElement("div");
    fakeDiv.style.color = color;
    document.body.appendChild(fakeDiv);
    const divCS = window.getComputedStyle(fakeDiv);
    const rgbValue = divCS.getPropertyValue("color");
    document.body.removeChild(fakeDiv);
    return rgbValue;
  }

  public static col2rgb(color: string) {
    if (this.checkRgb(color) === true) {
      return this.rgbFormat(color);
    }
    if (this.checkHex(color) === true) {
      return this.rgbFormat(this.hexToRgb(color));
    }
    const colorVal = this.convert(color);
    return this.rgbFormat(colorVal);
  }

  public static col2hex(color: string) {
    let colorVal = color;
    if (colorVal.toString().toLowerCase() === "transparent") {
      return "#0000";
    }
    if (this.checkHex(color) === false) {
      if (this.checkRgb(color) === false) {
        colorVal = this.convert(color);
      }
      return this.rgbToHex(parseInt(this.rgbFormat(colorVal)[0]), parseInt(this.rgbFormat(colorVal)[1]), parseInt(this.rgbFormat(colorVal)[2]));
    } else {
      return color;
    }
  }

  public static rgbToObj(rgb: string) {
    const colors = ["red", "green", "blue", "alpha"];
    const colorArr = rgb.slice(
      rgb.indexOf("(") + 1,
      rgb.indexOf(")")
    ).split(",");

    const obj: any = {};
    colorArr.forEach((item, index) => {
      obj[colors[index]] = Number(item.trim());
    });
    return obj;
  }

}