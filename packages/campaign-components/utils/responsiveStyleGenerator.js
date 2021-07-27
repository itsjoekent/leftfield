import {
  DESKTOP_DEVICE,
  TABLET_DEVICE,
} from 'pkg.campaign-components/constants/responsive';

export default function responsiveStyleGenerator(
  applyStyleIfChanged,
  theme,
  ...rest
) {
  const getStyleValueArgs = rest[0];
  const applyStyleIfChangedRest = rest.slice(1);

  return `
    ${applyStyleIfChanged(...rest)}

    @media (${theme.deviceBreakpoints.tabletUp}) {
      ${applyStyleIfChanged(
        { ...getStyleValueArgs, device: TABLET_DEVICE },
        ...applyStyleIfChangedRest,
      )}
    }

    @media (${theme.deviceBreakpoints.desktopSmallUp}) {
      ${applyStyleIfChanged(
        { ...getStyleValueArgs, device: DESKTOP_DEVICE },
        ...applyStyleIfChangedRest,
      )}
    }
  `;
}
