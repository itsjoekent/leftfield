import { useSelector } from 'react-redux';
import { ComponentMeta } from 'pkg.campaign-components';
import {
  selectActiveComponentId,
  selectActivePageRoute,
} from '@product/features/workspace';
import {
  selectComponentTag,
} from '@product/features/assembly';

export default function useActiveWorkspaceComponent() {
  const activePageRoute = useSelector(selectActivePageRoute);
  const activeComponentId = useSelector(selectActiveComponentId);
  const activeComponentTag = useSelector(selectComponentTag(activePageRoute, activeComponentId));

  const activeComponentMeta = ComponentMeta[activeComponentTag];

  return {
    activePageRoute,
    activeComponentId,
    activeComponentTag,
    activeComponentMeta,
  };
}
