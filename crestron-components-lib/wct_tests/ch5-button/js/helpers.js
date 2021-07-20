// const CH5_BUTTON_MASTERS = {
//   LABELS: {
//     default: '',
//     values: ['Default', 'Primary', 'Info', 'Text', 'Danger', 'Warning', 'Success', 'Secondary'],
//     key: 'label',
//     classListPrefix: 'ch5-button--'
//   },
//   ORIENTATIONS: {
//     default: 'horizontal',
//     values: ['horizontal', 'vertical'],
//     key: 'orientation',
//     classListPrefix: 'ch5-button--'
//   },
//   SHAPES: {
//     default: 'rounded-rectangle',
//     values: ['rounded-rectangle', 'rectangle', 'tab', 'circle', 'oval'],
//     key: 'shape',
//     classListPrefix: 'ch5-button--'
//   },
//   SIZES: {
//     default: 'regular',
//     values: ['regular', 'x-small', 'small', 'large', 'x-large'],
//     key: 'size',
//     classListPrefix: 'ch5-button--'
//   },
//   STRETCH: {
//     values: ['height', 'width', 'both'],
//     key: 'stretch',
//     classListPrefix: 'ch5-button--'
//   },
//   TYPES: {
//     default: 'default',
//     values: ['default', 'primary', 'info', 'text', 'danger', 'warning', 'success', 'secondary'],
//     key: 'type',
//     classListPrefix: 'ch5-button--'
//   },
//   HORIZONTAL_ALIGN_LABELS: {
//     default: 'center',
//     values: ['center', 'left', 'right'],
//     key: 'halignlabel',
//     classListPrefix: 'ch5-button--'
//   },
//   VERTICAL_ALIGN_LABELS: {
//     default: 'middle',
//     values: ['middle', 'top', 'bottom'],
//     key: 'valignlabel',
//     classListPrefix: 'ch5-button--'
//   },
//   CHECKBOX_POSITIONS: {
//     default: 'left',
//     values: ['left', 'right'],
//     key: 'checkboxPosition',
//     classListPrefix: 'ch5-button--'
//   },
//   CHECKBOX_SHOW: {
//     default: false,
//     values: [true, false],
//     key: 'checkboxShow',
//     classListPrefix: 'ch5-button--'
//   }
// };

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

function createRandomString(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}

function getAttributesList(id) {
  const arr = [];
  for (let k = 0; k < id.attributes.length; k++) {
    arr.push(id.attributes[k].nodeName + ": " + id.attributes[k].nodeValue);
  }
  return arr;
}

function log(...input) {
  console.log(...input);
  // console.log('fullTestingArray:', JSON.stringify(fullTestingArray, null, 4));
}

function mouseDown() {
  console.log("mouseDown");
}
function mouseUp() {
  console.log("mouseUp");
}

function triggerEvent(el, type) {
  if ('createEvent' in document) {
    // modern browsers, IE9+
    var e = document.createEvent('HTMLEvents');
    e.initEvent(type, false, true);
    el.dispatchEvent(e);
  } else {
    // IE 8
    var e = document.createEventObject();
    e.eventType = type;
    el.fireEvent('on' + e.eventType, e);
  }
}