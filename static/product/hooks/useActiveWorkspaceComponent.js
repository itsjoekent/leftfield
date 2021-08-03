import { useSelector } from 'react-redux';
import { ComponentMeta } from 'pkg.campaign-components';
import {
  selectActiveComponentId,
  selectActivePageId,
} from '@product/features/workspace';
import {
  selectComponentTag,
} from '@product/features/assembly';

export default function useActiveWorkspaceComponent() {
  const activePageId = useSelector(selectActivePageId);
  const activeComponentId = useSelector(selectActiveComponentId);
  const activeComponentTag = useSelector(selectComponentTag(activePageId, activeComponentId));

  const activeComponentMeta = ComponentMeta[activeComponentTag];

  return {
    activePageId,
    activeComponentId,
    activeComponentTag,
    activeComponentMeta,
  };
}
