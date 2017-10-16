import { BqSquareAdminPage } from './app.po';

describe('bq-square-admin App', () => {
  let page: BqSquareAdminPage;

  beforeEach(() => {
    page = new BqSquareAdminPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('bqs works!');
  });
});
