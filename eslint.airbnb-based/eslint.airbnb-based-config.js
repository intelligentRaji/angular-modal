import eslintBestPractices from './eslint.best-practices.js';
import eslintErrors from './eslint.errors.js';
import eslintEs6 from './eslint.es6.js';
// import eslintImports from './eslint.imports.js';
import eslintNode from './eslint.node.js';
import eslintPersonal from './eslint.personal.js';
import eslintStrict from './eslint.strict.js';
import eslintStyle from './eslint.style.js';
import eslintVariables from './eslint.variables.js';

export default {
  ...eslintBestPractices,
  ...eslintErrors,
  ...eslintEs6,
  // ...eslintImports,
  ...eslintNode,
  ...eslintStrict,
  ...eslintStyle,
  ...eslintVariables,
  ...eslintPersonal,
};
