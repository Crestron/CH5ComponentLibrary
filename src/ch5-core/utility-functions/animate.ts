const effects: any = {

    // Attention seekers
    bounce: ["animated", "bounce"],
    flash: ["animated", "flash"],
    pulse: ["animated", "pulse"],
    rubberBand: ["animated", "rubberBand"],
    shake: ["animated", "shake"],
    swing: ["animated", "swing"],
    tada: ["animated", "tada"],
    wobble: ["animated", "wobble"],
    jello: ["animated", "jello"],
    heartBeat: ["animated", "heartBeat"],

    // Bouncing entrances
    bounceIn: ["animated", "bounceIn"],
    bounceInDown: ["animated", "bounceInDown"],
    bounceInLeft: ["animated", "bounceInLeft"],
    bounceInRight: ["animated", "bounceInRight"],
    bounceInUp: ["animated", "bounceInUp"],

    // Bouncing exits
    bounceOut: ["animated", "bounceOut"],
    bounceOutDown: ["animated", "bounceOutDown"],
    bounceOutLeft: ["animated", "bounceOutLeft"],
    bounceOutRight: ["animated", "bounceOutRight"],
    bounceOutUp: ["animated", "bounceOutUp"],

    // Fading entrances (extras)
    fadeIn: ["animated", "fadeIn"],
    fadeInDown: ["animated", "fadeInDown"],
    fadeInDownBig: ["animated", "fadeInDownBig"],
    fadeInLeft: ["animated", "fadeInLeft"],
    fadeInLeftBig: ["animated", "fadeInLeftBig"],
    fadeInRight: ["animated", "fadeInRight"],
    fadeInRightBig: ["animated", "fadeInRightBig"],
    fadeInUp: ["animated", "fadeInUp"],
    fadeInUpBig: ["animated", "fadeInUpBig"],
   
    // Fading exits (extras)
    fadeOut: ["animated", "fadeOut"],
    fadeOutDown: ["animated", "fadeOutDown"],
    fadeOutDownBig: ["animated", "fadeOutDownBig"],
    fadeOutLeft: ["animated", "fadeOutLeft"],
    fadeOutLeftBig: ["animated", "fadeOutLeftBig"],
    fadeOutRight: ["animated", "fadeOutRight"],
    fadeOutRightBig: ["animated", "fadeOutRightBig"],
    fadeOutUp: ["animated", "fadeOutUp"],
    fadeOutUpBig: ["animated", "fadeOutUpBig"],
    
    // Flippers
    flip: ["animated", "flip"],
    flipInX: ["animated", "flipInX"],
    flipInY: ["animated", "flipInY"],
    flipOutX: ["animated", "flipOutX"],
    flipOutY: ["animated", "flipOutY"],

    // Lightspeed
    lightSpeedInRight: ["animated", "lightSpeedIn"],
    lightSpeedOut: ["animated", "lightSpeedOut"],

    // Rotating entrances
    rotateIn: ["animated", "rotateIn"],
    rotateInDownLeft: ["animated", "rotateInDownLeft"],
    rotateInDownRight: ["animated", "rotateInDownRight"],
    rotateInUpLeft: ["animated", "rotateInUpLeft"],
    rotateInUpRight: ["animated", "rotateInUpRight"],

    // Rotating exits
    rotateOut: ["animated", "rotateOut"],
    rotateOutDownLeft: ["animated", "rotateOutDownLeft"],
    rotateOutDownRight: ["animated", "rotateOutDownRight"],
    rotateOutUpLeft: ["animated", "rotateOutUpLeft"],
    rotateOutUpRight: ["animated", "rotateOutUpRight"],

    // Specials
    hinge: ["animated", "hinge"],
    jackInTheBox: ["animated", "jackInTheBox"],
    rollIn: ["animated", "rollIn"],
    rollOut: ["animated", "rollOut"],

    // Zooming entrances (extras)
    zoomIn: ["animated", "zoomIn"],
    zoomInDown: ["animated", "zoomInDown"],
    zoomInLeft: ["animated", "zoomInLeft"],
    zoomInRight: ["animated", "zoomInRight"],
    zoomInUp: ["animated", "zoomInUp"],

    // Zooming exits (extras)
    zoomOut: ["animated", "zoomOut"],
    zoomOutDown: ["animated", "zoomOutDown"],
    zoomOutLeft: ["animated", "zoomOutLeft"],
    zoomOutRight: ["animated", "zoomOutRight"],
    zoomOutUp: ["animated", "zoomOutUp"],

    // Sliding entrances
    slideInDown: ["animated", "slideInDown"],
    slideInLeft: ["animated", "slideInLeft"],
    slideInRight: ["animated", "slideInRight"],
    slideInUp: ["animated", "slideInUp"],

    // Sliding exits
    slideOutDown: ["animated", "slideOutDown"],
    slideOutLeft: ["animated", "slideOutLeft"],
    slideOutRight: ["animated", "slideOutRight"],
    slideOutUp: ["animated", "slideOutUp"],
};

export function setTransition(selectedElement: Element, effectType: string): void {
    if (effectType && effectType !== 'null') {
        const selectedEffect = effects[effectType];
        for (let i = 0; i < selectedEffect.length; i++) {
            selectedElement.classList.add(selectedEffect[i]);
        }
    }
}

export function removeTransition(selectedElement: Element, effectType: string): void {
    if (effectType && effectType !== 'null') {
        const selectedEffect = effects[effectType];
        for (let i = 0; i < selectedEffect.length; i++) {
            selectedElement.classList.remove(selectedEffect[i]);
        }
    }
}