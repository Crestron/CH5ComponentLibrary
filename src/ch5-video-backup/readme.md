# Creston ch5-import-htmlsnippet web component
Provides a view onto a streaming video window.  Components that are to be placed above the 
video that need to be visible and active (examples include buttons to control playback, 
text describing the video, and annotation controls) need to be defined as child elements 
to this component. 

As a background, the <video> tag provided in modern HTML5 browsers will stream HTTP based protocols 
such as HLS (HTTP Live Streaming) and DASH (dynamic adaptive Streaming over HTTP). These protocols 
are not employed on the vast majority of security cameras, and the design of these protocols specify 
a great deal of buffering (i.e. time delay) that would not be appropriate for use cases associated 
with a security camera.   

The implementation of the <ch5-video> component will not attempt to render the streaming video within 
the HTML rendering engine. A three-tier approach will be employed. In the top tier, the HTML component 
will be responsible for creating invisible rectangles to expose content beneath the HTML rendering engine. 
The second tier will provide a surface (handle to raw buffer to display graphics) that will render the 
streaming video. The top tier and the second tier will coordinate the location and size of rendered video 
stream. The bottom tier is responsible for decoding the video stream and interfacing with the second tier to 
display the decoded video stream. The documentation below describes the configuration of the top tier HTML 
component <ch5-video>. 

In Angular, the following types of bindings are not supported for the code imported and added at runtime:
	* Interpolation
	* Property Binding
	* Event Binding
	* Two-way binding


## CSS Classes
| Name                              | Description                                                          |
|:--------------------------------- |:-------------------------------------------------------------------- |
|:--------------------------------- |:-------------------------------------------------------------------- |


## Attributes
| Name                              | Description                                                          |
|:--------------------------------- |:-------------------------------------------------------------------- |
| indexId                           | Provides the name of the offset identifier to be substituted      |
|                                   | with a 0-based index of the item in the list within the signal      |
|									| names provided in other attributes surrounded by {{ }} delimiters.                  |
| url                               | The source path of the video.                                        |
| sourceType                        | Video Source type can be Network, HDMI, or DM.                        |
| snapShotUrl                       | A snapshot of the video, if any.									   |
| size                              | The display size for the video. The default size will be small     |
|                                   | if not mentioned.													   |	
| zIndex                            | The display of the video moves front and back with regard to  z-axis.              |
| controls                          | When present, it specifies that video controls like start, stop, and     |
|                                   | fullscreen should be displayed.                                      |
| userId                            | The sser ID to access the snapshot along with a password.                   |
| password                          | A password to access the video along witha  user ID.                      |
| snapShotUserId                    | The user ID to access the snapshot along with password.                   |
| snapShotPassword                  | A password to access the snapshot along with a user ID.                   |
| snapShotRefreshRate               | The refresh rate of the snapshot.                                        |
| aspectRatio                       | Sets the ratio of width to height of the video.                      |
| stretch                           | When true, video will be displayed in the whole component.           |
|:--------------------------------- |:-------------------------------------------------------------------- |


## Receive signal attributes
| Name                              | Description                                                          |
|:--------------------------------- |:-------------------------------------------------------------------- |
| receiveStateVideoCount            | Providess the maximum number of available videos.                      |
| receiveStateUrl                   | Default empty. Defines the video URL as an attribute.       		   |
| receiveStateSnapShotURL           | Provides the still image URL to use when selection changes to   |
|                                   | an INDEX value.        													   |
| receiveStatePlay                  | When defined, will play video only when the value is true, and will stop |
|                                   | video when the value is false.                                           |
| receiveStateSelect                | When defined, will play 0-based index of the video source list.      |
| receiveStateSourceType            | Provides the video source type when the selection changes to    |
|                                   | an INDEX value.                                                               |
| receiveStateSnapShotRefreshRate   | Defines the refresh rate for a still image URL.  0 indicates       |
|                                   | no refresh.														       |
| receiveStateUserId                | Provides the user ID for credentials supplied to camera for a video URL.|
| receiveStateSnapShotUserId        | provides the user ID for credentials supplied to camera for an image URL.|
| receiveStatePassword              | Provides the password for credentials supplied to camera for a video URL|
| receiveStateSnapShotPassword      | Provides the password for credentials supplied to camera for an image URL|
| receiveStatePositionChange        | Defines the change of position.
|:--------------------------------- |:-------------------------------------------------------------------- |


## Send event attributes
| Name                              | Description                                                          |
|:--------------------------------- |:-------------------------------------------------------------------- |
| sendEventOnClick                  | Sends a signal on a click or tap event (mouse or swi[e] up and down quickly).    |
| sendEventSelectionChange          | Sends a signal on a source selection change.       		               |
| sendEventSelectionSourceType      | The currently selected source type.                                        |
| sendEventSelectionURL             | When defined, will play a 0-based index of the video source list.      |
| sendEventSelectionSnapShotURL     | The currently selected still image URL.									   |
| sendEventErrorCode                | The current video error code state.      								   |
| sendEventErrorMessage             | The current video error message state.								   |
| sendEventRetryCount               | The current video retry count statte.                                     |
| sendEventResolution               | The current video resolution.											   |
| sendEventState                    | The current state of the video associated with the current source 	   |
|                                   | selection.														   |
| sendEventSnapShotStatus      		| The current state of the snapshot associated with the current source     |
|									| selection															   |
| sendStateSnapShotLastUpdateTime   | The timestamp of the last update time of the still image associated  |
|									| with the current source selection.								   |
|:--------------------------------- |:-------------------------------------------------------------------- |
