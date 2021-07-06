import get from 'lodash.get';

export default function getThemeLabels(theme, path) {
  const search = get(theme, path, {});

  return Object.keys(search).map((key) => ({
    key,
    label: get(search, `key.label`, ''),
  }));
}
