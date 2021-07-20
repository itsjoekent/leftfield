import get from 'lodash.get';

export default function getThemeLabels(theme, path, test) {
  const search = get(theme, path, {});

  return Object.keys(search).map((key) => ({
    value: key,
    label: get(search, `${key}.label`, ''),
  }));
}
