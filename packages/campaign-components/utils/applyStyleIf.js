export function notZero(styleValue) {
  return styleValue !== undefined && styleValue !== null && styleValue !== 0;
}

export function isStyleDefined(styleValue) {
  return styleValue !== undefined && styleValue !== null;
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
