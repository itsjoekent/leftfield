import React from 'react';
import styled from 'styled-components';
import get from 'lodash.get';
import {
  AMOUNT_PROPERTY,
  LABEL_PROPERTY,
} from '@cc/components/DonateButton/meta';
import { FundraisingContext } from '@cc/context/Fundraising';
import useLanguage from '@cc/hooks/useLanguage';
import getPropertyValue from '@cc/utils/getPropertyValue';

export default function DonateButton(props) {
  const { properties } = props;

  const language = useLanguage();
  const { buildUrl } = React.useContext(FundraisingContext);

  const href = buildUrl(getPropertyValue(properties, AMOUNT_PROPERTY, language));
  const label = getPropertyValue(properties, LABEL_PROPERTY, language);

  return (
    <Button
      href={href}
      properties={properties}
      language={language}
    >
      {label}
    </Button>
  );
}

const Button = styled.a`

`;
