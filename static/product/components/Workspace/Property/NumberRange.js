import React from 'react';
import styled from 'styled-components';
import { get } from 'lodash';
import { useSelector } from 'react-redux';
import { Flex, Typography } from 'pkg.admin-components';
import { useFormField } from 'pkg.form-wizard';
import { Languages } from 'pkg.campaign-components';
import { Inputs } from 'pkg.admin-components';
import {
  selectComponentPropertyInheritedFromForLanguage,
} from '@product/features/assembly';
import useActiveWorkspaceComponent from '@product/hooks/useActiveWorkspaceComponent';
import useGetPropertyValue from '@product/hooks/useGetPropertyValue';
import isDefined from '@product/utils/isDefined';

export default function NumberRange(props) {
  const { fieldId, language, property } = props;

  const propertyId = get(property, 'id');

  const { activePageRoute, activeComponentId } = useActiveWorkspaceComponent();

  const getPropertyValue = useGetPropertyValue(activePageRoute, activeComponentId);

  const inheritedFrom = useSelector(selectComponentPropertyInheritedFromForLanguage(
    activePageRoute,
    activeComponentId,
    propertyId,
    language,
  ));

  const field = useFormField(fieldId);

  if (!field) {
    return null;
  }

  const {
    inputProps,
    inputStylingProps,
  } = field;

  const finalInputProps = {
    ...inputProps,
    'aria-labelledby': `${propertyId}-${Languages.US_ENGLISH_LANG}`,
  };

  if (isDefined(inheritedFrom)) {
    const value = getPropertyValue(propertyId, language);

    finalInputProps['disabled'] = true;
    finalInputProps['value'] = value;
  }

  return (
    <NumberRangeWrapper align="center" gridGap="6px" fullWidth>
      <input
        type="range"
        min={get(property, 'min', 0)}
        max={get(property, 'max', 1)}
        step={get(property, 'incrementBy', 1)}
        {...finalInputProps}
      />
      <ValueColumn>
        <Typography
          fontStyle="regular"
          fontSize="14px"
          fg={(colors) => colors.mono[700]}
        >
          {finalInputProps.value}
        </Typography>
      </ValueColumn>
    </NumberRangeWrapper>
  );
}

const NumberRangeWrapper = styled(Flex.Row)`
  input {
    flex-grow: 1;
  }
`;

const ValueColumn = styled.div`
  flex: 0 0 10%;
`;
