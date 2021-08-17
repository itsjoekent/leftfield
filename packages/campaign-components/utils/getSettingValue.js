import get from 'lodash/get';
import { US_ENGLISH_LANG } from 'pkg.campaign-components/constants/languages';

export default function getSettingValue(
  settings,
  key,
  language = US_ENGLISH_LANG,
  fallbackLanguage = US_ENGLISH_LANG,
  defaultValue = null,
) {
  const firstAttempt = get(settings, `${key}.${language}`, defaultValue);

  if (firstAttempt !== defaultValue) {
    return firstAttempt;
  }

  if (!fallbackLanguage || fallbackLanguage === language) {
    return defaultValue;
  }

  const secondAttempt = get(settings, `${key}.${fallbackLanguage}`, defaultValue);
  return secondAttempt;
}
