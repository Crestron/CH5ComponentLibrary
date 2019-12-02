// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

/**
 * function randomFixedInteger generate random number with specified  length
 * @param {number} numberLength
 */
export function randomFixedInteger(numberLength: number): number {
    let randomNumber: number = 0;
    randomNumber = Math.floor(Math.pow(10, numberLength - 1) + Math.random()
        * (Math.pow(10, numberLength) - Math.pow(10, numberLength - 1) - 1));

    return randomNumber;
}