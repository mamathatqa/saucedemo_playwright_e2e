import { Page, Locator, expect } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;

  // ─── Locators ─────────────────────────────────────────────────────
  private readonly productItems:        Locator;
  private readonly productNameLinks:    Locator;
  private readonly productPrices:       Locator;
  private readonly productDescriptions: Locator;
  private readonly productImages:       Locator;
  private readonly sortDropdown:        Locator;
  private readonly pageTitle:           Locator;

  constructor(page: Page) {
    this.page                 = page;
    this.productItems         = page.locator('.inventory_item');
    this.productNameLinks     = page.locator('.inventory_item_name');
    this.productPrices        = page.locator('.inventory_item_price');
    this.productDescriptions  = page.locator('.inventory_item_desc');
    this.productImages        = page.locator('.inventory_item_img img');
    this.sortDropdown         = page.locator('.product_sort_container');
    this.pageTitle            = page.locator('.title');
  }

  //Actions
  async navigate() {
    await this.page.goto('/inventory.html');
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(option);
  }

  async clickProductByName(name: string) {
    await this.page
      .locator('.inventory_item_name', { hasText: name })
      .click();
  }

  async clickProductImageByName(name: string) {
    await this.page
      .locator('.inventory_item', { hasText: name })
      .locator('img')
      .click();
  }

    async getProductNames(): Promise<string[]> {
    return await this.productNameLinks.allTextContents();
  }


  // Assertions 

  async assertOnProductsPage() {
    await expect(this.page).toHaveURL('/inventory.html');
    await expect(this.pageTitle).toHaveText('Products');
  }

  async assertProductCount(count: number) {
    await expect(this.productItems).toHaveCount(count);
  }

  async assertProductNamesInOrder(expectedNames: string[]) {
    const actual = await this.getProductNames();
    expect(actual).toEqual(expectedNames);
  }

  async assertProductDetails(name: string, price: number, description: string) {
    const item = this.page.locator('.inventory_item', { hasText: name });

    // Assert name
    await expect(item.locator('.inventory_item_name'))
      .toHaveText(name);

    // Assert price
    await expect(item.locator('.inventory_item_price'))
      .toHaveText(`$${price}`);

    // Assert description
    await expect(item.locator('.inventory_item_desc'))
      .toContainText(description);
  }

  async assertButtonTextForProduct(name: string, expectedText: string) {
    const item = this.page.locator('.inventory_item', { hasText: name });
    await expect(item.locator('button')).toHaveText(expectedText);
  }

  async assertAllImagesVisible() {
    const count = await this.productImages.count();
    for (let i = 0; i < count; i++) {
      await expect(this.productImages.nth(i)).toBeVisible();
    }
  }
}