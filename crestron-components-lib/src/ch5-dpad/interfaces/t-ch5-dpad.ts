// Copyright (C) 2018 to the present' | 'Crestron Electronics' | 'Inc.
// All rights reserved.
// No part of this software may be reproduced in any form' | 'machine
// or natural' | 'without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5DpadBottom } from "../ch5-dpad-button-bottom";
import { Ch5DpadCenter } from "../ch5-dpad-button-center";
import { Ch5DpadLeft } from "../ch5-dpad-button-left";
import { Ch5DpadRight } from "../ch5-dpad-button-right";
import { Ch5DpadTop } from "../ch5-dpad-button-top";
import { IBottomBtnContract, ICenterBtnContract, ILeftBtnContract, IRightBtnContract, ITopBtnContract } from "./i-ch5-dpad-utils";


export type TDpadChildElement = Ch5DpadCenter | Ch5DpadLeft | Ch5DpadRight | Ch5DpadTop | Ch5DpadBottom;

export type TDpadChildElementContract = ICenterBtnContract | ILeftBtnContract | IRightBtnContract | ITopBtnContract | IBottomBtnContract;

export type TCh5DpadType = 'default' | 'info' | 'text' | 'danger' | 'warning' | 'success' | 'primary' | 'secondary';

export type TCh5DpadShape = 'plus' | 'circle';

export type TCh5DpadStretch = 'both' | 'width' | 'height';

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

/*
compName: 'ch5-dpad-button-center',
primaryTagClass: 'center',
defaultIconClass: 'fa-caret-center',
defaultArrowClass: 'direction-btn',
btnType: 'center',
primaryCssClass: 'ch5-dpad-button-center',
cssClassPrefix: 'ch5-dpad-button-center'
*/

export type TCh5DpadChildBtnType = 'top' | 'bottom' | 'left' | 'right' | 'center';