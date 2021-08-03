import React from 'react';
import { Flex } from 'pkg.admin-components';
import WorkspaceMenuAccordion from '@product/components/Workspace/Menu/Accordion';
import WorkspaceMenuThemeColorList from '@product/components/Workspace/Menu/Theme/ColorList';
import WorkspaceMenuThemeFontList from '@product/components/Workspace/Menu/Theme/FontList';

export default function Theme(props) {
  const {
    isExpanded,
    setIsExpanded,
  } = props;

  return (
    <WorkspaceMenuAccordion
      title="Theme"
      isExpanded={isExpanded}
      setIsExpanded={setIsExpanded}
    >
      <Flex.Column gridGap="24px">
        <WorkspaceMenuThemeColorList />
        <WorkspaceMenuThemeFontList />
      </Flex.Column>
    </WorkspaceMenuAccordion>
  );
}
