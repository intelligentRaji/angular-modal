// @ts-check

import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint';
import eslintAirbnbBasedConfig from './eslint.airbnb-based/eslint.airbnb-based-config.js';

export default tsEslint.config(
  eslint.configs.recommended,
  ...tsEslint.configs.recommendedTypeChecked,
  ...tsEslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      ...eslintAirbnbBasedConfig,
    },
  },
  {
    files: ['**/*.js'],
    ...tsEslint.configs.disableTypeChecked,
  },
);
