import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { Buttons, Flex, Icons } from 'pkg.admin-components';
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
    const modalElement = modalRef.current;

    function handleClickOutside(event) {
      if (!modalElement) {
        return;
      }

      if (!modalElement.contains(event.target)) {
        dispatch(closeModal());
      }
    }

    if (modalElement) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      if (modalElement) {
        document.removeEventListener('mousedown', handleClickOutside);
      }
    };
  }, [
    dispatch,
  ]);

  return (
    <Backdrop>
      <ModalContainer
        ref={modalRef}
        width={width}
        role="dialog"
        aria-label={title}
      >
        <TitleRow
          justify="flex-end"
          align="center"
          padding="6px"
          bg={(colors) => colors.mono[200]}
        >
          <Buttons.IconButton
            IconComponent={Icons.CloseRound}
            color={(colors) => colors.mono[600]}
            hoverColor={(colors) => colors.mono[900]}
            aria-label="Close dialog"
            onClick={() => dispatch(closeModal())}
          />
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
`;
