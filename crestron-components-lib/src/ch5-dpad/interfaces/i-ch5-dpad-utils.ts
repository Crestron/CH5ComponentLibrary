// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

/**
 * @ignore
 * DEV NOTE: This file is specific for utils and need not be part of documentation
 */
export interface ICh5DpadContract {
    centerBtn: ICenterBtnContract,
    topBtn: ITopBtnContract,
    rightBtn: IRightBtnContract,
    bottomBtn: IBottomBtnContract,
    leftBtn: ILeftBtnContract,
}
// Center
export interface ICenterBtnContract {
    CenterShow: string,
    CenterEnable: string,
    CenterClicked: string,
    CenterLabel: string,
    CenterIconClass: string,
    CenterIconUrl: string
}
// Top
export interface ITopBtnContract {
    TopShow: string,
    TopEnable: string,
    TopClicked: string,
    TopIconClass: string,
    TopIconUrl: string
}
// Right
export interface IRightBtnContract {
    RightShow: string,
    RightEnable: string,
    RightClicked: string,
    RightIconClass: string,
    RightIconUrl: string
}
// Bottom
export interface IBottomBtnContract {
    BottomShow: string,
    BottomEnable: string,
    BottomClicked: string,
    BottomIconClass: string,
    BottomIconUrl: string
}
// Left
export interface ILeftBtnContract {
    LeftShow: string,
    LeftEnable: string,
    LeftClicked: string,
    LeftIconClass: string,
    LeftIconUrl: string
}