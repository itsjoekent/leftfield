import get from 'lodash/get';
import set from 'lodash/set';

export function setValue(fieldId, value) {
  return function _setValue(state) {
    set(state, `values.${fieldId}`, value);
  }
}

export function setIsFocused(fieldId, isFocused) {
  return function _setValue(state) {
    set(state, `isFocused.${fieldId}`, isFocused);
  }
}
