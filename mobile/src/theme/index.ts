export {colors} from './colors';
export type {ColorKey} from './colors';
export {fontSizes, fontWeights, lineHeights} from './typography';
export {spacing, borderRadius} from './spacing';

import {colors} from './colors';
import {fontSizes, fontWeights, lineHeights} from './typography';
import {spacing, borderRadius} from './spacing';

export const theme = {
  colors,
  fontSizes,
  fontWeights,
  lineHeights,
  spacing,
  borderRadius,
} as const;

export default theme;
