import get from 'lodash/get';

export const FIT_SCALE_DOWN = 'scale-down';
export const FIT_CONTAIN = 'contain';
export const FIT_COVER = 'cover';
export const FIT_CROP = 'crop';

export const GRAVITY_LEFT_SIDE = 'left';
export const GRAVITY_RIGHT_SIDE = 'right';
export const GRAVITY_TOP_SIDE = 'top';
export const GRAVITY_BOTTOM_SIDE = 'bottom';
export const GRAVITY_CENTER = '0.5x0.5';
export const GRAVITY_TOP_LEFT = '0.0x0.0';

function isDefined(value) {
  return typeof value !== 'undefined' && value !== null;
}

export default function CfImageUrl(imageSrc, options = {}) {
  const {
    fit = FIT_COVER,
    format = 'auto',
    gravity = GRAVITY_TOP_LEFT,
    height = null,
    pixelRatio = 1,
    quality = 85,
    width = null,
  } = options;

  const params = [
    ['fit', get(options, 'fit', FIT_COVER)],
    ['f', get(options, 'format', 'auto')],
    ['g', get(options, 'gravity', GRAVITY_CENTER)],
    ['h', get(options, 'height', null)],
    ['dpr', get(options, 'pixelRatio', 1)],
    ['q', get(options, 'quality', 85)],
    ['w', get(options, 'width', null)],
  ];

  const cfOptions = params.filter((option) => isDefined(option[1]))
    .map((option) => `${option[0]}=${option[1]}`)
    .join(',');

  return `https://getleftfield.com/cdn-cgi/image/${cfOptions}/${imageSrc}`;
}
