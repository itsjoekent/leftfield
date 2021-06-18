import React from 'react';

export const initialFundraisingState = {
  baseUrl: '',
  color: '',
  backgroundColor: '',
  appendQuery: '',
};

export const FundraisingContext = React.createContext(initialFundraisingState);
