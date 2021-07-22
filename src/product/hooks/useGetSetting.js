import { get } from 'lodash';
import { useSelector } from 'react-redux';
import {
  SITE_SETTINGS,
  PAGE_SETTINGS,
} from '@product/constants/inheritance';
import {
  selectPageSettings,
  selectSiteSettings,
} from '@product/features/assembly';

//TODO
export default function useGetSetting(pageId) {
  const pageSettings = useSelector(selectPageSettings(pageId));
  const siteSettings = useSelector(selectSiteSettings);

  function getSetting(from, key, defaultValue = null) {
    const search = (() => {
      switch (from) {
        case SITE_SETTINGS:
          return siteSettings;
        case PAGE_SETTINGS:
          return pageSettings;
        default:
          return null;
      }
    })();

    return get(search, key, defaultValue);
  }

  return getSetting;
}
