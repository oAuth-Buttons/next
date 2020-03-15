/**
 * Logo type, at least 1 property should be not-null.
 * Logo should be looked up by following order:
 * svg sprite - svg - webfont - png
 */
export interface Logo {
  /**
   * The symbol name of svg sprite.
   */
  readonly svgSprite?: string;
  /**
   * The URL of SVG.
   */
  readonly svg?: string;
  /**
   * The string that logo mapped.
   */
  readonly webfont?: string;
  /**
   * The URL of PNG.
   */
  readonly png?: string;
}

/**
 * Color theme of service.
 */
export interface ColorTheme {
  /**
   * Main color of theme.
   */
  readonly main: string;
  /**
   * Sub color of theme.
   */
  readonly sub: string;
}

/**
 * The OAuth service.
 */
export interface Service {
  /**
   * ID of service. should be matched with following regex:
   * /^[a-z0-9_]$/g;
   */
  readonly id: string;
  /**
   * Color theme of service.
   */
  readonly colorTheme: ColorTheme;
  /**
   * Logo of service.
   */
  readonly logo: Logo;
}

export function evaluateLogoType(
  logo: Logo | Service,
): 'svg-sprite' | 'svg' | 'webfont' | 'png' {
  if ('logo' in logo) {
    return evaluateLogoType(logo.logo);
  }
  if ('svgSprite' in logo) {
    return 'svg-sprite';
  }
  if ('svg' in logo) {
    return 'svg';
  }
  if ('webfont' in logo) {
    return 'webfont';
  }
  if ('png' in logo) {
    return 'png';
  }
  throw new Error('Invalid logo provided');
}
