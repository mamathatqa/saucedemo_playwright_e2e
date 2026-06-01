import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;

  // ─── Locators ─────────────────────────────────────────────────────
  private readonly cartItems:           Locator;
  private readonly cartItemNames:       Locator;
  private readonly cartItemPrices:      Locator;
  private readonly cartItemQuantities:  Locator;
  private readonly continueShoppingBtn: Locator;
  private readonly checkoutButton:      Locator;
  private readonly cartBadge:           Locator;
  private readonly pageTitle:           Locator;
  private readonly cartIcon:            Locator;

  constructor(page: Page) {
    this.page                = page;
    this.cartItems           = page.locator('.cart_item');
    this.cartItemNames       = page.locator('.inventory_item_name');
    this.cartItemPrices      = page.locator('.inventory_item_price');
    this.cartItemQuantities  = page.locator('.cart_quantity');
    this.continueShoppingBtn = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton      = page.locator('[data-test="checkout"]');
    this.cartBadge           = page.locator('.shopping_cart_badge');
    this.pageTitle           = page.locator('.title');
    this.cartIcon            = page.locator('.shopping_cart_link');
  }

  // ─── Navigation ───────────────────────────────────────────────────

  async navigate() {
    await this.page.goto('/cart.html');
  }

  async continueShopping() {
    await this.continueShoppingBtn.click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async goToCart() {
    await this.cartIcon.click();
  }

  // ─── Actions ──────────────────────────────────────────────────────

  async removeItemByName(name: string) {
    await this.page
      .locator('.cart_item', { hasText: name })
      .locator('button')
      .click();
  }

  // ─── Getters ──────────────────────────────────────────────────────

  async getCartItemNames(): Promise<string[]> {
    return await this.cartItemNames.allTextContents();
  }

  async getCartItemPrices(): Promise<number[]> {
    const texts = await this.cartItemPrices.allTextContents();
    return texts.map(t => parseFloat(t.replace('$', '')));
  }

  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  // ─── Assertions ───────────────────────────────────────────────────

  async assertOnCartPage() {
    await expect(this.page).toHaveURL('/cart.html');
    await expect(this.pageTitle).toHaveText('Your Cart');
  }

  async assertCartItemCount(count: number) {
    await expect(this.cartItems).toHaveCount(count);
  }

  async assertItemInCart(name: string) {
    await expect(
      this.page.locator('.cart_item', { hasText: name })
    ).toBeVisible();
  }

  async assertItemNotInCart(name: string) {
    await expect(
      this.page.locator('.cart_item', { hasText: name })
    ).not.toBeVisible();
  }

  async assertItemPrice(name: string, price: number) {
    const item = this.page.locator('.cart_item', { hasText: name });
    await expect(
      item.locator('.inventory_item_price')
    ).toHaveText(`$${price}`);
  }

  async assertItemQuantity(name: string, quantity: number) {
    const item = this.page.locator('.cart_item', { hasText: name });
    await expect(
      item.locator('.cart_quantity')
    ).toHaveText(String(quantity));
  }

  async assertCartIsEmpty() {
    await expect(this.cartItems).toHaveCount(0);
  }

  async assertCartBadgeCount(count: number) {
    await expect(this.cartBadge).toHaveText(String(count));
  }

  async assertCartBadgeNotVisible() {
    await expect(this.cartBadge).not.toBeVisible();
  }

  async assertContinueShoppingButtonVisible() {
    await expect(this.continueShoppingBtn).toBeVisible();
  }

  async assertCheckoutButtonVisible() {
    await expect(this.checkoutButton).toBeVisible();
  }
}