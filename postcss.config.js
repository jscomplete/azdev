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
    ...(process.env.NODE_ENV === 'production' ? [purgecss] : []),
  ],
};
