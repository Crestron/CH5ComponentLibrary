import { TLog } from '../types';
import { ElogLevel } from '../enums';
import { isNull, isEmpty, isNaN } from 'lodash';

export class Message {

  private readonly _time: Date = {} as Date;
  private readonly _message: string | object = '';
  private readonly _level: ElogLevel = ElogLevel.DEFAULT;

  constructor(logData: TLog) {
    this._time = new Date(logData.date);
    this._message = logData.message;
    this._level = logData.level;

    this.validOrFail();
  }

  public get level(): ElogLevel {
    return this._level;
  }

  public toString() {
    const time = this._time;

    const month = `${time.getUTCMonth() + 1}`.padStart(2, '0');
    const date = `${time.getUTCDate()}`.padStart(2, '0');
    const year = `${time.getUTCFullYear()}`;
    const hour = `${time.getUTCHours()}`.padStart(2, '0');
    const minutes = `${time.getUTCMinutes()}`.padStart(2, '0');
    const seconds = `${time.getUTCSeconds()}`.padStart(2, '0');

    const plainTime = `${hour}:${minutes}:${seconds}`;
    const plainDate = `${date}/${month}/${year}`;
    const message = `${plainTime} ${plainDate} ${this._message}`;

    return message;
  }

  private validOrFail() {
    if (isNull(this._message) || isEmpty(this._message)) {
      throw Error('Message is invalid!');
    } else if (isNaN(this._time.getTime()) || this._time.getTime() <= 0) {
      throw Error('Time is invalid');
    } else if (this.level > 3) {
      throw Error('Level is higher than 3. Keep it in the range of 0-3');
    } else if (this.level < 0) {
      throw Error('Given level is invalid. Keep it in the range of 0-3');
    }
  }
}
