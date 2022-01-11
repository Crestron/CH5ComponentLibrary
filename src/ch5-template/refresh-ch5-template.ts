import { Subject } from "rxjs";

export const ch5TemplateSubject = new Subject<string>();

export const refreshCh5Template = (ch5TemplateId: string) => {
    ch5TemplateSubject.next(ch5TemplateId);
}