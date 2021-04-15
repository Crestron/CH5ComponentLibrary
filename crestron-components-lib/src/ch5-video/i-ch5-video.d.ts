interface localWindowInterfaceRef extends Window {
    Ch5VideoListManager: {} | iCh5VideoListMgr;
}

interface iCh5VideoListMgr {
    getIntance: () => {} | iCh5VideoListMgr,
    addToMasterCollection: (videoNode: iCh5VideoRef) => void,
    getAllVideoElements: () => iCh5VideoCollection
}

interface iCh5VideoCollection {
    [index: string]: iCh5VideoRef
}

interface iCh5VideoRef {
    id: string,
    position: { posX: number, posY: number }
}

interface iElementDimensions {
    offsetLeft: number,
    offsetTop: number,
    totalHeight: number,
    totalWidth: number
}