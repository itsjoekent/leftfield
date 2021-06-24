import { useSelector } from 'react-redux';
import { ComponentMeta } from 'pkg.campaign-components';
import {
  selectActiveComponentId,
  selectActivePageId,
} from '@editor/features/workspace';
import {
  selectComponentTag,
} from '@editor/features/assembly';

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
