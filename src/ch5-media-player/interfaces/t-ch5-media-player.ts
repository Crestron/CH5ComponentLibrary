export type TCh5MediaPlayerMyMusicContentItem = {
	titleText: string;
	subTitleText: string;
	id: string;
}

export type TCh5MediaPlayerProgressbarData = {
	StreamState: string;
	TrackSec: number;
	ElapsedSec: number;
	ProgressBar: boolean;
}

export type ignoreActionsForLoader = "Shuffle" | "Repeat" | "PlayAll" | "NextTrack" | "PreviousTrack" | "Seek" | "Ffwd" | "Rewind" | "Play" | "Pause" | "ThumbsDown" | "ThumbsUp";