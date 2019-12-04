# Creston ch5-import-htmlsnippet web component
Component to load HTML snippets during run time.
This component allows the users to load the HTML snippets without HTML, HEAD and BODY tags.
The users can modularize the HTML files into pages or sections using this component.
This component will import and insert the Snippet into the DOM at the respective place
during run time.

To import the snippet in Angular, we have to add the source directory in angular.json file like below:

"assets": [
 "src/assets/htmlsnippets"
 ]

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
| url                               | Pass the file path or url to import the HTML Snippet.                |
|:--------------------------------- |:-------------------------------------------------------------------- |


## Receive signal attributes
| Name                              | Description                                                          |
|:--------------------------------- |:-------------------------------------------------------------------- |
| receiveStateShowPulse             | On transition from false to true, this signal will                   | 
|                                   | direct the component to be seen by user.                             |
| receiveStateHidePulse             | On transition from false to true, the signal will                    |
|                                   | direct if the component to no longer be seen.                        |
| sendEventOnShow                   | Boolean value of true when the component is visible and false        |
|                                   | when not visible.                                                    |
| receiveStateShow                  | While true, the boolean value of the signal determines if the        |
|                                   | component is seen by user                                            |
|:--------------------------------- |:-------------------------------------------------------------------- |
