export const THEME_EDITOR_PATH = '../../CH5ThemeEditor/';
export const HELPERS_PATH = './helpers/';

export interface PROPERTIES_INTERFACE {
  [key: string]: {
    values: string[],
    key: string,
    classListPrefix: string
  }
}

export interface RULES_INTERFACE {
  className: string,
  description: string,
  supports: string[],
  showWhen: {}
}

export interface BASE_OBJECT_INTERFACE {
  "ch5-elements": {
    component: {
      tagName: string,
      version: string,
      style: RULES_INTERFACE[]
    }[]
  }[]
}
