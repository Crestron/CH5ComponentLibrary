function getDiv(ch5ComponentObject) {
  return ch5ComponentObject.getElementsByTagName('div')[0];
}

function getButton(ch5ComponentObject) {
  return getImmediateChildrenElementsByTagName(getDiv(ch5ComponentObject), "button", "div")[0];
}

function getSpan(ch5ComponentObject) {
  return getImmediateChildrenElementsByTagName(getButton(ch5ComponentObject), "span", "button")[0];
}

function getSpanForLabel(ch5ComponentObject) {
  return getImmediateChildrenElementsByTagName(getSpan(ch5ComponentObject), "span", "span")[0];
}

function getSVGTagInSpanForIcon(ch5ComponentObject) {
  return getImmediateChildrenElementsByTagName(getSpan(ch5ComponentObject), "svg", "span")[0];
}

function getITagInSpanForIcon(ch5ComponentObject) {
  return getImmediateChildrenElementsByTagName(getSpan(ch5ComponentObject), "i", "span")[0];
}

function getITagInButtonForCheckbox(ch5ComponentObject) {
  return getImmediateChildrenElementsByTagName(getButton(ch5ComponentObject), "i", "button")[0];
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