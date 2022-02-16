const puppeteer = require('puppeteer');
const jsdom = require('jsdom');
const fs = require('fs');

const headerPath = './scraping/result/HeaderHomeBlockware.result.html';
const footerPath = './scraping/result/FooterHomeBlockware.result.html';

const url = 'https://www.google.com';

const saveAtfile = (fileName, data) => {
  fs.writeFile(fileName, data, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('file written successfully', fileName);
  });
};

class google {
  constructor() {}

  async run() {
    try {
      this.browser = await puppeteer.launch({ headless: true, defaultViewport: null });
      this.page = await this.browser.newPage();
      const response = await this.page.goto(url);
      const body = await response.text();

      const {
        window: { document },
      } = new jsdom.JSDOM(body);

      const linkElemnt = document.querySelectorAll(" link[type='text/css']")[1];
      const elementHeader = document.querySelector('header');
      const elementFooter = document.querySelector('footer');

      const newHeader = `
        <link rel="stylesheet" type="text/css" href="${linkElemnt.href}"/>
        <header class="${elementHeader.className}" />
          ${elementHeader.outerHTML}
        </header>
      `;
      saveAtfile(headerPath, newHeader);

      const newFooter = `
      <link rel="stylesheet" type="text/css" href="${linkElemnt.href}" />
      <footer class="${elementFooter.className}" />
        ${elementFooter.outerHTML}
      </footer>
    `;
      saveAtfile(footerPath, newFooter);

      await this.browser.close();
    } catch (error) {
      console.log(error);
    }
  }
}
const google = new google();

module.exports = { google };

