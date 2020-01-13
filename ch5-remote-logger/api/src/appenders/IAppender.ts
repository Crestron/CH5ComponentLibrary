import { Message } from '../model/Message';

export interface IAppender {
  append(message: Message): void;
}
