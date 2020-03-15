declare module '*.svg' {
  const url: string;
  export default url;
}

declare module '*/data.json' {
  interface ServiceData {
    displayName: string | Record<string, string>;
    colorTheme: {
      main: string;
      sub: string;
    };
  }

  const data: ServiceData;

  export default data;
}
