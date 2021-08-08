export default function isTrue(input) {
  return typeof input === 'string'
    ? (input || '').toLowerCase() === 'true'
    : !!input;
}
