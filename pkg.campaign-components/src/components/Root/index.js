import React from 'react';
import styled from 'styled-components';
import { get } from 'lodash';
import { SECTIONS_SLOT } from '@cc/components/Root/meta';

export default function Root(props) {
  const { slots } = props;

  return (
    <RootContainer>
      {get(slots, SECTIONS_SLOT, null)}
    </RootContainer>
  );
}

const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
`;
