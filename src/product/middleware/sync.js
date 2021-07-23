import md5 from 'md5';
import { get } from 'lodash';
import { PARLIAMENTARIAN_ESCAPE_KEY } from '@product/constants/parliamentarian';
import {
  addChildComponentToSlot,
  buildComponent,
  deleteComponentAndDescendants,
  detachStyleReference,
  duplicateComponent,
  exportStyle,
  importStyle,
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
  removeChildComponentFromSlot.toString(),
  reorderChildComponent.toString(),
  resetComponentStyleAttribute.toString(),
  setCampaignThemeKeyValue.toString(),
  setComponentPropertyValue.toString(),
  setComponentInheritedFrom.toString(),
  setComponentCustomStyle.toString(),
  setComponentThemeStyle.toString(),
  setPageSetting.toString(),
  setSiteSetting.toString(),
  wipePropertyValue.toString(),
  wipePropertyInheritedFrom.toString(),
  wipeSlot.toString(),
  wipeStyle.toString(),
];

const sync = store => next => action => {
  const result = next(action);

  const state = store.getState();
  const websiteId = selectWebsiteId(state);

  if (!!websiteId && TRIGGERS.includes(action.type)) {
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
