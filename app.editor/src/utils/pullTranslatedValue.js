import { get } from 'lodash';

export default function pullTranslatedValue(value, language, defaultValue = null) {
  if (typeof value !== 'object') {
    return value;
  }

  return get(value, language, defaultValue);
}
