// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { TAspectRatio } from "../_interfaces/ch5-video/types";

/**
 * Aspect Ratio Sizes for 16:9 Resolution
 */
export const aspectRatio16x9: TAspectRatio = {
    "xx-large": { width: 1920, height: 1080 },
    "x-large": { width: 1280, height: 720 },
    "large": { width: 1024, height: 576 },
    "regular": { width: 768, height: 432 },
    "small": { width: 512, height: 288 },
    "x-small": { width: 256, height: 144 }
}

/**
 * Aspect Ratio Sizes for 4:3 Resolution
 */
export const aspectRatio4x3: TAspectRatio = {
    "xx-large": { width: 1440, height: 1080 },
    "x-large": { width: 960, height: 720 },
    "large": { width: 768, height: 576 },
    "regular": { width: 576, height: 432 },
    "small": { width: 384, height: 288 },
    "x-small": { width: 192, height: 144 }
}
