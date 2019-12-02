// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5ListTemplate } from "./ch5-list-template";
import { Ch5ListEventManager } from "./ch5-list-event-manager";
import { Ch5ListAnimation } from "./ch5-list-animation";
import { Ch5List } from "./ch5-list";

export abstract class Ch5ListAbstractHelper {

    protected _list: Ch5List = {} as Ch5List;
    protected _templateHelper: Ch5ListTemplate = {} as Ch5ListTemplate;
    protected _eventManager: Ch5ListEventManager = {} as Ch5ListEventManager;
    protected _animationHelper: Ch5ListAnimation = {} as Ch5ListAnimation;

    constructor(list: Ch5List) {
        this._list = list;
    }


    public addTemplateHelper(templateHelper: Ch5ListTemplate) {
        this._templateHelper = templateHelper;
    }

    public addAnimationHelper(animationHelper: Ch5ListAnimation) {
        this._animationHelper = animationHelper;
    }

    public addEventManager(eventManager: Ch5ListEventManager) {
        this._eventManager = eventManager;
    }

}
