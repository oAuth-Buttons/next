import install from './install-vanilla';

// webpack define
declare const process: { env?: { NODE_ENV?: string } } | undefined;

const oauthButtons = {
  isDevelopment: process && process.env && process.env.NODE_ENV,
  textGenerator: (service: Service): string => `Login with ${service}`,
  install,
};

export default oauthButtons;

(globalThis as any)['ob'] = oauthButtons;
