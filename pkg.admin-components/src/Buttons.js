import React from 'react';
import styled from 'styled-components';

const IconButtonWrapper = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  padding: 0;
  margin: 0;
  border: none;
  background: none;
  cursor: pointer;

  svg * {
    transition: stroke 0.4s, fill 0.4s;
  }
`;

export function IconButton(props) {
  const {
    IconComponent,
    color,
    hoverColor,
    width = 24,
    height = 24,
    tooltipProps,
    ...rest
  } = props;

  const buttonRef = React.useRef(null);
  const [isHovering, setIsHovering] = React.useState(false);

  React.useEffect(() => {
    if (!buttonRef.current || !hoverColor) {
      return;
    }

    function onMouseEnter() {
      setIsHovering(true);
    }

    function onMouseLeave() {
      setIsHovering(false);
    }

    buttonRef.current.addEventListener('mouseenter', onMouseEnter);
    buttonRef.current.addEventListener('mouseleave', onMouseLeave);

    return () => {
      buttonRef.current.removeEventListener('mouseenter', onMouseEnter);
      buttonRef.current.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [
    hoverColor,
  ]);

  const iconColor = isHovering && hoverColor ? hoverColor : color;

  return (
    <IconButtonWrapper ref={buttonRef} {...rest}>
      <IconComponent width={width} height={height} color={iconColor} />
    </IconButtonWrapper>
  );
}
