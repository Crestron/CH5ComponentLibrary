import { ICh5VideoCollection, ICh5VideoListManager, ICh5VideoRef } from './interfaces/types';
import './i-ch5-video.d.ts';

declare var window: any;

/**
 * Class designed for handling all the global management of video manager
 * Some challenges like, coordinated window rendering of ch5-video sections within a list of them etc
 * will be addressed here
 */
export class Ch5VideoListManager implements ICh5VideoListManager {
    // this var controls the list of video tags subscribed under the manager, essentially all the ones in the app
    private _videoCollection: { [index: string]: ICh5VideoRef } = {};
    // this var controls the list of the ch5-video elements strictly in view
    private _videoCollectionInView: { [index: string]: ICh5VideoRef } = {};
    
    constructor() {
        this._init();
    }
    /**
     * _init
     * @returns Function to initialize the ch5VideoListMgr object on window
     */
    private _init() {
        if (typeof window === "object" && typeof window.Ch5VideoListManager === "undefined") {
            window.Ch5VideoListManager = {} as ICh5VideoListManager;
        }
        return window.Ch5VideoListManager;
    }

    /**
     * getVideoList
     * Function that returns the list of all the subscribed ch5-video objects currently in project
     */
    public getInstance() {
        return this;
    }

    /**
     * pushVideoRefNode
     * Function to add a video element's reference into the global object's observable
     */
    public addToMasterCollection(videoNode: ICh5VideoRef) {
        this._videoCollection[videoNode.id] = videoNode;
    }

    /**
     * getVideoElements
     * Function to return the video elements subscribed under manager
     */
    public getAllVideoElements(): ICh5VideoCollection {
        return this._videoCollection;
    }

    /**
     * getVideoElements
     * Function to return the video elements subscribed under manager
     */
    public getAllVideoElements_InView(): ICh5VideoCollection {
        return this._videoCollectionInView;
    }

    /**
     * updateVideoRefStatus_InView
     * Function to update the status for a given ch5-video element to be under the visible range
     */
    public updateVideoRefStatus_InView(videoRefObj: ICh5VideoRef) {
        this._videoCollectionInView[videoRefObj.id] = videoRefObj;
    }

    /**
     * updateVideoRefStatus_OutView
     * Function to update the status for a given ch5-video element to be under the visible range
     */
    public updateVideoRefStatus_OutView(videoRefID: string) {
        delete this._videoCollectionInView[videoRefID];
    }

    /**
     * _triggerCanvasCut
     * Function to trigger the canvas based cut of master background images 
     * for the entire list of video elements part of the visible collection
     * THIS IS THE OBSERVABLE HANDLER RESPONSIBLE FOR PERFORMING THE CUTS FOR ALL IN-VIEW VIDEO ELEMENTS
     */
    private _triggerCanvasCut(): void {
        // TODO - Remove later if unused after multi-video testing 
        const items = this._videoCollectionInView;
    }
}

// Finally, allocate the Ch5VideoListMgr as an object to window
window.Ch5VideoListManager = new Ch5VideoListManager();

