/*
 * Copyright (C) 2018 to the present, Crestron Electronics, Inc.
 * All rights reserved.
 * No part of this software may be reproduced in any form, machine
 * or natural, without the express written consent of Crestron Electronics.
 * Use of this source code is subject to the terms of the Crestron Software License Agreement
 * under which you licensed this source code.
 */

import { IAppender } from './IAppender';
import { Message } from '../model/Message';
import { IFileWriter } from '../services/IFileWriter';

export class FileAppender implements IAppender {

  private fileWriter: IFileWriter;

  constructor(fileWriter: IFileWriter) {
    this.fileWriter = fileWriter;
  }

  public append(message: Message): void {
    this.fileWriter.write(message.toString());
  }

}
