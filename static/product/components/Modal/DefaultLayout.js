import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import {
  Buttons,
  Flex,
  Icons,
  Typography,
} from 'pkg.admin-components';
import { closeModal } from '@product/features/modal';

export default function DefaultLayout(props) {
  const {
    children,
    width = '620px',
    title = '',
    disableClose = false,
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

    if (modalElement && !disableClose) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      if (modalElement && !disableClose) {
        document.removeEventListener('mousedown', handleClickOutside);
      }
    };
  }, [
    disableClose,
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
        {!disableClose && (
          <TitleRow
            justify="space-between"
            align="center"
            padding="12px"
            bg={(colors) => colors.mono[100]}
          >
            <Typography
              as="h2"
              fontStyle="bold"
              fontSize="16px"
              fg={(colors) => colors.mono[700]}
            >
              {title}
            </Typography>
            <Buttons.IconButton
              IconComponent={Icons.CloseRound}
              color={(colors) => colors.mono[600]}
              hoverColor={(colors) => colors.mono[900]}
              aria-label="Close dialog"
              onClick={() => dispatch(closeModal())}
            />
          </TitleRow>
        )}
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
  border-radius: ${(props) => props.theme.rounded.default};
  overflow: hidden;
`;

const TitleRow = styled(Flex.Row)`
  border-top-right-radius: ${(props) => props.theme.rounded.default};
  border-top-left-radius: ${(props) => props.theme.rounded.default};
  border-bottom: 1px solid ${(props) => props.theme.colors.mono[700]};
`;
