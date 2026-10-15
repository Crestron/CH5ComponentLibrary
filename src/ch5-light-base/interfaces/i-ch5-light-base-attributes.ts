// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5LightBaseAttributesForShow } from "./common/i-ch5-light-base-attributes-show";
import { ICh5LightBaseAttributesForNoShowType } from "./common/i-ch5-light-base-attributes-noshowtype";
import { ICh5LightBaseAttributesForReceiveStateShow } from "./common/i-ch5-light-base-attributes-receivestateshow";
import { ICh5LightBaseAttributesForReceiveStateEnable } from "./common/i-ch5-light-base-attributes-receivestateenable";
import { ICh5LightBaseAttributesForSendEventOnShow } from "./common/i-ch5-light-base-attributes-sendeventonshow";
import { ICh5LightBaseAttributesForDisabled } from "./common/i-ch5-light-base-attributes-disabled";
import { ICh5LightBaseAttributesForDebug } from "./common/i-ch5-light-base-attributes-debug";
import { ICh5LightBaseAttributesForTrace } from "./common/i-ch5-light-base-attributes-trace";
import { ICh5LightBaseAttributesForContractName } from "./common/i-ch5-light-base-attributes-contractname";
import { ICh5LightBaseAttributesForId } from "./common/i-ch5-light-base-attributes-id";
import { ICh5LightBaseAttributesForRole } from "./common/i-ch5-light-base-attributes-role";
import { ICh5LightBaseAttributesForDir } from "./common/i-ch5-light-base-attributes-dir";
import { ICh5LightBaseAttributesForClass } from "./common/i-ch5-light-base-attributes-class";
import { ICh5LightBaseAttributesForStyle } from "./common/i-ch5-light-base-attributes-style";

// Self-contained common attribute surface for the light family. Each attribute lives in
// its own sub-interface under ./common (mirroring the ch5-common layout) but is owned
// entirely within ch5-light-base — Ch5LightBaseClass implements them itself, with no
// dependency on Ch5Common.
/**
 * @ignore
 */
export interface ICh5LightBaseAttributes extends
  ICh5LightBaseAttributesForShow,
  ICh5LightBaseAttributesForNoShowType,
  ICh5LightBaseAttributesForReceiveStateShow,
  ICh5LightBaseAttributesForReceiveStateEnable,
  ICh5LightBaseAttributesForSendEventOnShow,
  ICh5LightBaseAttributesForDisabled,
  ICh5LightBaseAttributesForDebug,
  ICh5LightBaseAttributesForTrace,
  ICh5LightBaseAttributesForContractName,
  ICh5LightBaseAttributesForId,
  ICh5LightBaseAttributesForRole,
  ICh5LightBaseAttributesForDir,
  ICh5LightBaseAttributesForClass,
  ICh5LightBaseAttributesForStyle {

}
