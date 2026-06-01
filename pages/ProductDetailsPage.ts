import { Page, Locator, expect } from '@playwright/test';

export class ProductDetailsPage {
  readonly page: Page;

  //Locators
  private readonly productName:        Locator;
  private readonly productPrice:       Locator;
  private readonly productDescription: Locator;
  private readonly productImage:       Locator;
  private readonly addToCartButton:    Locator;
  private readonly removeButton:       Locator;
  private readonly backButton:         Locator;
  private readonly cartBadge:          Locator;
  private readonly cartIcon:           Locator;

  constructor(page: Page) {
    this.page               = page;
    this.productName        = page.locator('.inventory_details_name');
    this.productPrice       = page.locator('.inventory_details_price');
    this.productDescription = page.locator('.inventory_details_desc');
    this.productImage       = page.locator('.inventory_details_img');
    this.addToCartButton    = page.locator('button[id^="add-to-cart"]');
    this.removeButton       = page.locator('button[id^="remove"]');
    this.backButton         = page.locator('[data-test="back-to-products"]');
    this.cartBadge          = page.locator('.shopping_cart_badge');
    this.cartIcon           = page.locator('.shopping_cart_link');
  }

  //Actions

  async addToCart() {
    await this.addToCartButton.click();
  }

  async removeFromCart() {
    await this.removeButton.click();
  }

  async goBackToProducts() {
    await this.backButton.click();
  }

  async goToCart() {
    await this.cartIcon.click();
  }

  //Assertions

  async assertOnDetailPage() {
    await expect(this.page).toHaveURL(/inventory-item\.html/);
  }

  async assertProductName(name: string) {
    await expect(this.productName).toHaveText(name);
  }

  async assertProductPrice(price: number) {
    await expect(this.productPrice).toHaveText(`$${price}`);
  }

  async assertProductDescription(description: string) {
    await expect(this.productDescription).toContainText(description);
  }

  async assertProductImageVisible() {
    await expect(this.productImage).toBeVisible();
  }

  async assertAddToCartButtonVisible() {
    await expect(this.addToCartButton).toBeVisible();
  }

  async assertRemoveButtonVisible() {
    await expect(this.removeButton).toBeVisible();
  }

  async assertAddToCartButtonNotVisible() {
    await expect(this.addToCartButton).not.toBeVisible();
  }

  async assertCartBadgeCount(count: number) {
    await expect(this.cartBadge).toHaveText(String(count));
  }

  async assertCartBadgeNotVisible() {
    await expect(this.cartBadge).not.toBeVisible();
  }
}