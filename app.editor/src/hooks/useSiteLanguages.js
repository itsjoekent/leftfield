import { get } from 'lodash';
import { useSelector } from 'react-redux';
import { SiteSettings, Languages } from 'pkg.campaign-components';
import { selectSiteSettings } from '@editor/features/assembly';

export function getSiteSettings(siteSettings) {
  const languages = get(
    siteSettings,
    `${SiteSettings.LANGUAGES.key}.${Languages.US_ENGLISH_LANG}`,
    [Languages.US_ENGLISH_LANG],
  );

  return languages;
}

export default function useSiteLanguages() {
  const siteSettings = useSelector(selectSiteSettings);

  return getSiteSettings(siteSettings);
}
