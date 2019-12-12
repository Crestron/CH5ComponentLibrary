// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { expect } from "chai";
import { LogMessagesFilter } from "../../../../../crestron-components-lib/src/ch5-logger/helpers";

let logMessageFilter: LogMessagesFilter;

describe('Ch5-Remote-Logger LogMessagesFilter Tests', () => {
  beforeEach(() => {
    logMessageFilter = new LogMessagesFilter();
  });

  it('LogMessageFilter will match regex without slashes', () => {
    logMessageFilter.regularExpression = '[0-9]';

    expect(logMessageFilter.isMatchingFilterRegex('111')).to.equal(true);
  });

  it('LogMessageFilter will match regex with slashes', () => {
    logMessageFilter.regularExpression = '/[0-9]/';

    expect(logMessageFilter.isMatchingFilterRegex('111')).to.equal(true);
  });

    it('LogMessageFilter regularExpression setter will remove slashes', () => {
    logMessageFilter.regularExpression = '/[0-9]/';

    expect(logMessageFilter.regularExpression).to.equal('[0-9]');
  });
});
