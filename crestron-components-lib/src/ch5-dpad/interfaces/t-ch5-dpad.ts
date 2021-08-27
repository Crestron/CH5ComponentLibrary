// Copyright (C) 2021 to the present' | 'Crestron Electronics' | 'Inc.
// All rights reserved.
// No part of this software may be reproduced in any form' | 'machine
// or natural' | 'without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

export type TCh5DpadType = 'default' | 'info' | 'text' | 'danger' | 'warning' | 'success' | 'primary' | 'secondary';

export type TCh5DpadShape = 'plus' | 'circle';

export type TCh5DpadStretch = 'both' | 'width' | 'height';

export type TCh5DpadChildBtnType = 'top' | 'bottom' | 'left' | 'right' | 'center';

export type TCh5DpadButtonClassListType = {
    commonBtnClass: string,
    primaryTagClass: string,
    primaryIconClass: string,
    defaultIconClass: string,
    imageClassName: string,
    defaultArrowClass: string
}

export type TCh5DpadConstructorParam = {
    primaryTagClass: string,
    defaultIconClass: string,
    defaultArrowClass: string,
    btnType: TCh5DpadChildBtnType
};