import get from 'lodash.get';
import { US_ENGLISH_LANG } from '@cc/constants/languages';

export default function getPropertyValue(
  properties,
  key,
  language = US_ENGLISH_LANG,
  fallbackLanguage = US_ENGLISH_LANG,
  defaultValue = null,
) {
  const firstAttempt = get(properties, `${key}.value.${language}`, defaultValue);

  if (firstAttempt !== defaultValue) {
    return firstAttempt;
  }

  if (!fallbackLanguage) {
    return defaultValue;
  }

  const secondAttempt = get(properties, `${key}.value.${fallbackLanguage}`, defaultValue);
  if (secondAttempt !== defaultValue) {
    return secondAttempt;
  }

  return defaultValue;
}
