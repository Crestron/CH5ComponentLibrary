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

export enum IgnoreActionsForLoader {
	Shuffle,       // 0
	Repeat,        // 1
	PlayAll,       // 2
	NextTrack,     // 3
	PreviousTrack, // 4
	Seek,          // 5
	Ffwd,          // 6
	Rewind,        // 7
	Play,          // 8
	Pause,         // 9
	ThumbsDown,    // 10
	ThumbsUp,      // 11
	MusicNote,     // 12
	UserNote       //13
  }
  
  