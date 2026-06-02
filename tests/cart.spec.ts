import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { CartPage } from '../pages/CartPage';
import { validuser } from '../data/users';
import { products } from '../data/products';

test.describe('Cart', () => {

  let loginPage:          LoginPage;
  let productsPage:      ProductsPage;
  let productDetailsPage: ProductDetailsPage;
  let cartPage:           CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage          = new LoginPage(page);
    productsPage       = new ProductsPage(page);
    productDetailsPage = new ProductDetailsPage(page);
    cartPage           = new CartPage(page);

    await loginPage.navigate();
    await loginPage.login(validuser.username, validuser.password);
    await productsPage.assertOnProductsPage();
  });

  test('Add to cart from product details page @regression', async () => {
    await productsPage.clickProductByName(products[0].name);
    await productDetailsPage.assertOnDetailPage();
    await productDetailsPage.assertAddToCartButtonVisible();

    await productDetailsPage.addToCart();

    await productDetailsPage.assertCartBadgeCount(1);
    await productDetailsPage.assertRemoveButtonVisible();
    await productDetailsPage.assertAddToCartButtonNotVisible();
  });

  test('Remove button removes item from cart on product details page @regression', async () => {
    await productsPage.clickProductByName(products[0].name);
    await productDetailsPage.addToCart();
    await productDetailsPage.assertCartBadgeCount(1);

    await productDetailsPage.removeFromCart();

    await productDetailsPage.assertCartBadgeNotVisible();
    await productDetailsPage.assertAddToCartButtonVisible();
  });

  test('Back to Products button navigates to inventory @regression', async () => {
    await productsPage.clickProductByName(products[0].name);
    await productDetailsPage.assertOnDetailPage();

    await productDetailsPage.goBackToProducts();

    await productsPage.assertOnProductsPage();
  });

  // ─── Cart badge ───────────────────────────────────────────────────

  test('Add single item shows badge count 1 @regression', async () => {
    await productsPage.addToCartByName(products[0].name);

    await productsPage.assertCartBadgeCount(1);
  });

  test('Add multiple items updates badge correctly @regression', async () => {
    await productsPage.addToCartByName(products[0].name);
    await productsPage.addToCartByName(products[1].name);
    await productsPage.addToCartByName(products[2].name);

    await productsPage.assertCartBadgeCount(3);
  });

  test('Remove item from inventory page updates badge @regression', async () => {
    await productsPage.addToCartByName(products[0].name);
    await productsPage.assertCartBadgeCount(1);

    await productsPage.removeFromCartByName(products[0].name);

    await productsPage.assertCartBadgeNotVisible();
  });

  test('Cart icon navigates to cart page @regression', async () => {
    await productsPage.goToCart();

    await cartPage.assertOnCartPage();
  });

  test('Continue Shopping navigates back to inventory @regression', async () => {
    await productsPage.addToCartByName(products[0].name);
    await productsPage.goToCart();
    await cartPage.assertOnCartPage();

    await cartPage.continueShopping();

    await productsPage.assertOnProductsPage();
  });

  test('Cart shows correct items quantities and prices @regression', async () => {
    await productsPage.addToCartByName(products[0].name);
    await productsPage.addToCartByName(products[1].name);
    await productsPage.goToCart();

    await cartPage.assertOnCartPage();
    await cartPage.assertCartItemCount(2);

    await cartPage.assertItemInCart(products[0].name);
    await cartPage.assertItemPrice(products[0].name, products[0].price);
    await cartPage.assertItemQuantity(products[0].name, 1);

    await cartPage.assertItemInCart(products[1].name);
    await cartPage.assertItemPrice(products[1].name, products[1].price);
    await cartPage.assertItemQuantity(products[1].name, 1);
  });

  test('Remove item from cart page @regression', async () => {
    await productsPage.addToCartByName(products[0].name);
    await productsPage.addToCartByName(products[1].name);
    await productsPage.goToCart();

    await cartPage.assertCartItemCount(2);

    await cartPage.removeItemByName(products[0].name);

    await cartPage.assertCartItemCount(1);
    await cartPage.assertItemNotInCart(products[0].name);
    await cartPage.assertItemInCart(products[1].name);
  });

  test('Cart persists after page refresh @regression', async () => {
    await productsPage.addToCartByName(products[0].name);
    await productsPage.addToCartByName(products[1].name);
    await productsPage.assertCartBadgeCount(2);

    await productsPage.page.reload();

    await productsPage.assertCartBadgeCount(2);
    await productsPage.goToCart();
    await cartPage.assertCartItemCount(2);
    await cartPage.assertItemInCart(products[0].name);
    await cartPage.assertItemInCart(products[1].name);
  });

  test('should show empty cart when no items added @regression', async () => {
    await productsPage.goToCart();

    await cartPage.assertOnCartPage();
    await cartPage.assertCartIsEmpty();
    await cartPage.assertCartBadgeNotVisible();
  });

  test('should show checkout and continue shopping buttons @regression', async () => {
    await productsPage.goToCart();

    await cartPage.assertContinueShoppingButtonVisible();
    await cartPage.assertCheckoutButtonVisible();
  });

  test('should navigate to cart from product details page @regression', async () => {
    await productsPage.clickProductByName(products[0].name);
    await productDetailsPage.addToCart();

    await productDetailsPage.goToCart();

    await cartPage.assertOnCartPage();
    await cartPage.assertItemInCart(products[0].name);
    await cartPage.assertItemPrice(products[0].name, products[0].price);
  });
});