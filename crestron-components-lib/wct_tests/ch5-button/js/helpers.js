const CH5_BUTTON_MASTERS = {
  LABELS: {
    default: '',
    values: ['Default', 'Primary', 'Info', 'Text', 'Danger', 'Warning', 'Success', 'Secondary'],
    key: 'label',
    classListPrefix: 'ch5-button--'
  },
  ORIENTATIONS: {
    default: 'horizontal',
    values: ['horizontal', 'vertical'],
    key: 'orientation',
    classListPrefix: 'ch5-button--'
  },
  SHAPES: {
    default: 'rounded-rectangle',
    values: ['rounded-rectangle', 'rectangle', 'tab', 'circle', 'oval'],
    key: 'shape',
    classListPrefix: 'ch5-button--'
  },
  SIZES: {
    default: 'regular',
    values: ['regular', 'x-small', 'small', 'large', 'x-large'],
    key: 'size',
    classListPrefix: 'ch5-button--'
  },
  STRETCH: {
    values: ['height', 'width', 'both'],
    key: 'stretch',
    classListPrefix: 'ch5-button--'
  },
  TYPES: {
    default: 'default',
    values: ['default', 'primary', 'info', 'text', 'danger', 'warning', 'success', 'secondary'],
    key: 'type',
    classListPrefix: 'ch5-button--'
  },
  HORIZONTAL_ALIGN_LABELS: {
    default: 'center',
    values: ['center', 'left', 'right'],
    key: 'halignlabel',
    classListPrefix: 'ch5-button--'
  },
  VERTICAL_ALIGN_LABELS: {
    default: 'middle',
    values: ['middle', 'top', 'bottom'],
    key: 'valignlabel',
    classListPrefix: 'ch5-button--'
  },
  CHECKBOX_POSITIONS: {
    default: 'left',
    values: ['left', 'right'],
    key: 'checkboxPosition',
    classListPrefix: 'ch5-button--'
  },
  CHECKBOX_SHOW: {
    default: false,
    values: [true, false],
    key: 'checkboxShow',
    classListPrefix: 'ch5-button--'
  }
};

/*
public static readonly TYPES: TCh5ButtonType[] = ['default', 'primary', 'info', 'text', 'danger', 'warning', 'success', 'secondary'];

public static readonly SHAPES: TCh5ButtonShape[] = ['rounded-rectangle', 'rectangle', 'tab', 'circle', 'oval'];


public static readonly SIZES: TCh5ButtonSize[] = ['regular', 'x-small', 'small', 'large', 'x-large'];

public static readonly STRETCHES: TCh5ButtonStretch[] = ['both', 'width', 'height'];

public static readonly ICON_POSITIONS: TCh5ButtonIconPosition[] = ['first', 'last', 'top', 'bottom'];

public static readonly CHECKBOX_POSITIONS: TCh5ButtonCheckboxPosition[] = ['left', 'right']; // this.getAllCheckboxPositions() // ['left', 'right'];

public static readonly HORIZONTAL_LABEL_ALIGNMENTS: TCh5ButtonHorizontalAlignLabel[] = ['center', 'left', 'right'];
public static readonly VERTICAL_LABEL_ALIGNMENTS: TCh5ButtonVerticalAlignLabel[] = ['middle', 'top', 'bottom'];


public static readonly ORIENTATIONS: TCh5ButtonOrientation[] = ['horizontal', 'vertical'];

*/

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

function log(...input) {
  console.log(...input);
  // console.log('fullTestingArray:', JSON.stringify(fullTestingArray, null, 4));
}