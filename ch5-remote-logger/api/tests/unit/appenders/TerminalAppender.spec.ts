import { describe, it, before } from 'mocha';
import { use, should } from 'chai';
import * as Sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import { TerminalAppender } from '../../../src/appenders/TerminalAppender';
import { Message } from '../../../src/model/Message';
import { ConsoleMessageFormat } from '../../../src/format/ConsoleMessageFormat';

should();
use(sinonChai);

const terminalAppenderInstance = new TerminalAppender();

const date = new Date('09/07/2019 12:50:51');
const message = 'This is a simple log message';

const createMessage = (level: number) => {

  const messageObject = new Message({
    level,
    date,
    message,
  });

  return messageObject;

};

describe('TerminalAppender tests suite', () => {

  const consoleStub: {[key: string]: any} = {};

  before(() => {
    consoleStub.log = Sinon.stub(console, 'log');
    consoleStub.info = Sinon.stub(console, 'info');
    consoleStub.warn = Sinon.stub(console, 'warn');
    consoleStub.error = Sinon.stub(console, 'error');
  });

  it('Log level 0 should use console.log', () => {
    const messageObject = createMessage(0);
    terminalAppenderInstance.append(messageObject);

    consoleStub.log.restore();
    Sinon.assert.called(consoleStub.log);
  });

  it('Log level 1 should use console.info', () => {
    const messageObject = createMessage(1);
    terminalAppenderInstance.append(messageObject);

    consoleStub.info.restore();
    Sinon.assert.called(consoleStub.info);
  });

  it('Log level 2 should use console.warn', () => {
    const messageObject = createMessage(2);
    terminalAppenderInstance.append(messageObject);

    consoleStub.warn.restore();
    Sinon.assert.called(consoleStub.warn);
  });

  it('Log level 3 should use console.error', () => {
    const messageObject = createMessage(3);
    terminalAppenderInstance.append(messageObject);

    consoleStub.error.restore();
    Sinon.assert.called(consoleStub.error);
  });

});
