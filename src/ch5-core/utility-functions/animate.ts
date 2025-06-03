const effects: any = {

    // Back entrances
    backInDown: ["animate__animated", "animate__delay", "animate__backInDown"],
    backInLeft: ["animate__animated", "animate__delay", "animate__backInLeft"],
    backInRight: ["animate__animated", "animate__delay", "animate__backInRight"],
    backInUp: ["animate__animated", "animate__delay", "animate__backInUp"],

    // Back exits
    backOutDown: ["animate__animated", "animate__delay", "animate__backOutDown"],
    backOutLeft: ["animate__animated", "animate__delay", "animate__backOutLeft"],
    backOutRight: ["animate__animated", "animate__delay", "animate__backOutRight"],
    backOutUp: ["animate__animated", "animate__delay", "animate__backOutUp"],

    // Bouncing entrances
    bounceIn: ["animate__animated", "animate__delay", "animate__bounceIn"],
    bounceInDown: ["animate__animated", "animate__delay", "animate__bounceInDown"],
    bounceInLeft: ["animate__animated", "animate__delay", "animate__bounceInLeft"],
    bounceInRight: ["animate__animated", "animate__delay", "animate__bounceInRight"],
    bounceInUp: ["animate__animated", "animate__delay", "animate__bounceInUp"],

    // Bouncing exits
    bounceOut: ["animate__animated", "animate__delay", "animate__bounceOut"],
    bounceOutDown: ["animate__animated", "animate__delay", "animate__bounceOutDown"],
    bounceOutLeft: ["animate__animated", "animate__delay", "animate__bounceOutLeft"],
    bounceOutRight: ["animate__animated", "animate__delay", "animate__bounceOutRight"],
    bounceOutUp: ["animate__animated", "animate__delay", "animate__bounceOutUp"],

    // Fading entrances (extras)
    fadeIn: ["animate__animated", "animate__delay", "animate__fadeIn"],
    fadeInDown: ["animate__animated", "animate__delay", "animate__fadeInDown"],
    fadeInDownBig: ["animate__animated", "animate__delay", "animate__fadeInDownBig"],
    fadeInLeft: ["animate__animated", "animate__delay", "animate__fadeInLeft"],
    fadeInLeftBig: ["animate__animated", "animate__delay", "animate__fadeInLeftBig"],
    fadeInRight: ["animate__animated", "animate__delay", "animate__fadeInRight"],
    fadeInRightBig: ["animate__animated", "animate__delay", "animate__fadeInRightBig"],
    fadeInUp: ["animate__animated", "animate__delay", "animate__fadeInUp"],
    fadeInUpBig: ["animate__animated", "animate__delay", "animate__fadeInUpBig"],
    fadeInTopLeft: ["animate__animated", "animate__delay", "animate__fadeInTopLeft"],
    fadeInTopRight: ["animate__animated", "animate__delay", "animate__fadeInTopRight"],
    fadeInBottomLeft: ["animate__animated", "animate__delay", "animate__fadeInBottomLeft"],
    fadeInBottomRight: ["animate__animated", "animate__delay", "animate__fadeInBottomRight"],

   // fading speed
    fadeInUpBigFast: ["animate__animated", "animate__delay", "animate__fadeInUpBig", "animate__fast"],
    fadeInDownBigFast: ["animate__animated", "animate__delay", "animate__fadeInDownBig", "animate__fast"],
    fadeInSlow: ["animate__animated", "animate__delay", "animate__fadeIn", "animate__slow"],
    fadeInFast: ["animate__animated", "animate__delay", "animate__fadeIn", "animate__fast"],

    // Fading exits (extras)
    fadeOut: ["animate__animated", "animate__delay", "animate__fadeOut"],
    fadeOutDown: ["animate__animated", "animate__delay", "animate__fadeOutDown"],
    fadeOutDownBig: ["animate__animated", "animate__delay", "animate__fadeOutDownBig"],
    fadeOutLeft: ["animate__animated", "animate__delay", "animate__fadeOutLeft"],
    fadeOutLeftBig: ["animate__animated", "animate__delay", "animate__fadeOutLeftBig"],
    fadeOutRight: ["animate__animated", "animate__delay", "animate__fadeOutRight"],
    fadeOutRightBig: ["animate__animated", "animate__delay", "animate__fadeOutRightBig"],
    fadeOutUp: ["animate__animated", "animate__delay", "animate__fadeOutUp"],
    fadeOutUpBig: ["animate__animated", "animate__delay", "animate__fadeOutUpBig"],
    fadeOutTopLeft: ["animate__animated", "animate__delay", "animate__fadeOutTopLeft"],
    fadeOutTopRight: ["animate__animated", "animate__delay", "animate__fadeOutTopRight"],
    fadeOutBottomLeft: ["animate__animated", "animate__delay", "animate__fadeOutBottomLeft"],
    fadeOutBottomRight: ["animate__animated", "animate__delay", "animate__fadeOutBottomRight"],
    
    // fading speed
    fadeOutUpBigFast: ["animate__animated", "animate__delay", "animate__fadeOutUpBig", "animate__fast"],
    fadeOutDownBigFast: ["animate__animated", "animate__delay", "animate__fadeOutDownBig", "animate__fast"],
    fadeOutSlow: ["animate__animated", "animate__delay", "animate__fadeOut", "animate__slow"],
    fadeOutFast: ["animate__animated", "animate__delay", "animate__fadeOut", "animate__fast"],

    // Flippers
    flip: ["animate__animated", "animate__delay", "animate__flip"],
    flipInX: ["animate__animated", "animate__delay", "animate__flipInX"],
    flipInY: ["animate__animated", "animate__delay", "animate__flipInY"],
    flipOutX: ["animate__animated", "animate__delay", "animate__flipOutX"],
    flipOutY: ["animate__animated", "animate__delay", "animate__flipOutY"],

    // Lightspeed
    lightSpeedInRight: ["animate__animated", "animate__delay", "animate__lightSpeedInRight"],
    lightSpeedInLeft: ["animate__animated", "animate__delay", "animate__lightSpeedInLeft"],
    lightSpeedOutRight: ["animate__animated", "animate__delay", "animate__lightSpeedOutRight"],
    lightSpeedOutLeft: ["animate__animated", "animate__delay", "animate__lightSpeedOutLeft"],

    // Rotating entrances
    rotateIn: ["animate__animated", "animate__delay", "animate__rotateIn"],
    rotateInDownLeft: ["animate__animated", "animate__delay", "animate__rotateInDownLeft"],
    rotateInDownRight: ["animate__animated", "animate__delay", "animate__rotateInDownRight"],
    rotateInUpLeft: ["animate__animated", "animate__delay", "animate__rotateInUpLeft"],
    rotateInUpRight: ["animate__animated", "animate__delay", "animate__rotateInUpRight"],

    // Rotating exits
    rotateOut: ["animate__animated", "animate__delay", "animate__rotateOut"],
    rotateOutDownLeft: ["animate__animated", "animate__delay", "animate__rotateOutDownLeft"],
    rotateOutDownRight: ["animate__animated", "animate__delay", "animate__rotateOutDownRight"],
    rotateOutUpLeft: ["animate__animated", "animate__delay", "animate__rotateOutUpLeft"],
    rotateOutUpRight: ["animate__animated", "animate__delay", "animate__rotateOutUpRight"],

    // Specials
    hinge: ["animate__animated", "animate__delay", "animate__hinge"],
    jackInTheBox: ["animate__animated", "animate__delay", "animate__jackInTheBox"],
    rollIn: ["animate__animated", "animate__delay", "animate__rollIn"],
    rollOut: ["animate__animated", "animate__delay", "animate__rollOut"],

    // Zooming entrances (extras)
    zoomIn: ["animate__animated", "animate__delay", "animate__zoomIn"],
    zoomInDown: ["animate__animated", "animate__delay", "animate__zoomInDown"],
    zoomInLeft: ["animate__animated", "animate__delay", "animate__zoomInLeft"],
    zoomInRight: ["animate__animated", "animate__delay", "animate__zoomInRight"],
    zoomInUp: ["animate__animated", "animate__delay", "animate__zoomInUp"],

    // Zooming exits (extras)
    zoomOut: ["animate__animated", "animate__delay", "animate__zoomOut"],
    zoomOutDown: ["animate__animated", "animate__delay", "animate__zoomOutDown"],
    zoomOutLeft: ["animate__animated", "animate__delay", "animate__zoomOutLeft"],
    zoomOutRight: ["animate__animated", "animate__delay", "animate__zoomOutRight"],
    zoomOutUp: ["animate__animated", "animate__delay", "animate__zoomOutUp"],

    // Sliding entrances
    slideInDown: ["animate__animated", "animate__delay", "animate__slideInDown"],
    slideInLeft: ["animate__animated", "animate__delay", "animate__slideInLeft"],
    slideInRight: ["animate__animated", "animate__delay", "animate__slideInRight"],
    slideInUp: ["animate__animated", "animate__delay", "animate__slideInUp"],

    // Sliding exits
    slideOutDown: ["animate__animated", "animate__delay", "animate__slideOutDown"],
    slideOutLeft: ["animate__animated", "animate__delay", "animate__slideOutLeft"],
    slideOutRight: ["animate__animated", "animate__delay", "animate__slideOutRight"],
    slideOutUp: ["animate__animated", "animate__delay", "animate__slideOutUp"],
};

export function setTransition(selectedElement: Element, effectType: string): void {
    if (effectType) {
        const selectedEffect = effects[effectType];
        for (let i = 0; i < selectedEffect.length; i++) {
            selectedElement.classList.add(selectedEffect[i]);
        }
    }
}

export function removeTransition(selectedElement: Element, effectType: string): void {
    if (effectType) {
        const selectedEffect = effects[effectType];
        for (let i = 0; i < selectedEffect.length; i++) {
            selectedElement.classList.remove(selectedEffect[i]);
        }
    }
}