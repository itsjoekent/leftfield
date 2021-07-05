import React from 'react';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';
import { useDispatch } from 'react-redux';
import { Flex, Grid } from 'pkg.admin-components';
import { ComponentMeta } from 'pkg.campaign-components';
import ModalDefaultLayout from '@editor/components/Modal/DefaultLayout';
import SearchBar from '@editor/components/Modal/ElementLibrary/SearchBar';
import TraitPill from '@editor/components/Modal/ElementLibrary/TraitPill';
import ComponentCard from '@editor/components/Modal/ElementLibrary/ComponentCard';
import { addChildComponentInstance, buildComponent } from '@editor/features/assembly';
import { closeModal } from '@editor/features/modal';

const featuredTraits = [
  { label: 'Fundraising', trait: 'FUNDRAISING_TRAIT' },
];

const recentComponents = [
  ComponentMeta.ActBlueDonateForm,
  ComponentMeta.DonateButton,
];

export default function ElementLibraryModal(props) {
  const {
    pageId,
    parentComponentId,
    slotId,
  } = props;

  const [selectedTraits, setSelectedTraits] = React.useState(
    featuredTraits.reduce((acc, item) => ({ ...acc, [item.trait]: false }), {}),
  );

  const dispatch = useDispatch();

  function addComponent(meta) {
    const componentId = uuid();

    dispatch(buildComponent({
      pageId,
      componentId,
      componentTag: meta.tag,
    }));

    dispatch(addChildComponentInstance({
      componentId,
      pageId,
      parentComponentId,
      slotId,
    }));

    dispatch(closeModal());
  }

  return (
    <ModalDefaultLayout
      width="600px"
      title="Element Library"
    >
      <ModalContainer fullWidth bg={(colors) => colors.mono[100]}>
        <Flex.Column fullWidth padding="24px" gridGap="12px">
          <SearchBar />
          <Flex.Row fullWidth gridGap="6px" overflowX="scroll">
            {featuredTraits.map((item) => (
              <TraitPill
                key={item.trait}
                label={item.label}
                trait={item.trait}
                isSelected={selectedTraits[item.trait]}
                setIsSelected={() => setSelectedTraits((state) => ({
                  ...state,
                  [item.trait]: !selectedTraits[item.trait],
                }))}
              />
            ))}
          </Flex.Row>
        </Flex.Column>
        <ComponentsColumn
          fullWidth
          paddingHorizontal="24px"
          gridGap="12px"
          overflowY="scroll"
        >
          <ComponentsGroupTitle>Recent</ComponentsGroupTitle>
          <Grid fullWidth columns="1fr 1fr" gap="12px">
            {recentComponents.map((meta) => (
              <ComponentCard
                key={meta.tag}
                componentMeta={meta}
                onClick={() => addComponent(meta)}
              />
            ))}
          </Grid>
        </ComponentsColumn>
      </ModalContainer>
    </ModalDefaultLayout>
  );
}

const ModalContainer = styled(Flex.Column)`
  border-bottom-right-radius: ${(props) => props.theme.rounded.default};
  border-bottom-left-radius: ${(props) => props.theme.rounded.default};
`;

const ComponentsGroupTitle = styled.h2`
  ${(props) => props.theme.fonts.main.bold};
  font-size: 14px;
  color: ${(props) => props.theme.colors.mono[500]};
`;

const ComponentsColumn = styled(Flex.Column)`
  max-height: 40vh;
  padding-top: 8px;
  padding-bottom: 24px;
`;
