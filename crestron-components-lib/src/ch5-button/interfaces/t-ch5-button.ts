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

export type TCh5ButtonActionType = 'cancel' | 'submit';

export type TCh5ButtonCheckboxPosition = 'left' | 'right'; // Ch5Alignments.Left | Ch5Alignments.Right;

export type TCh5ButtonHorizontalAlignLabel = 'left' | 'right' | 'center' | 'justify';

export type TCh5ButtonIconPosition = 'first' | 'last' | 'top' | 'bottom';

export type TCh5ButtonOrientation = 'horizontal' | 'vertical';

export type TCh5ButtonShape = 'rounded-rectangle' | 'rectangle' | 'tab' | 'circle' | 'oval';

export type TCh5ButtonSize = 'regular' | 'x-small' | 'small' | 'large' | 'x-large';

export type TCh5ButtonStretch = 'both' | 'width' | 'height';

export type TCh5ButtonType = 'default' | 'primary' | 'info' | 'text' | 'danger' | 'warning' | 'success' | 'secondary';

export type TCh5ButtonVerticalAlignLabel = 'start' | 'end' | 'center' | 'baseline';