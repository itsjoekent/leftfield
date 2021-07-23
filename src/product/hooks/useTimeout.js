import React from 'react';

export default function useTimeout(callback, delay, dependencies = []) {
  React.useEffect(() => {
    const timeoutId = setTimeout(callback, delay);
    return () => clearTimeout(timeoutId);
  }, [...dependencies]);
}
