export default function parseColorPicker(output) {
  const { rgb: { r, g, b, a } } = output;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
