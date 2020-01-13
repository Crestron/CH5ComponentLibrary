import { createHash } from 'crypto';
import { resolve } from 'path';
import { createWriteStream, WriteStream } from 'fs';
import { IFileWriter } from './IFileWriter';

export class FileSystem implements IFileWriter {

  public readonly kind: string = '';

  private _fileName: string = '';
  private _writeStream: WriteStream;

  constructor(kind: string) {
    this.kind = kind;
    this._fileName = this.createFileName();
    this._writeStream = createWriteStream(
      resolve(
        '.',
        this.kind,
        `${this._fileName}.txt`,
      ),
    );
  }

  public get fileName(): string {
    return this._fileName;
  }

  public write(data: string) {
    this._writeStream.write(`${data}\r\n`);
  }

  private createFileName(): string {
    const hashedFilename = createHash('sha1');
    hashedFilename.update(this.kind);

    return hashedFilename.digest('hex');
  }
}
