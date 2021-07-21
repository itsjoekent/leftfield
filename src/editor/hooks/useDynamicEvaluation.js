import { find, get } from 'lodash';
import { useSelector } from 'react-redux';
import { ComponentMeta } from 'pkg.campaign-components';
import {
  selectComponentProperties,
  selectComponentsParentComponentId,
  selectComponentsParentComponentSlotId,
  selectComponentTag,
} from '@editor/features/assembly';

export default function useDynamicEvaluation(pageId, componentId) {
  const parentComponentId = useSelector(selectComponentsParentComponentId(pageId, componentId));
  const parentComponentTag = useSelector(selectComponentTag(pageId, parentComponentId));
  const parentComponentSlotId = useSelector(selectComponentsParentComponentSlotId(pageId, componentId));

  const slot = find(get(ComponentMeta[parentComponentTag], 'slots'), { id: parentComponentSlotId }) || null;

  const properties = useSelector(selectComponentProperties(pageId, componentId));

  const data = {
    properties,
    slot,
  };

  function evaluateDynamicPropertyAttribute(property, key) {
    return property[key](data);
  }

  function evaluateDynamicSlot(slot, key) {
    return slot[key](data);
  }

  return {
    evaluateDynamicPropertyAttribute,
    evaluateDynamicSlot,
  };
}
