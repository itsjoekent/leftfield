import get from 'lodash/get';

export default function getThemeLabels(theme, path, filter) {
  const search = get(theme, path, {});

  const labels = Object.keys(search).map((key) => ({
    value: key,
    label: get(search, `${key}.label`, ''),
  }));

  if (!filter) {
    return labels;
  }

  return labels.filter((label) => filter(search[label.value]));
}
