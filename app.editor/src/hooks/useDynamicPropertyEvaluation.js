import { get } from 'lodash';
import { useSelector } from 'react-redux';
import { ComponentMeta } from 'pkg.campaign-components';
import {
  selectComponentProperties,
  selectComponentsParentComponentId,
  selectComponentsParentComponentSlotId,
  selectComponentTag,
} from '@editor/features/assembly';

export default function useDynamicPropertyEvaluation(pageId, componentId) {
  const parentComponentId = useSelector(selectComponentsParentComponentId(pageId, componentId));
  const parentComponentTag = useSelector(selectComponentTag(pageId, parentComponentId));
  const parentComponentSlotId = useSelector(selectComponentsParentComponentSlotId(pageId, parentComponentId));

  const slot = get(ComponentMeta[parentComponentTag], `slots.${parentComponentSlotId}`, null);

  const properties = useSelector(selectComponentProperties(pageId, componentId));

  const data = {
    properties,
    slot,
  };

  function evaluateDynamicPropertyAttribute(property, keys) {
    return keys.map((key) => property[key](data));
  }

  return evaluateDynamicPropertyAttribute;
}
