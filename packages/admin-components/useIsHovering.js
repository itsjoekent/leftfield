import React from 'react';

export default function useIsHovering(buttonRef) {
  const [isHovering, setIsHovering] = React.useState(false);

  React.useEffect(() => {
    if (!buttonRef.current) {
      return;
    }

    function onMouseEnter() {
      setIsHovering(true);
    }

    function onMouseLeave() {
      setIsHovering(false);
    }

    if (buttonRef.current) {
      buttonRef.current.addEventListener('mouseenter', onMouseEnter);
      buttonRef.current.addEventListener('mouseleave', onMouseLeave);
    }

    return () => {
      if (buttonRef.current) {
        buttonRef.current.removeEventListener('mouseenter', onMouseEnter);
        buttonRef.current.removeEventListener('mouseleave', onMouseLeave);
      }
    };
  }, []);

  return isHovering;
}
