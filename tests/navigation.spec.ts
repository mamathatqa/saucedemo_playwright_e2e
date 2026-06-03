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

  test('Navigation-Menü öffnet sich beim Klicken und zeigt alle Einträge @regression', async () => {
    await navigationPage.openBurgerMenu();
    await navigationPage.assertMenuOpen();
  });

  test('Alle-Artikel-Link navigiert zur InventoryPage @regression', async () => {
    // Navigate away from inventory first
    await productsPage.goToCart();

    await navigationPage.openBurgerMenu();
    await navigationPage.clickAllItems();

    await navigationPage.assertOnInventoryPage();
  });

  test('About-Link navigiert zur Sauce-Labs-Website @regression', async () => {
    await navigationPage.openBurgerMenu();

    // About opens in same tab — wait for navigation
    await Promise.all([
      navigationPage.page.waitForURL('**/saucelabs**'),
      navigationPage.clickAbout(),
    ]);
    await expect(navigationPage.page).toHaveURL(/saucelabs\.com/);
  });

  test('Abmelden leitet zur Anmeldeseite weiter @regression', async () => {
    await navigationPage.openBurgerMenu();
    await navigationPage.clickLogout();
    await navigationPage.assertOnLoginPage();
  });

  test('App-Status-Zurücksetzen löscht Warenkorb-Badge und setzt Artikel zurück @regression', async () => {
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

  test('Menü schließt sich über X-Schaltfläche @regression', async () => {
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

  test('Pagetitel auf der Inventarseite ist Swag Labs @regression', async () => {
    await navigationPage.assertPageTitle('Swag Labs');
  });

  test('Keine defekten Bilder auf der Inventarseite @regression', async () => {
    await navigationPage.assertAllImagesLoaded();
  });

  test('problem_user zeigt gleiche Bilder (bekannter Fehler) @regression', async ({ page }) => {
    // Login als problem_user
    await page.goto('/');
    await loginPage.navigate();
    await loginPage.login(problemuser.username, problemuser.password);
    await productsPage.assertOnProductsPage();

    // bekannter Fehler
    await navigationPage.assertProblemUserImagesBroken();
  });

  test('Footer zeigt korrekten Copyright-Text @regression', async () => {
    await navigationPage.assertFooterVisible();
    await navigationPage.assertFooterText();
  });
});
