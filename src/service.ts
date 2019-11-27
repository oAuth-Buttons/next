/**
 * Logo type, at least 1 property should be not-null.
 * We'll lookup by following order:
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
  readonly svg?: URL;
  /**
   * The string that logo mapped.
   */
  readonly webfont?: string;
  /**
   * The URL of PNG.
   */
  readonly png?: URL;
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
