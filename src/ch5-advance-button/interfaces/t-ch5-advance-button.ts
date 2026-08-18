// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

export enum Ch5Alignments {
  Left = 'left',
  Right = 'right',
  Center = 'center',
  Justify = 'justify'
}

// export type KeysMatching<T, V> = { [K in keyof T]: T[K] extends V ? K : never }[keyof T];

export type TCh5AdvanceButtonActionType = 'cancel' | 'submit';

export type TCh5AdvanceButtonCheckboxPosition = 'left' | 'right'; // Ch5Alignments.Left | Ch5Alignments.Right;

export type TCh5AdvanceButtonHorizontalAlignLabel = 'left' | 'right' | 'center';

export type TCh5AdvanceButtonIconPosition = 'first' | 'last' | 'top' | 'bottom';

// TODO in future - try after upgrading typescript version
// export const TCh5AdvanceButtonListOfOrientations = ['horizontal', 'vertical'] as const;
// export type TCh5AdvanceButtonOrientationNew =  typeof TCh5AdvanceButtonListOfOrientations[number];  // 'horizontal' | 'vertical';

export type TCh5AdvanceButtonOrientation = 'horizontal' | 'vertical';

export type TCh5AdvanceButtonShape = 'rounded-rectangle' | 'rectangle' | 'tab' | 'circle' | 'oval';

export type TCh5AdvanceButtonSize = 'regular' | 'x-small' | 'small' | 'large' | 'x-large';

export type TCh5AdvanceButtonStretch = 'both' | 'width' | 'height';

export type TCh5AdvanceButtonType = 'default' | 'primary' | 'info' | 'text' | 'danger' | 'warning' | 'success' | 'secondary';

export type TCh5AdvanceButtonVerticalAlignLabel = 'middle' | 'top' | 'bottom';

export type TCh5AdvanceButtonModeState = 'normal' | 'pressed' | 'selected';

export type TCh5AdvanceButtonBackgroundImageFillType = 'stretch-aspect' | 'stretch' | 'center' | 'tile';

export type TCh5AdvanceButtonIconUrlFillType = 'stretch' | 'stretch-aspect' | 'center' | 'tile' | 'initial';

export type TCh5AdvanceButtonSgIconTheme = 'icons-lg' | 'icons-sm' | 'media-transports-accents' | 'media-transports-light' | 'media-transports-dark';