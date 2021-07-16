import React from 'react';

export default function useClickOutside(onOutsideClick, dependencies = []) {
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    const element = containerRef.current;

    function handleClickOutside(event) {
      if (!element) {
        return;
      }

      if (!element.contains(event.target)) {
        onOutsideClick();
      }
    }

    if (element) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      if (element) {
        document.removeEventListener('mousedown', handleClickOutside);
      }
    };
  }, [...(dependencies || [])]); // eslint-disable-line react-hooks/exhaustive-deps

  return containerRef;
}
