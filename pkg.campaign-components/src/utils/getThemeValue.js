import get from 'lodash.get';

export default function getThemeValue(theme, path, defaultValue = null) {
  return get(theme, `${path}.value`, defaultValue);
}
