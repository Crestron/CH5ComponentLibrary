/**
 * Create a random string for testing
 * @param {*} lengthOfOutput 
 * @returns String
 */
function createRandomString(lengthOfOutput) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < lengthOfOutput; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}

/**
 * Get the list of attributes for a tag
 * @param {*} id 
 * @returns Array
 */
function getAttributesList(id) {
  const arr = [];
  for (let k = 0; k < id.attributes.length; k++) {
    arr.push(id.attributes[k].nodeName + ": " + id.attributes[k].nodeValue);
  }
  return arr;
}

/**
 * Log objects and arrays in formatted manner
 * @param {*} input 
 */
function logStringify(input) {
  console.log(JSON.stringify(input, null, 2));
}

function log(...input) {
  console.log(...input);
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
