import { describe, it } from 'mocha';
import { assert } from 'chai';
import { Message } from '../../../src/model/Message';
import { ConsoleMessageFormat } from '../../../src/format/ConsoleMessageFormat';

const date = new Date('09/07/2019 12:50:51');
const message = 'This is a simple log message';

const createConsoleObject = (level: number) => {

  const messageObject = new Message({
    level,
    date,
    message,
  });

  const consoleObject = new ConsoleMessageFormat(messageObject);

  return consoleObject;
};

describe('ConsoleMessageFormat tests suite', () => {
  it('should be white if level is 0 (default log)', () => {
    const consoleObject = createConsoleObject(0);

    assert.isBelow(consoleObject.getMessage().indexOf('\u001b['), 0);
  });

  it('should be blue if level is 1 (message of type info)', () => {
    const consoleObject = createConsoleObject(1);
    assert.isAtLeast(consoleObject.getMessage().indexOf('\u001b[34m'), 0);
  });

  it('should be yellow if level is 2 (message of type warning)', () => {
    const consoleObject = createConsoleObject(2);
    assert.isAtLeast(consoleObject.getMessage().indexOf('\u001b[33m'), 0);
  });

  it('should be red if level is 3 (message of type error)', () => {
    const consoleObject = createConsoleObject(3);
    assert.isAtLeast(consoleObject.getMessage().indexOf('\u001b[31m'), 0);
  });
});
