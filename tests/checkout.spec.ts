import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { validuser } from '../data/users';
import { products } from '../data/products';
import { validCheckout, invalidCheckoutData } from '../data/checkout';

test.describe('Checkout', () => {

  let loginPage:    LoginPage;
  let productsPage: ProductsPage;
  let cartPage:     CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage     = new LoginPage(page);
    productsPage = new ProductsPage(page);
    cartPage      = new CartPage(page);
    checkoutPage  = new CheckoutPage(page);

    await loginPage.navigate();
    await loginPage.login(validuser.username, validuser.password);
    await productsPage.assertOnProductsPage();
  });

  async function addItemsAndGoToCart(page: any) {
    await productsPage.addToCartByName(products[0].name);
    await productsPage.addToCartByName(products[1].name);
    await productsPage.goToCart();
    await cartPage.assertOnCartPage();
    await cartPage.proceedToCheckout();
  }

  test('Zur Checkout mit leerem Warenkorb @regression', async () => {
    await productsPage.goToCart();
    await cartPage.assertOnCartPage();

    await cartPage.proceedToCheckout();
    await checkoutPage.assertOnInfoPage();
  });

  test('Zur Checkout mit Artikeln im Warenkorb lädt die Infoseite @regression', async ({ page }) => {
    await productsPage.addToCartByName(products[0].name);
    await productsPage.goToCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.assertOnInfoPage();
  });

  test('Gültige Eingaben weiterleiten zur Overview Page @regression', async ({ page }) => {
    await addItemsAndGoToCart(page);
    await checkoutPage.assertOnInfoPage();

    await checkoutPage.fillInfo(
      validCheckout.firstName,
      validCheckout.lastName,
      validCheckout.zip
    );
    await checkoutPage.continueToOverview();
    await checkoutPage.assertOnOverviewPage();
  });

  for (const scenario of invalidCheckoutData) {
    test(`Fehlermeldung anzeigen für ${scenario.label} @regression`, async ({ page }) => {
      await addItemsAndGoToCart(page);
      await checkoutPage.assertOnInfoPage();

      await checkoutPage.fillInfo(
        scenario.firstName,
        scenario.lastName,
        scenario.zip
      );
      await checkoutPage.continueToOverview();
      await checkoutPage.assertErrorMessage(scenario.error);
      await checkoutPage.assertOnInfoPage();
    });
  }

  test('Cart Overview zeigt korrekte Artikel und Preise @regression', async ({ page }) => {
    await addItemsAndGoToCart(page);

    await checkoutPage.fillInfo(
      validCheckout.firstName,
      validCheckout.lastName,
      validCheckout.zip
    );
    await checkoutPage.continueToOverview();
    await checkoutPage.assertOnOverviewPage();

    await checkoutPage.assertOverviewItemCount(2);
    await checkoutPage.assertItemInOverview(products[0].name);
    await checkoutPage.assertItemPriceInOverview(products[0].name, products[0].price);
    await checkoutPage.assertItemInOverview(products[1].name);
    await checkoutPage.assertItemPriceInOverview(products[1].name, products[1].price);
  });

  test('Steuer wird berechnet und angezeigt @regression', async ({ page }) => {
    await addItemsAndGoToCart(page);
    await checkoutPage.fillInfo(
      validCheckout.firstName,
      validCheckout.lastName,
      validCheckout.zip
    );
    await checkoutPage.continueToOverview();
    await checkoutPage.assertTaxVisible();
  });

  test('Total Betrag entspricht Artikelsumme plus Steuer @regression', async ({ page }) => {
    await addItemsAndGoToCart(page);
    await checkoutPage.fillInfo(
      validCheckout.firstName,
      validCheckout.lastName,
      validCheckout.zip
    );
    await checkoutPage.continueToOverview();
    await checkoutPage.assertTotalEqualsItemTotalPlusTax();
  });

  test('Finish Button schließt Bestellung ab und zeigt Bestätigung @regression', async ({ page }) => {
    await addItemsAndGoToCart(page);
    await checkoutPage.fillInfo(
      validCheckout.firstName,
      validCheckout.lastName,
      validCheckout.zip
    );
    await checkoutPage.continueToOverview();
    await checkoutPage.finishCheckout();
    await checkoutPage.assertOnConfirmationPage();
    await checkoutPage.assertConfirmationMessage();
  });

  test('Back Home Button leert Warenkorb und kehrt zum Inventar zurück @regression', async ({ page }) => {
    await addItemsAndGoToCart(page);
    await checkoutPage.fillInfo(
      validCheckout.firstName,
      validCheckout.lastName,
      validCheckout.zip
    );
    await checkoutPage.continueToOverview();
    await checkoutPage.finishCheckout();
    await checkoutPage.assertOnConfirmationPage();

    await checkoutPage.goBackHome();
    await productsPage.assertOnProductsPage();
    await checkoutPage.assertCartIsEmpty();
  });

  test('Abbrechen auf der AboutPage kehrt zum Warenkorb zurück @regression', async ({ page }) => {
    await addItemsAndGoToCart(page);
    await checkoutPage.assertOnInfoPage();
    await checkoutPage.cancelFromInfo();
    await cartPage.assertOnCartPage();

    // Cart should still have items
    await cartPage.assertCartItemCount(2);
    await cartPage.assertItemInCart(products[0].name);
    await cartPage.assertItemInCart(products[1].name);
  });

  test('Abbrechen auf der Overview page kehrt zum Inventar zurück @regression', async ({ page }) => {
    await addItemsAndGoToCart(page);

    await checkoutPage.fillInfo(
      validCheckout.firstName,
      validCheckout.lastName,
      validCheckout.zip
    );
    await checkoutPage.continueToOverview();
    await checkoutPage.assertOnOverviewPage();
    await checkoutPage.cancelFromOverview();
    await productsPage.assertOnProductsPage();
  });
});