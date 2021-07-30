import {extractMixins, processSassfile} from './sassToJson';
import {BASE_OBJECT_INTERFACE, HELPERS_PATH, PROPERTIES_INTERFACE, THEME_EDITOR_PATH} from "./utils";

const fs = require('fs');
const flatten = require('sass-flatten');



/**
 * Write to file and create all the missing directories
 * @param data
 * @param path
 */
function writeToFile(data: string, path: string) {
  const directoryPath = path.split('/').slice(0, -1).join('/');
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, {recursive: true});
  }
  fs.writeFile(path, data, (err: NodeJS.ErrnoException | null) => {
    if (err) {
      console.log(err, path);
    }
  })
}

function getHelperForComponent(name: string) {
  try {
    return import(HELPERS_PATH + name + `/helper.ts`);
  } catch (err) {
    throw new Error(`COULD NOT FIND HELPER FILE FOR ${name}`);
  }
}

/**
 * Each time the conversion is run generate a json output file of how the properties look like used in decoding showWhen
 * @param properties
 * @param path
 */
function generatePropertiesJson(properties: PROPERTIES_INTERFACE, path: string) {
  const fileName = `${path}.properties.json`;
  writeToFile(JSON.stringify(Object.values(properties).map(property => {
    return {
      [property.key]: property.values
    }
  })), HELPERS_PATH + path + '/' + fileName)
}

/**
 * Utils function used to extract the global mixins used throughout all the components
 */
function extractGlobalMixins() {
  const mainScss = '@import "./style/mixins";';
  const flattenedScss = flatten(mainScss, THEME_EDITOR_PATH);

  const mixins = extractMixins(flattenedScss);

  return mixins;
}

async function buildJsonStructure(flattenedComponents: {flattenedScss: string, name: string}[]) {
  // The default base structure
  const jsonObject: BASE_OBJECT_INTERFACE = {
    "ch5-elements": [
      {
        component: [],
      }
    ]
  };

  // Extract the global mixins which are used throughout the whole application
  const globalMixins = extractGlobalMixins();


  // For each flattened SCSS component
  for (const component of flattenedComponents) {
    try {
      // Get the helper
      const helper = await getHelperForComponent(component.name);
      // Get the properties
      const properties = await helper.GET_PROPERTIES();
      // Save the properties to a json for future reference
      generatePropertiesJson(properties, component.name);
      // Process the flattened scss
      const outputJson = await processSassfile(component.flattenedScss, component.name, properties, globalMixins);
      jsonObject["ch5-elements"][0].component.push({
        tagName: component.name,
        version: helper.VERSION,
        style: outputJson
      });
    } catch (err) {
      console.log(err, component.name, 'BUILD JSON STRUCTURE');
    }
  }

  return jsonObject;
}

/**
 * For each path flatten the SCSS files - basically resolve the imports
 * @param paths
 */
async function flattenScssComponents(paths: string[]) {
  const flattenedComponents: {flattenedScss: string, name: string}[] = [];
  for (const componentPath of paths) {
    try {
      const fileName = '/' + componentPath + '.scss';
      // Read the content of the entry SCSS File so it can be passed on to the flatten function
      const entrySCSSContent = fs.readFileSync(THEME_EDITOR_PATH + componentPath + fileName, 'utf8');
      // Provide the content of the entry SCSS File and its location to the flatten function. Its location is required so the imports can be resolved
      const output = flatten(entrySCSSContent, THEME_EDITOR_PATH+componentPath);

      writeToFile(output, HELPERS_PATH + componentPath + fileName);

      flattenedComponents.push({
        flattenedScss: output,
        name: componentPath
      })
    } catch (err) {
      console.log(err, componentPath, 'FLATTEN SCSS');
    }
  }

  return flattenedComponents;
}


/**
 * Get an array of ch5 components name found in ch5 theme editor
 * Temporarily not used at the moment - we keep a hardcoded string
 */
async function traverseThemeEditorsObjects(): Promise<string[]> {
  const CH5ComponentsPath = [];
  const dir = await fs.promises.opendir(THEME_EDITOR_PATH);

  for await (const dirent of dir) {
    if (dirent.isDirectory() && /^(ch5)[-a-zA-Z]+/.test(dirent.name)) {
      CH5ComponentsPath.push(dirent.name);
    }
  }

  return CH5ComponentsPath;
}


async function initialize() {
  // Dynamically traversing items is temporarily removed
  // const componentsPath = await traverseThemeEditorsObjects();

  // extractGlobalMixins();
  //
  // return;

  // All the components that are interested in are hardcoded. We will compute the path based on THEME_EDITOR_PATH constant + values below
  const componentsPath = [
    'ch5-background', 'ch5-button', 'ch5-image', 'ch5-list', 'ch5-modal-dialog', 'ch5-overlay-panel',
    'ch5-select', 'ch5-slider', 'ch5-spinner', 'ch5-textinput', 'ch5-toggle', 'ch5-video'
  ];

  // For each component flatten its scss
  const flattenedComponents = await flattenScssComponents(componentsPath);
  // const flattenedComponents = await flattenScssComponents(['ch5-button']);

  // Build the final json structure and compute
  const outputJSON = await buildJsonStructure(flattenedComponents);

  writeToFile(JSON.stringify(outputJSON), './output.json');
}

initialize();
