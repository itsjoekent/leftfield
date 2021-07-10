import React from 'react';
import styled from 'styled-components';
import { Flex } from 'pkg.admin-components';
import Modal from '@editor/components/Modal';
import Workspace from '@editor/components/Workspace';
import Preview from '@editor/components/Preview';
import PreviewSelector from '@editor/components/PreviewSelector';

function App() {
  return (
    <React.Fragment>
      <Page fullWidth fullViewportHeight>
        <Flex.Row
          justify="space-between"
          padding="12px"
          bg={(colors) => colors.mono[100]}
          shadow={(shadows) => shadows.light}
        >
          <LeftSide />
          <RightSide>
            <PreviewSelector />
          </RightSide>
        </Flex.Row>
        <Flex.Row
          as="main"
          justify="space-between"
          flexGrow
          padding="24px"
          minHeight="0"
        >
          <LeftSide>
            <Workspace />
          </LeftSide>
          <RightSide>
            <Preview />
          </RightSide>
        </Flex.Row>
      </Page>
      <Modal />
    </React.Fragment>
  );
}

const Page = styled(Flex.Column)`
  background: radial-gradient(${(props) => props.theme.colors.purple[200]} 1px, transparent 1px);
  background-size: 25px 25px;
`;

const LeftSide = styled.section`
  width: calc(33.33% - 12px);
  height: 100%;
`;

const RightSide = styled.section`
  width: calc(66.66% - 12px);
  height: 100%;
`;

export default App;
