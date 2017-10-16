import { browser, element, by } from 'protractor';

export class BqSquareAdminPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('bqs-root h1')).getText();
  }
}
