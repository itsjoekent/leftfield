import getStyleValue from 'pkg.campaign-components/utils/getStyleValue';

export default function getCascadingStyleValue(
  styles,
  attribute,
  theme,
  themePath = null,
  devices = [MOBILE_DEVICE],
  defaultValue = null,
) {
  return devices.reduce((acc, device) => {
    if (acc !== defaultValue) {
      return acc;
    }

    return getStyleValue(
      styles,
      attribute,
      theme,
      themePath,
      device,
      defaultValue,
    );
  }, defaultValue);
}
