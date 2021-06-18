import React from 'react';
import InlineGrid from '@cc/blocks/InlineGrid';
import { initialFundraisingState, FundraisingContext } from '@cc/context/Fundraising';

export default function ActBlueDonateForm(props) {
  const {
    children,
  } = props;

  const fundraisingState = {
    ...initialFundraisingState,
  };

  return (
    <FundraisingContext.Provider value={fundraisingState}>
      <InlineGrid>
        {children}
      </InlineGrid>
    </FundraisingContext.Provider>
  );
}

export { default as ActBlueDonateFormMeta } from '@cc/components/ActBlueDonateForm';
