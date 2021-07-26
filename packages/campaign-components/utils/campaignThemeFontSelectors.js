import get from 'lodash/get';

export function getDefaultFontFamily(campaignTheme) {
  return Object.keys(get(campaignTheme, 'fonts', {}))[0];
}

export function getCampaignThemeFontWeights(campaignTheme, fontFamily) {
  return Object.keys(get(campaignTheme, `fontWeights.${fontFamily}`) || {});
}

export function getCampaignThemeFontWeightsSorted(campaignTheme, fontFamily) {
  const fontWeights = getCampaignThemeFontWeights(campaignTheme, fontFamily)
    .map((id) => ({
      ...get(campaignTheme, `fontWeights.${fontFamily}.${id}`),
      id,
    }));

  return fontWeights.sort((a, b) => a.value - b.value);
}

export function getCampaignThemeFontWeightNearest(campaignTheme, fontFamily, targetWeight, direction = 1) {
  const fontWeights = getCampaignThemeFontWeightsSorted(campaignTheme, fontFamily);
  if (direction < 0) fontWeights.reverse();

  for (const weight of fontWeights) {
    if (direction > 0 && weight.value >= targetWeight) return weight.id;
    if (direction < 0 && weight.value <= targetWeight) return weight.id;
  }

  return null;
}
