import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { NavigationPage } from '../pages/NavigationPage';
import { CartPage } from '../pages/CartPage';
import { validuser, problemuser } from '../data/users';
import { products } from '../data/products';

test.describe('Navigation Menu', () => {

  let loginPage:      LoginPage;
  let productsPage:  ProductsPage;
  let navigationPage: NavigationPage;
  let cartPage:       CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage      = new LoginPage(page);
    productsPage   = new ProductsPage(page);
    navigationPage = new NavigationPage(page);
    cartPage       = new CartPage(page);

    await loginPage.navigate();
    await loginPage.login(validuser.username, validuser.password);
    await productsPage.assertOnProductsPage();
  });

  test('NAV_01 - Burger menu opens on click and shows all items @regression', async () => {
    await navigationPage.openBurgerMenu();
    await navigationPage.assertMenuOpen();
  });

  test('NAV_02 - All Items link navigates to inventory page @regression', async () => {
    // Navigate away from inventory first
    await productsPage.goToCart();

    await navigationPage.openBurgerMenu();
    await navigationPage.clickAllItems();

    await navigationPage.assertOnInventoryPage();
  });

  test('About link navigates to Sauce Labs website @regression', async () => {
    await navigationPage.openBurgerMenu();

    // About opens in same tab — wait for navigation
    await Promise.all([
      navigationPage.page.waitForURL('**/saucelabs**'),
      navigationPage.clickAbout(),
    ]);
    await expect(navigationPage.page).toHaveURL(/saucelabs\.com/);
  });

  test('Logout redirects to login page @regression', async () => {
    await navigationPage.openBurgerMenu();
    await navigationPage.clickLogout();
    await navigationPage.assertOnLoginPage();
  });

  test('Reset App State clears cart badge and resets items @regression', async () => {
    await productsPage.addToCartByName(products[0].name);
    await productsPage.addToCartByName(products[1].name);
    await navigationPage.assertCartBadgeCount(2);

    await navigationPage.openBurgerMenu();
    await navigationPage.clickResetAppState();
    await navigationPage.closeBurgerMenu();

    await navigationPage.assertCartBadgeNotVisible();
    await productsPage.reloadPage();
    await productsPage.assertButtonTextForProduct(products[0].name, 'Add to cart');
    await productsPage.assertButtonTextForProduct(products[1].name, 'Add to cart');
  });

  test('Menu closes via X button @regression', async () => {
    await navigationPage.openBurgerMenu();
    await navigationPage.assertMenuOpen();
    await navigationPage.closeBurgerMenu();
    await navigationPage.assertMenuClosed();
  });

});

test.describe('UI & Visual', () => {

  let loginPage:      LoginPage;
  let productsPage:  ProductsPage;
  let navigationPage: NavigationPage;

  test.beforeEach(async ({ page }) => {
    loginPage      = new LoginPage(page);
    productsPage  = new ProductsPage(page);
    navigationPage = new NavigationPage(page);

    await loginPage.navigate();
    await loginPage.login(validuser.username, validuser.password);
    await productsPage.assertOnProductsPage();
  });

  test('Page title is Swag Labs on inventory page @regression', async () => {
    await navigationPage.assertPageTitle('Swag Labs');
  });

  test('No broken images on inventory page @regression', async () => {
    await navigationPage.assertAllImagesLoaded();
  });

  test('Problem user shows similar images (known bug) @regression', async ({ page }) => {
    // Login as problem_user
    await page.goto('/');
    await loginPage.navigate();
    await loginPage.login(problemuser.username, problemuser.password);
    await productsPage.assertOnProductsPage();

    // All images are the same — known bug for problem_user
    await navigationPage.assertProblemUserImagesBroken();
  });

  test('Footer displays correct copyright text @regression', async () => {
    await navigationPage.assertFooterVisible();
    await navigationPage.assertFooterText();
  });
});
