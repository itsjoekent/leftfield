import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get } from 'lodash';
import {
  Buttons,
  Flex,
  Icons,
  Typography,
} from 'pkg.admin-components';
import {
  eatSnack,
  selectSnack,
  SPICY_SNACK,
} from '@product/features/snacks';
import useTimeout from '@product/hooks/useTimeout';

export default function Item(props) {
  const { id, index } = props;

  const snack = useSelector(selectSnack(id));
  const isSpicy = get(snack, 'type') === SPICY_SNACK;

  const [translate, setTranslate] = React.useState(0);
  const [fadeIn, setFadeIn] = React.useState(true);
  const [fadeOut, setFadeOut] = React.useState(false);

  const dispatch = useDispatch();

  useTimeout(() => dispatch(eatSnack(id)), 5000, [id]);
  useTimeout(() => setFadeOut(true), 4600, []);

  React.useEffect(() => {
    setTranslate(48 * (index + 1));
  }, [index]);

  return (
    <Flex.Row
      position="absolute"
      zIndex={(indexes) => indexes.snacks}
      transform="translateY(0)"
      fitWidth
      maxWidth="90vw"
      align="center"
      justify="space-between"
      gridGap="6px"
      padding="6px"
      rounded={(radius) => radius.default}
      shadow={(shadows) => shadows.light}
      bg={(colors) => isSpicy ? colors.red[300] : colors.mono[100]}
      transitions={['transform']}
      style={{ transform: `translateY(-${translate}px)` }}
      playFadeIn={fadeIn && !fadeOut}
      playFadeOut={fadeOut}
    >
      <Typography
        fontStyle="medium"
        fontSize="16px"
        fg={(colors) => isSpicy ? colors.mono[100] : colors.mono[700]}
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
      >
        {get(snack, 'message')}
      </Typography>
      <Buttons.IconButton
        IconComponent={Icons.CloseRound}
        width={20}
        height={20}
        color={(colors) => isSpicy ? colors.mono[100] : colors.mono[700]}
        hoverColor={(colors) => isSpicy ? colors.mono[200] : colors.mono[900]}
        aria-label="Close notification"
        onClick={() => dispatch(eatSnack(id))}
      />
    </Flex.Row>
  );
}
