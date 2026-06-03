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

  test('Artikel von der Produktdetailpage in den Warenkorb legen @regression', async () => {
    await productsPage.clickProductByName(products[0].name);
    await productDetailsPage.assertOnDetailPage();
    await productDetailsPage.assertAddToCartButtonVisible();

    await productDetailsPage.addToCart();

    await productDetailsPage.assertCartBadgeCount(1);
    await productDetailsPage.assertRemoveButtonVisible();
    await productDetailsPage.assertAddToCartButtonNotVisible();
  });

  test('Remove-Button entfernt Artikel auf der Produktdetailseite @regression', async () => {
    await productsPage.clickProductByName(products[0].name);
    await productDetailsPage.addToCart();
    await productDetailsPage.assertCartBadgeCount(1);

    await productDetailsPage.removeFromCart();

    await productDetailsPage.assertCartBadgeNotVisible();
    await productDetailsPage.assertAddToCartButtonVisible();
  });

  test('Back-Button in Cart Page navigiert zum Inventar @regression', async () => {
    await productsPage.clickProductByName(products[0].name);
    await productDetailsPage.assertOnDetailPage();

    await productDetailsPage.goBackToProducts();

    await productsPage.assertOnProductsPage();
  });

  test('Einzelnen Artikel hinzufügen zeigt Badge-Zähler 1 @regression', async () => {
    await productsPage.addToCartByName(products[0].name);

    await productsPage.assertCartBadgeCount(1);
  });

  test('Mehrere Artikel hinzufügen aktualisiert Badge korrekt @regression', async () => {
    await productsPage.addToCartByName(products[0].name);
    await productsPage.addToCartByName(products[1].name);
    await productsPage.addToCartByName(products[2].name);

    await productsPage.assertCartBadgeCount(3);
  });

  test('Artikel von der Inventorypage entfernen aktualisiert Badge @regression', async () => {
    await productsPage.addToCartByName(products[0].name);
    await productsPage.assertCartBadgeCount(1);

    await productsPage.removeFromCartByName(products[0].name);

    await productsPage.assertCartBadgeNotVisible();
  });

  test('Cart-Symbol navigiert zur Warenkorbseite @regression', async () => {
    await productsPage.goToCart();

    await cartPage.assertOnCartPage();
  });

  test('Continue Shopping Button navigiert zurück zum Inventar @regression', async () => {
    await productsPage.addToCartByName(products[0].name);
    await productsPage.goToCart();
    await cartPage.assertOnCartPage();

    await cartPage.continueShopping();

    await productsPage.assertOnProductsPage();
  });

  test('Warenkorb zeigt korrekte Artikel, Mengen und Preise @regression', async () => {
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

  test('Artikel von der CartPage entfernen @regression', async () => {
    await productsPage.addToCartByName(products[0].name);
    await productsPage.addToCartByName(products[1].name);
    await productsPage.goToCart();

    await cartPage.assertCartItemCount(2);

    await cartPage.removeItemByName(products[0].name);

    await cartPage.assertCartItemCount(1);
    await cartPage.assertItemNotInCart(products[0].name);
    await cartPage.assertItemInCart(products[1].name);
  });

  test('Cart bleibt nach Pageaktualisierung erhalten @regression', async () => {
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

  test('Empty Cart wird angezeigt wenn keine Artikel hinzugefügt wurden @regression', async () => {
    await productsPage.goToCart();

    await cartPage.assertOnCartPage();
    await cartPage.assertCartIsEmpty();
    await cartPage.assertCartBadgeNotVisible();
  });

  test('Checkout- und Continue Buttons werden angezeigt @regression', async () => {
    await productsPage.goToCart();

    await cartPage.assertContinueShoppingButtonVisible();
    await cartPage.assertCheckoutButtonVisible();
  });

  test('Von der Produktdetails Page zum Cart navigieren @regression', async () => {
    await productsPage.clickProductByName(products[0].name);
    await productDetailsPage.addToCart();

    await productDetailsPage.goToCart();

    await cartPage.assertOnCartPage();
    await cartPage.assertItemInCart(products[0].name);
    await cartPage.assertItemPrice(products[0].name, products[0].price);
  });
});