import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;

  // ─── Step 1 (Info) Locators ───────────────────────────────────────
  private readonly firstNameInput:  Locator;
  private readonly lastNameInput:   Locator;
  private readonly zipInput:        Locator;
  private readonly continueButton:  Locator;
  private readonly cancelInfoBtn:   Locator;
  private readonly errorMessage:    Locator;

  // ─── Step 2 (Overview) Locators ───────────────────────────────────
  private readonly overviewItems:   Locator;
  private readonly overviewNames:   Locator;
  private readonly overviewPrices:  Locator;
  private readonly itemTotalLabel:  Locator;
  private readonly taxLabel:        Locator;
  private readonly totalLabel:      Locator;
  private readonly finishButton:    Locator;
  private readonly cancelOverviewBtn: Locator;

  // ─── Confirmation Locators ────────────────────────────────────────
  private readonly confirmationHeader:  Locator;
  private readonly confirmationText:    Locator;
  private readonly backHomeButton:      Locator;

  // ─── Shared ───────────────────────────────────────────────────────
  private readonly pageTitle:       Locator;
  private readonly cartBadge:       Locator;

  constructor(page: Page) {
    this.page = page;

    // Step 1
    this.firstNameInput   = page.locator('[data-test="firstName"]');
    this.lastNameInput    = page.locator('[data-test="lastName"]');
    this.zipInput         = page.locator('[data-test="postalCode"]');
    this.continueButton   = page.locator('[data-test="continue"]');
    this.cancelInfoBtn    = page.locator('[data-test="cancel"]');
    this.errorMessage     = page.locator('[data-test="error"]');

    // Step 2
    this.overviewItems    = page.locator('.cart_item');
    this.overviewNames    = page.locator('.inventory_item_name');
    this.overviewPrices   = page.locator('.inventory_item_price');
    this.itemTotalLabel   = page.locator('.summary_subtotal_label');
    this.taxLabel         = page.locator('.summary_tax_label');
    this.totalLabel       = page.locator('.summary_total_label');
    this.finishButton     = page.locator('[data-test="finish"]');
    this.cancelOverviewBtn = page.locator('[data-test="cancel"]');

    // Confirmation
    this.confirmationHeader = page.locator('.complete-header');
    this.confirmationText   = page.locator('.complete-text');
    this.backHomeButton     = page.locator('[data-test="back-to-products"]');

    // Shared
    this.pageTitle  = page.locator('.title');
    this.cartBadge  = page.locator('.shopping_cart_badge');
  }

  // ─── Step 1 Actions ───────────────────────────────────────────────

  async fillInfo(firstName: string, lastName: string, zip: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.zipInput.fill(zip);
  }

  async continueToOverview() {
    await this.continueButton.click();
  }

  async cancelFromInfo() {
    await this.cancelInfoBtn.click();
  }

  // ─── Step 2 Actions ───────────────────────────────────────────────

  async finishCheckout() {
    await this.finishButton.click();
  }

  async cancelFromOverview() {
    await this.cancelOverviewBtn.click();
  }

  // ─── Confirmation Actions ─────────────────────────────────────────

  async goBackHome() {
    await this.backHomeButton.click();
  }

  // ─── Getters ──────────────────────────────────────────────────────

  async getItemTotal(): Promise<number> {
    const text = await this.itemTotalLabel.textContent();
    return parseFloat(text?.replace('Item total: $', '') ?? '0');
  }

  async getTax(): Promise<number> {
    const text = await this.taxLabel.textContent();
    return parseFloat(text?.replace('Tax: $', '') ?? '0');
  }

  async getTotal(): Promise<number> {
    const text = await this.totalLabel.textContent();
    return parseFloat(text?.replace('Total: $', '') ?? '0');
  }

  async getOverviewItemNames(): Promise<string[]> {
    return await this.overviewNames.allTextContents();
  }

  async getOverviewItemPrices(): Promise<number[]> {
    const texts = await this.overviewPrices.allTextContents();
    return texts.map(t => parseFloat(t.replace('$', '')));
  }

  // ─── Step 1 Assertions ────────────────────────────────────────────

  async assertOnInfoPage() {
    await expect(this.page).toHaveURL('/checkout-step-one.html');
    await expect(this.pageTitle).toHaveText('Checkout: Your Information');
  }

  async assertErrorMessage(expectedError: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedError);
  }

  // ─── Step 2 Assertions ────────────────────────────────────────────

  async assertOnOverviewPage() {
    await expect(this.page).toHaveURL('/checkout-step-two.html');
    await expect(this.pageTitle).toHaveText('Checkout: Overview');
  }

  async assertOverviewItemCount(count: number) {
    await expect(this.overviewItems).toHaveCount(count);
  }

  async assertItemInOverview(name: string) {
    await expect(
      this.page.locator('.cart_item', { hasText: name })
    ).toBeVisible();
  }

  async assertItemPriceInOverview(name: string, price: number) {
    const item = this.page.locator('.cart_item', { hasText: name });
    await expect(
      item.locator('.inventory_item_price')
    ).toHaveText(`$${price}`);
  }

  async assertTaxVisible() {
    await expect(this.taxLabel).toBeVisible();
  }

  async assertTotalEqualsItemTotalPlusTax() {
    const itemTotal = await this.getItemTotal();
    const tax       = await this.getTax();
    const total     = await this.getTotal();

    const expected  = parseFloat((itemTotal + tax).toFixed(2));
    expect(total).toBe(expected);
  }

  // ─── Confirmation Assertions ──────────────────────────────────────

  async assertOnConfirmationPage() {
    await expect(this.page).toHaveURL('/checkout-complete.html');
  }

  async assertConfirmationMessage() {
    await expect(this.confirmationHeader).toHaveText('Thank you for your order!');
  }

  async assertCartIsEmpty() {
    await expect(this.cartBadge).not.toBeVisible();
  }
}