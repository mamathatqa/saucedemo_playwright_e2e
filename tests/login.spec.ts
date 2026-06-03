import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { invalidLoginData, validuser, validLoginData} from '../data/users';

test.describe('Login', () => {

  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  for (const scenario of validLoginData) {
    test(`Erfolgreich anmelden mit ${scenario.label} @regression`, async () => {
      await loginPage.login(scenario.username, scenario.password);
      await loginPage.assertRedirectedToInventory();
    });
  }

  for (const scenario of invalidLoginData) {
    test(`Fehlermeldung anzeigen für ${scenario.label} @regression`, async () => {
      await loginPage.login(scenario.username, scenario.password);
      await loginPage.assertErrorMessage(scenario.error);
    });
  }

  test('Abmeldung aus der NavigationMenu @regression', async ({ page }) => {
    await loginPage.login(validuser.username, validuser.password);
    await page.click('#react-burger-menu-btn');
    await page.click('#logout_sidebar_link');
    await loginPage.assertOnLoginPage();
  })

  test('Inventory Page ohne Anmeldung nicht zugänglich @regression', async({ page }) => {
    await page.goto('/inventory.html')
    await loginPage.assertErrorMessage("Epic sadface: You can only access '/inventory.html' when you are logged in.");
  })

  test('Inventory Page nach Abmeldung nicht über Back Button erreichbar @regression', async ({ page }) => {
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