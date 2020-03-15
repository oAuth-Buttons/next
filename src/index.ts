import install from './install-vanilla';
import { Service, evaluateLogoType } from './service';
import './config';

// webpack define
declare const process: { env: { NODE_ENV: string } };

export type TextGenerator = (service: Service) => string;
export class OAuthButtons {
  public static readonly instance = new OAuthButtons();
  public readonly isDevelopment =
    process && process.env && process.env.NODE_ENV;

  public textGenerator: TextGenerator = service => `Login with ${service.id}`;
  private readonly services = new Map<string, Service>();
  public readonly install = install;
  public readonly evaluateLogoType = evaluateLogoType;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public addService(service: Service): void {
    if (this.isDevelopment) {
      if (this.services.has(service.id)) {
        throw new Error(`Service already registered: ${service.id}`);
      }
    }
    this.services.set(service.id, service);
  }

  public hasService(id: string): boolean {
    return this.services.has(id);
  }

  public getService(id: string): Service {
    if (this.isDevelopment) {
      if (!this.services.has(id)) {
        throw new Error(`Unknown service: ${id}`);
      }
    }

    // eslint-disable-next-line
    return this.services.get(id)!;
  }
}

export default OAuthButtons.instance;

// eslint-disable-next-line
((globalThis as unknown) as any).ob = OAuthButtons.instance;
