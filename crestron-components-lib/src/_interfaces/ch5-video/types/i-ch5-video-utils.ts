export interface localWindowInterfaceRef extends Window {
    Ch5VideoListManager: {} | iCh5VideoListMgr;
}

export interface iCh5VideoListMgr {
    addToMasterCollection: (videoNode: iCh5VideoRef) => void,
    getAllVideoElements: () => iCh5VideoCollection
}

export interface iCh5VideoCollection {
    [index: string]: iCh5VideoRef
}

export interface iCh5VideoRef {
    id: string,
    position: { posX: number, posY: number }
}

export interface iElementDimensions {
    offsetLeft: number,
    offsetTop: number,
    totalHeight: number,
    totalWidth: number
}