**Sass schema converter**

- Paths to components are hardcoded


1. We traverse the hardcoded components. If they have a .scss file with the same name inside we continue, otherwise skip.
2. Flatten the SCSS and save the output file
3. After flattening the scss for all the component we build the base json structure
4. For each flattened component we get the helper file, generate a json of the component_data and process the flattened scss.
5. Save the output json after processing all the flattened scss.

TODO - explain steps to use in a developer.README FILE
