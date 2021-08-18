import React from 'react';

export default function useIsKeyPressed(targetKeys) {
  const [isKeyPressed, setIsKeyPressed] = React.useState(false);

  function downHandler(event) {
    if (event.defaultPrevented) {
      return;
    }

    if (targetKeys.includes(event.key)) {
      setIsKeyPressed(true);
    }
  }

  function upHandler(event) {
    if (event.defaultPrevented) {
      return;
    }

    if (targetKeys.includes(event.key)) {
      setIsKeyPressed(false);
    }
  }

  React.useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKeys]);

  return isKeyPressed;
}
