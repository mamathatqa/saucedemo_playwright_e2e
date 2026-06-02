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

  //Helper method
  async function addItemsAndGoToCart(page: any) {
    await productsPage.addToCartByName(products[0].name);
    await productsPage.addToCartByName(products[1].name);
    await productsPage.goToCart();
    await cartPage.assertOnCartPage();
    await cartPage.proceedToCheckout();
  }

  test('Proceed to checkout with empty cart @regression', async () => {
    await productsPage.goToCart();
    await cartPage.assertOnCartPage();

    await cartPage.proceedToCheckout();
    await checkoutPage.assertOnInfoPage();
  });

  test('Proceed to checkout with items in cart loads info page @regression', async ({ page }) => {
    await productsPage.addToCartByName(products[0].name);
    await productsPage.goToCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.assertOnInfoPage();
  });

  test('Submit valid info proceeds to overview page @regression', async ({ page }) => {
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
    test(`should show error for ${scenario.label} @regression`, async ({ page }) => {
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

  test('Overview shows correct items and prices @regression', async ({ page }) => {
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

  test('Tax is calculated and displayed @regression', async ({ page }) => {
    await addItemsAndGoToCart(page);
    await checkoutPage.fillInfo(
      validCheckout.firstName,
      validCheckout.lastName,
      validCheckout.zip
    );
    await checkoutPage.continueToOverview();
    await checkoutPage.assertTaxVisible();
  });

  test('Total equals item total plus tax @regression', async ({ page }) => {
    await addItemsAndGoToCart(page);
    await checkoutPage.fillInfo(
      validCheckout.firstName,
      validCheckout.lastName,
      validCheckout.zip
    );
    await checkoutPage.continueToOverview();
    await checkoutPage.assertTotalEqualsItemTotalPlusTax();
  });

  test('Finish button completes order and shows confirmation @regression', async ({ page }) => {
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

  test('Back Home clears cart and returns to inventory @regression', async ({ page }) => {
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

  test('Cancel on info page returns to cart @regression', async ({ page }) => {
    await addItemsAndGoToCart(page);
    await checkoutPage.assertOnInfoPage();
    await checkoutPage.cancelFromInfo();
    await cartPage.assertOnCartPage();

    // Cart should still have items
    await cartPage.assertCartItemCount(2);
    await cartPage.assertItemInCart(products[0].name);
    await cartPage.assertItemInCart(products[1].name);
  });

  test('Cancel on overview page returns to inventory @regression', async ({ page }) => {
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