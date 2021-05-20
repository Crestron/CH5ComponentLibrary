import { getAspectRatio } from "../ch5-common/utils/viewport";
import { TPosDimension, TDimension, iElementDimensions } from "../_interfaces/ch5-video/types";

export class CH5VideoUtils {

    /**
     * Calculate the fullscreen landscape or potrait positons
     * @param aspectRatio Pass the aspect ratio
     * @returns {TPosDimension} returns calculated dimensions
     */
    public static getFullScreenDimensions(aspectRatio: string, width: number, height: number): TPosDimension {
        let sizeObj: TDimension = {} as TDimension;
        let position: { xPos: number, yPos: number } = { xPos: 0, yPos: 0 };
        const fullScreenObj: TPosDimension = {} as TPosDimension;

        sizeObj = CH5VideoUtils.getDisplayWxH(aspectRatio, width, height);
        if (sizeObj.width < width) {
            position = CH5VideoUtils.calculatePillarBoxPadding(width, sizeObj.width);
        } else if (sizeObj.height < height) {
            position = CH5VideoUtils.calculateLetterBoxPadding(height, sizeObj.height);
        }

        fullScreenObj.width = sizeObj.width;
        fullScreenObj.height = sizeObj.height;
        fullScreenObj.posX = position.xPos;
        fullScreenObj.posY = position.yPos;

        return fullScreenObj;
    }

    /**
     * Function to calculate the position based on the fixed size like small, large, medium
     * @param sWidth width available width
     * @param sHeight height available height
     * @param displaySizeObj size of the video to be displayed
     * @returns {obj} calculated position object
     */
    public static getSizeAndPositionForFixedSize = (elem: Element, displaySizeObj: TDimension): any => {
        let position = { xPos: 0, yPos: 0 };
        const elementDimensions: iElementDimensions = CH5VideoUtils.getParentElementOffsetAndDimension(elem);

        if (displaySizeObj.width < elementDimensions.totalWidth) {
            position = CH5VideoUtils.calculatePillarBoxPadding(elementDimensions.totalWidth, displaySizeObj.width);
        } else if (displaySizeObj.height < elementDimensions.totalHeight) {
            position = CH5VideoUtils.calculateLetterBoxPadding(elementDimensions.totalHeight, displaySizeObj.height);
        }

        position.xPos += elementDimensions.offsetLeft;
        position.yPos += elementDimensions.offsetTop;

        return position;
    }

    /**
     * Function to calculate the given element's offsetTop, offsetLeft, totalHeight, totalWidth and
     * and return them in the expected format
     * @param ele is the DOM element whose dimensions are calculated and returned
     */
    public static getParentElementOffsetAndDimension = (ele: Element): iElementDimensions => {
        let totalWidth = ele.clientWidth;
        let totalHeight = ele.clientHeight;
        console.log(ele.className, totalHeight, totalWidth);
        let offsetTop = ele.getBoundingClientRect().top + ele.clientTop;
        let offsetLeft = ele.getBoundingClientRect().left + ele.clientLeft;
        const paddingObj = {
            top: getComputedStyle(ele).getPropertyValue("padding-top"),
            right: getComputedStyle(ele).getPropertyValue("padding-right"),
            bottom: getComputedStyle(ele).getPropertyValue("padding-bottom"),
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
    private static pad = (n: number) => {
        return n < 10 ? ("0" + n) : String(n);
    }

    /**
     * 
     * @returns Boolean
     */
    public static isPortrait = (): boolean => {
        return window.innerHeight > window.innerWidth;
    }

    /**
     * 
     * @returns Boolean
     */
    public static isLandscape = (): boolean => {
        // TODO - Remove the below comments after review
        // window.orientation is no longer recommended. Though some browsers might still support it, it may have already been removed from the relevant web standards.
        // return (window.orientation === 90 || window.orientation === -90);
        return !CH5VideoUtils.isPortrait();
    }

    /**
     * Gets Timezone Offset
     * @param offset 
     */
    private static timezoneOffset = (offset: number) => {
        let sign: any;
        if (offset === 0) {
            return "Z";
        }
        sign = (offset > 0) ? "-" : "+";
        offset = Math.abs(offset);
        return sign + CH5VideoUtils.pad(Math.floor(offset / 60)) + ":" + CH5VideoUtils.pad(offset % 60);
    }

    /**
     * To get the current timestamp in RFC3339 format
     */
    public static rfc3339TimeStamp = () => {
        const d = new Date();
        return d.getFullYear() + "-" +
            CH5VideoUtils.pad(d.getMonth() + 1) + "-" +
            CH5VideoUtils.pad(d.getDate()) + "T" +
            CH5VideoUtils.pad(d.getHours()) + ":" +
            CH5VideoUtils.pad(d.getMinutes()) + ":" +
            CH5VideoUtils.pad(d.getSeconds()) +
            CH5VideoUtils.timezoneOffset(d.getTimezoneOffset());
    }

    /**
     * Get the Aspect Ratio of the video based on the viewport size and returns a sizeObj with width and height as keys
     * @param aspectRatio - has 16:9 or 4:3 as value
     * @param size 
     */
    public static getAspectRatioForVideo = (aspectRatio: string, size: string) => {
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

    public static setAttributesBasedValue = (hasAttribute: boolean, valToAssign: any, defaultValue: string) => {
        if (hasAttribute) {
            return valToAssign;
        } else {
            return defaultValue;
        }
    }

    /**
     * Returns the height for the given width based on the aspect ratio
     * @param aRatio 
     * @param width 
     * @param height
     */
    public static getDisplayWxH = (aRatio: any, width: number, height: number) => {
        let pixelsHeight: number = 0;
        let pixelsWidth: number = 0;
        if (aRatio === '16:9' || aRatio === '') {
            pixelsHeight = Math.round(width / 16 * 9);
            pixelsWidth = Math.round(height / 9 * 16);
            // Check for minimum width and height
            if (width < 256 || height < 144) {
                width = 256; height = 144;
            }
        } else if (aRatio === '4:3') {
            pixelsHeight = Math.round(width / 4 * 3);
            pixelsWidth = Math.round(height / 3 * 4);
            // Check for minimum width and height
            if (width < 192 || height < 144) {
                width = 192; height = 144;
            }
        }
        if (pixelsWidth > width) {
            pixelsWidth = width;
        } else if (pixelsHeight > height) {
            pixelsHeight = height;
        }
        return { width: pixelsWidth, height: pixelsHeight };
    }

    /**
     * Calculate the padding space for aspect ratio 4:3
     * @param availableWidth 
     * @param displayWidth 
     */
    public static calculatePillarBoxPadding = (availableWidth: number, displayWidth: number) => {
        const yPos: number = 0;
        const xPos: number = Math.round((availableWidth - displayWidth) / 2);
        return { xPos, yPos };
    }

    /**
     * Calculate the padding space for aspect ratio 16:9
     * @param availableHeight 
     * @param displayHeight 
     */
    public static calculateLetterBoxPadding = (availableHeight: number, displayHeight: number) => {
        const xPos: number = 0;
        const yPos: number = Math.round((availableHeight - displayHeight) / 2);
        return { xPos, yPos };
    }

    /**
     * 
     * @returns Function to get the position of the current video element w.r.t the viewport
     */
    public static getVideoElementOffset(el: HTMLElement) {
        const rect = el.getBoundingClientRect();
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
    }

}
