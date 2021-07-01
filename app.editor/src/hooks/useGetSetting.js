import { get } from 'lodash';
import { useSelector } from 'react-redux';
import {
  SITE_SETTINGS,
  TEMPLATE_SETTINGS,
  PAGE_SETTINGS,
} from '@editor/constants/inheritance';
import {
  selectPageSettings,
  selectPageTemplateId,
  selectSiteSettings,
} from '@editor/features/assembly';

export default function useGetSetting(pageId) {
  const pageSettings = useSelector(selectPageSettings(pageId));
  const templateId = useSelector(selectPageTemplateId(pageId));
  const templateSettings = useSelector(selectPageSettings(templateId))
  const siteSettings = useSelector(selectSiteSettings);

  function getSetting(from, key, defaultValue = null) {
    const search = (() => {
      switch (from) {
        case SITE_SETTINGS:
          return siteSettings;
        case TEMPLATE_SETTINGS:
          return templateSettings;
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
