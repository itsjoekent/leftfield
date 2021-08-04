import React from 'react';

export default function useDebounce({
  onComplete = () => {},
  onStart = () => {},
  delay = 500,
}) {
  const [hasStarted, setHasStarted] = React.useState(false);
  const [value, setValue] = React.useState('');

  const skippedInitialRef = React.useRef(null);

  function onCompleteWrapper() {
    setHasStarted(false);

    if (!!onComplete && skippedInitialRef.current) {
      onComplete(value);
    }

    skippedInitialRef.current = true;
  }

  React.useEffect(() => {
    const timeoutId = setTimeout(() => onCompleteWrapper(value), delay);
    return () => clearTimeout(timeoutId);
  }, [
    delay,
    onComplete,
    value,
  ]);

  function setValueWrapper(value) {
    if (!hasStarted) {
      setHasStarted(true);

      if (!!onStart) {
        onStart();
      }
    }

    setValue(value);
  }

  return [value, setValueWrapper];
}
