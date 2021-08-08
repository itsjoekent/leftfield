import React from 'react';
import { get } from 'lodash';
import ModalDefaultLayout from '@product/components/Modal/DefaultLayout';
import ManualScreen from '@product/components/Modal/Fonts/ManualScreen';
import StarterScreen from '@product/components/Modal/Fonts/StarterScreen';

export const STARTER_SCREEN = 'STARTER_SCREEN';
export const ADD_CUSTOM_SCREEN = 'ADD_CUSTOM_SCREEN';
export const EDIT_SCREEN = 'EDIT_SCREEN';

export default function Fonts(props) {
  const { font } = props;

  const [screen, setScreen] = React.useState(!!get(font, 'value') ? EDIT_SCREEN : STARTER_SCREEN);
  const title = [STARTER_SCREEN, ADD_CUSTOM_SCREEN].includes(screen) ? 'Add a new font' : 'Edit font configuration';

  return (
    <ModalDefaultLayout title={title} width="800px">
      {screen === STARTER_SCREEN && (
        <StarterScreen setScreen={setScreen} />
      )}
      {([ADD_CUSTOM_SCREEN, EDIT_SCREEN].includes(screen)) && (
        <ManualScreen font={font} />
      )}
    </ModalDefaultLayout>
  );
}
