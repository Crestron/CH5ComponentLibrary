const puppeteer = require('puppeteer');

// TODO: Add documentation as to why we do it like this. (README.MD)
export async function getCrComLibComponentData(name: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.addScriptTag({ path: './cr-com-lib/cr-com-lib.js' });
  // await page.addScriptTag({path: 'node_modules/@crestron/ch5-crcomlib/build_bundles/umd/cr-com-lib.js'});

  const data = await page.evaluate((name: string) => {
    // @ts-ignore
    return CrComLib[name].COMPONENT_DATA;
  }, name);
  await browser.close();
  return data;
}
