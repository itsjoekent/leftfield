import React from 'react';
import styled from 'styled-components';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { Typography } from 'pkg.admin-components';
import Library from '@editor/components/Library';

export default function Workspace() {
  return (
    <Container>
      <DropdownPlaceholder>
        <Typography.LargeMenuTitle>Edit your splash page</Typography.LargeMenuTitle>
      </DropdownPlaceholder>
      <DndProvider backend={HTML5Backend}>
        <ElementsContainer />
        <LibraryContainer>
          <Library />
        </LibraryContainer>
      </DndProvider>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.colors.mono[200]};
`;

const DropdownPlaceholder = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  width: 100%;
  padding: 6px 12px;
  background-color: ${(props) => props.theme.colors.blue[200]};

  ${Typography.LargeMenuTitle} {
    color: ${(props) => props.theme.colors.blue[700]};
  }
`;

const LibraryContainer = styled.div`
  width: 100%;
  height: 33.33%;
`;

const ElementsContainer = styled.div`
  width: 100%;
  flex-grow: 1;
  overflow-y: scroll;
`;
