// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5CommonAttributesForAppendClassWhenInViewPort } from "./common/i-ch5-common-attributes-appendclasswheninviewport";
import { ICh5CommonAttributesForCustomClass } from "./common/i-ch5-common-attributes-customclass";
import { ICh5CommonAttributesForCustomStyle } from "./common/i-ch5-common-attributes-customstyle";
import { ICh5CommonAttributesForDir } from "./common/i-ch5-common-attributes-dir";
import { ICh5CommonAttributesForId } from "./common/i-ch5-common-attributes-id";
import { ICh5CommonAttributesForNoShowType } from "./common/i-ch5-common-attributes-noshowtype";
import { ICh5CommonAttributesForReceiveStateEnable } from "./common/i-ch5-common-attributes-receivestateenable";
import { ICh5CommonAttributesForReceiveStateShow } from "./common/i-ch5-common-attributes-receivestateshow";
import { ICh5CommonAttributesForShow } from "./common/i-ch5-common-attributes-show";
import { ICh5CommonAttributesForReceiveStateCustomClass } from "./common/i-ch5-common-attributes-receivestatecustomclass";
import { ICh5CommonAttributesForReceiveStateCustomStyle } from "./common/i-ch5-common-attributes-receivestatecustomstyle";

/**
 * @ignore
 */
export interface ICh5ButtonListCommonAttributes extends ICh5CommonAttributesForDir,
	ICh5CommonAttributesForShow,
	ICh5CommonAttributesForAppendClassWhenInViewPort,
	ICh5CommonAttributesForReceiveStateEnable,
	ICh5CommonAttributesForReceiveStateShow,
	ICh5CommonAttributesForNoShowType,
	ICh5CommonAttributesForCustomStyle,
	ICh5CommonAttributesForCustomClass,
	ICh5CommonAttributesForReceiveStateCustomClass,
	ICh5CommonAttributesForReceiveStateCustomStyle,
	ICh5CommonAttributesForId {

}
