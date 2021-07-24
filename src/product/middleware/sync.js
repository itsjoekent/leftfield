import md5 from 'md5';
import { get } from 'lodash';
import {
  addChildComponentToSlot,
  buildComponent,
  deleteComponentAndDescendants,
  detachStyleReference,
  duplicateComponent,
  exportStyle,
  importStyle,
  redo,
  removeChildComponentFromSlot,
  reorderChildComponent,
  resetComponentStyleAttribute,
  setCampaignThemeKeyValue,
  setComponentPropertyValue,
  setComponentInheritedFrom,
  setComponentStyle,
  setComponentCustomStyle,
  setComponentThemeStyle,
  setPageSetting,
  setSiteSetting,
  undo,
  wipePropertyValue,
  wipePropertyInheritedFrom,
  wipeSlot,
  wipeStyle,

  selectWebsiteId,
} from '@product/features/assembly';
import {
  pushRevision,
  selectAutoSaveHash,
} from '@product/features/autoSave';

const TRIGGERS = [
  addChildComponentToSlot.toString(),
  buildComponent.toString(),
  deleteComponentAndDescendants.toString(),
  detachStyleReference.toString(),
  duplicateComponent.toString(),
  exportStyle.toString(),
  importStyle.toString(),
  redo.toString(),
  removeChildComponentFromSlot.toString(),
  reorderChildComponent.toString(),
  resetComponentStyleAttribute.toString(),
  setCampaignThemeKeyValue.toString(),
  setComponentPropertyValue.toString(),
  setComponentInheritedFrom.toString(),
  setComponentStyle.toString(),
  setComponentCustomStyle.toString(),
  setComponentThemeStyle.toString(),
  setPageSetting.toString(),
  setSiteSetting.toString(),
  undo.toString(),
  wipePropertyValue.toString(),
  wipePropertyInheritedFrom.toString(),
  wipeSlot.toString(),
  wipeStyle.toString(),
];

const sync = store => next => action => {
  const result = next(action);

  const state = store.getState();
  const websiteId = selectWebsiteId(state);

  if (
    !!websiteId
    && TRIGGERS.includes(action.type)
  ) {
    const compareHash = selectAutoSaveHash(state);

    const {
      pages,
      siteSettings,
      styleLibrary,
      templatedFrom,
      theme,
    } = state.assembly;

    const payload = {
      pages,
      siteSettings,
      styleLibrary,
      templatedFrom,
      theme,
    };

    const versionHash = md5(JSON.stringify(payload));
    if (compareHash !== versionHash) {
      store.dispatch(pushRevision({ data: payload, hash: versionHash }));
    }
  }

  return result;
}

export default sync;
