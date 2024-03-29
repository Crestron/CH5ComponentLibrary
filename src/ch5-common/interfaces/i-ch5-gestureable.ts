// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { TBoolAttribute } from "./t-ch5-common";

/**
 * @ignore
 */
export interface ICh5Gestureable {

  /**
   * @documentation
   * [
   * "`gestureable` attribute",
   * "***",
   * "The default value is false. When set to true, gesturing will be supported. ",
   * "Adding this will change the behavior inside of the component."
   * ]
   * @name gestureable
   * @attributeType "Boolean"
   */
  gestureable: TBoolAttribute;

}
