// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.


export type TCh5SliderDirection = 'rtl' | 'ltr';
export enum TCh5SliderHandle { VALUE = 0, HIGHVALUE = 1};

export type TCh5SliderOrientation = 'horizontal' | 'vertical';
export type TCh5SliderShape = 'rounded-rectangle' | 'rectangle' | 'circle' | 'oval';

export type TCh5SliderSize = 'regular' | 'x-small' | 'small' | 'large' | 'x-large';

export type TCh5SliderStretch = ''| 'both' | 'width' | 'height';
export type TCh5SliderTooltipDisplay = '%' | 'value';
export type TCh5SliderTooltipType = 'off' | 'on' | 'auto';
