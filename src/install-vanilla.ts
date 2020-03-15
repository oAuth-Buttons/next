import ob from '.';
import { evaluateLogoType } from './service';

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

  let serviceId = '';
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

  // no contains check because it already happen inside the getService function
  const service = ob.getService(serviceId);
  if (ob.isDevelopment) {
    target.classList.add('ob-installed');
  }

  let logo: Element;

  switch (evaluateLogoType(service)) {
    case 'svg-sprite': {
      const element = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'svg',
      );
      element.classList.add('svg-sprite');
      const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      use.setAttributeNS(
        'http://www.w3.org/1999/xlink',
        'xlink:href',
        // eslint-disable-next-line
        service.logo.svgSprite!,
      );
      element.appendChild(use);
      logo = element;
      break;
    }
    case 'svg': {
      const element = document.createElement('object');
      element.classList.add('svg');
      element.type = 'image/svg+xml';
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      element.data = service.logo.svg!;
      element.innerText = `${service.id} logo`;
      logo = element;
      break;
    }
    case 'webfont': {
      const element = document.createElement('span');
      element.classList.add('webfont');
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      element.innerText = service.logo.webfont!;
      logo = element;
      break;
    }
    case 'png': {
      const element = document.createElement('img');
      element.classList.add('png');
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      element.src = service.logo.png!;
      logo = element;
      break;
    }
  }
  logo.classList.add('logo');

  const text = document.createElement('span');
  text.classList.add('label');
  text.innerText = ob.textGenerator(service);

  target.appendChild(logo);
  target.appendChild(text);
}
