// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.js'],
    extends: [tseslint.configs.disableTypeChecked],
  },
  // {
  //   rules: {
  //     '@typescript-eslint/no-explicit-any': 'error',
  //     '@typescript-eslint/explicit-function-return-type': 'error',
  //     '@typescript-eslint/explicit-module-boundary-types': 'error',
  //     '@typescript-eslint/explicit-member-accessibility': 'error',
  //     '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
  //   },
  // },
);
