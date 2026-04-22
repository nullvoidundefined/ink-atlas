/**
 * Design token source of truth.
 *
 * This file is the single place where all visual values are defined.
 * Do not hardcode colors, spacing, radii, or typography values anywhere else.
 *
 * After editing this file, run:
 *   pnpm --filter @repo/tokens run build
 *
 * This regenerates dist/_tokens.scss (CSS custom properties for web)
 * and dist/index.js (direct import for programmatic use).
 */
export const tokens = {
  colors: {
    background:            '#ffffff',
    backgroundTranslucent: 'rgba(255, 255, 255, 0.92)',
    border:                '#e5e5e5',
    error:                 '#ef4444',
    foreground:            '#111111',
    foregroundMuted:       '#666666',
    surface:               '#f5f5f5',
    surfaceActive:         '#e0e0e0',
    surfaceHover:          '#ebebeb',
    white:                 '#ffffff',
  },
  fontSizes: {
    badge:      11,
    caption:    12,
    small:      13,
    body:       14,
    label:      15,
    subheading: 16,
    subtitle:   18,
    navLogo:    20,
    section:    28,
    heroMobile: 32,
    hero:       48,
  },
  fontWeights: {
    regular:  400,
    medium:   500,
    semibold: 600,
    bold:     700,
    black:    800,
  },
  letterSpacing: {
    heading:   '-0.02em',
    hero:      '-0.03em',
    uppercase: '0.05em',
  },
  lineHeights: {
    body:      1.5,
    hero:      1.1,
    paragraph: 1.6,
  },
  radii: {
    button:   2,
    card:     2,
    large:    4,
    pill:     20,
    standard: 2,
    subtle:   2,
  },
  spacing: {
    1:  4,
    2:  8,
    3:  12,
    4:  16,
    5:  20,
    6:  24,
    7:  28,
    8:  32,
    9:  40,
    10: 48,
    11: 64,
    12: 80,
  },
  transitions: {
    hover: '0.15s',
    state: '0.20s',
  },
} as const;

export type Tokens = typeof tokens;
export type ColorKey = keyof typeof tokens.colors;
export type SpacingKey = keyof typeof tokens.spacing;
