import React from 'react';
import useClickOutside from '@product/hooks/useClickOutside';
import useIsKeyPressed from '@product/hooks/useIsKeyPressed';

export default function useDropper() {
  const [isOpen, setIsOpen] = React.useState(false);

  const containerRef = useClickOutside(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  }, [isOpen]);

  const isEscapePressed = useIsKeyPressed(['Esc', 'Escape']);

  React.useEffect(() => {
    if (isEscapePressed && isOpen) {
      setIsOpen(false);
    }
  }, [isOpen, isEscapePressed]);

  return {
    isOpen,
    setIsOpen,
    containerRef,
  };
}
