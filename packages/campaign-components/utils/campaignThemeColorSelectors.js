import {
  getLuminance,
  parseToHsl,
  readableColor,
} from 'polished';
import getThemeValue from 'pkg.campaign-components/utils/getThemeValue';

export function getLightestCampaignThemeColor(campaignTheme) {
  const sortedColors = Object.keys(campaignTheme.colors).sort((left, right) => {
    const leftLuminance = getLuminance(getThemeValue(campaignTheme, `colors.${left}`));
    const rightLuminance = getLuminance(getThemeValue(campaignTheme, `colors.${right}`));

    return rightLuminance - leftLuminance;
  });

  return sortedColors[0];
}

export function getDarkestCampaignThemeColor(campaignTheme) {
  const sortedColors = Object.keys(campaignTheme.colors).sort((left, right) => {
    const leftLuminance = getLuminance(getThemeValue(campaignTheme, `colors.${left}`));
    const rightLuminance = getLuminance(getThemeValue(campaignTheme, `colors.${right}`));

    return leftLuminance - rightLuminance;
  });

  return sortedColors[0];
}

export function getBrightestCampaignThemeColor(campaignTheme) {
  const sortedColors = Object.keys(campaignTheme.colors).sort((left, right) => {
    const {
      saturation: leftSaturation,
      lightness: leftLightness,
    } = parseToHsl(getThemeValue(campaignTheme, `colors.${left}`));

    const {
      saturation: rightSaturation,
      lightness: rightLightness,
    } = parseToHsl(getThemeValue(campaignTheme, `colors.${right}`));

    return (rightSaturation + rightLightness) - (leftSaturation + leftLightness);
  });

  return sortedColors[0];
}

export function getReadableThemeColor(campaignTheme, backgroundColor) {
  return readableColor(
    backgroundColor,
    getLightestCampaignThemeColor(campaignTheme),
    getDarkestCampaignThemeColor(campaignTheme),
    false,
  );
}
