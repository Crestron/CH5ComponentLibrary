# Crestron ch5-import-htmlsnippet web component
A component to load HTML snippets during run time.
This component allows users to load HTML snippets without HTML, HEAD, and BODY tags.
Users can modularize the HTML files into pages or sections using this component.
This component will import and insert the snippet into the DOM at the respective place
during run time.

To import the snippet in Angular, the source directory must be added in the angular.json file as shown below:

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
| url                               | Passes the file path or url to import the HTML Snippet.                |
|:--------------------------------- |:-------------------------------------------------------------------- |


## Receive signal attributes
| Name                              | Description                                                          |
|:--------------------------------- |:-------------------------------------------------------------------- |
| receiveStateShowPulse             | On transition from false to true, this signal will                   | 
|                                   | direct the component to be visible.                             |
| receiveStateHidePulse             | On transition from false to true, the signal will                    |
|                                   | direct the component to be no longer visible.                        |
| sendEventOnShow                   | Has a boolean value of true when the component is visible and        |
|                                   | false when not visible.                                                    |
| receiveStateShow                  | When true, the boolean value of the signal determines if the        |
|                                   | component is seen by the user.                                         |
|:--------------------------------- |:-------------------------------------------------------------------- |
