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