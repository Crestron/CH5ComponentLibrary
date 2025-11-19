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

export enum TCH5NowPlayingActions {
	Shuffle = "Shuffle",
	Repeat = "Repeat",
	PlayAll = "PlayAll",
	NextTrack = "NextTrack",
	PreviousTrack = "PreviousTrack",
	Seek = "Seek",
	Ffwd = "Ffwd",
	Rewind = "Rewind",
	Play = "Play",
	Pause = "Pause",
	ThumbsDown = "ThumbsDown",
	ThumbsUp = "ThumbsUp",
	MusicNote = "MusicNote",
	UserNote = "UserNote"
}

