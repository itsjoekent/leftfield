import React from 'react';
import styled from 'styled-components';
import { Flex, Icons } from 'pkg.admin-components';
import WorkspaceComponentLibrary from '@editor/components/Workspace/ComponentLibrary';
import WorkspaceComponentToolbar from '@editor/components/Workspace/ComponentToolbar';
import WorkspaceDocumentationSection from '@editor/components/Workspace/DocumentationSection';
import WorkspaceFeedbackSection from '@editor/components/Workspace/FeedbackSection';
import WorkspacePageNavigation from '@editor/components/Workspace/PageNavigation';
import WorkspacePropertiesSection from '@editor/components/Workspace/PropertiesSection';
import WorkspaceSlotsSection from '@editor/components/Workspace/SlotsSection';

console.log([
  Icons.SettingFill,
  Icons.Menu2,
  Icons.QuestionFill,
  Icons.Bug,
])

export default function Workspace() {
  return (
    <WorkspaceContainer fullWidth fullHeight as="article">
      <WorkspacePageNavigation />
      <WorkspaceComponentToolbar />
      <InnerWorkspaceContainer flexGrow justifyContent="space-between" gridGap={36}>
        <Flex.Column fullHeight gridGap={12}>
          <Icons.SettingFill />
          <Icons.Menu2 />
          <Icons.QuestionFill />
          <Icons.Bug />
        </Flex.Column>
        <Flex.Column overflowY="scroll" gridGap={32}>
          <WorkspacePropertiesSection />
          <WorkspaceSlotsSection />
          <WorkspaceDocumentationSection />
          <WorkspaceFeedbackSection />
        </Flex.Column>
      </InnerWorkspaceContainer>
      <WorkspaceComponentLibrary />
    </WorkspaceContainer>
  );
}

const WorkspaceContainer = styled(Flex.Column)`
  position: relative;
  background-color: ${(props) => props.theme.colors.mono[200]};
`;

const InnerWorkspaceContainer = styled(Flex.Row)`
  padding: 12px;
  padding-bottom: 0;
`;
