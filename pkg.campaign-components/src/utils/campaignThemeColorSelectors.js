import {
  getLuminance,
  parseToHsl,
  readableColor,
} from 'polished';
import getThemeValue from '@cc/utils/getThemeValue';

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

export function getHighestSaturatedCampaignThemeColor(campaignTheme) {
  const sortedColors = Object.keys(campaignTheme.colors).sort((left, right) => {
    const { saturation: leftSaturation } = parseToHsl(getThemeValue(campaignTheme, `colors.${left}`));
    const { saturation: rightSaturation } = parseToHsl(getThemeValue(campaignTheme, `colors.${right}`));

    return leftSaturation - rightSaturation;
  });

  return sortedColors[0];
}

export function getReadableThemeColor(campaignTheme, backgroundColor) {
  return readableColor(
    backgroundColor,
    getLightestCampaignThemeColor(campaignTheme),
    getDarkestCampaignThemeColor(campaignTheme),
  );
}
