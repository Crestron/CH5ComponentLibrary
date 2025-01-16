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
	if (isLightButton(myCh5Button)) {
		return getButton(myCh5Button);
	} else {
		return getImmediateChildrenElementsByTagName(getButton(myCh5Button), "span", "button")[0];
	}
}

function getSpanForLabel(myCh5Button) {
	if (isLightButton(myCh5Button)) {
		return getImmediateChildrenElementsByTagName(getSpan(myCh5Button), "span", "button")[0];
	} else {
		return getImmediateChildrenElementsByTagName(getSpan(myCh5Button), "span", "span")[0];
	}
}

function getSVGTagInSpanForIcon(myCh5Button) {
	if (isLightButton(myCh5Button)) {
		return getButton(myCh5Button);
	} else {
		return getImmediateChildrenElementsByTagName(getSpan(myCh5Button), "svg", "span")[0];
	}
}

function getITagInSpanForIcon(myCh5Button) {
	if (isLightButton(myCh5Button)) {
		return getImmediateChildrenElementsByTagName(getSpan(myCh5Button), "i", "button")[0];
	} else {
		return getImmediateChildrenElementsByTagName(getSpan(myCh5Button), "i", "span")[0];
	}
}

function getITagInButtonForCheckbox(myCh5Button) {
	return getImmediateChildrenElementsByTagName(getButton(myCh5Button), "i", "button")[0];
}

function isLightButton(myCh5Button) {
	let hasCheckboxIcon = true;
	if (myCh5Button.hasAttribute("checkboxShow") && toBoolean((myCh5Button.hasAttribute('checkboxshow') && myCh5Button.getAttribute('checkboxshow') !== "false")) === true) {
		hasCheckboxIcon = false;
	}
	return hasCheckboxIcon;
}

function toBoolean(val) {
	const str = String(val).toLowerCase().trim();
	switch (str) {
		case "true": case "yes": case "1":
			return true;
		case "false": case "no": case "0":
			return false;
		case "": case null: case undefined: case "null": case "undefined":
				return false;
		default:
			return false;
	}
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
