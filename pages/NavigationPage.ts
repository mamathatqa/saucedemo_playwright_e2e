import { Page, Locator, expect } from '@playwright/test';

export class NavigationPage {
  readonly page: Page;

  private readonly burgerMenuButton:  Locator;
  private readonly closeMenuButton:   Locator;
  private readonly menuContainer:     Locator;
  private readonly allItemsLink:      Locator;
  private readonly aboutLink:         Locator;
  private readonly logoutLink:        Locator;
  private readonly resetAppStateLink: Locator;
  private readonly pageTitle:         Locator;
  private readonly cartBadge:         Locator;
  private readonly footer:            Locator;
  private readonly footerText:        Locator;
  private readonly inventoryImages:   Locator;

  constructor(page: Page) {
    this.page = page;

    this.burgerMenuButton  = page.locator('#react-burger-menu-btn');
    this.closeMenuButton   = page.locator('#react-burger-cross-btn');
    this.menuContainer     = page.locator('.bm-menu-wrap');
    this.allItemsLink      = page.locator('#inventory_sidebar_link');
    this.aboutLink         = page.locator('#about_sidebar_link');
    this.logoutLink        = page.locator('#logout_sidebar_link');
    this.resetAppStateLink = page.locator('#reset_sidebar_link');
    this.pageTitle         = page.locator('.title');
    this.cartBadge         = page.locator('.shopping_cart_badge');
    this.footer            = page.locator('footer');
    this.footerText        = page.locator('.footer_copy');
    this.inventoryImages   = page.locator('.inventory_item_img img');
  }

  async openBurgerMenu() {
    await this.burgerMenuButton.click();
    await expect(this.menuContainer).toHaveAttribute('aria-hidden', 'false');
  }

  async closeBurgerMenu() {
    await this.closeMenuButton.click();
    await expect(this.menuContainer).toHaveAttribute('aria-hidden', 'true');
  }

  async clickAllItems() {
    await this.allItemsLink.click();
  }

  async clickAbout() {
    await this.aboutLink.click();
  }

  async clickLogout() {
    await this.logoutLink.click();
  }

  async clickResetAppState() {
    await this.resetAppStateLink.click();
  }

  async assertMenuOpen() {
    await expect(this.menuContainer).toHaveAttribute('aria-hidden', 'false');
    await expect(this.allItemsLink).toBeVisible();
    await expect(this.aboutLink).toBeVisible();
    await expect(this.logoutLink).toBeVisible();
    await expect(this.resetAppStateLink).toBeVisible();
  }

  async assertMenuClosed() {
    await expect(this.menuContainer).toHaveAttribute('aria-hidden', 'true');
  }

  async assertOnLoginPage() {
    await expect(this.page).toHaveURL('/');
  }

  async assertOnInventoryPage() {
    await expect(this.page).toHaveURL('/inventory.html');
  }

  async assertCartBadgeNotVisible() {
    await expect(this.cartBadge).not.toBeVisible();
  }

  async assertCartBadgeCount(count: number) {
    await expect(this.cartBadge).toHaveText(String(count));
  }

  async assertPageTitle(expectedTitle: string) {
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  async assertInventoryPageTitle() {
    await expect(this.pageTitle).toHaveText('Products');
  }

  async assertFooterVisible() {
    await expect(this.footer).toBeVisible();
  }

  async assertFooterText() {
    await expect(this.footerText).toContainText(
      '© 2026 Sauce Labs. All Rights Reserved. Terms of Service | Privacy Policy'
    );
  }

  async assertAllImagesLoaded() {
    const count = await this.inventoryImages.count();
    for (let i = 0; i < count; i++) {
      const img = this.inventoryImages.nth(i);
      await expect(img).toBeVisible();

      const src = await img.getAttribute('src');
      expect(src).not.toBeNull();
      expect(src?.trim()).not.toBe('');
    }
  }

  async assertProblemUserImagesBroken() {
    const count = await this.inventoryImages.count();
    const srcs: string[] = [];

    for (let i = 0; i < count; i++) {
      const src = await this.inventoryImages.nth(i).getAttribute('src');
      srcs.push(src ?? '');
    }
    // assert all images have the same src (known bug)
    const allSame = srcs.every(src => src === srcs[0]);
    expect(allSame).toBe(true);
  }
}