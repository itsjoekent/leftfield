import { find, get } from 'lodash';
import { useSelector } from 'react-redux';
import { ComponentMeta } from 'pkg.campaign-components';
import {
  selectComponentProperties,
  selectComponentsParentComponentId,
  selectComponentsParentComponentSlotId,
  selectComponentTag,
} from '@product/features/assembly';

export default function useDynamicEvaluation(route, componentId) {
  const parentComponentId = useSelector(selectComponentsParentComponentId(route, componentId));
  const parentComponentTag = useSelector(selectComponentTag(route, parentComponentId));
  const parentComponentSlotId = useSelector(selectComponentsParentComponentSlotId(route, componentId));

  const slot = find(get(ComponentMeta[parentComponentTag], 'slots'), { id: parentComponentSlotId }) || null;

  const properties = useSelector(selectComponentProperties(route, componentId));

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
