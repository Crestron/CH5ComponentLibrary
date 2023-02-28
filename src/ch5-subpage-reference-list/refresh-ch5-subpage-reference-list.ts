import { Subject } from "rxjs";

export const ch5subpageReferenceListSubject = new Subject<string>();

export const refreshCh5subpageReferenceList = (ch5subpageReferenceListId: string) => {
    ch5subpageReferenceListSubject.next(ch5subpageReferenceListId);
}