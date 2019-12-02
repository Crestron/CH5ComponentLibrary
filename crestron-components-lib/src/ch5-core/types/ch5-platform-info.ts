// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

export interface ICh5PlatformInfo {
  capabilities: ICh5PlatformInfoCapabilities;
  version: string;
  name: string;
}

export interface ICh5PlatformInfoCapabilities {
  supportsTouchActivity: boolean;
  supportCredentialIntercept: ICh5PlatformInfoSupportCredentialIntercept;
}

export interface ICh5PlatformInfoSupportCredentialIntercept {
  http: string;
  https: string;
}
