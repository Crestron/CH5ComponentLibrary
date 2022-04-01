// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5CommonAttributes } from "../../ch5-common/interfaces/";

/**
 * @ignore
 */
export interface ICH5ImageModeAttributes extends ICh5CommonAttributes {

  /**
   * @documentation
   * [
   * "`url` attribute",
   * "***",
   * "Must be a supported image format, including JPEG, GIF, PNG, SVG, and BMP."
   * ]
   * @name url
   * @attributeType "ImageURL"
   */
  url: string;

}
