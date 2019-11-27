import ob from '.';

const loginClassPattern = /^login-([a-z_]+)$/;

export default function install(target?: Array<Element> | Element): void {
  if (!target) {
    install(Array.from(document.getElementsByClassName('oauth-buttons')));
    return;
  }

  if (Array.isArray(target)) {
    Array.from(target).forEach(install);
    return;
  }

  let serviceId: string;
  const serviceIds = [] as string[];
  for (const className of target.classList) {
    const array = loginClassPattern.exec(className);
    if (!array) {
      continue;
    }
    serviceId = array[1];
    if (ob.isDevelopment) {
      // for the validation
      serviceIds.push(array[1]);
    } else {
      break;
    }
  }
  if (ob.isDevelopment) {
    // no validation on production
    if (serviceIds.length === 0) {
      throw new Error('No service provided');
    }
    if (serviceIds.length > 1) {
      throw new Error(`Too many services provided: ${serviceIds.join(', ')}`);
    }
  }
}
