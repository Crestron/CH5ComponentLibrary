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

export type TCh5AdvancedButtonActionType = 'cancel' | 'submit';

export type TCh5AdvancedButtonCheckboxPosition = 'left' | 'right'; // Ch5Alignments.Left | Ch5Alignments.Right;

export type TCh5AdvancedButtonHorizontalAlignLabel = 'left' | 'right' | 'center';

export type TCh5AdvancedButtonIconPosition = 'first' | 'last' | 'top' | 'bottom';

// TODO in future - try after upgrading typescript version
// export const TCh5AdvancedButtonListOfOrientations = ['horizontal', 'vertical'] as const;
// export type TCh5AdvancedButtonOrientationNew =  typeof TCh5AdvancedButtonListOfOrientations[number];  // 'horizontal' | 'vertical';

export type TCh5AdvancedButtonOrientation = 'horizontal' | 'vertical';

export type TCh5AdvancedButtonShape = 'rounded-rectangle' | 'rectangle' | 'tab' | 'circle' | 'oval';

export type TCh5AdvancedButtonSize = 'regular' | 'x-small' | 'small' | 'large' | 'x-large';

export type TCh5AdvancedButtonStretch = 'both' | 'width' | 'height';

export type TCh5AdvancedButtonType = 'default' | 'primary' | 'info' | 'text' | 'danger' | 'warning' | 'success' | 'secondary';

export type TCh5AdvancedButtonVerticalAlignLabel = 'middle' | 'top' | 'bottom';

export type TCh5AdvancedButtonModeState = 'normal' | 'pressed' | 'selected';

export type TCh5AdvancedButtonBackgroundImageFillType = 'stretch-aspect' | 'stretch' | 'center' | 'tile';

export type TCh5AdvancedButtonIconUrlFillType = 'stretch' | 'stretch-aspect' | 'center' | 'tile' | 'initial';

export type TCh5AdvancedButtonSgIconTheme = 'icons-lg' | 'icons-sm' | 'media-transports-accents' | 'media-transports-light' | 'media-transports-dark';