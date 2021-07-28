const { compile, serialize, stringify } = require('stylis');
const CleanCSS = require('clean-css');

export default function compileComponentStyles(css) {
  const compiled = serialize(compile(css), stringify);

  const { styles: minified } = new CleanCSS({
    level: 2,
  }).minify(compiled);

  return minified;
}
