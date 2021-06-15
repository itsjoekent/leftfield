import React from 'react';
import styled from 'styled-components';
import { Typography } from 'pkg.admin-components';
import App from '@editor/components/App';
import useMediaQuery from '@editor/hooks/useMediaQuery';

function Entrypoint() {
  const isMobile = useMediaQuery('(max-width: 960px');

  if (isMobile) {
    return (
      <CenteredLayout>
        <Typography.Title>
          Sorry! The editor isn't mobile friendly right now.
        </Typography.Title>
      </CenteredLayout>
    );
  }

  return (
    <App />
  );
}

const CenteredLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;

  ${Typography.Title} {
    color: ${(props) => props.theme.colors.mono[100]};
  }
`;

export default Entrypoint;
