// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

/**
 * Define the display sizes of the video.
 */
export type TDimension = {
    width: number;
    height: number;
}

export type TAspectRatio = {
    "xx-large": TDimension;
    "x-large": TDimension;
    "large": TDimension;
    "small": TDimension;
    "x-small": TDimension;
}
