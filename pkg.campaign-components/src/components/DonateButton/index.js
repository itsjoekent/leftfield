import React from 'react';
import styled from 'styled-components';
import get from 'lodash.get';
import {
  AMOUNT_PROPERTY,
  LABEL_PROPERTY,

  BUTTON_TEXT_STYLE,
  BUTTON_HOVER_TEXT_STYLE,
} from '@cc/components/DonateButton/meta';
import { FundraisingContext } from '@cc/context/Fundraising';
import useLanguage from '@cc/hooks/useLanguage';
import TextStyle from '@cc/styles/text';
import getPropertyValue from '@cc/utils/getPropertyValue';

export default function DonateButton(props) {
  const { properties, styles } = props;

  const language = useLanguage();
  const { buildUrl } = React.useContext(FundraisingContext);

  const href = buildUrl(getPropertyValue(properties, AMOUNT_PROPERTY, language));
  const label = getPropertyValue(properties, LABEL_PROPERTY, language);

  return (
    <Button
      href={href}
      styles={styles}
    >
      {label}
    </Button>
  );
}

const Button = styled.a`
  text-decoration: none;

  ${(props) => TextStyle.styling({
    campaignTheme: props.theme.campaign,
    styles: get(props, `styles.${BUTTON_TEXT_STYLE}`, {}),
  })}

  &:hover {
    cursor: pointer;
  }
`;
