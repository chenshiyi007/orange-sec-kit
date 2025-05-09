module.exports = {
  overrides: [
    {
      files: ['electron/**/*.cjs'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-require-imports': 'off',
        'import/no-commonjs': 'off',
        'jsdoc/require-jsdoc': 'off',
        '@typescript-eslint/ban-require-import': 'off',
        'import/prefer-es-modules': 'off',
      },
    },
  ],
}
