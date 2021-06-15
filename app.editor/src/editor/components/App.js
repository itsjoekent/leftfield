import React from 'react';
import styled from 'styled-components';
import { Icons } from 'pkg.admin-components';
import Workspace from '@editor/components/Workspace';
import Preview from '@editor/components/Preview';

function App() {
  return (
    <Layout>
      <LeftSide>
        <h1 style={{ color: 'white' }}>
          left
        </h1>
        <Icons.SettingFill />
      </LeftSide>
      <RightSide>
        <Preview />
      </RightSide>
    </Layout>
  );
}

const Layout = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 100vh;
  padding: 24px;
`;

const LeftSide = styled.div`
  width: calc(33.33% - 12px);
  height: 100%;
`;

const RightSide = styled.div`
  width: calc(66.66% - 12px);
  height: 100%;
`;

export default App;

