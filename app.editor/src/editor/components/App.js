import React from 'react';
import styled from 'styled-components';
import Modal from '@editor/components/Modal';
import Workspace from '@editor/components/Workspace';
import Preview from '@editor/components/Preview';
import PreviewSelector from '@editor/components/PreviewSelector';

function App() {
  return (
    <React.Fragment>
      <Page>
        <SectionLayout>
          <LeftSide />
          <RightSide>
            <PreviewSelector />
          </RightSide>
        </SectionLayout>
        <PanelLayout as="main">
          <LeftSide>
            <Workspace />
          </LeftSide>
          <RightSide>
            <Preview />
          </RightSide>
        </PanelLayout>
      </Page>
      <Modal />
    </React.Fragment>
  );
}

const Page = styled.div`
  display: flex;
  flex-direction: column;
  grid-gap: 24px;
  width: 100%;
  height: 100vh;
  padding: 24px;
`;

const SectionLayout = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const PanelLayout = styled(SectionLayout)`
  flex-grow: 1;
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
