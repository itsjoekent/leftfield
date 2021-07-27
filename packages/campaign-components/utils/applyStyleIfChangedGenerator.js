import applyStyleIf, { isStyleDefined } from 'pkg.campaign-components/utils/applyStyleIf';
import getStyleValue from 'pkg.campaign-components/utils/getStyleValue';

export default function applyStyleIfChangedGenerator() {
  const log = {};

  function applyStyleIfChangedGenerator(
    getStyleValueArgs = {},
    style = () => {},
    truthyCheck = isStyleDefined,
  ) {
    const attribute = getStyleValueArgs[1];
    const styleValue = getStyleValue(getStyleValueArgs);

    if (log[attribute] !== styleValue) {
      log[attribute] = styleValue;
      return applyStyleIf(styleValue, style, truthyCheck);
    }

    return '';
  }

  return applyStyleIfChangedGenerator;
}
