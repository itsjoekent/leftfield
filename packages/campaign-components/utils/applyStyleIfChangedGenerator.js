import {
  DESKTOP_DEVICE,
  MOBILE_DEVICE,
  TABLET_DEVICE,
} from 'pkg.campaign-components/constants/responsive';
import applyStyleIf, { isStyleDefined, isStyleArrayDefined } from 'pkg.campaign-components/utils/applyStyleIf';
import getCascadingStyleValue from 'pkg.campaign-components/utils/getCascadingStyleValue';
import getStyleValue from 'pkg.campaign-components/utils/getStyleValue';

const cascadeOrder = {
  [MOBILE_DEVICE]: [MOBILE_DEVICE],
  [TABLET_DEVICE]: [TABLET_DEVICE, MOBILE_DEVICE],
  [DESKTOP_DEVICE]: [DESKTOP_DEVICE, TABLET_DEVICE, MOBILE_DEVICE],
};

export default function applyStyleIfChangedGenerator() {
  const log = {};

  function applyStyleIfChangedGenerator(
    getStyleValueArgs = {},
    style = () => {},
    truthyCheck = isStyleDefined,
  ) {
    const hasManyStyles = Array.isArray(getStyleValueArgs);
    if (hasManyStyles) {
      const attributes = getStyleValueArgs.map((attributeArgs) => attributeArgs.attribute);

      const styleValues = getStyleValueArgs
        .map((attributeArgs) => getCascadingStyleValue({
          ...attributeArgs,
          devices: cascadeOrder[attributeArgs.device || MOBILE_DEVICE],
        }));

      const hasAnyChanged = !!styleValues.find((styleValue, index) => log[attributes[index]] !== styleValue);

      if (hasAnyChanged) {
        styleValues.forEach((styleValue, index) => log[attributes[index]] = styleValue);

        return applyStyleIf(
          styleValues,
          style,
          (styleValue) => isStyleArrayDefined(styleValue, truthyCheck),
        );
      }

      return '';
    }

    const { attribute } = getStyleValueArgs;
    const styleValue = getStyleValue(getStyleValueArgs);

    if (log[attribute] !== styleValue) {
      log[attribute] = styleValue;
      return applyStyleIf(styleValue, style, truthyCheck);
    }

    return '';
  }

  return applyStyleIfChangedGenerator;
}
