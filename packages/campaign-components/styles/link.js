import get from 'lodash/get';
import {
  COLOR_TYPE,
  NUMBER_RANGE_TYPE,
  SELECT_TYPE,
} from 'pkg.campaign-components/constants/property-types';
import { MOBILE_DEVICE } from 'pkg.campaign-components/constants/responsive';
import responsiveStyleGenerator from 'pkg.campaign-components/utils/responsiveStyleGenerator';

export const KEY = 'LinkStyle';

export const ON_HOVER = 'ON_HOVER';

export const TEXT_COLOR_ATTRIBUTE = 'TEXT_COLOR_ATTRIBUTE';
export const ENABLE_UNDERLINE_ATTRIBUTE = 'ENABLE_UNDERLINE_ATTRIBUTE';
export const UNDERLINE_COLOR_ATTRIBUTE = 'UNDERLINE_COLOR_ATTRIBUTE';
export const UNDERLINE_HEIGHT_ATTRIBUTE = 'UNDERLINE_HEIGHT_ATTRIBUTE';
export const UNDERLINE_GAP_ATTRIBUTE = 'UNDERLINE_GAP_ATTRIBUTE';

export const UNDERLINE_ENABLE = 'UNDERLINE_ENABLE';
export const UNDERLINE_DISABLE = 'UNDERLINE_DISABLE';

const attributes = [
  {
    id: TEXT_COLOR_ATTRIBUTE,
    label: 'Text Color',
    type: COLOR_TYPE,
  },
  {
    id: ENABLE_UNDERLINE_ATTRIBUTE,
    label: 'Enable Underline',
    type: SELECT_TYPE,
    options: [
      { label: 'Enabled', value: UNDERLINE_ENABLE },
      { label: 'Disabled', value: UNDERLINE_DISABLE },
    ],
    defaultValue: {
      [MOBILE_DEVICE]: {
        custom: UNDERLINE_ENABLE,
      },
    },
  },
  {
    id: UNDERLINE_COLOR_ATTRIBUTE,
    label: 'Underline Color',
    hideIf: {
      compare: ENABLE_UNDERLINE_ATTRIBUTE,
      test: (attribute) => get(attribute, 'custom', UNDERLINE_DISABLE) === UNDERLINE_DISABLE,
    },
    type: COLOR_TYPE,
  },
  {
    id: UNDERLINE_HEIGHT_ATTRIBUTE,
    label: 'Underline Height',
    hideIf: {
      compare: ENABLE_UNDERLINE_ATTRIBUTE,
      test: (attribute) => get(attribute, 'custom', UNDERLINE_DISABLE) === UNDERLINE_DISABLE,
    },
    type: NUMBER_RANGE_TYPE,
    min: 1,
    max: 6,
    incrementBy: 1,
    defaultValue: {
      [MOBILE_DEVICE]: {
        custom: 1,
      },
    },
  },
  {
    id: UNDERLINE_GAP_ATTRIBUTE,
    label: 'Underline Gap',
    help: 'Space between the text and the underline',
    hideIf: {
      compare: ENABLE_UNDERLINE_ATTRIBUTE,
      test: (attribute) => get(attribute, 'custom', UNDERLINE_DISABLE) === UNDERLINE_DISABLE,
    },
    type: NUMBER_RANGE_TYPE,
    min: 0,
    max: 6,
    incrementBy: 1,
    defaultValue: {
      [MOBILE_DEVICE]: {
        custom: 0,
      },
    },
  },
];

const hoverAttributes = attributes.map((attribute) => {
  const hoverAttribute = {
    ...attribute,
    id: `${attribute.id}_${ON_HOVER}`,
    label: `${attribute.label} (On Hover)`,
  };

  if (attribute.hideIf) {
    hoverAttribute.hideIf = {
      compare: `${ENABLE_UNDERLINE_ATTRIBUTE}_${ON_HOVER}`,
      test: attribute.hideIf.test,
    };
  }

  return hoverAttribute;
});

function underlineStyle(styleValue) {
  const [
    toggle,
    color,
    height,
    gap,
  ] = styleValue;

  if (toggle === UNDERLINE_DISABLE) {
    return `
      text-decoration: none;
      background-image: none;
    `;
  }

  if (height > 1 || gap > 0) {
    return `
      text-decoration: none;
      background-image: linear-gradient(to bottom, ${color}, ${color});
      background-position: 0 calc(1em + ${gap}px);
      background-repeat: repeat-x;
      background-size: 1px ${height}px;
    `;
  } else {
    return `
      text-decoration: underline;
      text-decoration-color: ${color};
      background-image: none;
    `;
  }
}

const LinkStyle = {
  key: KEY,
  humanName: 'Link Style',
  attributes: (overrides) => ([
    ...[...attributes, ...hoverAttributes].map((attribute) => ({
      ...attribute,
      ...(get(overrides, attribute.id, {})),
    })),
  ]),
  styling: ({ applyStyleIfChanged, styles, theme }) => `
    ${responsiveStyleGenerator(
      applyStyleIfChanged,
      theme,
      {
        styles,
        attribute: TEXT_COLOR_ATTRIBUTE,
        theme,
        themePath: 'campaign.colors',
      },
      (styleValue) => `color: ${styleValue};`,
    )}

    ${responsiveStyleGenerator(
      applyStyleIfChanged,
      theme,
      [
        {
          styles,
          attribute: ENABLE_UNDERLINE_ATTRIBUTE,
        },
        {
          styles,
          attribute: UNDERLINE_COLOR_ATTRIBUTE,
          theme,
          themePath: 'campaign.colors',
        },
        {
          styles,
          attribute: UNDERLINE_HEIGHT_ATTRIBUTE,
        },
        {
          styles,
          attribute: UNDERLINE_GAP_ATTRIBUTE,
        },
      ],
      underlineStyle,
    )}

    &:hover {
      ${responsiveStyleGenerator(
        applyStyleIfChanged,
        theme,
        {
          styles,
          attribute: `${TEXT_COLOR_ATTRIBUTE}_${ON_HOVER}`,
          theme,
          themePath: 'campaign.colors',
        },
        (styleValue) => `color: ${styleValue};`,
      )}

      ${responsiveStyleGenerator(
        applyStyleIfChanged,
        theme,
        [
          {
            styles,
            attribute: `${ENABLE_UNDERLINE_ATTRIBUTE}_${ON_HOVER}`,
          },
          {
            styles,
            attribute: `${UNDERLINE_COLOR_ATTRIBUTE}_${ON_HOVER}`,
            theme,
            themePath: 'campaign.colors',
          },
          {
            styles,
            attribute: `${UNDERLINE_HEIGHT_ATTRIBUTE}_${ON_HOVER}`,
          },
          {
            styles,
            attribute: `${UNDERLINE_GAP_ATTRIBUTE}_${ON_HOVER}`,
          },
        ],
        underlineStyle,
      )}
    }
  `,
};

export default LinkStyle;
