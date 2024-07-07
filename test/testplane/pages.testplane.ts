describe('страницы', () => {
  it(`на ширине меньше 576px навигационное меню должно скрываться за "гамбургер".
      При выборе элемента из меню "гамбургера", меню должно закрываться`, async ({browser}) => {
      
      await browser.url('http://localhost:3000/hw/store/');
      await browser.setWindowSize(575, 1080);
      const navbar: WebdriverIO.Element = await browser.$('.navbar');
      await navbar.waitForDisplayed();
      await navbar.assertView('menu-hidden');
      const button: WebdriverIO.Element = await browser.$('.navbar-toggler');
      await button.click();
      await navbar.assertView('menu-show');
      const menuLink: WebdriverIO.Element = await browser.$('.nav-link');
      await menuLink.click();
      await navbar.assertView('menu-link-click');
  })

  it('вёрстка должна адаптироваться под ширину экрана', async ({browser}) => {
      await browser.url('http://localhost:3000/hw/store/');
      const page: WebdriverIO.Element  = await browser.$('.Application');
      await browser.setWindowSize(575, 1080);
      await page.assertView('width-570');
      await browser.setWindowSize(970, 1080);
      await page.assertView('width-970');
      await browser.setWindowSize(1520, 1080);
      await page.assertView('width-1520');
  })

  it('главная, условия доставки, контакты должны иметь статическое содержимое', async ({browser}) => {
      await browser.url('http://localhost:3000/hw/store');
      const page: WebdriverIO.Element  = await browser.$('.pt-4');
      await page.assertView('home');
      await browser.url('http://localhost:3000/hw/store/delivery');
      await page.assertView('delivery');
      await browser.url('http://localhost:3000/hw/store/contacts');
      await page.assertView('contacts');
  })

})
