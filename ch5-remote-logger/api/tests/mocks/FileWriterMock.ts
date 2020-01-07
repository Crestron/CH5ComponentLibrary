import { IFileWriter } from "../../src/services/IFileWriter";

export class FileWriterMock implements IFileWriter {

    public dataWritten: string;
    public called: number = 0;

    public clearWrittenData() {
        this.dataWritten = "";
    }

    public write(data: string): void {
        this.dataWritten = data;
        this.called++;
    }
}
