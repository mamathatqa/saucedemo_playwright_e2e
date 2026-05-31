import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    
    //Locators
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly errMessage: Locator;
    private readonly errCloseButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput   = page.locator('#user-name');
        this.passwordInput   = page.locator('#password');
        this.loginButton     = page.locator('#login-button');
        this.errMessage    = page.locator('[data-test="error"]');
        this.errCloseButton = page.locator('.error-button');
    }

    //Actions
    async navigate() {
        await this.page.goto('/');
    }

    async fillUsername(username: string) {
        await this.usernameInput.fill(username);
    }

    async fillPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    async clickLogin() {
        await this.loginButton.click();
    }

    async login(username: string, password: string) {
        await this.fillUsername(username);
        await this.fillPassword(password);
        await this.clickLogin();
    }

    async closeError() {
        await this.errCloseButton.click();
    }

    //Assertions
    async assertOnLoginPage() {
        await expect(this.page).toHaveURL('/');
        await expect(this.loginButton).toBeVisible();
    }

    async assertErrorMessage(expectedMessage: string) {
        await expect(this.errMessage).toBeVisible();
        await expect(this.errMessage).toContainText(expectedMessage);
    }

    async assertErrorNotVisible() {
        await expect(this.errMessage).not.toBeVisible();
    }

    async assertRedirectedToInventory() {
        await expect(this.page).toHaveURL('/inventory.html');
  }
}