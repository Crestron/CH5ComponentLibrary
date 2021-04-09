/**
 * Function to calculate the given element's offsetTop, offsetLeft, totalHeight, totalWidth and
 * and return them in the expected format
 * @param ele is the DOM element whose dimensions are calculated and returned
 */
const getParentElementOffsetAndDimension = (ele: Element) => {
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

export const ch5VideoUtils = {
    getParentElementOffsetAndDimension
}