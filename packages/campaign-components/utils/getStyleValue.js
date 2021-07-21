import get from 'lodash/get';
import { MOBILE_DEVICE } from 'pkg.campaign-components/constants/responsive';

export default function getStyleValue(
  styles,
  attribute,
  theme,
  themePath = null,
  device = MOBILE_DEVICE,
  defaultValue = null,
) {
  const attributeValues = get(styles, `${attribute}.${device}`, defaultValue);
  const custom = get(attributeValues, 'custom', defaultValue);

  if (custom !== defaultValue) {
    return custom;
  }

  const inheritFromTheme = get(attributeValues, 'inheritFromTheme', defaultValue);

  if (!!theme && !!themePath && !!inheritFromTheme) {
    return get(theme, `${themePath}.${inheritFromTheme}.value`, defaultValue);
  }

  return inheritFromTheme;
}
