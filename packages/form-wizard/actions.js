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

export function setValidation(fieldId, validation) {
  return function _setValidation(state) {
    set(state, `validations.${fieldId}`, validation);
  }
}

export function setHasSubmittedOnce(hasSubmittedOnce) {
  return function _setHasSubmittedOnce(state) {
    set(state, 'hasSubmittedOnce', false);
  }
}

export function clearForm() {
  return function _clearForm(state) {
    set(state, 'hasSubmittedOnce', false);
    set(state, 'isFocused', {});
    set(state, 'values', {});
    set(state, 'validations', {});
  }
}
