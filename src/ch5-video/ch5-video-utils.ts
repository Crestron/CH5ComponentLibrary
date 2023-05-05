export class CH5VideoUtils {

    public static readonly SVG_ICONS = {
        FULLSCREEN_ICON: '<svg xmlns="http://www.w3.org/2000/svg" class="svgIconStyle" class="svgIconStyle" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>',
    }

    public static readonly VIDEO_ACTION = {
        START: 'start',
        STARTED: 'started',
        STOP: 'stop',
        STOPPED: 'stopped',
        RESIZE: 'resize',
        RESIZED: 'resized',
        REFILL: 'refill',
        SNAPSHOT: 'snapshot',
        MARK: 'mark',
        NOURL: 'nourl',
        FULLSCREEN: 'fullscreen',
        ERROR: 'error',
        EMPTY: ''
    }

    public static validateVideoUrl(videoUrl: string): boolean {
        if (videoUrl.startsWith('rtsp://') || videoUrl.startsWith('http://')
            || videoUrl.startsWith('https://')) {
            return true;
        } else {
            return false;
        }
    }


    public static isPortrait = (): boolean => {
        return window.innerHeight > window.innerWidth;
    }

    public static isLandscape = (): boolean => {
        return !CH5VideoUtils.isPortrait();
    }


    public static rfc3339TimeStamp = () => {
        const d = new Date();
        return (d.getTime() / 1000.0); // epoch time
    }

}