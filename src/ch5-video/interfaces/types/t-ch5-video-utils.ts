/*
export type localWindowtypeRef extends any {
    Ch5VideoListManager: {} | iCh5VideoListMgr;
}*/

export type iCh5VideoListMgr = {
    addToMasterCollection: (videoNode: iCh5VideoRef) => void,
    getAllVideoElements: () => iCh5VideoCollection
}

export type iCh5VideoCollection = {
    [index: string]: iCh5VideoRef
}

export type iCh5VideoRef = {
    id: string,
    position: { posX: number, posY: number }
}

export type iElementDimensions = {
    offsetLeft: number,
    offsetTop: number,
    totalHeight: number,
    totalWidth: number
}
