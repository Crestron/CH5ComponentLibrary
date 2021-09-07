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
    public static getBtnList(parentContractName: string = ''): TCh5KeypadBtnCreateDTO[] {
        const retArr: TCh5KeypadBtnCreateDTO[] = [];
        const majors: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];
        const minors: string[] = ['&nbsp;', 'ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQRS', 'TUV', 'WXYZ', '', '+', ''];
        const contractList: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Star', '0', 'Hash'];
        const classNameList: string[] = ['', '', '', '', '', '', '', '', '', 'misc-btn misc-btn-one', '', 'misc-btn misc-btn-two'];
        for (let i = 0; i < majors.length; i++) {
            const contractName = parentContractName.length > 0 ? (parentContractName + '.Press' + contractList[i]) : '';
            const className = classNameList[i].length > 0 ? classNameList[i] : 'number-btn';
            const obj: TCh5KeypadBtnCreateDTO = {
                name: 'kbtn' + i,
                major: majors[i],
                minor: minors[i],
                className,
                iconClass: [],
                contractName
            };
            retArr.push(obj);
        }
        return retArr;
    }

    /**
     * Function to generate a list of child button DTOs to create and render buttons
     * @returns list of buttons
     */
    public static getBtnList_Extra(parentContractName: string): TCh5KeypadBtnCreateDTO[] {
        const retArr: TCh5KeypadBtnCreateDTO[] = [];
        const nameList: string[] = ['left', 'center', 'right'];
        const contractList: string[] = ['Star', 'ExtraButton', 'Hash'];
        const classNameList: string[] = ['extra-btn empty-btn', 'extra-btn special-center', 'extra-btn empty-btn'];
        for (let i = 0; i < nameList.length; i++) {
            const contractName = parentContractName.length > 0 ? (parentContractName + '.Press' + contractList[i]) : '';
            const obj: TCh5KeypadBtnCreateDTO = {
                name: 'extra' + nameList[i],
                major: '',
                minor: '',
                className: classNameList[i],
                iconClass: (i.toString() === '1') ? ['fas', 'fa-phone-alt'] : [],
                contractName
            };
            retArr.push(obj);
        }

        return retArr;
    }
}