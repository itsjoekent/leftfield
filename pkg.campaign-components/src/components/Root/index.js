import React from 'react';
import styled from 'styled-components';
import get from 'lodash.get';
import {
  SECTIONS_SLOT,
  BACKGROUND_STYLE,
} from '@cc/components/Root/meta';
import BoxStyle from '@cc/styles/box';

export default function Root(props) {
  const { slots, styles } = props;

  return (
    <RootContainer styles={styles}>
      {get(slots, SECTIONS_SLOT, null)}
    </RootContainer>
  );
}

const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;

  ${(props) => BoxStyle.styling({
    campaignTheme: props.theme.campaign,
    styles: get(props, `styles.${BACKGROUND_STYLE}`, {}),
  })}
`;
