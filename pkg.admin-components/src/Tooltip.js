import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import useAdminTheme from '@ac/useAdminTheme';

const UP = 'UP';
const UP_LEFT_ALIGNED = 'UP_LEFT_ALIGNED';
const UP_RIGHT_ALIGNED = 'UP_RIGHT_ALIGNED';
const DOWN = 'DOWN';
const LEFT = 'LEFT';
const RIGHT = 'RIGHT';

export default function Tooltip(props) {
  const theme = useAdminTheme();

  const {
    children,
    point = UP,
    copy = '',
    delay = 750,
    fg = () => theme.colors.mono[100],
    bg = () => theme.colors.mono[900],
  } = props;

  const containerRef = React.useRef(null);
  const [isHovering, setIsHovering] = React.useState(false);

  React.useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    let timeoutId = null;

    function clearTimeout() {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    }

    function onMouseEnter() {
      setTimeout(() => setIsHovering(true), delay);
    }

    function onMouseLeave() {
      clearTimeout();
      setIsHovering(false);
    }

    if (containerRef.current) {
      containerRef.current.addEventListener('mouseenter', onMouseEnter);
      containerRef.current.addEventListener('mouseleave', onMouseLeave);
    }

    return () => {
      clearTimeout();

      if (containerRef.current) {
        containerRef.current.removeEventListener('mouseenter', onMouseEnter);
        containerRef.current.removeEventListener('mouseleave', onMouseLeave);
      }
    };
  }, [
    delay,
  ]);

  return (
    <Container
      ref={containerRef}
      isHovering={isHovering}
      copy={copy}
      point={point}
      fg={fg}
      bg={bg}
    >
      {children}
    </Container>
  );
}

Tooltip.UP = UP;
Tooltip.UP_LEFT_ALIGNED = UP_LEFT_ALIGNED;
Tooltip.UP_RIGHT_ALIGNED = UP_RIGHT_ALIGNED;
Tooltip.DOWN = DOWN;
Tooltip.LEFT = LEFT;
Tooltip.RIGHT = RIGHT;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const Container = styled.div`
  position: relative;

  &:before {
    content: "${(props) => props.copy}";
    position: absolute;
    z-index: ${(props) => props.theme.zIndex.tooltip};

    display: none;
    width: fit-content;
    white-space: nowrap;
    padding: 6px;

    ${(props) => props.theme.fonts.main.regular};
    font-size: 12px;
    letter-spacing: 2%;

    color: ${(props) => props.fg(props.theme)};
    background-color: ${(props) => props.bg(props.theme)};
    border-radius: ${(props) => props.theme.rounded.default};

    ${(props) => (() => {
      switch (props.point) {
        case UP: return css`
          left: 50%;
          transform: translateX(-50%);
          top: calc(100% + 10px);
        `;

        case UP_LEFT_ALIGNED: return css`
          top: calc(100% + 10px);
          left: 0;
        `;

        case UP_RIGHT_ALIGNED: return css`
          top: calc(100% + 10px);
          right: 0;
        `;

        case DOWN: return css`
          left: 50%;
          transform: translateX(-50%);
        `;

        case LEFT: return css`
          top: 50%;
          transform: translateY(-50%);
          left: calc(100% + 10px);
        `;

        case RIGHT: return css`
          top: 50%;
          transform: translateX(0) translateY(-50%);
          right: calc(100% + 5px);
        `;

        default: return '';
      }
    })()}
  }

  &:after {
    content: "";
    position: absolute;
    display: none;

    ${(props) => (() => {
      switch (props.point) {
        case UP: return css`
          left: 50%;
          transform: translateX(-50%);
          top: calc(100% - 5px);

          border: 10px solid ${(props) => props.bg(props.theme)};
          border-color: transparent transparent ${(props) => props.bg(props.theme)} transparent;
        `;

        case UP_LEFT_ALIGNED: return css`
          top: calc(100% - 5px);
          left: 0;

          border: 10px solid ${(props) => props.bg(props.theme)};
          border-color: transparent transparent ${(props) => props.bg(props.theme)} transparent;
        `;

        case UP_RIGHT_ALIGNED: return css`
          top: calc(100% - 5px);
          right: 0;

          border: 10px solid ${(props) => props.bg(props.theme)};
          border-color: transparent transparent ${(props) => props.bg(props.theme)} transparent;
        `;

        case DOWN: return css`
          left: 50%;
          transform: translateX(-50%);
        `;

        case LEFT: return css`
          top: 50%;
          transform: translateY(-50%);
          left: calc(100% - 5px);

          border: 10px solid ${(props) => props.bg(props.theme)};
          border-color: transparent ${(props) => props.bg(props.theme)} transparent transparent;
        `;

        case RIGHT: return css`
          top: 50%;
          transform: translateX(0) translateY(-50%);
          right: calc(100% - 10px);

          border: 10px solid ${(props) => props.bg(props.theme)};
          border-color: transparent transparent transparent ${(props) => props.bg(props.theme)};
        `;

        default: return '';
      }
    })()}
  }

  ${(props) => props.isHovering && css`
    &:hover {
      &:before, &:after {
        display: block;
        animation: ${fadeIn} 0.15s ease-in;
      }
    }
  `}
`;
