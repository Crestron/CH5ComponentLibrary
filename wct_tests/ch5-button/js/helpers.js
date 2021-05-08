const CH5_BUTTON_MASTERS = {
  LABELS: {
    default: '',
    values: ['Default', 'Primary', 'Info', 'Text', 'Danger', 'Warning', 'Success', 'Secondary'],
    key: 'label'
  },
  ORIENTATIONS: {
    default: 'horizontal',
    values: ['horizontal', 'vertical'],
    key: 'orientation'
  },
  SHAPES: {
    default: 'rounded-rectangle',
    values: ['rounded-rectangle', 'rectangle', 'tab', 'circle', 'oval'],
    key: 'shape'
  },
  SIZES: {
    default: 'regular',
    values: ['regular', 'x-small', 'small', 'large', 'x-large'],
    key: 'size'
  },
  STRETCH: {
    values: ['height', 'width', 'both'],
    key: 'stretch'
  },
  TYPES: {
    default: 'default',
    values: ['default', 'primary', 'info', 'text', 'danger', 'warning', 'success', 'secondary'],
    key: 'type'
  }
}

function getDiv(myCh5Button) {
  return myCh5Button.children[0];
}

function getButton(myCh5Button) {
  return myCh5Button.children[0].children[0];
}

function getSpan(myCh5Button) {
  return myCh5Button.children[0].children[0].children[0];
}

function log(...input) {
  console.log(...input);
  // console.log('fullTestingArray:', JSON.stringify(fullTestingArray, null, 4));
}