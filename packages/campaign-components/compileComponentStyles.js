const { compile, serialize, stringify } = require('stylis');
const csso = require('csso');

export default function compileComponentStyles(css) {
  const compiled = serialize(compile(css), stringify);
  const minified = csso.minify(compiled).css;

  return minified;
}
