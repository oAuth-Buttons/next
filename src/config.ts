// USER EDIT AREA

// You can configure services to use by commenting or uncommenting those function calls.
/* eslint-disable */
registerService('google');
/* eslint-enable */

/************
 * DSL AREA *
 ************/

import ob from '.';

async function registerService(id: string): Promise<void> {
  const { colorTheme } = (
    await import(/* webpackMode: "eager" */ `../services/${id}/data.json`)
  ).default;
  console.log(__webpack_public_path__);
  const logo = {
    svg:
      // eslint-disable-next-line @typescript-eslint/camelcase
      __webpack_public_path__ +
      (await import(/* webpackMode: "eager" */ `../services/${id}/logo.svg`))
        .default,
  };
  ob.addService({
    id,
    colorTheme,
    logo,
  });
}
