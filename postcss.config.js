/* eslint-disable @typescript-eslint/no-var-requires */

const purgecss = require('@fullhuman/postcss-purgecss')({
  content: ['./src/**/*.tsx'],
  defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
});

module.exports = {
  plugins: [
    require('postcss-import'),
    require('tailwindcss'),
    require('postcss-nested'),
    require('postcss-preset-env')({ stage: 1 }), // Nesting not working with just env
    ...(process.env.NODE_ENV === 'production' ? [purgecss] : []),
  ],
};
