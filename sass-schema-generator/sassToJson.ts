import { PROPERTIES_INTERFACE, RULES_INTERFACE } from "./utils";

const parser = require('css-simple-parser');

function flattenNestedRules(higherSelector: string[], lowerSelector: string[]): string[][] {
  return higherSelector.map(selector => {
    return lowerSelector.map(innerSelector => {
      if (selector.trim().startsWith('&')) {
        return innerSelector.trim() + selector.replace('&', '').trim();
      }
      return innerSelector + selector;
    })
  });
}

/**
 * Remove all single line comments and multi line comments.
 * For single line comments we consider them to start with // and ignore those that start with /// as those are considered documentation
 * @param data
 */
function removeComments(data: string) {
  const singleLineComments = new RegExp(/((?<!\/)[/]{2}(?!\/).*)/);
  const multiLineComments = new RegExp(/(\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\/)/);
  const allCommentsRegex = new RegExp(singleLineComments.source + '|' + multiLineComments.source, 'g');

  return data.replace(allCommentsRegex, '');
}


/**
 * Return the documentation(s) for the provided data (marked by ///)
 * @param data
 */
function extractDocumentation(data: string): string {
  const documentationRegex = new RegExp(/\/\/\/.*/, 'g');

  const documentation = data.match(documentationRegex);

  // Expect only one documentation per selector
  return (documentation || []).map(doc => doc.replace(/\/\/\//, '').replace(/\s\s+/g, ' ').trim())[documentation?.length - 1] || '';
}

/**
 * Return the string provided without any documentation (marked by ///)
 * @param data
 */
function removeDocumentation(data: string): string {
  const documentationRegex = new RegExp(/\/\/\/.*/, 'g');

  return data.replace(documentationRegex, '');
}

/**
 * For the given selector, traverse all its parents and extract the selectors so they can be flattened
 * @param node
 */
function processNodeParents(node: any) {
  let selectors: string[] = [];
  let parentTraversal = node.parent;

  // Traverse the parents of the current selector
  while (parentTraversal.selector) {
    let splitSelectors = removeDocumentation(parentTraversal.selector).replace(/\s\s+/g, ' ').split(',');
    if (selectors.length) {
      const mappedSelectors = flattenNestedRules(selectors, splitSelectors);
      // @ts-ignore
      selectors = mappedSelectors.flat();
    } else {
      selectors = selectors.concat(removeDocumentation(parentTraversal.selector).replace(/\s\s+/g, ' ').split(','));
    }
    parentTraversal = parentTraversal.parent;
  }

  return selectors;
}

/**
 * Process the body of a selector - its properties - so that we can extract those that support variables
 * @param body
 */
function extractVariables(body: string) {
  let supportsVariables = [];
  const splitProperties = body.split(';').map(property => property.replace(/\s\s+/g, ' ').trim());

  for (const property of splitProperties) {
    if (property.includes('$')) {
      const newProperty = property.split(':')[0];
      supportsVariables.push({
        styleName: newProperty,
        limits: [{}]
      });
    }
  }

  return supportsVariables;
}

function removeMixins(data: string) {
  const mixinsRegex = new RegExp(/(@mixin)([\s\S]*?)(^})/, 'gm');
  return data.replace(mixinsRegex, '');
}

/**
 * Extract the mixins from the given scss. Return their name and content
 * @param data
 */
function extractMixins(data: string) {
  const mixins = [];
  // This will match the whole mixin except the last closing bracket } which we will consider to be the last one.
  const mixinsRegex = new RegExp(/(@mixin)([\s\S]*?)(^})/, 'gm');
  const mixinNameRegex = new RegExp(/(@mixin[ a-zA-Z0-9-]+)/, 'g');
  const mixinContentRegex = new RegExp(/(?<={)[\s\S]*(?=})/, 'g');
  for (const mixin of (data.match(mixinsRegex) || [])) {
    const name = mixin.match(mixinNameRegex)[0].substr(7).trim();
    const content = mixin.match(mixinContentRegex)[0].replace(/\s\s+/g, ' ').trim();
    mixins.push({ name, content });
  }
  return mixins;
}

function processInclude(body: string, mixins: { name: string, content: string }[]) {
  let processBody = body;
  const includeRegex = new RegExp(/(@include[ a-zA-Z0-9-$,();]+)/, 'g');
  const includeNameRegex = new RegExp(/(@include[ a-zA-Z0-9-]+)/, 'g');
  if (includeRegex.test(body)) {
    for (const include of (processBody.match(includeRegex) || [])) {
      const includeName = include.match(includeNameRegex)[0].substr(9);
      const mixin = mixins.find(mixin => mixin.name === includeName);
      if (!mixin) {
        console.log(`COULD NOT FIND MIXIN FOR ${includeName}`);
        // throw new Error(`COULD NOT FIND MIXIN FOR ${includeName}`);
      } else {
        processBody = processBody.replace(include, mixins.find(mixin => mixin.name === includeName).content);
      }
    }
  }
  return processBody;
}

function applyBusinessRules(selector: string, showWhen: {}[], businessRules: object) {
  for (const rule of Object.values(businessRules)) {
    if (rule.contains) {
      let containsProperty = selector.toLowerCase().includes(rule.contains);
      const containsNot = selector.toLowerCase().includes(`not(${rule.contains})`);
      if (containsNot) {
        const otherRules = Object.values(businessRules).filter(notRule => notRule.key === rule.key && notRule.value !== rule.value);
        showWhen.push({ [rule.key]: [otherRules.map(otherRule => otherRule.value)] });
      } else if (containsProperty) {
        showWhen.push({ [rule.key]: [rule.value] });
      }
    }
  }
}

/**
 * Compute the showWhen field
 * @param selector
 * @param properties
 * @param businessRules
 */
function computeShowWhen(selector: string, properties: PROPERTIES_INTERFACE, businessRules: object) {
  let showWhen: {}[] = [];

  applyBusinessRules(selector, showWhen, businessRules);

  for (const value of Object.values(properties)) {
    for (const data of value.values.filter(propertyValue => propertyValue.length)) {
      if (selector.indexOf(value.classListPrefix + data) !== -1) {
        // If the 'not' operator is present pipe all the other values except the negated one.
        if (selector.indexOf(`:not(.${value.classListPrefix + data})`) !== -1) {
          showWhen.push({ [value.key]: value.values.filter(tempValue => tempValue !== data) });
        } else {
          showWhen.push({ [value.key]: Array.isArray(data) ? data : [data] });
        }
      }
    }
  }
  return showWhen;
}

async function processSassFile(data: string, name: string, helper: PROPERTIES_INTERFACE, globalMixins: ReturnType<typeof extractMixins>, businessRules: object) {
  let stringifiedData = data;

  // STEP 1: Remove all the multiline/ single line comments, except the documentation marked with ///
  stringifiedData = removeComments(stringifiedData);
  const mixins = extractMixins(stringifiedData).concat(globalMixins);

  stringifiedData = removeMixins(stringifiedData);
  stringifiedData = processInclude(stringifiedData, mixins);

  const rules: RULES_INTERFACE[] = [];
  const ast = parser.parse(stringifiedData);

  // STEP 2: Traverse each selector
  // Selector and body are only some of the properties available.
  parser.traverse(ast, async (node: { selector: string, body: string }) => {
    let selectors = [];
    let selectorStyles = [];
    let description = '';

    // STEP 3: Extract the supported properties - those that have variables - for the current selector
    selectorStyles = extractVariables(node.body);

    // IF it doesn't support any variable, we are not interested in this node.
    if (!selectorStyles.length) {
      return;
    }

    // STEP 4: For each selector traverse its parents so that we can flatten them
    selectors = processNodeParents(node);

    // STEP 5: Process the current selector and extract its documentation (written above the selector)
    description = extractDocumentation(node.selector);

    // STEP 6: To the flattened selectors (its ancestors) append the current selector
    if (selectors.length) {
      selectors = flattenNestedRules(removeDocumentation(node.selector).replace(/\s\s+/g, ' ').split(','), selectors);
    } else {
      selectors = selectors.concat(removeDocumentation(node.selector).replace(/\s\s+/g, ' ').split(','));
    }

    // @ts-ignore
    selectors = selectors.flat();

    // Description & supports applies to all selectors
    // ShowWhen applies to individual selectors only because it is computed based on the selector itself !
    /*
    I.e.     .ch5-button--label + .cx-button-icon-pos-bottom .ch5-button--label ch5-button--size-regular,
            .cx-button-icon-pos-top + .ch5-button--ios-label,
       Although we processed these 2 selectors together so far, we cannot compute the same showWhen for both of them.
       The first one has size regular and has no ios, the second one has ios and no size.
     */

    for (const selector of selectors) {
      rules.push({
        className: selector.trim().replace(/\s\s+/g, ' '),
        description,
        selectorStyles,
        // STEP 7: Extract the show when based on the flattened and individual selectors.
        showWhen: computeShowWhen(selector, helper, businessRules)
      })
    }
  });
  return rules;
}

export {
  processSassFile,
  extractMixins
}
