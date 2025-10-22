module.exports = {
  // JavaScript/TypeScript
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  arrowParens: 'always',

  // FIX: No more CRLF warnings on Windows
  endOfLine: 'auto',

  // React Native / JSX
  jsxSingleQuote: false,
  bracketSameLine: false,

  // Markdown (preserve manual control)
  proseWrap: 'preserve',

  // Overrides for specific file types
  overrides: [
    {
      files: ['*.md'],
      options: {
        proseWrap: 'preserve',
        printWidth: 120, // Markdown can be longer
      },
    },
  ],
};
