// Copyright (C) 2022 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

export type TCh5SliderHandleShape = 'rounded-rectangle' | 'rectangle' | 'circle' | 'oval';
export enum TCh5SliderHandle { VALUE = 0, HIGHVALUE = 1 };
export type TCh5SliderOrientation = 'horizontal' | 'vertical';
export type TCh5SliderSize = 'regular' | 'x-small' | 'small' | 'large' | 'x-large';
export type TCh5SliderHandleSize = 'regular' | 'x-small' | 'small' | 'large' | 'x-large';
export type TCh5SliderStretch = 'both' | 'height' | 'width';
export type TCh5SliderToolTipShowType = 'off' | 'on' | 'auto';
export type TCh5SliderToolTipDisplayType = '%' | 'value';