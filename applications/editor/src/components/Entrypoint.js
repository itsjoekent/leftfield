import React from 'react';
import styled from 'styled-components';
import App from '@editor/components/App';
import useMediaQuery from '@editor/hooks/useMediaQuery';

function Entrypoint() {
  const isMobile = useMediaQuery('(max-width: 960px');

  if (isMobile) {
    return (
      <CenteredLayout>
        <Title>
          Sorry! The editor isn't mobile friendly right now.
        </Title>
      </CenteredLayout>
    );
  }

  return (
    <App />
  );
}

const Title = styled.h1`
  ${(props) => props.theme.fonts.main.extraBold};
  font-size: 48px;
  line-height: 1.1;
`;

const CenteredLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;

  ${Title} {
    color: ${(props) => props.theme.colors.mono[100]};
  }
`;

export default Entrypoint;
