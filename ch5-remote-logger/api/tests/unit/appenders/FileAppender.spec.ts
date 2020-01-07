import { describe, it } from 'mocha';
import { assert } from 'chai';

import { Message } from '../../../src/model/Message';
import { FileAppender } from "../../../src/appenders/FileAppender";
import { FileWriterMock } from "../../mocks/FileWriterMock";
import { TLog } from "../../../src/types";
import { ElogLevel } from "../../../src/enums";

const fileWriterMock = new FileWriterMock();
const fileAppender = new FileAppender(fileWriterMock);

const logData: TLog = {message: "This is a test message", date: new Date(), level: ElogLevel.WARN}
const testMessage = new Message(logData);

describe('FileAppender tests suite', () => {

    beforeEach(() => {
        fileWriterMock.clearWrittenData();
    });

    it('Write method of the fileWriter is called with data', () => {
        fileAppender.append(testMessage);

        assert.equal(fileWriterMock.called, 1);
        assert.equal(fileWriterMock.dataWritten, testMessage.toString());
    });
});
