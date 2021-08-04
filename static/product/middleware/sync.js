import md5 from 'md5';
import { find, get } from 'lodash';
import { ComponentMeta, Settings } from 'pkg.campaign-components';
import {
  PAGE_SETTINGS,
  SETTING_LABELS,
  SITE_SETTINGS,
} from '@product/constants/inheritance';
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
  selectComponentTag,
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

function getPropertyName(pageId, componentId, propertyId, state) {
  return get(
    find(
      get(
        ComponentMeta[selectComponentTag(pageId, componentId)(state)],
        'properties',
        {},
      ),
      { id: propertyId },
    ),
    'label',
    'property',
  );
}

function getStyleName(pageId, componentId, styleId, state) {
  return get(
    find(
      get(
        ComponentMeta[selectComponentTag(pageId, componentId)(state)],
        'styles',
        {},
      ),
      { id: styleId },
    ),
    'label',
    'style',
  );
}

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
  [resetComponentStyleAttribute]: ({ action, state }) => {
    const componentName = selectComponentName(action.payload.pageId, action.payload.componentId)(state);
    const styleName = getStyleName(action.payload.pageId, action.payload.componentId, action.payload.styleId, state);

    return `Reset ${componentName} ${styleName} style`;
  },
  [setCampaignThemeKeyValue.toString()]: () => {
    return 'Updated theme';
  },
  [setComponentPropertyValue.toString()]: ({ action, state }) => {
    const componentName = selectComponentName(action.payload.pageId, action.payload.componentId)(state);
    const propertyName = getPropertyName(action.payload.pageId, action.payload.componentId, action.payload.propertyId, state);

    return `Updated ${componentName} ${propertyName}`;
  },
  [setComponentInheritedFrom.toString()]: ({ action, state }) => {
    const componentName = selectComponentName(action.payload.pageId, action.payload.componentId)(state);
    const propertyName = getPropertyName(action.payload.pageId, action.payload.componentId, action.payload.propertyId, state);

    return `Updated ${componentName} ${propertyName} to use ${SETTING_LABELS[action.payload.value]}`;
  },
  [setComponentStyle.toString()]: ({ action, state }) => {
    const componentName = selectComponentName(action.payload.pageId, action.payload.componentId)(state);
    const styleName = getStyleName(action.payload.pageId, action.payload.componentId, action.payload.styleId, state);

    return `Updated ${componentName} ${styleName} style`;
  },
  [setComponentCustomStyle.toString()]: ({ action, state }) => {
    const componentName = selectComponentName(action.payload.pageId, action.payload.componentId)(state);
    const styleName = getStyleName(action.payload.pageId, action.payload.componentId, action.payload.styleId, state);

    return `Updated ${componentName} ${styleName} style`;
  },
  [setComponentThemeStyle.toString()]: ({ action, state }) => {
    const componentName = selectComponentName(action.payload.pageId, action.payload.componentId)(state);
    const styleName = getStyleName(action.payload.pageId, action.payload.componentId, action.payload.styleId, state);

    return `Updated ${componentName} ${styleName} style`;
  },
  [setPresetName.toString()]: ({ action, priorState }) => {
    const name = action.payload.name;
    const priorName = selectPresetName(action.payload.presetId)(priorState);

    return `Renamed "${priorName}" preset to ${name}`;
  },
  [setMetaValue.toString()]: () => {
    return 'Updated theme';
  },
  [setPageSetting.toString()]: ({ action, state }) => {
    const pageName = selectPageName(action.payload.pageId)(state);
    const name = get(Settings[action.payload.settingId], 'field.label', 'setting');

    return `Updated ${pageName} ${name} setting`;
  },
  [setSiteSetting.toString()]: ({ action }) => {
    const name = get(Settings[action.payload.settingId], 'field.label', 'setting');
    return `Updated ${name} site setting`;
  },
  [undo.toString()]: () => 'Undo',
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
