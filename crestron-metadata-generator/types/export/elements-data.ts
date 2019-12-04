// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { CommonData } from "./ch5-common";
import { Ch5Element } from "./ch5-element";

export class ElementsData {
    public common: CommonData;
    public elements: Ch5Element[];

    public static New(): ElementsData {
        const result = new ElementsData();
        result.common = CommonData.New();
        result.elements = [];
        return result;
    }
}
