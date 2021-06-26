import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useDispatch } from 'react-redux';
import { Flex, Icons } from 'pkg.admin-components';
import { closeModal } from '@editor/features/modal';

export default function DefaultLayout(props) {
  const {
    children,
    width = '620px',
    title = '',
  } = props;

  const dispatch = useDispatch();
  const modalRef = React.useRef(null);

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (!modalRef.current) {
        return;
      }

      if (!modalRef.current.contains(event.target)) {
        dispatch(closeModal());
      }
    }

    if (modalRef.current) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      if (modalRef.current) {
        document.removeEventListener('mousedown', handleClickOutside);
      }
    };
  }, []);

  return (
    <Backdrop>
      <ModalContainer
        ref={modalRef}
        width={width} 
        role="dialog"
        aria-labelledby="modal-title"
      >
        <TitleRow justify="center" align="center" padding="6px">
          <Title id="modal-title">{title}</Title>
          <CloseButton
            aria-label="Close dialog"
            onClick={() => dispatch(closeModal())}
          >
            <Icons.CloseRound width={18} height={18} />
          </CloseButton>
        </TitleRow>
        {children}
      </ModalContainer>
    </Backdrop>
  );
}

const Backdrop = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: ${(props) => props.theme.zIndex.modal};

  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContainer = styled(Flex.Column)`
  display: block;
  position: relative;
  width: ${(props) => props.width};
  background: none;
  ${(props) => props.theme.shadow.light};
`;

const TitleRow = styled(Flex.Row)`
  border-top-right-radius: ${(props) => props.theme.rounded.default};
  border-top-left-radius: ${(props) => props.theme.rounded.default};
  background-color: ${(props) => props.theme.colors.mono[200]};
  position: relative;
`;

const Title = styled.h1`
  ${(props) => props.theme.fonts.main.medium};
  font-size: 14px;
  color: ${(props) => props.theme.colors.mono[700]};
`;

const CloseButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  position: absolute;
  right: 4px;

  width: 22px;
  height: 22px;
  border-radius: 50%;

  cursor: pointer;
  background: none;
  transition: ${(props) => props.theme.animation.defaultTransition} background-color;

  margin: 0;
  padding: 0;
  border: none;

  svg path {
    stroke: ${(props) => props.theme.colors.mono[900]};
    transition: ${(props) => props.theme.animation.defaultTransition} stroke;
  }

  &:hover {
    background-color: ${(props) => props.theme.colors.mono[900]};

    svg path {
      stroke: ${(props) => props.theme.colors.mono[100]};
      transition: ${(props) => props.theme.animation.defaultTransition} stroke;
    }
  }
`;
