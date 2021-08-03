import React from 'react';
import { Styles as CampaignComponentStyles } from 'pkg.campaign-components';
import WorkspaceMenuAccordion from '@product/components/Workspace/Menu/Accordion';
import WorkspaceMenuPresetsList from '@product/components/Workspace/Menu/Presets/List';
import { Flex } from 'pkg.admin-components';

export default function Styles(props) {
  const {
    isExpanded,
    setIsExpanded,
  } = props;

  return (
    <WorkspaceMenuAccordion
      title="Presets"
      isExpanded={isExpanded}
      setIsExpanded={setIsExpanded}
    >
      <Flex.Column gridGap="12px">
        {[
          CampaignComponentStyles.ButtonStyle.key,
          CampaignComponentStyles.MarkupStyle.key,
          CampaignComponentStyles.TextStyle.key,
        ].map((styleKey) => (
          <WorkspaceMenuPresetsList key={styleKey} styleKey={styleKey} />
        ))}
      </Flex.Column>
    </WorkspaceMenuAccordion>
  );
}
