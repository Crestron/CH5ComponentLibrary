// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { TCh5KeypadButtonCreateDTO } from "./interfaces/t-ch5-keypad";

export class CH5KeypadButtonData {
    private static numberTypeBtnCssClass = 'number-btn';
    private static miscOneBtnCssClass = 'misc-btn misc-btn-one';
    private static miscTwoBtnCssClass = 'misc-btn misc-btn-two';
    private static specialBtnCssClass = 'extra-btn special-center';
    /**
     * Function to generate a list of child button DTOs to create and render buttons
     * @returns list of buttons
     */
    public static getBtnList(
        runtimeChildButtonList: { [key: string]: TCh5KeypadButtonCreateDTO; },
        parentContractName: string,
        sendEventOnClickStartVal: string
    ): TCh5KeypadButtonCreateDTO[] {
        // populate by merging existing controls
        const retArr: TCh5KeypadButtonCreateDTO[] = [];
        const majors: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];
        const minors: string[] = ['&nbsp;', 'ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQRS', 'TUV', 'WXYZ', '', '+', ''];
        const contractList: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Star', '0', 'Hash'];
        const joinCountList: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 9, 11]; // STAR is 10, ZERO is 9, when it comes to serial joins
        const classNameList: string[] = ['', '', '', '', '', '', '', '', '', this.miscOneBtnCssClass, '', this.miscTwoBtnCssClass];

        for (let i = 0; i < majors.length; i++) {
            const name = 'button' + contractList[i];
            let toMerge = {};
            if (runtimeChildButtonList.hasOwnProperty(name)) {
                toMerge = runtimeChildButtonList[name];
            }
            const contractName = parentContractName.length > 0 ? (parentContractName + '.Press' + contractList[i]) : '';
            const className = classNameList[i].length > 0 ? classNameList[i] : this.numberTypeBtnCssClass;
            const joinCount = (contractName.length === 0 && sendEventOnClickStartVal.length > 0) ?
                parseInt(sendEventOnClickStartVal, 10) + joinCountList[i] : sendEventOnClickStartVal;
            const obj: TCh5KeypadButtonCreateDTO = {
                indexRef: i,
                name,
                major: majors[i],
                minor: minors[i],
                className,
                iconClass: [],
                contractName,
                contractKey: contractList[i],
                joinCountToAdd: joinCount.toString(),
                key: '',
                ...toMerge
            };

            // If none major and minor are set, use default values
            if (!obj.major && !obj.minor) {
                obj.major = majors[i];
                obj.minor = minors[i];
            }

            retArr.push(obj);
        }
        return retArr;
    }

    /**
     * Function to generate a list of child button DTOs to create and render buttons
     * @returns list of buttons
     */
    public static getBtnList_Extra(
        runtimeChildButtonList: { [key: string]: TCh5KeypadButtonCreateDTO; },
        parentContractName: string,
        sendEventOnClickStartVal: string = ''
    ): TCh5KeypadButtonCreateDTO[] {
        // populate by merging existing controls
        // DEV NOTE: below set of commented variables allow two extra buttons as part of the 5th row, if required
        // const nameList: string[] = ['left', 'center', 'right'];
        // const contractList: string[] = ['Star', 'ExtraButton', 'Hash'];
        // const classNameList: string[] = ['extra-btn empty-btn', 'extra-btn special-center', 'extra-btn empty-btn'];
        const retArr: TCh5KeypadButtonCreateDTO[] = [];
        const nameList: string[] = ['center'];
        const contractList: string[] = ['ExtraButton'];
        const classNameList: string[] = [this.specialBtnCssClass];
        const joinIndex: number = 12;
        for (let i = 0; i < nameList.length; i++) {
            const name: string = 'button' + nameList[i];
            let toMerge = {};
            if (runtimeChildButtonList.hasOwnProperty(name)) {
                toMerge = runtimeChildButtonList[name];
            }
            const contractName = parentContractName.length > 0 ? (parentContractName + '.Press' + contractList[i]) : '';
            const joinCount = (sendEventOnClickStartVal.length > 0) ?
                parseInt(sendEventOnClickStartVal, 10) + joinIndex : sendEventOnClickStartVal;
            const obj: TCh5KeypadButtonCreateDTO = {
                indexRef: joinIndex,
                name,
                major: '',
                minor: '',
                className: classNameList[i],
                iconClass: ['fas', 'fa-phone-alt'],
                contractName,
                contractKey: contractList[i],
                joinCountToAdd: joinCount.toString(),
                key: '',
                ...toMerge
            };
            retArr.push(obj);
        }

        return retArr;
    }

    public static getChildBtnDTOFromElement(ele: Element, contractName: string, sendEventOnClickStart: string): TCh5KeypadButtonCreateDTO {
        let obj: TCh5KeypadButtonCreateDTO = {} as TCh5KeypadButtonCreateDTO;
        const key = ele.getAttribute('key');
        const index = (!!key && key.length > 0) ? key.replace('button', '') : null;
        if (index !== null) {
            const contractList: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Star', '0', 'Hash', 'ExtraButton'];
            const indexRef = this.getIndexRefForChildBtn(index);
            const major = ele.getAttribute('labelmajor');
            const minor = ele.getAttribute('labelminor');
            const className = this.getClassNameForChildBtn(ele.getAttribute('classlist'), indexRef);
            const iconClass = ele.getAttribute('iconclass');
            const contractKey = contractList[indexRef];
            const joinCountToAdd = (contractName.length === 0 && sendEventOnClickStart.length > 0) ?
                (parseInt(sendEventOnClickStart, 10) + index + '') : '';

            obj = {
                indexRef,
                name: 'button' + contractKey,
                major: !!major ? major : '',
                minor: !!minor ? minor : '',
                className,
                iconClass: !!iconClass ? iconClass.split(' ') : [],
                contractName,
                contractKey,
                joinCountToAdd,
                key: !!key ? key : '',
            }
        }
        return obj;
    }

    private static getIndexRefForChildBtn(str: string) {
        let ret: number = -1;
        switch (str.toLowerCase()) {
            case 'star':
                ret = 9;
                break;
            case '0': // this is special because its after 'Star' character
                ret = 10;
                break;
            case 'hash':
                ret = 11;
                break;
            case 'center':
                ret = 12;
                break;
            default:
                ret = parseInt(str, 10) - 1;
                break;
        }
        return ret;
    }

    private static getClassNameForChildBtn(existingClassList: string | null, index: number) {
        const ret = !!existingClassList ? [existingClassList] : [];
        if (index > -1 && index < 9 || index === 10) {
            ret.push(this.numberTypeBtnCssClass);
        } else if (index === 9) {
            ret.push(this.miscOneBtnCssClass);
        } else if (index === 11) {
            ret.push(this.miscTwoBtnCssClass);
        } else if (index === 12) {
            ret.push(this.specialBtnCssClass);
        }
        return ret.join(' ');
    }
}