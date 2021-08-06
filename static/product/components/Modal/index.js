import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { useSelector } from 'react-redux';
import {
  selectModalType,
  selectModalProps,

  ADD_LINK_MODAL,
  CONFIRM_MODAL,
  ELEMENT_LIBRARY_MODAL,
  EXPORT_STYLE_MODAL,
  FILE_SELECTOR,
  FONTS_MODAL,
  WEBSITE_SELECTOR_MODAL,
} from '@product/features/modal';

const componentFileMap = {
  [ADD_LINK_MODAL]: async () => import('./AddLink'),
  [CONFIRM_MODAL]: async () => import('./Confirm'),
  [ELEMENT_LIBRARY_MODAL]: async () => import('./ElementLibrary'),
  [EXPORT_STYLE_MODAL]: async () => import('./ExportStyle'),
  [FILE_SELECTOR]: async () => import('./FileSelector'),
  [FONTS_MODAL]: async () => import('./Fonts'),
  [WEBSITE_SELECTOR_MODAL]: async () => import('./WebsiteSelector'),
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
  }, [
    modalComponents,
    modalType,
  ]);

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
    animation: ${fadeIn} ${(props) => props.theme.animation.defaultTransition} forwards ease-in;
  `}
`;
