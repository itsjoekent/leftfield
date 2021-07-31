export function notZero(styleValue) {
  return styleValue !== undefined && styleValue !== null && styleValue !== 0;
}

export function isStyleDefined(styleValue) {
  return styleValue !== undefined && styleValue !== null;
}

export function isStyleArrayDefined(styleValue, truthyCheck = isStyleDefined) {
  if (Array.isArray(styleValue)) {
    return !styleValue.find((value) => !truthyCheck(value));
  }

  return truthyCheck(styleValue);
}

export default function applyStyleIf(
  styleValue = null,
  style = () => {},
  truthyCheck = isStyleDefined,
) {
  if (truthyCheck(styleValue)) {
    if (typeof style === 'string') {
      return style;
    }

    return style(styleValue);
  }

  return '';
}
