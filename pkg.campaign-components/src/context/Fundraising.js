import React from 'react';

export const initialFundraisingState = {
  buildUrl: (input) => input,
};

export const FundraisingContext = React.createContext(initialFundraisingState);
