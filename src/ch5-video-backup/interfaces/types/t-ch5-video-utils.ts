export type ICh5VideoListManager = {
    addToMasterCollection: (videoNode: ICh5VideoRef) => void;
    getAllVideoElements: () => ICh5VideoCollection;
}

export type ICh5VideoCollection = {
    [index: string]: ICh5VideoRef;
}

export type ICh5VideoRef = {
    id: string;
    position: { posX: number, posY: number };
}

export type IVideoElementDimensions = {
    offsetLeft: number;
    offsetTop: number;
    totalHeight: number;
    totalWidth: number;
}
