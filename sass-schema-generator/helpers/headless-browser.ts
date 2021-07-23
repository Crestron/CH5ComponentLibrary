const puppeteer = require('puppeteer');

export async function getCrComLibComponent(name: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.addScriptTag({path: 'node_modules/@crestron/ch5-crcomlib/build_bundles/umd/cr-com-lib.js'});

  const data = await page.evaluate((name: string) => {
    // @ts-ignore
    return CrComLib[name];
  }, name);
  await browser.close();

  return data;
}
