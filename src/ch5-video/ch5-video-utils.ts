import { getAspectRatio } from "../ch5-common/utils/viewport";
import { iElementDimensions } from "../_interfaces/ch5-video/types";

/**
 * Function to calculate the given element's offsetTop, offsetLeft, totalHeight, totalWidth and
 * and return them in the expected format
 * @param ele is the DOM element whose dimensions are calculated and returned
 */
const getParentElementOffsetAndDimension = (ele: Element): iElementDimensions => {
    let totalWidth = ele.clientWidth;
    let totalHeight = ele.clientHeight;
    console.log(ele.className, totalHeight, totalWidth);
    let offsetTop = ele.getBoundingClientRect().top + ele.clientTop;
    let offsetLeft = ele.getBoundingClientRect().left + ele.clientLeft;
    const paddingObj = {
        top: getComputedStyle(ele).getPropertyValue("padding-top"),
        right: getComputedStyle(ele).getPropertyValue("padding-right"),
        bottom: getComputedStyle(ele).getPropertyValue("padding-top"),
        left: getComputedStyle(ele).getPropertyValue("padding-left")
    }
    if (paddingObj.top) {
        offsetTop += parseInt(paddingObj.top, 0);
    }

    if (paddingObj.left) {
        offsetLeft += parseInt(paddingObj.left, 0);
    }

    if (paddingObj.right) {
        totalWidth = ele.clientWidth - (parseInt(paddingObj.right, 0) + parseInt(paddingObj.left, 0));
    }

    if (paddingObj.bottom) {
        totalHeight = ele.clientHeight - (parseInt(paddingObj.bottom, 0) + parseInt(paddingObj.top, 0));
    }
    return {
        offsetLeft,
        offsetTop,
        totalHeight,
        totalWidth
    }
}

/**
 * Returns double digit string based on input number
 * @param n 
 */
const pad = (n: number) => {
    return n < 10 ? ("0" + n) : String(n);
}

/**
 * Gets Timezone Offset
 * @param offset 
 */
const timezoneOffset = (offset: number) => {
    let sign: any;
    if (offset === 0) {
        return "Z";
    }
    sign = (offset > 0) ? "-" : "+";
    offset = Math.abs(offset);
    return sign + pad(Math.floor(offset / 60)) + ":" + pad(offset % 60);
}

/**
 * To get the current timestamp in RFC3339 format
 */
const rfc3339TimeStamp = () => {
    const d = new Date();
    return d.getFullYear() + "-" +
        pad(d.getMonth() + 1) + "-" +
        pad(d.getDate()) + "T" +
        pad(d.getHours()) + ":" +
        pad(d.getMinutes()) + ":" +
        pad(d.getSeconds()) +
        timezoneOffset(d.getTimezoneOffset());
}

/**
 * Get the Aspect Ratio of the video based on the viewport size and returns a sizeObj with width and height as keys
 * @param aspectRatio - has 16:9 or 4:3 as value
 * @param size 
 */
const getAspectRatioForVideo = (aspectRatio: string, size: string) => {
    let sizeObj: { width: number, height: number } = { width: 0, height: 0 };
    let ratioWidth = 16;
    let ratioHeight = 9;
    if (aspectRatio === "16:9") {
        ratioWidth = 16;
        ratioHeight = 9;
    } else if (aspectRatio === "4:3") {
        ratioWidth = 4;
        ratioHeight = 3;
    }
    switch (size) {
        case 'xx-large':
            sizeObj = getAspectRatio(ratioWidth, ratioHeight, 85);
            break;
        case 'x-large':
            sizeObj = getAspectRatio(ratioWidth, ratioHeight, 70);
            break;
        case 'large':
            sizeObj = getAspectRatio(ratioWidth, ratioHeight, 55);
            break;
        case 'small':
            sizeObj = getAspectRatio(ratioWidth, ratioHeight, 40);
            break;
        case 'x-small':
            sizeObj = getAspectRatio(ratioWidth, ratioHeight, 25);
            break;
        default:
            sizeObj = getAspectRatio(ratioWidth, ratioHeight, 55);
            break;
    }
    return sizeObj;
}

const setAttributesBasedValue = (hasAttribute: boolean, valToAssign: any, defaultValue: string) => {
    if (hasAttribute) {
        return valToAssign;
    } else {
        return defaultValue;
    }
}

export const ch5VideoUtils = {
    getParentElementOffsetAndDimension,
    rfc3339TimeStamp,
    getAspectRatioForVideo,
    setAttributesBasedValue
}