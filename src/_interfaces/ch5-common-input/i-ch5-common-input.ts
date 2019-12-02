// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5CommonInputAttributes } from "./i-ch5-common-input-attributes";
import { TBoolAttribute } from "../ch5-common/types/t-bool-attribute";

/**
 * @ignore
 */
export interface ICh5CommonInput extends ICh5CommonInputAttributes {

  /**
   * @documentation
   * [
   * "`onclean` attribute",
   * "***",
   * "Run when clean event is fired"
   * ]
   * @name onclean
   */
  onclean: string;

  /**
   * @documentation
   * [
   * "`ondirty` attribute",
   * "***",
   * "Run when dirty event is fired"
   * ]
   * @name ondirty
   */
  ondirty: string;

  /**
   * @documentation
   * [
   * "`required` attribute",
   * "***",
   * "Specifies that the input element must be filled out before submitting the form"
   * ]
   * @name required
   */
  required: TBoolAttribute;
}