import React from 'react';
import styled from 'styled-components';
import { Flex } from 'pkg.admin-components';
import Modal from '@editor/components/Modal';
import Workspace from '@editor/components/Workspace';
import Preview from '@editor/components/Preview';
import PreviewSelector from '@editor/components/PreviewSelector';

function App() {
  const previewContainerRef = React.useRef(null);
  const [previewContainerDimensions, setpreviewContainerDimensions] = React.useState(null);

  React.useEffect(() => {
    function updateDimensions() {
      const boundingRect = previewContainerRef.current.getBoundingClientRect();
      setpreviewContainerDimensions([boundingRect.width - 24, boundingRect.height - 24]);
    }

    function onResize(event) {
      updateDimensions();
    }

    if (previewContainerRef.current) {
      window.addEventListener('resize', onResize);

      if (!previewContainerDimensions) {
        updateDimensions();
      }

      return () => window.removeEventListener('resize', onResize);
    }
  }, [previewContainerDimensions]);

  return (
    <React.Fragment>
      <Page fullWidth minHeight="100vh" align="center">
        <Flex.Row
          fullWidth
          justify="center"
          bg={(colors) => colors.mono[100]}
          shadow={(shadows) => shadows.light}
          padding="12px"
        >
          <LeftSide />
          <RightSide>
            <PreviewSelector />
          </RightSide>
        </Flex.Row>
        <Flex.Row
          as="main"
          fullWidth
          justify="space-between"
          flexGrow
          padding="24px"
          minHeight="0"
        >
          <WorkspaceContainer as="section">
            <Workspace />
          </WorkspaceContainer>
          <PreviewContainer
            as="section"
            ref={previewContainerRef}
          >
            <Preview previewContainerDimensions={previewContainerDimensions} />
          </PreviewContainer>
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

const LeftSide = styled.div`
  width: calc(40% - 12px);

  @media (min-width: 1280px) {
    width: calc(33.33% - 12px);
  }
`;

const RightSide = styled.div`
  width: calc(60% - 12px);

  @media (min-width: 1280px) {
    width: calc(66.66% - 12px);
  }
`;

const WorkspaceContainer = styled(LeftSide)`
  height: calc(100vh - 96px);
`;

const PreviewContainer = styled(RightSide)`
  position: relative;
  overflow: hidden;
  height: calc(100vh - 96px);
`;

export default App;
