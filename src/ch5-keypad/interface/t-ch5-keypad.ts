// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

export type TCh5KeypadStretch = 'both' | 'width' | 'height';

export type TCh5KeypadType = 'default' | 'info' | 'text' | 'danger' | 'warning' | 'success' | 'primary' | 'secondary';

export type TCh5KeypadShape = 'rounded-rectangle' | 'rectangle' | 'circle';

export type TCh5KeypadTextOrientation = 'top' | 'right' | 'bottom' | 'left';

export type TCh5KeypadButtonCreateDTO = {
    indexRef: number;
    name: string;
    major: string;
    minor: string;
    className: string;
    iconClass: string[];
    contractName: string;
    contractKey: string;
    joinCountToAdd: string;
    key: string;
    pressed: boolean;
    [key: string]: any;
}

export type TCh5KeypadSize = 'regular' | 'x-small' | 'small' | 'large' | 'x-large';