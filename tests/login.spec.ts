import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { validLoginData, invalidLoginData, validuser } from '../data/users';

test.describe('Authentication', () => {

  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  for (const user of validLoginData) {
    test(`should login successfully with ${user.label} @regression`, async () => {
      await loginPage.login(user.username, user.password);
      await loginPage.assertRedirectedToInventory();
    });
  }

  for (const scenario of invalidLoginData) {
    test(`should show error for ${scenario.label} @regression`, async () => {
      await loginPage.login(scenario.username, scenario.password);
      await loginPage.assertErrorMessage(scenario.error);
    });
  }

  test('should logout the application',async ({ page }) => {
    await loginPage.login(validuser.username, validuser.password);
    await page.click('#react-burger-menu-btn');
    await page.click('#logout_sidebar_link');
    await loginPage.assertOnLoginPage();
  })

  test('should not access the inventory page without login', async({ page }) => {
    await page.goto('/inventory.html')
    await loginPage.assertErrorMessage("Epic sadface: You can only access '/inventory.html' when you are logged in.");
  })

  test('should not access inventory via back button after logout @regression', async ({ page }) => {
    // Logout via menu
    await loginPage.login(validuser.username, validuser.password);
    await page.click('#react-burger-menu-btn');
    await page.click('#logout_sidebar_link');
    await loginPage.assertOnLoginPage();

    // Try browser back
    await page.goBack();
    await loginPage.assertOnLoginPage();
    await loginPage.assertErrorMessage("Epic sadface: You can only access '/inventory.html' when you are logged in.");
  });
});