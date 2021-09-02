// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { TCh5KeypadBtnCreateDTO } from "./interfaces/t-ch5-keypad";

export class CH5KeypadBtnData {

    /**
     * Function to generate a list of child button DTOs to create and render buttons
     * @returns list of buttons
     */
    public static getBtnList(): TCh5KeypadBtnCreateDTO[] {
        return [
            this.getButtonData('kbtn_one', '1', '&nbsp;'),
            this.getButtonData('kbtn_two', '2', 'ABC'),
            this.getButtonData('kbtn_three', '3', 'DEF'),
            this.getButtonData('kbtn_four', '4', 'GHI'),
            this.getButtonData('kbtn_five', '5', 'JKL'),
            this.getButtonData('kbtn_six', '6', 'MNO'),
            this.getButtonData('kbtn_seven', '7', 'PQRS'),
            this.getButtonData('kbtn_eight', '8', 'TUV'),
            this.getButtonData('kbtn_nine', '9', 'WXYZ'),
            this.getButtonData('mbtn_a', '*', '', 'misc-btn misc-btn-one'),
            this.getButtonData('kbtn_zero', '0', '+'),
            this.getButtonData('mbtn_b', '#', '', 'misc-btn misc-btn-two')
        ];
    }

    /**
     * Function to generate a list of child button DTOs to create and render buttons
     * @returns list of buttons
     */
    public static getBtnList_Extra(): TCh5KeypadBtnCreateDTO[] {
        return [
            this.getButtonData('extra-left', '', '', 'extra-btn'),
            this.getButtonData('extra-center', '', '', 'extra-btn', ['fas', 'fa-phone-alt']),
            this.getButtonData('extra-right', '', '', 'extra-btn'),
        ];
    }

    public static getButtonData(
        name: string, major: string, minor: string,
        className: string = 'number-btn', iconClass: string[] = []
    ): TCh5KeypadBtnCreateDTO {
        return {
            name,
            major,
            minor,
            className,
            iconClass,
            contractName: '' // defaulting contractName to empty
        };
    }
}