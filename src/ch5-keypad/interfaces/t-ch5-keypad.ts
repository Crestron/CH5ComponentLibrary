// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

export type TCh5KeypadStretch = 'both' | 'width' | 'height';

export type TCh5KeypadType = 'default' | 'primary' | 'info' | 'text' | 'danger' | 'warning' | 'success' | 'secondary';

export type TCh5KeypadShape = 'rounded-rectangle' | 'square' | 'circle';

export type TCh5KeypadTextOrientation = 'top' | 'right' | 'bottom' | 'left';

export type TKeypadButtonDefault = {
    key: string,
    iconClass: string,
    labelMajor: string,
    labelMinor: string,
    pressed: boolean,
    index: number,
    defaultClasses: string[],
    sendEventOnClick: string
}

export type TCh5KeypadSize = 'regular' | 'x-small' | 'small' | 'large' | 'x-large';