import { Subject } from "rxjs";

export const ch5WidgetListSubject = new Subject<string>();

export const refreshCh5WidgetList = (ch5WidgetListId: string) => {
    ch5WidgetListSubject.next(ch5WidgetListId);
}