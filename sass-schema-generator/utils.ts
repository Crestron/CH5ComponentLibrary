export const THEME_EDITOR_PATH = '../../CH5ThemeEditor/';
export const HELPERS_PATH = './helpers/';
export const OUTPUT_PATH = './output/';
export const OUTPUT_PROPERTIES = OUTPUT_PATH + 'properties/';
export const OUTPUT_SCSS = OUTPUT_PATH + 'scss/';
export const OUTPUT_JSON = OUTPUT_PATH + 'sass-output.json';
export const COMPONENT_PATH = "../crestron-components-lib/src/";

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
  selectorStyles: {styleName: string, limits: {}[]}[],
  showWhen: {}
}

export interface BASE_OBJECT_INTERFACE {
  version: string,
  themeVersion: string,
  ch5ElementThemeDefs: {
    [key: string]: {
      componentThemeVersion: string
      selectors: RULES_INTERFACE[]
    }
  }
}
