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
