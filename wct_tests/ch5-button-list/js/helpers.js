const BASIC_TESTING_TIMEOUT = 40;
const COMPONENT_TESTING_TIMEOUT = 100;

function getDiv(myComponent) {
  return myComponent.getElementsByTagName('div')[0];
}

function getAllButtons(myComponent) {
  return myComponent.getElementsByTagName('ch5-button');
}


function getContainerDivForButtons(myComponent) {
  return myComponent.getElementsByTagName('div')[0].children.getElementsByTagName('div')[0];
}

function getButton(myComponent) {
  return getImmediateChildrenElementsByTagName(getDiv(myComponent), "button", "div")[0];
}

function getSpan(myComponent) {
  return getImmediateChildrenElementsByTagName(getButton(myComponent), "span", "button")[0];
}

function getSpanForLabel(myComponent) {
  return getImmediateChildrenElementsByTagName(getSpan(myComponent), "span", "span")[0];
}

function getSVGTagInSpanForIcon(myComponent) {
  return getImmediateChildrenElementsByTagName(getSpan(myComponent), "svg", "span")[0];
}

function getITagInSpanForIcon(myComponent) {
  return getImmediateChildrenElementsByTagName(getSpan(myComponent), "i", "span")[0];
}

function getITagInButtonForCheckbox(myComponent) {
  return getImmediateChildrenElementsByTagName(getButton(myComponent), "i", "button")[0];
}

function getImmediateChildrenElementsByTagName(controlObject, tagName, parentElement) {
  const output = [];
  const input = controlObject.getElementsByTagName(tagName);
  for (let i = 0; i < input.length; i++) {
    if (input[i].parentNode.nodeName.toString().toUpperCase() === parentElement.toString().toUpperCase()) {
      output.push(input[i]);
    }
  }
  return output;
}
