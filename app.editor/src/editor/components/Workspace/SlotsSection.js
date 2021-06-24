import React from 'react';
import { get } from 'lodash';
import WorkspaceFieldLabel from '@editor/components/Workspace/FieldLabel';
import WorkspaceFieldList from '@editor/components/Workspace/FieldList';
import WorkspaceFieldGroup from '@editor/components/Workspace/FieldGroup';
import WorkspaceSlotList from '@editor/components/Workspace/SlotList';
import useActiveWorkspaceComponent from '@editor/hooks/useActiveWorkspaceComponent';

export default function WorkspaceSlotsSection() {
  const { activeComponentMeta } = useActiveWorkspaceComponent();
  const slots = get(activeComponentMeta, 'slots', []);

  return (
    <WorkspaceFieldList>
      {slots.map((slot) => (
        <WorkspaceFieldGroup key={slot.id}>
          <WorkspaceFieldLabel
            labelCopy={slot.label}
            labelFor={false}
            isRequired={false}
            help={slot.help}
          />
          <WorkspaceSlotList slotId={slot.id} />
        </WorkspaceFieldGroup>
      ))}
    </WorkspaceFieldList>
  );
}
