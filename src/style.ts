interface LogoSvg {
  type: 'svg';
  url: string;
  useSymbolTable: boolean;
}
interface LogoPng {
  type: 'png';
  url: string;
}
interface LogoWebFont {
  type: 'webfont';
  character: string;
}

declare class HslColor {
  public static readonly WHITE: HslColor;

  public readonly hue: number;
  public readonly saturation: number;
  public readonly lightness: number;

  constructor(hue: number, saturation: number, lightness: number);

  public subtractSaturation(value: number): HslColor;
  public toHslColor(): HslColor;
  public toHex(): string;
}

type Color = HslColor;
type Logo = LogoSvg | LogoPng | LogoWebFont;
interface Service {
  /**
   * Fallback svg, png or character?
   */
  logo: Logo;
  id: string;
  mainColor: Color;
  subColor?: Color;
}

function css(array: TemplateStringsArray, ...params: any[]): string {
  return array.reduce((left, right, index) => {
    return left + (params && params[index] ? params[index] : '') + right;
  }, '');
}

const LogoStyle = ({ logo }: Service, isLightTheme: boolean) => css`
  ${logo.type === 'svg' &&
    css`
      ${logo.useSymbolTable
        ? css`
            /* i don't have idea */
          `
        : css`
            background: url(${logo.url});
          `}
    `}
  ${logo.type === 'png' &&
    css`
      background: url(${logo.url});
    `}
`;

const Button = ({ mainColor, subColor }: Service, isLightTheme: boolean) => css`
  ${isLightTheme
    ? css`
        color: ${mainColor};
        background-color: ${subColor || HslColor.WHITE};
        border-color: ${(subColor || HslColor.WHITE).subtractSaturation(20)};
      `
    : css`
        color: ${HslColor.WHITE};
        background-color: ${mainColor};
        border-color: ${mainColor.subtractSaturation(20)};
      `}
`;
