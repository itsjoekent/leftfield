import { get, isEmpty, set } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';
import {
  ComponentMeta,
  Languages,
  Responsive,
  SiteSettings,
  theme,
} from 'pkg.campaign-components';
import { MAIN_COMPONENT } from '@editor/constants/inheritance';
import { getSiteSettings } from '@editor/hooks/useSiteLanguages';

const defaultSettings = Object.keys(SiteSettings).reduce((acc, key) => ({
  ...acc,
  [key]: get(SiteSettings[key], `field.defaultValue`),
}), {});

function _addChildComponentToSlot(
  state,
  payload,
) {
  const {
    componentId,
    pageId,
    parentComponentId,
    slotId,
    slotPlacementOrder,
  } = payload;

  const path = `pages.${pageId}.components.${parentComponentId}.slots.${slotId}`;

  const finalSlotPlacementOrder = isNaN(slotPlacementOrder)
    ? get(state, `${path}.length`, 0)
    : slotPlacementOrder

  const children = get(state, path, []);
  children.splice(finalSlotPlacementOrder, 0, componentId);

  set(state, path, children);
  set(state, `pages.${pageId}.components.${componentId}.childOf`, parentComponentId);
  set(state, `pages.${pageId}.components.${componentId}.withinSlot`, slotId);
}

function _removeChildComponentFromSlot(
  state,
  payload,
) {
  const {
    pageId,
    componentId,
    slotId,
    targetIndex,
  } = payload;

  const path = `pages.${pageId}.components.${componentId}.slots.${slotId}`;
  const children = get(state, path, []);

  children.splice(targetIndex, 1);
  set(state, path, children);
}

export const assemblySlice = createSlice({
  name: 'assembly',
  initialState: {
    compiled: {
      'test': {},
    },
    library: {
      components: {},
      styles: {},
    },
    pages: {
      'test': {
        components: {
          '1': {
            id: '1',
            tag: ComponentMeta.Root.tag,
            name: ComponentMeta.Root.tag,
            properties: {},
            slots: {
              [ComponentMeta.Root.slots[0].id]: [],
            },
          },
        },
        name: 'Test page',
        settings: {},
        rootComponentId: '1',
      },
    },
    siteSettings: {
      ...defaultSettings,
      LANGUAGES: {
        [Languages.US_ENGLISH_LANG]: [
          Languages.US_ENGLISH_LANG,
          Languages.MX_SPANISH_LANG,
        ],
      },
    },
    templatedFrom: null,
    // TODO: Move to library?
    theme: theme.campaign,
  },
  reducers: {
    addChildComponentToSlot: (state, action) => _addChildComponentToSlot(state, action.payload),
    buildComponent: (state, action) => {
      const {
        componentId,
        componentTag,
        pageId,
      } = action.payload;

      const insert = {
        id: componentId,
        tag: componentTag,
        name: ComponentMeta[componentTag].name,
      };

      set(state, `pages.${pageId}.components.${insert.id}`, insert);
    },
    deleteComponentAndDescendants: (state, action) => {
      const {
        pageId,
        componentId,
      } = action.payload;

      const childOf = get(state, `pages.${pageId}.components.${componentId}.childOf`, {});
      const withinSlot = get(state, `pages.${pageId}.components.${componentId}.withinSlot`, {});

      if (!!childOf && !!withinSlot) {
        const targetIndex = get(
          state,
          `pages.${pageId}.components.${childOf}.slots.${withinSlot}`,
          [],
        ).indexOf(componentId);

        _removeChildComponentFromSlot(state, {
          pageId,
          componentId: childOf,
          slotId: withinSlot,
          targetIndex,
        });
      }

      function recursiveDelete(targetComponentId) {
        const slots = get(state, `pages.${pageId}.components.${targetComponentId}.slots`, {});

        Object.keys(slots).forEach((slotId) => {
          slots[slotId].forEach((childId) => recursiveDelete(childId));
        });

        delete state.pages[pageId].components[targetComponentId];
      }

      recursiveDelete(componentId);
    },
    duplicateComponent: (state, action) => {
      const {
        pageId,
        componentId,
      } = action.payload;

      const originalComponent = get(state, `pages.${pageId}.components.${componentId}`);
      const duplicatedComponent = {
        ...originalComponent,
        id: uuid(),
      };

      set(state, `pages.${pageId}.components.${duplicatedComponent.id}`, duplicatedComponent);

      _addChildComponentToSlot(state, {
        pageId,
        componentId: duplicatedComponent.id,
        parentComponentId: get(originalComponent, 'childOf'),
        slotId: get(originalComponent, 'withinSlot'),
      });
    },
    exportComponentToLibrary: (state, action) => {
      const {
        pageId,
        componentId,
      } = action.payload;

      const component = selectComponent(pageId, componentId)({ assembly: state });

      const libraryId = uuid();
      const libraryComponent = {
        ...component,
        id: libraryId,
      };

      delete libraryComponent.childOf;
      delete libraryComponent.withinSlot;

      set(state, `library.components.${libraryId}`, libraryComponent);

      set(state, `pages.${pageId}.components.${componentId}.instanceOf`, libraryId);

      const componentPropertyValues = selectComponentProperties(pageId, componentId)({ assembly: state });
      const languages = getSiteSettings(selectSiteSettings({ assembly: state }));

      const updatedComponentPropertyValues = Object.keys(componentPropertyValues)
        .reduce((acc, propertyId) => {
          const tag = get(componentPropertyValues, `${propertyId}.tag`);
          const property = get(ComponentMeta[tag], `properties`, []);
          const isTranslatable = get(property, 'isTranslatable', false);

          languages.forEach((language) => {
            if (!isTranslatable && language !== Languages.US_ENGLISH_LANG) {
              return;
            }

            set(
              acc,
              `${propertyId}.inheritedFrom.${language}`,
              MAIN_COMPONENT
            );
          });

          return acc;
        }, {});

      set(state, `pages.${pageId}.components.${componentId}.properties`, updatedComponentPropertyValues);
    },
    reorderChildComponent: (state, action) => {
      const {
        pageId,
        componentId,
        slotId,
        fromIndex,
        toIndex,
      } = action.payload;

      const path = `pages.${pageId}.components.${componentId}.slots.${slotId}`;
      const children = get(state, path, []);

      const [targetComponentId] = children.splice(fromIndex, 1);
      children.splice(toIndex, 0, targetComponentId);
      set(state, path, children);
    },
    removeChildComponentFromSlot: (state, action) => _removeChildComponentFromSlot(state, action.payload),
    resetComponentStyleAttribute: (state, action) => {
      const {
        pageId,
        componentId,
        styleId,
        attributeId,
        device,
      } = action.payload;

      set(state, `pages.${pageId}.components.${componentId}.styles.${styleId}.${attributeId}.${device}`, {});
    },
    setComponentPropertyValue: (state, action) => {
      const {
        pageId,
        componentId,
        propertyId,
        value,
        language = Languages.US_ENGLISH_LANG,
      } = action.payload;

      set(state, `pages.${pageId}.components.${componentId}.properties.${propertyId}.value.${language}`, value);
      set(state, `pages.${pageId}.components.${componentId}.properties.${propertyId}.inheritedFrom.${language}`, null);
    },
    setComponentInheritedFrom: (state, action) => {
      const {
        pageId,
        componentId,
        propertyId,
        value,
        language = Languages.US_ENGLISH_LANG,
      } = action.payload;

      set(state, `pages.${pageId}.components.${componentId}.properties.${propertyId}.inheritedFrom.${language}`, value);
      set(state, `pages.${pageId}.components.${componentId}.properties.${propertyId}.value.${language}`, null);
    },
    setComponentStyle: (state, action) => {
      const {
        pageId,
        componentId,
        styleId,
        attributeId,
        device,
        value,
      } = action.payload;

      set(state, `pages.${pageId}.components.${componentId}.styles.${styleId}.${attributeId}.${device}`, value);
    },
    setComponentCustomStyle: (state, action) => {
      const {
        pageId,
        componentId,
        styleId,
        attributeId,
        device,
        value,
      } = action.payload;

      set(state, `pages.${pageId}.components.${componentId}.styles.${styleId}.${attributeId}.${device}`, { custom: value });
    },
    setComponentThemeStyle: (state, action) => {
      const {
        pageId,
        componentId,
        styleId,
        attributeId,
        device,
        value,
      } = action.payload;

      set(state, `pages.${pageId}.components.${componentId}.styles.${styleId}.${attributeId}.${device}`, { inheritFromTheme: value });
    },
    setCompiledPage: (state, action) => {
      const { pageId, compilation } = action.payload;
      set(state, `compiled.${pageId}`, compilation);
    },
    wipePropertyValue: (state, action) => {
      const {
        pageId,
        componentId,
        propertyId,
      } = action.payload;

      set(state, `pages.${pageId}.components.${componentId}.properties.${propertyId}.value`, {});
    },
    wipePropertyInheritedFrom: (state, action) => {
      const {
        pageId,
        componentId,
        propertyId,
      } = action.payload;

      set(state, `pages.${pageId}.components.${componentId}.properties.${propertyId}.inheritedFrom`, {});
    },
    wipeSlot: (state, action) => {
      const {
        pageId,
        componentId,
        slotId,
      } = action.payload;

      const path = `pages.${pageId}.components.${componentId}.slots.${slotId}`;

      get(state, path, []).forEach((childId) => {
        if (get(state, `pages.${pageId}.components.${childId}`)) {
          delete state.pages[pageId].components[childId];
        }
      });

      set(state, path, []);
    },
  },
});

export const {
  addChildComponentToSlot,
  buildComponent,
  deleteComponentAndDescendants,
  duplicateComponent,
  exportComponentToLibrary,
  removeChildComponentFromSlot,
  reorderChildComponent,
  resetComponentStyleAttribute,
  setComponentPropertyValue,
  setComponentInheritedFrom,
  setComponentStyle,
  setComponentCustomStyle,
  setComponentThemeStyle,
  setCompiledPage,
  wipePropertyValue,
  wipePropertyInheritedFrom,
  wipeSlot,
} = assemblySlice.actions;

export default assemblySlice.reducer;

export function selectCampaignTheme(state) {
  return get(state, 'assembly.theme', {});
}

export function selectSiteSettings(state) {
  return get(state, 'assembly.siteSettings', {});
}

export function selectSiteTemplateId(state) {
  return get(state, 'assembly.templatedFrom', null);
}

export function selectPage(pageId) {
  function _selectPage(state) {
    return get(state, `assembly.pages.${pageId}`);
  }

  return _selectPage;
}

export function selectPageSettings(pageId) {
  function _selectPageSettings(state) {
    return get(selectPage(pageId)(state), 'settings', {});
  }

  return _selectPageSettings;
}

export function selectPageName(pageId) {
  function _selectPageName(state) {
    return get(selectPage(pageId)(state), 'name', null);
  }

  return _selectPageName;
}

export function selectPageRootComponentId(pageId) {
  function _selectPageRootComponentId(state) {
    return get(selectPage(pageId)(state), 'rootComponentId', null);
  }

  return _selectPageRootComponentId;
}

export function selectPageComponents(pageId) {
  function _selectPageComponents(state) {
    return get(selectPage(pageId)(state), 'components', null);
  }

  return _selectPageComponents;
}

export function selectComponent(pageId, componentId) {
  function _selectComponent(state) {
    return get(selectPageComponents(pageId)(state), componentId, null);
  }

  return _selectComponent;
}

export function selectComponentTag(pageId, componentId) {
  function _selectComponentTag(state) {
    return get(selectComponent(pageId, componentId)(state), 'tag', null);
  }

  return _selectComponentTag;
}

export function selectComponentName(pageId, componentId) {
  function _selectComponentName(state) {
    return get(selectComponent(pageId, componentId)(state), 'name', null);
  }

  return _selectComponentName;
}

export function selectComponentsParentComponentId(pageId, componentId) {
  function _selectComponentsParentComponentId(state) {
    return get(selectComponent(pageId, componentId)(state), 'childOf', null);
  }

  return _selectComponentsParentComponentId;
}

export function selectComponentsParentComponentSlotId(pageId, componentId) {
  function _selectComponentsParentComponentSlotId(state) {
    return get(selectComponent(pageId, componentId)(state), 'withinSlot', null);
  }

  return _selectComponentsParentComponentSlotId;
}

export function selectComponentSlots(pageId, componentId) {
  function _selectComponentSlots(state) {
    return get(selectComponent(pageId, componentId)(state), 'slots', {});
  }

  return _selectComponentSlots;
}

export function selectComponentSlot(pageId, componentId, slotId) {
  function _selectComponent(state) {
    return get(selectComponentSlots(pageId, componentId)(state), slotId, []);
  }

  return _selectComponent;
}

export function selectComponentSlotMapped(pageId, componentId, slotId) {
  function _selectComponentSlotMapped(state) {
    const componentIds = selectComponentSlot(pageId, componentId, slotId)(state);
    return componentIds
      .map((childId) => selectComponent(pageId, childId)(state))
      .filter((child) => child !== null);
  }

  return _selectComponentSlotMapped;
}

export function selectComponentProperties(pageId, componentId) {
  function _selectComponentProperties(state) {
    return get(selectComponent(pageId, componentId)(state), 'properties', {});
  }

  return _selectComponentProperties;
}

export function selectComponentPropertyValue(pageId, componentId, propertyId, language = Languages.US_ENGLISH_LANG) {
  function _selectComponentPropertyValue(state) {
    return get(selectComponentProperties(pageId, componentId)(state), `${propertyId}.value.${language}`, null);
  }

  return _selectComponentPropertyValue;
}

export function selectComponentPropertyInheritedFrom(pageId, componentId, propertyId) {
  function _selectComponentPropertyInheritedFrom(state) {
    return get(selectComponentProperties(pageId, componentId)(state), `${propertyId}.inheritedFrom`, {});
  }

  return _selectComponentPropertyInheritedFrom;
}

export function selectComponentPropertyInheritedFromForLanguage(pageId, componentId, propertyId, language = Languages.US_ENGLISH_LANG) {
  function _selectComponentPropertyInheritedFromForLanguage(state) {
    return get(selectComponentPropertyInheritedFrom(pageId, componentId, propertyId)(state), language, null);
  }

  return _selectComponentPropertyInheritedFromForLanguage;
}

export function selectComponentStyles(pageId, componentId) {
  function _selectComponentStyles(state) {
    return get(selectComponent(pageId, componentId)(state), 'styles', {});
  }

  return _selectComponentStyles;
}

export function selectComponentStyleAttribute(pageId, componentId, styleId, attributeId) {
  function _selectComponentStyleAttribute(state) {
    return get(selectComponentStyles(pageId, componentId)(state), `${styleId}.${attributeId}`, {});
  }

  return _selectComponentStyleAttribute;
}

export function selectComponentStyleAttributeForDevice(pageId, componentId, styleId, attributeId, device) {
  function _selectComponentStyleAttributeForDevice(state) {
    return get(selectComponentStyleAttribute(pageId, componentId, styleId, attributeId)(state), device, {});
  }

  return _selectComponentStyleAttributeForDevice;
}

export function selectComponentStyleAttributeForDeviceCascading(pageId, componentId, styleId, attributeId, device) {
  function _selectComponentStyleAttributeForDeviceCascading(state) {
    const firstAttempt = selectComponentStyleAttributeForDevice(
      pageId,
      componentId,
      styleId,
      attributeId,
      device,
    )(state);

    if (!isEmpty(firstAttempt)) {
      return firstAttempt;
    }

    const cascading = {
      [Responsive.DESKTOP_DEVICE]: [
        Responsive.TABLET_DEVICE,
        Responsive.MOBILE_DEVICE,
      ],
      [Responsive.MOBILE_DEVICE]: [],
      [Responsive.TABLET_DEVICE]: [Responsive.MOBILE_DEVICE],
    };

    return cascading[device].reduce((acc, cascadingDevice) => {
      if (!isEmpty(acc)) return acc;

      const nthAttempt = selectComponentStyleAttributeForDevice(
        pageId,
        componentId,
        styleId,
        attributeId,
        cascadingDevice,
      )(state);

      return !isEmpty(nthAttempt)
        ? { ...nthAttempt, cascadedFrom: cascadingDevice }
        : acc;
    }, {}) || {};
  }

  return _selectComponentStyleAttributeForDeviceCascading;
}

export function selectComponentInstanceOf(pageId, componentId) {
  function _selectComponentInstanceOf(state) {
    return get(selectComponent(pageId, componentId)(state), 'instanceOf', null);
  }

  return _selectComponentInstanceOf;
}

export function selectLibrary(state) {
  return get(state, 'assembly.library', {});
}

export function selectLibraryComponents(state) {
  return get(selectLibrary(state), 'components', {});
}

export function selectLibraryComponent(componentId) {
  function _selectLibraryComponent(state) {
    if (componentId === 'test') console.trace(componentId);
    return get(selectLibraryComponents(state), componentId, null);
  }

  return _selectLibraryComponent;
}

export function selectLibraryComponentProperties(componentId) {
  function _selectLibraryComponentProperties(state) {
    return get(selectLibraryComponent(componentId)(state), 'properties', {});
  }

  return _selectLibraryComponentProperties;
}

export function selectLibraryComponentProperty(componentId, propertyId) {
  function _selectLibraryComponentProperty(state) {
    return get(selectLibraryComponentProperties(componentId)(state), propertyId, {});
  }

  return _selectLibraryComponentProperty;
}

export function selectCompiledPages(state) {
  return get(state, 'assembly.compiled', {});
}

export function selectCompiledPage(pageId) {
  function _selectCompiledPage(state) {
    return get(selectCompiledPages(state), pageId, {});
  }

  return _selectCompiledPage;
}
