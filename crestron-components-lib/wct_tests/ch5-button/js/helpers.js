const BASIC_TESTING_TIMEOUT = 40;

function getDiv(myCh5Button) {
  return myCh5Button.getElementsByTagName('div')[0];
  // return myCh5Button.getImmediateChildrenElementsByTagName('div', Ch5Button)[0];
}

function getButton(myCh5Button) {
  // return getDiv(myCh5Button).getImmediateChildrenElementsByTagName("button", "div")[0];
  return getImmediateChildrenElementsByTagName(getDiv(myCh5Button), "button", "div")[0];
}

function getSpan(myCh5Button) {
  return getImmediateChildrenElementsByTagName(getButton(myCh5Button), "span", "button")[0];
}

function getSpanForLabel(myCh5Button) {
  return getImmediateChildrenElementsByTagName(getSpan(myCh5Button), "span", "span")[0];
}

function getSVGTagInSpanForIcon(myCh5Button) {
  return getImmediateChildrenElementsByTagName(getSpan(myCh5Button), "svg", "span")[0];
}

function getITagInSpanForIcon(myCh5Button) {
  return getImmediateChildrenElementsByTagName(getSpan(myCh5Button), "i", "span")[0];
}

function getITagInButtonForCheckbox(myCh5Button) {
  return getImmediateChildrenElementsByTagName(getButton(myCh5Button), "i", "button")[0];
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
  // return getElementById(tagName);
}
