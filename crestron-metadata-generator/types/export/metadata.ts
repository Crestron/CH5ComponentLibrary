// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ElementsData } from "./elements-data";

export class Metadata {
    public htmlElements: ElementsData;
    public ch5Elements: ElementsData;
    public version: string;
    public componentsVersion: string;

    public static New(): Metadata {
        const result = new Metadata();
        result.version = "";
        result.componentsVersion = "";
        result.htmlElements = ElementsData.New();
        result.ch5Elements = ElementsData.New();
        return result;
    }
}



