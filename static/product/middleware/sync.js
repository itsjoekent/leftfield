import md5 from 'md5';
import { get } from 'lodash';
import {
  addChildComponentToSlot,
  archivePreset,
  buildComponent,
  deleteComponentAndDescendants,
  detachPreset,
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
  setPresetName,
  setMetaValue,
  setPageSetting,
  setSiteSetting,
  undo,
  wipePropertyValue,
  wipePropertyInheritedFrom,
  wipeSlot,
  wipeStyle,

  selectComponentName,
  selectComponentSlot,
  selectComponentStyleInheritsFrom,
  selectPageName,
  selectPresetName,
  selectWebsiteId,
} from '@product/features/assembly';
import {
  pushRevision,
  selectAutoSaveHash,
} from '@product/features/autoSave';

const TRIGGERS = [
  addChildComponentToSlot.toString(),
  archivePreset.toString(),
  buildComponent.toString(),
  deleteComponentAndDescendants.toString(),
  detachPreset.toString(),
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
  setPresetName.toString(),
  setMetaValue.toString(),
  setPageSetting.toString(),
  setSiteSetting.toString(),
  undo.toString(),
  wipePropertyValue.toString(),
  wipePropertyInheritedFrom.toString(),
  wipeSlot.toString(),
  wipeStyle.toString(),
];

const ACTION_DESCRIPTIONS = {
  [addChildComponentToSlot.toString()]: ({ action, state }) => {
    const componentName = selectComponentName(action.payload.pageId, action.payload.componentId)(state);
    const parentComponentName = selectComponentName(action.payload.pageId, action.payload.parentComponentId)(state);

    return `Added ${componentName} to ${parentComponentName}`;
  },
  [archivePreset.toString()]: ({ action, state }) => {
    const presetName = selectPresetName(action.payload.presetId)(state);
    return `Archived ${presetName}`;
  },
  [buildComponent.toString()]: ({ action, state }) => {
    const componentName = selectComponentName(action.payload.pageId, action.payload.componentId)(state);
    return `Created ${componentName}`;
  },
  [deleteComponentAndDescendants.toString()]: ({ action, priorState }) => {
    const componentName = selectComponentName(action.payload.pageId, action.payload.componentId)(priorState);
    return `Deleted ${componentName}`;
  },
  [detachPreset.toString()]: ({ action, state, priorState }) => {
    const componentName = selectComponentName(action.payload.pageId, action.payload.componentId)(state);
    const presetId = selectComponentStyleInheritsFrom(action.payload.pageId, action.payload.componentId)(priorState);
    const presetName = selectPresetName(presetId)(state);

    return `Removed ${presetName} from ${componentName}`;
  },
  [duplicateComponent.toString()]: ({ action, state }) => {
    const componentName = selectComponentName(action.payload.pageId, action.payload.componentId)(state);
    return `Duplicated ${componentName}`;
  },
  [exportStyle.toString()]: ({ action, state }) => {
    const componentName = selectComponentName(action.payload.pageId, action.payload.componentId)(state);
    const presetName = selectPresetName(action.payload.presetId)(state);

    return `Created ${presetName} and applied to ${componentName}`;
  },
  [importStyle.toString()]: ({ action, state }) => {
    const componentName = selectComponentName(action.payload.pageId, action.payload.componentId)(state);
    const presetName = selectPresetName(action.payload.presetId)(state);

    return `Applied ${presetName} to ${componentName}`;
  },
  [redo.toString()]: () => 'Redo',
  [removeChildComponentFromSlot.toString()]: ({ action, state, priorState }) => {
    const parentComponentName = selectComponentName(action.payload.pageId, action.payload.componentId)(state);
    const slot = selectComponentSlot(action.payload.pageId, action.payload.componentId, action.payload.slotId)(priorState);
    const childName = selectComponentName(action.payload.pageId, slot[action.payload.targetIndex])(state);

    return `Removed ${childName} from ${parentComponentName}`;
  },
  [reorderChildComponent.toString()]: ({ action, state }) => {
    const parentComponentName = selectComponentName(action.payload.pageId, action.payload.componentId)(state);
    const slot = selectComponentSlot(action.payload.pageId, action.payload.componentId, action.payload.slotId)(priorState);
    const childName = selectComponentName(action.payload.pageId, slot[action.payload.fromIndex])(state);

    return `Reordered ${childName} in ${parentComponentName}`;
  },
  // [resetComponentStyleAttribute]: ({ action, state }) => {
  //   const componentName = selectComponentName(action.pageId, action.componentId)(state);
  // },
};

const sync = store => next => action => {
  const priorState = store.getState();
  const result = next(action);

  const state = store.getState();
  const websiteId = selectWebsiteId(state);

  if (
    !!websiteId
    && TRIGGERS.includes(action.type)
  ) {
    const compareHash = selectAutoSaveHash(state);

    const {
      meta,
      pages,
      siteSettings,
      stylePresets,
      templatedFrom,
      theme,
    } = state.assembly;

    const payload = {
      meta,
      pages,
      siteSettings,
      stylePresets,
      templatedFrom,
      theme,
    };

    const stringified = JSON.stringify(payload);
    const versionHash = md5(stringified);

    if (compareHash !== versionHash) {
      const descriptionGenerator = ACTION_DESCRIPTIONS[action.type];
      const description = descriptionGenerator
        ? descriptionGenerator({ action, state, priorState })
        : null;

      store.dispatch(pushRevision({
        data: stringified,
        hash: versionHash,
        description,
      }));
    }
  }

  return result;
}

export default sync;
