import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { useSelector } from 'react-redux';
import {
  selectModalType,
  selectModalProps,
  ELEMENT_LIBRARY,
} from '@editor/features/modal';

const componentFileMap = {
  [ELEMENT_LIBRARY]: async () => import('./ElementLibrary'),
};

export default function Modal() {
  const modalType = useSelector(selectModalType);
  const modalProps = useSelector(selectModalProps);

  const [modalComponents, setModalComponents] = React.useState({});

  React.useEffect(() => {
    (async function () {
      if (modalType && !modalComponents[modalType]) {
        const result = await componentFileMap[modalType]();

        setModalComponents((store) => ({
          ...store,
          [modalType]: result.default,
        }));
      }
    })();
  }, [modalType]);

  const ModalComponent = modalComponents[modalType];
  const hasModalComponent = !!ModalComponent;

  return (
    <FadeWrapper hasModalComponent={hasModalComponent}>
      {!!ModalComponent ? <ModalComponent {...(modalProps || {})} /> : null}
    </FadeWrapper>
  );
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const FadeWrapper = styled.div`
  ${(props) => props.hasModalComponent && css`
    animation: ${fadeIn} 0.15s forwards ease-in;
  `}
`;
