export function notZero(styleValue) {
  return styleValue !== null && styleValue !== 0;
}

export default function applyStyleIf(
  styleValue = null,
  style = () => {},
  truthyCheck = (styleValue) => styleValue !== null,
) {
  if (truthyCheck(styleValue)) {
    return style(styleValue);
  }

  return '';
}
