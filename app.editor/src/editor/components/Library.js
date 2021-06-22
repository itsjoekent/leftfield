import React from 'react';
import styled from 'styled-components';
import get from 'lodash.get';
import { ComponentMeta } from 'pkg.campaign-components';
import LibraryCard from '@editor/components/LibraryCard';

export default function Library() {
  const availableComponents = Object.keys(ComponentMeta)
    .map((metaKey) => ComponentMeta[metaKey])
    .filter((meta) => !get(meta, 'devOnly', false));

  return (
    <Container>
      <SearchBar />
      <ComponentList>
        {availableComponents.map((meta) => (
          <LibraryCard key={meta.tag} campaignComponentMeta={meta} />
        ))}
      </ComponentList>
    </Container>
  );
}

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const SearchBar = styled.div`
  display: block;
  width: 100%;
  height: 45px; // temp
  background-color: ${(props) => props.theme.colors.blue[700]};
  border-top: 1px solid ${(props) => props.theme.colors.blue[800]};
`;

const ComponentList = styled.ol`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 12px;
  flex-grow: 1;
  padding: 12px;
  margin: 0;
  background-color: ${(props) => props.theme.colors.blue[200]};
`;
