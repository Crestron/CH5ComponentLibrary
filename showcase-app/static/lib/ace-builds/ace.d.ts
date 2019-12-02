export namespace Ace {
  export type NewLineMode = 'auto' | 'unix' | 'windows';

  export interface Anchor extends EventEmitter {
    getPosition(): Position;
    getDocument(): Document;
    setPosition(row: number, column: number, noClip?: boolean): void;
    detach(): void;
    attach(doc: Document): void;
  }

  export interface Document extends EventEmitter {
    setValue(text: string): void;
    getValue(): string;
    createAnchor(row: number, column: number): Anchor;
    getNewLineCharacter(): string;
    setNewLineMode(newLineMode: NewLineMode): void;
    getNewLineMode(): NewLineMode;
    isNewLine(text: string): boolean;
    getLine(row: number): string;
    getLines(firstRow: number, lastRow: number): string[];
    getAllLines(): string[];
    getTextRange(range: Range): string;
    getLinesForRange(range: Range): string[];
    insert(position: Position, text: string): Position;
    insertInLine(position: Position, text: string): Position;
    clippedPos(row: number, column: number): Point;
    clonePos(pos: Point): Point;
    pos(row: number, column: number): Point;
    insertFullLines(row: number, lines: string[]): void;
    insertMergedLines(position: Position, lines: string[]): Point;
    remove(range: Range): Position;
    removeInLine(row: number, startColumn: number, endColumn: number): Position;
    removeFullLines(firstRow: number, lastRow: number): string[];
    removeNewLine(row: number): void;
    replace(range: Range, text: string): Position;
    applyDeltas(deltas: Delta[]): void;
    revertDeltas(deltas: Delta[]): void;
    applyDelta(delta: Delta, doNotValidate?: boolean): void;
    revertDelta(delta: Delta): void;
    indexToPosition(index: number, startRow: number): Position;
    positionToIndex(pos: Position, startRow?: number): number;
  }

  export interface FoldLine {
    folds: Fold[];
    range: Range;
    start: Point;
    end: Point;

    shiftRow(shift: number): void;
    addFold(fold: Fold): void;
    containsRow(row: number): boolean;
    walk(callback: Function, endRow?: number, endColumn?: number): void;
    getNextFoldTo(row: number, column: number): null | { fold: Fold, kind: string };
    addRemoveChars(row: number, column: number, len: number): void;
    split(row: number, column: number): FoldLine;
    merge(foldLineNext: FoldLine): void;
    idxToPosition(idx: number): Point;
  }

  export interface Fold {
    range: Range;
    start: Point;
    end: Point;
    foldLine?: FoldLine;
    sameRow: boolean;
    subFolds: Fold[];

    setFoldLine(foldLine: FoldLine): void;
    clone(): Fold;
    addSubFold(fold: Fold): Fold;
    restoreRange(range: Range): void;
  }

  export interface Range {
    start: Point;
    end: Point;

    isEqual(range: Range): boolean;
    toString(): string;
    contains(row: number, column: number): boolean;
    compareRange(range: Range): number;
    comparePoint(p: Point): number;
    containsRange(range: Range): boolean;
    intersects(range: Range): boolean;
    isEnd(row: number, column: number): boolean;
    isStart(row: number, column: number): boolean;
    setStart(row: number, column: number): void;
    setEnd(row: number, column: number): void;
    inside(row: number, column: number): boolean;
    insideStart(row: number, column: number): boolean;
    insideEnd(row: number, column: number): boolean;
    compare(row: number, column: number): number;
    compareStart(row: number, column: number): number;
    compareEnd(row: number, column: number): number;
    compareInside(row: number, column: number): number;
    clipRows(firstRow: number, lastRow: number): Range;
    extend(row: number, column: number): Range;
    isEmpty(): boolean;
    isMultiLine(): boolean;
    clone(): Range;
    collapseRows(): Range;
    toScreenRange(session: EditSession): Range;
    moveBy(row: number, column: number): void;
  }

  export interface EditSessionOptions {
    wrap: string | number;
    wrapMethod: 'code' | 'text' | 'auto';
    indentedSoftWrap: boolean;
    firstLineNumber: number;
    useWorker: boolean;
    useSoftTabs: boolean;
    tabSize: number;
    navigateWithinSoftTabs: boolean;
    foldStyle: 'markbegin' | 'markbeginend' | 'manual';
    overwrite: boolean;
    newLineMode: NewLineMode;
    mode: string;
  }

  export interface VirtualRendererOptions {
    animatedScroll: boolean;
    showInvisibles: boolean;
    showPrintMargin: boolean;
    printMarginColumn: number;
    printMargin: boolean | number;
    showGutter: boolean;
    fadeFoldWidgets: boolean;
    showFoldWidgets: boolean;
    showLineNumbers: boolean;
    displayIndentGuides: boolean;
    highlightGutterLine: boolean;
    hScrollBarAlwaysVisible: boolean;
    vScrollBarAlwaysVisible: boolean;
    fontSize: number;
    fontFamily: string;
    maxLines: number;
    minLines: number;
    scrollPastEnd: boolean;
    fixedWidthGutter: boolean;
    theme: string;
    hasCssTransforms: boolean;
    maxPixelHeight: number;
  }

  export interface MouseHandlerOptions {
    scrollSpeed: number;
    dragDelay: number;
    dragEnabled: boolean;
    focusTimeout: number;
    tooltipFollowsMouse: boolean;
  }

  export interface EditorOptions extends EditSessionOptions,
                                         MouseHandlerOptions,
                                         VirtualRendererOptions {
    selectionStyle: string;
    highlightActiveLine: boolean;
    highlightSelectedWord: boolean;
    readOnly: boolean;
    copyWithEmptySelection: boolean;
    cursorStyle: 'ace' | 'slim' | 'smooth' | 'wide';
    mergeUndoDeltas: true | false | 'always';
    behavioursEnabled: boolean;
    wrapBehavioursEnabled: boolean;
    autoScrollEditorIntoView: boolean;
    keyboardHandler: string;
    value: string;
    session: EditSession;
  }

  export interface SearchOptions {
    needle: string | RegExp;
    preventScroll: boolean;
    backwards: boolean;
    start: Range;
    skipCurrent: boolean;
    range: Range;
    preserveCase: boolean;
    regExp: RegExp;
    wholeWord: string;
    caseSensitive: boolean;
    wrap: boolean;
  }

  export interface EventEmitter {
    once(name: string, callback: Function): void;
    setDefaultHandler(name: string, callback: Function): void;
    removeDefaultHandler(name: string, callback: Function): void;
    on(name: string, callback: Function, capturing?: boolean): void;
    addEventListener(name: string, callback: Function, capturing?: boolean): void;
    off(name: string, callback: Function): void;
    removeListener(name: string, callback: Function): void;
    removeEventListener(name: string, callback: Function): void;
  }

  export interface Point {
    row: number;
    column: number;
  }

  export interface Delta {
    action: 'insert' | 'remove';
    start: Point;
    end: Point;
    lines: string[];
  }

  export interface Annotation {
    row?: number;
    column?: number;
    text: string;
    type: string;
  }

  export interface Command {
    name?: string;
    bindKey?: string | { mac?: string, win?: string };
    readOnly?: boolean;
    exec: (editor: Editor, args?: any) => void;
  }

  export type CommandLike = Command | ((editor: Editor) => void);

  export interface KeyboardHandler {
    handleKeyboard: Function;
  }

  export interface MarkerLike {
    range: Range;
    type: string;
    renderer?: MarkerRenderer;
    clazz: string;
    inFront: boolean;
    id: number;
    update?: (html: string[],
              // TODO maybe define Marker class
              marker: any,
              session: EditSession,
              config: any) => void;
  }

  export type MarkerRenderer = (html: string[],
                                range: Range,
                                left: number,
                                top: number,
                                config: any) => void;

  export interface Token {
    type: string;
    value: string;
    index?: number;
    start?: number;
  }

  export interface Completion {
    value: string;
    score: number;
    meta?: string;
    name?: string;
    caption?: string;
  }

  export interface Tokenizer {
    removeCapturingGroups(src: string): string;
    createSplitterRegexp(src: string, flag?: string): RegExp;
    getLineTokens(line: string, startState: string | string[]): Token[];
  }

  export interface SyntaxMode {
    getTokenizer(): Tokenizer;
    toggleCommentLines(state: any,
                       session: EditSession,
                       startRow: number,
                       endRow: number): void;
    toggleBlockComment(state: any,
                       session: EditSession,
                       range: Range,
                       cursor: Position): void;
    getNextLineIndent(state: any, line: string, tab: string): string;
    checkOutdent(state: any, line: string, input: string): boolean;
    autoOutdent(state: any, doc: Document, row: number): void;
    // TODO implement WorkerClient types
    createWorker(session: EditSession): any;
    createModeDelegates(mapping: {[key: string]: string}): void;
    transformAction(state: string,
                    action: string,
                    editor: Editor,
                    session: EditSession,
                    text: string): any;
    getKeywords(append?: boolean): Array<string | RegExp>;
    getCompletions(state: string,
                   session: EditSession,
                   pos: Position,
                   prefix: string): Completion[];
  }

  export interface Config {
    get(key: string): any;
    set(key: string, value: any): void;
    all(): {[key: string]: any};
    moduleUrl(name: string, component?: string): string;
    setModuleUrl(name: string, subst: string): string;
    loadModule(moduleName: string | [string, string],
               onLoad: (module: any) => void): void;
    init(packaged: any): any;
    defineOptions(obj: any, path: string, options: {[key: string]: any}): Config;
    resetOptions(obj: any): void;
    setDefaultValue(path: string, name: string, value: any): void;
    setDefaultValues(path: string, optionHash: {[key: string]: any}): void;
  }

  export interface OptionsProvider {
    setOptions(optList: {[key: string]: any}): void;
    getOptions(optionNames?: string[] | {[key: string]: any}): {[key: string]: any};
    setOption(name: string, value: any): void;
    getOption(name: string): any;
  }

  export interface UndoManager {
    addSession(session: EditSession): void;
    add(delta: Delta, allowMerge: boolean, session: EditSession): void;
    addSelection(selection: string, rev?: number): void;
    startNewGroup(): void;
    markIgnored(from: number, to?: number): void;
    getSelection(rev: number, after?: boolean): { value: string, rev: number };
    getRevision(): number;
    getDeltas(from: number, to?: number): Delta[];
    undo(session: EditSession, dontSelect?: boolean): void;
    redo(session: EditSession, dontSelect?: boolean): void;
    reset(): void;
    canUndo(): boolean;
    canRedo(): boolean;
    bookmark(rev?: number): void;
    isAtBookmark(): boolean;
  }

  export interface EditSession extends EventEmitter, OptionsProvider {
    selection: Selection;

    on(name: 'changeFold',
       callback: (obj: { data: Fold, action: string }) => void): void;
    on(name: 'changeScrollLeft', callback: (scrollLeft: number) => void): void;
    on(name: 'changeScrollTop', callback: (scrollTop: number) => void): void;
    on(name: 'tokenizerUpdate',
       callback: (obj: { data: { first: number, last: number } }) => void): void;


    setOption<T extends keyof EditSessionOptions>(name: T, value: EditSessionOptions[T]): void;
    getOption<T extends keyof EditSessionOptions>(name: T): EditSessionOptions[T];

    setDocument(doc: Document): void;
    getDocument(): Document;
    resetCaches(): void;
    setValue(text: string): void;
    getValue(): string;
    getSelection(): Selection;
    getState(row: number): string;
    getTokens(row: number): Token[];
    getTokenAt(row: number, column: number): Token | null;
    setUndoManager(undoManager: UndoManager): void;
    markUndoGroup(): void;
    getUndoManager(): UndoManager;
    getTabString(): string;
    setUseSoftTabs(val: boolean): void;
    getUseSoftTabs(): boolean;
    setTabSize(tabSize: number): void;
    getTabSize(): number;
    isTabStop(position: Position): boolean;
    setNavigateWithinSoftTabs(navigateWithinSoftTabs: boolean): void;
    getNavigateWithinSoftTabs(): boolean;
    setOverwrite(overwrite: boolean): void;
    getOverwrite(): boolean;
    toggleOverwrite(): void;
    addGutterDecoration(row: number, className: string): void;
    removeGutterDecoration(row: number, className: string): void;
    getBreakpoints(): string[];
    setBreakpoints(rows: number[]): void;
    clearBreakpoints(): void;
    setBreakpoint(row: number, className: string): void;
    clearBreakpoint(row: number): void;
    addMarker(range: Range,
              clazz: string,
              type: MarkerRenderer,
              inFront: boolean): number;
    addDynamicMarker(marker: MarkerLike, inFront: boolean): MarkerLike;
    removeMarker(markerId: number): void;
    getMarkers(inFront?: boolean): MarkerLike[];
    highlight(re: RegExp): void;
    highlightLines(startRow: number,
                   endRow: number,
                   clazz: string,
                   inFront?: boolean): Range;
    setAnnotations(annotations: Annotation[]): void;
    getAnnotations(): Annotation[];
    clearAnnotations(): void;
    getWordRange(row: number, column: number): Range;
    getAWordRange(row: number, column: number): Range;
    setNewLineMode(newLineMode: NewLineMode): void;
    getNewLineMode(): NewLineMode;
    setUseWorker(useWorker: boolean): void;
    getUseWorker(): boolean;
    setMode(mode: string | SyntaxMode, callback?: () => void): void;
    getMode(): SyntaxMode;
    setScrollTop(scrollTop: number): void;
    getScrollTop(): number;
    setScrollLeft(scrollLeft: number): void;
    getScrollLeft(): number;
    getScreenWidth(): number;
    getLineWidgetMaxWidth(): number;
    getLine(row: number): string;
    getLines(firstRow: number, lastRow: number): string[];
    getLength(): number;
    getTextRange(range: Range): string;
    insert(position: Position, text: string): void;
    remove(range: Range): void;
    removeFullLines(firstRow: number, lastRow: number): void;
    undoChanges(deltas: Delta[], dontSelect?: boolean): void;
    redoChanges(deltas: Delta[], dontSelect?: boolean): void;
    setUndoSelect(enable: boolean): void;
    replace(range: Range, text: string): void;
    moveText(fromRange: Range, toPosition: Position, copy?: boolean): void;
    indentRows(startRow: number, endRow: number, indentString: string): void;
    outdentRows(range: Range): void;
    moveLinesUp(firstRow: number, lastRow, number): void;
    moveLinesDown(firstRow: number, lastRow: number): void;
    duplicateLines(firstRow: number, lastRow: number): void;
    setUseWrapMode(useWrapMode: boolean): void;
    getUseWrapMode(): boolean;
    setWrapLimitRange(min: number, max: number): void;
    adjustWrapLimit(desiredLimit: number): boolean;
    getWrapLimit(): number;
    setWrapLimit(limit: number): void;
    getWrapLimitRange(): { min: number, max: number };
    getRowLineCount(row: number): number;
    getRowWrapIndent(screenRow: number): number;
    getScreenLastRowColumn(screenRow: number): number;
    getDocumentLastRowColumn(docRow: number, docColumn: number): number;
    getdocumentLastRowColumnPosition(docRow: number, docColumn: number): Position;
    getRowSplitData(row: number): string | undefined;
    getScreenTabSize(screenColumn: number): number;
    screenToDocumentRow(screenRow: number, screenColumn: number): number;
    screenToDocumentColumn(screenRow: number, screenColumn: number): number;
    screenToDocumentPosition(screenRow: number,
                             screenColumn: number,
                             offsetX?: number): Position;
    documentToScreenPosition(docRow, docColumn): Position;
    documentToScreenColumn(row: number, docColumn: number): number;
    documentToScreenRow(docRow: number, docColumn: number): number;
    getScreenLength(): number;
    destroy(): void;
  }

  export interface KeyBinding {
    setDefaultHandler(handler: KeyboardHandler): void;
    setKeyboardHandler(handler: KeyboardHandler): void;
    addKeyboardHandler(handler: KeyboardHandler, pos: number): void;
    removeKeyboardHandler(handler: KeyboardHandler): boolean;
    getKeyboardHandler(): KeyboardHandler;
    getStatusText(): string;
  }

  export interface CommandManager extends EventEmitter {
    on(name: 'exec', callback: (obj: {
                                  editor: Editor,
                                  command: Command,
                                  args: any[]
                               }) => void): void;
    once(name: string, callback: Function): void;
    setDefaultHandler(name: string, callback: Function): void;
    removeDefaultHandler(name: string, callback: Function): void;
    on(name: string, callback: Function, capturing?: boolean): void;
    addEventListener(name: string, callback: Function, capturing?: boolean): void;
    off(name: string, callback: Function): void;
    removeListener(name: string, callback: Function): void;
    removeEventListener(name: string, callback: Function): void;

    exec(command: string, editor: Editor, args: any): boolean;
    toggleRecording(editor: Editor): void;
    replay(editor: Editor): void;
    addCommand(command: Command): void;
    removeCommand(command: Command, keepCommand?: boolean): void;
    bindKey(key: string | { mac?: string, win?: string},
            command: CommandLike,
            position?: number): void;
  }

  export interface VirtualRenderer extends OptionsProvider, EventEmitter {
    container: HTMLElement;

    setOption<T extends keyof VirtualRendererOptions>(name: T, value: VirtualRendererOptions[T]): void;
    getOption<T extends keyof VirtualRendererOptions>(name: T): VirtualRendererOptions[T];

    setSession(session: EditSession): void;
    updateLines(firstRow: number, lastRow: number, force?: boolean): void;
    updateText(): void;
    updateFull(force?: boolean): void;
    updateFontSize(): void;
    adjustWrapLimit(): boolean;
    setAnimatedScroll(shouldAnimate: boolean): void;
    getAnimatedScroll(): boolean;
    setShowInvisibles(showInvisibles: boolean): void;
    getShowInvisibles(): boolean;
    setDisplayIndentGuides(display: boolean): void;
    getDisplayIndentGuides(): boolean;
    setShowPrintMargin(showPrintMargin: boolean): void;
    getShowPrintMargin(): boolean;
    setPrintMarginColumn(showPrintMargin: boolean): void;
    getPrintMarginColumn(): boolean;
    setShowGutter(show: boolean): void;
    getShowGutter(): boolean;
    setFadeFoldWidgets(show: boolean): void;
    getFadeFoldWidgets(): boolean;
    setHighlightGutterLine(shouldHighlight: boolean): void;
    getHighlightGutterLine(): boolean;
    getContainerElement(): HTMLElement;
    getMouseEventTarget(): HTMLElement;
    getTextAreaContainer(): HTMLElement;
    getFirstVisibleRow(): number;
    getFirstFullyVisibleRow(): number;
    getLastFullyVisibleRow(): number;
    getLastVisibleRow(): number;
    setPadding(padding: number): void;
    setScrollMargin(top: number,
                    bottom: number,
                    left: number,
                    right: number): void;
    setHScrollBarAlwaysVisible(alwaysVisible: boolean): void;
    getHScrollBarAlwaysVisible(): boolean;
    setVScrollBarAlwaysVisible(alwaysVisible: boolean): void;
    getVScrollBarAlwaysVisible(): boolean;
    freeze(): void;
    unfreeze(): void;
    updateFrontMarkers(): void;
    updateBackMarkers(): void;
    updateBreakpoints(): void;
    setAnnotations(annotations: Annotation[]): void;
    updateCursor(): void;
    hideCursor(): void;
    showCursor(): void;
    scrollSelectionIntoView(anchor: Position,
                            lead: Position,
                            offset?: number): void;
    scrollCursorIntoView(cursor: Position, offset?: number): void;
    getScrollTop(): number;
    getScrollLeft(): number;
    getScrollTopRow(): number;
    getScrollBottomRow(): number;
    scrollToRow(row: number): void;
    alignCursor(cursor: Position | number, alignment: number): number;
    scrollToLine(line: number,
                 center: boolean,
                 animate: boolean,
                 callback: () => void): void;
    animateScrolling(fromValue: number, callback: () => void): void;
    scrollToY(scrollTop: number): void;
    scrollToX(scrollLeft: number): void;
    scrollTo(x: number, y: number): void;
    scrollBy(deltaX: number, deltaY: number): void;
    isScrollableBy(deltaX: number, deltaY: number): boolean;
    textToScreenCoordinates(row: number, column: number): { pageX: number, pageY: number};
    visualizeFocus(): void;
    visualizeBlur(): void;
    showComposition(position: number): void;
    setCompositionText(text: string): void;
    hideComposition(): void;
    setTheme(theme: string, callback?: () => void): void;
    getTheme(): string;
    setStyle(style: string, include?: boolean): void;
    unsetStyle(style: string): void;
    setCursorStyle(style: string): void;
    setMouseCursor(cursorStyle: string): void;
    attachToShadowRoot(): void;
    destroy(): void;
  }


  export interface Selection extends EventEmitter {
    moveCursorWordLeft(): void;
    moveCursorWordRight(): void;
    fromOrientedRange(range: Range): void;
    setSelectionRange(match: any): void;
    getAllRanges(): Range[];
    addRange(range: Range): void;
    isEmpty(): boolean;
    isMultiLine(): boolean;
    setCursor(row: number, column: number): void;
    setAnchor(row: number, column: number): void;
    getAnchor(): Position;
    getCursor(): Position;
    isBackwards(): boolean;
    getRange(): Range;
    clearSelection(): void;
    selectAll(): void;
    setRange(range: Range, reverse?: boolean): void;
    selectTo(row: number, column: number): void;
    selectToPosition(pos: any): void;
    selectUp(): void;
    selectDown(): void;
    selectRight(): void;
    selectLeft(): void;
    selectLineStart(): void;
    selectLineEnd(): void;
    selectFileEnd(): void;
    selectFileStart(): void;
    selectWordRight(): void;
    selectWordLeft(): void;
    getWordRange(): void;
    selectWord(): void;
    selectAWord(): void;
    selectLine(): void;
    moveCursorUp(): void;
    moveCursorDown(): void;
    moveCursorLeft(): void;
    moveCursorRight(): void;
    moveCursorLineStart(): void;
    moveCursorLineEnd(): void;
    moveCursorFileEnd(): void;
    moveCursorFileStart(): void;
    moveCursorLongWordRight(): void;
    moveCursorLongWordLeft(): void;
    moveCursorBy(rows: number, chars: number): void;
    moveCursorToPosition(position: any): void;
    moveCursorTo(row: number, column: number, keepDesiredColumn?: boolean): void;
    moveCursorToScreen(row: number, column: number, keepDesiredColumn: boolean): void;
  }
  var Selection: {
    new(session: EditSession): Selection;
  }

  export interface Editor extends OptionsProvider, EventEmitter {
    container: HTMLElement;
    renderer: VirtualRenderer;
    id: string;
    commands: CommandManager;
    keyBinding: KeyBinding;
    session: EditSession;
    selection: Selection;

    on(name: 'blur', callback: (e: Event) => void): void;
    on(name: 'change', callback: (delta: Delta) => void): void;
    on(name: 'changeSelectionStyle', callback: (obj: { data: string }) => void): void;
    on(name: 'changeSession',
       callback: (obj: { session: EditSession, oldSession: EditSession }) => void): void;
    on(name: 'copy', callback: (obj: { text: string }) => void): void;
    on(name: 'focus', callback: (e: Event) => void): void;
    on(name: 'paste', callback: (obj: { text: string }) => void): void;

    setOption<T extends keyof EditorOptions>(name: T, value: EditorOptions[T]): void;
    getOption<T extends keyof EditorOptions>(name: T): EditorOptions[T];

    setKeyboardHandler(keyboardHandler: string, callback?: () => void);
    getKeyboardHandler(): string;
    setSession(session: EditSession): void;
    getSession(): EditSession;
    setValue(val: string, cursorPos?: number): string;
    getValue(): string;
    getSelection(): Selection;
    resize(force?: boolean): void;
    setTheme(theme: string, callback?: () => void);
    getTheme(): string;
    setStyle(style: string): void;
    unsetStyle(style: string): void;
    getFontSize(): string;
    setFontSize(size: string): void;
    focus(): void;
    isFocused(): boolean;
    flur(): void;
    getSelectedText(): string;
    getCopyText(): string;
    execCommand(command: string | string[], args: any): boolean;
    insert(text: string, pasted?: boolean): void;
    setOverwrite(overwrite: boolean): void;
    getOverwrite(): boolean;
    toggleOverwrite(): void;
    setScrollSpeed(speed: number): void;
    getScrollSpeed(): number;
    setDragDelay(dragDelay: number): void;
    getDragDelay(): number;
    setSelectionStyle(val: string): void;
    getSelectionStyle(): string;
    setHighlightActiveLine(shouldHighlight: boolean): void;
    getHighlightActiveLine(): boolean;
    setHighlightGutterLine(shouldHighlight: boolean): void;
    getHighlightGutterLine(): boolean;
    setHighlightSelectedWord(shouldHighlight: boolean): void;
    getHighlightSelectedWord(): boolean;
    setAnimatedScroll(shouldAnimate: boolean): void;
    getAnimatedScroll(): boolean;
    setShowInvisibles(showInvisibles: boolean): void;
    getShowInvisibles(): boolean;
    setDisplayIndentGuides(display: boolean): void;
    getDisplayIndentGuides(): boolean;
    setShowPrintMargin(showPrintMargin: boolean): void;
    getShowPrintMargin(): boolean;
    setPrintMarginColumn(showPrintMargin: number): void;
    getPrintMarginColumn(): number;
    setReadOnly(readOnly: boolean): void;
    getReadOnly(): boolean;
    setBehavioursEnabled(enabled: boolean): void;
    getBehavioursEnabled(): boolean;
    setWrapBehavioursEnabled(enabled: boolean): void;
    getWrapBehavioursEnabled(): boolean;
    setShowFoldWidgets(show: boolean): void;
    getShowFoldWidgets(): boolean;
    setFadeFoldWidgets(fade: boolean): void;
    getFadeFoldWidgets(): boolean;
    remove(dir?: 'left' | 'right'): void;
    removeWordRight(): void;
    removeWordLeft(): void;
    removeLineToEnd(): void;
    splitLine(): void;
    transposeLetters(): void;
    toLowerCase(): void;
    toUpperCase(): void;
    indent(): void;
    blockIndent(): void;
    blockOutdent(): void;
    sortLines(): void;
    toggleCommentLines(): void;
    toggleBlockComment(): void;
    modifyNumber(amount: number): void;
    removeLines(): void;
    duplicateSelection(): void;
    moveLinesDown(): void;
    moveLinesUp(): void;
    moveText(range: Range, toPosition: Point, copy?: boolean): Range;
    copyLinesUp(): void;
    copyLinesDown(): void;
    getFirstVisibleRow(): number;
    getLastVisibleRow(): number;
    isRowVisible(row: number): boolean;
    isRowFullyVisible(row: number): boolean;
    selectPageDown(): void;
    selectPageUp(): void;
    gotoPageDown(): void;
    gotoPageUp(): void;
    scrollPageDown(): void;
    scrollPageUp(): void;
    scrollToRow(row: number): void;
    scrollToLine(line: number, center: boolean, animate: boolean, callback: () => void): void;
    centerSelection(): void;
    getCursorPosition(): Point;
    getCursorPositionScreen(): Point;
    getSelectionRange(): Range;
    selectAll(): void;
    clearSelection(): void;
    moveCursorTo(row: number, column: number): void;
    moveCursorToPosition(pos: Point): void;
    jumpToMatching(select: boolean, expand: boolean): void;
    gotoLine(lineNumber: number, column: number, animate: boolean): void;
    navigateTo(row: number, column: number): void;
    navigateUp(): void;
    navigateDown(): void;
    navigateLeft(): void;
    navigateRight(): void;
    navigateLineStart(): void;
    navigateLineEnd(): void;
    navigateFileEnd(): void;
    navigateFileStart(): void;
    navigateWordRight(): void;
    navigateWordLeft(): void;
    replace(replacement: string, options?: Partial<SearchOptions>): number;
    replaceAll(replacement: string, options?: Partial<SearchOptions>): number;
    getLastSearchOptions(): Partial<SearchOptions>;
    find(needle: string, options?: Partial<SearchOptions>, animate?: boolean): void;
    findNext(options?: Partial<SearchOptions>, animate?: boolean): void;
    findPrevious(options?: Partial<SearchOptions>, animate?: boolean): void;
    undo(): void;
    redo(): void;
    destroy(): void;
    setAutoScrollEditorIntoView(enable: boolean): void;
  }
}

export const version: string;
export const config: Ace.Config;
export function require(name: string): any;
export function edit(el: Element | string, options?: Partial<Ace.EditorOptions>): Ace.Editor;
export function createEditSession(text: Ace.Document | string, mode: Ace.SyntaxMode): Ace.EditSession;
export const VirtualRenderer: {
  new(container: HTMLElement, theme?: string): Ace.VirtualRenderer;
};
export const EditSession: {
  new(text: string | Document, mode?: Ace.SyntaxMode): Ace.EditSession;
};
export const UndoManager: {
  new(): Ace.UndoManager;
};
export const Range: {
  new(startRow: number, startColumn: number, endRow: number, endColumn: number): Ace.Range;
  fromPoints(start: Ace.Point, end: Ace.Point): Ace.Range;
  comparePoints(p1: Ace.Point, p2: Ace.Point): number;
};

declare module 'ace-builds/src-noconflict/ext-beautify';
declare module 'ace-builds/src-noconflict/ext-elastic_tabstops_lite';
declare module 'ace-builds/src-noconflict/ext-emmet';
declare module 'ace-builds/src-noconflict/ext-error_marker';
declare module 'ace-builds/src-noconflict/ext-keybinding_menu';
declare module 'ace-builds/src-noconflict/ext-language_tools';
declare module 'ace-builds/src-noconflict/ext-linking';
declare module 'ace-builds/src-noconflict/ext-modelist';
declare module 'ace-builds/src-noconflict/ext-options';
declare module 'ace-builds/src-noconflict/ext-searchbox';
declare module 'ace-builds/src-noconflict/ext-settings_menu';
declare module 'ace-builds/src-noconflict/ext-spellcheck';
declare module 'ace-builds/src-noconflict/ext-split';
declare module 'ace-builds/src-noconflict/ext-static_highlight';
declare module 'ace-builds/src-noconflict/ext-statusbar';
declare module 'ace-builds/src-noconflict/ext-textarea';
declare module 'ace-builds/src-noconflict/ext-themelist';
declare module 'ace-builds/src-noconflict/ext-whitespace';
declare module 'ace-builds/src-noconflict/keybinding-emacs';
declare module 'ace-builds/src-noconflict/keybinding-vim';
declare module 'ace-builds/src-noconflict/mode-abap';
declare module 'ace-builds/src-noconflict/mode-abc';
declare module 'ace-builds/src-noconflict/mode-actionscript';
declare module 'ace-builds/src-noconflict/mode-ada';
declare module 'ace-builds/src-noconflict/mode-apache_conf';
declare module 'ace-builds/src-noconflict/mode-applescript';
declare module 'ace-builds/src-noconflict/mode-asciidoc';
declare module 'ace-builds/src-noconflict/mode-asl';
declare module 'ace-builds/src-noconflict/mode-assembly_x86';
declare module 'ace-builds/src-noconflict/mode-autohotkey';
declare module 'ace-builds/src-noconflict/mode-batchfile';
declare module 'ace-builds/src-noconflict/mode-bro';
declare module 'ace-builds/src-noconflict/mode-c9search';
declare module 'ace-builds/src-noconflict/mode-cirru';
declare module 'ace-builds/src-noconflict/mode-clojure';
declare module 'ace-builds/src-noconflict/mode-cobol';
declare module 'ace-builds/src-noconflict/mode-coffee';
declare module 'ace-builds/src-noconflict/mode-coldfusion';
declare module 'ace-builds/src-noconflict/mode-csharp';
declare module 'ace-builds/src-noconflict/mode-csound_document';
declare module 'ace-builds/src-noconflict/mode-csound_orchestra';
declare module 'ace-builds/src-noconflict/mode-csound_score';
declare module 'ace-builds/src-noconflict/mode-csp';
declare module 'ace-builds/src-noconflict/mode-css';
declare module 'ace-builds/src-noconflict/mode-curly';
declare module 'ace-builds/src-noconflict/mode-c_cpp';
declare module 'ace-builds/src-noconflict/mode-d';
declare module 'ace-builds/src-noconflict/mode-dart';
declare module 'ace-builds/src-noconflict/mode-diff';
declare module 'ace-builds/src-noconflict/mode-django';
declare module 'ace-builds/src-noconflict/mode-dockerfile';
declare module 'ace-builds/src-noconflict/mode-dot';
declare module 'ace-builds/src-noconflict/mode-drools';
declare module 'ace-builds/src-noconflict/mode-edifact';
declare module 'ace-builds/src-noconflict/mode-eiffel';
declare module 'ace-builds/src-noconflict/mode-ejs';
declare module 'ace-builds/src-noconflict/mode-elixir';
declare module 'ace-builds/src-noconflict/mode-elm';
declare module 'ace-builds/src-noconflict/mode-erlang';
declare module 'ace-builds/src-noconflict/mode-forth';
declare module 'ace-builds/src-noconflict/mode-fortran';
declare module 'ace-builds/src-noconflict/mode-ftl';
declare module 'ace-builds/src-noconflict/mode-gcode';
declare module 'ace-builds/src-noconflict/mode-gherkin';
declare module 'ace-builds/src-noconflict/mode-gitignore';
declare module 'ace-builds/src-noconflict/mode-glsl';
declare module 'ace-builds/src-noconflict/mode-gobstones';
declare module 'ace-builds/src-noconflict/mode-golang';
declare module 'ace-builds/src-noconflict/mode-graphqlschema';
declare module 'ace-builds/src-noconflict/mode-groovy';
declare module 'ace-builds/src-noconflict/mode-haml';
declare module 'ace-builds/src-noconflict/mode-handlebars';
declare module 'ace-builds/src-noconflict/mode-haskell';
declare module 'ace-builds/src-noconflict/mode-haskell_cabal';
declare module 'ace-builds/src-noconflict/mode-haxe';
declare module 'ace-builds/src-noconflict/mode-hjson';
declare module 'ace-builds/src-noconflict/mode-html';
declare module 'ace-builds/src-noconflict/mode-html_elixir';
declare module 'ace-builds/src-noconflict/mode-html_ruby';
declare module 'ace-builds/src-noconflict/mode-ini';
declare module 'ace-builds/src-noconflict/mode-io';
declare module 'ace-builds/src-noconflict/mode-jack';
declare module 'ace-builds/src-noconflict/mode-jade';
declare module 'ace-builds/src-noconflict/mode-java';
declare module 'ace-builds/src-noconflict/mode-javascript';
declare module 'ace-builds/src-noconflict/mode-json';
declare module 'ace-builds/src-noconflict/mode-jsoniq';
declare module 'ace-builds/src-noconflict/mode-jsp';
declare module 'ace-builds/src-noconflict/mode-jssm';
declare module 'ace-builds/src-noconflict/mode-jsx';
declare module 'ace-builds/src-noconflict/mode-julia';
declare module 'ace-builds/src-noconflict/mode-kotlin';
declare module 'ace-builds/src-noconflict/mode-latex';
declare module 'ace-builds/src-noconflict/mode-less';
declare module 'ace-builds/src-noconflict/mode-liquid';
declare module 'ace-builds/src-noconflict/mode-lisp';
declare module 'ace-builds/src-noconflict/mode-livescript';
declare module 'ace-builds/src-noconflict/mode-logiql';
declare module 'ace-builds/src-noconflict/mode-lsl';
declare module 'ace-builds/src-noconflict/mode-lua';
declare module 'ace-builds/src-noconflict/mode-luapage';
declare module 'ace-builds/src-noconflict/mode-lucene';
declare module 'ace-builds/src-noconflict/mode-makefile';
declare module 'ace-builds/src-noconflict/mode-markdown';
declare module 'ace-builds/src-noconflict/mode-mask';
declare module 'ace-builds/src-noconflict/mode-matlab';
declare module 'ace-builds/src-noconflict/mode-maze';
declare module 'ace-builds/src-noconflict/mode-mel';
declare module 'ace-builds/src-noconflict/mode-mixal';
declare module 'ace-builds/src-noconflict/mode-mushcode';
declare module 'ace-builds/src-noconflict/mode-mysql';
declare module 'ace-builds/src-noconflict/mode-nix';
declare module 'ace-builds/src-noconflict/mode-nsis';
declare module 'ace-builds/src-noconflict/mode-objectivec';
declare module 'ace-builds/src-noconflict/mode-ocaml';
declare module 'ace-builds/src-noconflict/mode-pascal';
declare module 'ace-builds/src-noconflict/mode-perl';
declare module 'ace-builds/src-noconflict/mode-pgsql';
declare module 'ace-builds/src-noconflict/mode-php';
declare module 'ace-builds/src-noconflict/mode-pig';
declare module 'ace-builds/src-noconflict/mode-plain_text';
declare module 'ace-builds/src-noconflict/mode-powershell';
declare module 'ace-builds/src-noconflict/mode-praat';
declare module 'ace-builds/src-noconflict/mode-prolog';
declare module 'ace-builds/src-noconflict/mode-properties';
declare module 'ace-builds/src-noconflict/mode-protobuf';
declare module 'ace-builds/src-noconflict/mode-python';
declare module 'ace-builds/src-noconflict/mode-r';
declare module 'ace-builds/src-noconflict/mode-razor';
declare module 'ace-builds/src-noconflict/mode-rdoc';
declare module 'ace-builds/src-noconflict/mode-red';
declare module 'ace-builds/src-noconflict/mode-redshift';
declare module 'ace-builds/src-noconflict/mode-rhtml';
declare module 'ace-builds/src-noconflict/mode-rst';
declare module 'ace-builds/src-noconflict/mode-ruby';
declare module 'ace-builds/src-noconflict/mode-rust';
declare module 'ace-builds/src-noconflict/mode-sass';
declare module 'ace-builds/src-noconflict/mode-scad';
declare module 'ace-builds/src-noconflict/mode-scala';
declare module 'ace-builds/src-noconflict/mode-scheme';
declare module 'ace-builds/src-noconflict/mode-scss';
declare module 'ace-builds/src-noconflict/mode-sh';
declare module 'ace-builds/src-noconflict/mode-sjs';
declare module 'ace-builds/src-noconflict/mode-smarty';
declare module 'ace-builds/src-noconflict/mode-snippets';
declare module 'ace-builds/src-noconflict/mode-soy_template';
declare module 'ace-builds/src-noconflict/mode-space';
declare module 'ace-builds/src-noconflict/mode-sparql';
declare module 'ace-builds/src-noconflict/mode-sql';
declare module 'ace-builds/src-noconflict/mode-sqlserver';
declare module 'ace-builds/src-noconflict/mode-stylus';
declare module 'ace-builds/src-noconflict/mode-svg';
declare module 'ace-builds/src-noconflict/mode-swift';
declare module 'ace-builds/src-noconflict/mode-tcl';
declare module 'ace-builds/src-noconflict/mode-tex';
declare module 'ace-builds/src-noconflict/mode-text';
declare module 'ace-builds/src-noconflict/mode-textile';
declare module 'ace-builds/src-noconflict/mode-toml';
declare module 'ace-builds/src-noconflict/mode-tsx';
declare module 'ace-builds/src-noconflict/mode-turtle';
declare module 'ace-builds/src-noconflict/mode-twig';
declare module 'ace-builds/src-noconflict/mode-typescript';
declare module 'ace-builds/src-noconflict/mode-vala';
declare module 'ace-builds/src-noconflict/mode-vbscript';
declare module 'ace-builds/src-noconflict/mode-velocity';
declare module 'ace-builds/src-noconflict/mode-verilog';
declare module 'ace-builds/src-noconflict/mode-vhdl';
declare module 'ace-builds/src-noconflict/mode-wollok';
declare module 'ace-builds/src-noconflict/mode-xml';
declare module 'ace-builds/src-noconflict/mode-xquery';
declare module 'ace-builds/src-noconflict/mode-yaml';
declare module 'ace-builds/src-noconflict/theme-ambiance';
declare module 'ace-builds/src-noconflict/theme-chaos';
declare module 'ace-builds/src-noconflict/theme-chrome';
declare module 'ace-builds/src-noconflict/theme-clouds';
declare module 'ace-builds/src-noconflict/theme-clouds_midnight';
declare module 'ace-builds/src-noconflict/theme-cobalt';
declare module 'ace-builds/src-noconflict/theme-crimson_editor';
declare module 'ace-builds/src-noconflict/theme-dawn';
declare module 'ace-builds/src-noconflict/theme-dracula';
declare module 'ace-builds/src-noconflict/theme-dreamweaver';
declare module 'ace-builds/src-noconflict/theme-eclipse';
declare module 'ace-builds/src-noconflict/theme-github';
declare module 'ace-builds/src-noconflict/theme-gob';
declare module 'ace-builds/src-noconflict/theme-gruvbox';
declare module 'ace-builds/src-noconflict/theme-idle_fingers';
declare module 'ace-builds/src-noconflict/theme-iplastic';
declare module 'ace-builds/src-noconflict/theme-katzenmilch';
declare module 'ace-builds/src-noconflict/theme-kr_theme';
declare module 'ace-builds/src-noconflict/theme-kuroir';
declare module 'ace-builds/src-noconflict/theme-merbivore';
declare module 'ace-builds/src-noconflict/theme-merbivore_soft';
declare module 'ace-builds/src-noconflict/theme-monokai';
declare module 'ace-builds/src-noconflict/theme-mono_industrial';
declare module 'ace-builds/src-noconflict/theme-pastel_on_dark';
declare module 'ace-builds/src-noconflict/theme-solarized_dark';
declare module 'ace-builds/src-noconflict/theme-solarized_light';
declare module 'ace-builds/src-noconflict/theme-sqlserver';
declare module 'ace-builds/src-noconflict/theme-terminal';
declare module 'ace-builds/src-noconflict/theme-textmate';
declare module 'ace-builds/src-noconflict/theme-tomorrow';
declare module 'ace-builds/src-noconflict/theme-tomorrow_night';
declare module 'ace-builds/src-noconflict/theme-tomorrow_night_blue';
declare module 'ace-builds/src-noconflict/theme-tomorrow_night_bright';
declare module 'ace-builds/src-noconflict/theme-tomorrow_night_eighties';
declare module 'ace-builds/src-noconflict/theme-twilight';
declare module 'ace-builds/src-noconflict/theme-vibrant_ink';
declare module 'ace-builds/src-noconflict/theme-xcode';
declare module 'ace-builds/webpack-resolver';
