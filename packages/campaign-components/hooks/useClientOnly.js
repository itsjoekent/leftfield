import React from 'react';

export default function useClientOnly() {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => setIsClient(true), []);

  return isClient;
}
