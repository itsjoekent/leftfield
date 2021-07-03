import { get } from 'lodash';
import { useSelector } from 'react-redux';
import { SiteSettings, Languages } from 'pkg.campaign-components';
import { selectSiteSettings } from '@editor/features/assembly';

export default function useSiteLanguages() {
  const siteSettings = useSelector(selectSiteSettings);

  const languages = get(
    siteSettings,
    `${SiteSettings.LANGUAGES.key}.${Languages.US_ENGLISH_LANG}`,
    [Languages.US_ENGLISH_LANG],
  );

  return languages;
}
