import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { CartPage } from '../pages/CartPage';
import { validuser } from '../data/users';
import { products } from '../data/products';

test.describe('Product Details', () => {

  let loginPage:         LoginPage;
  let productsPage:     ProductsPage;
  let productDetailsPage: ProductDetailsPage;
  let cartPage:          CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage         = new LoginPage(page);
    productsPage     = new ProductsPage(page);
    productDetailsPage = new ProductDetailsPage(page);
    cartPage          = new CartPage(page);

    // Login and navigate to inventory before each test
    await loginPage.navigate();
    await loginPage.login(validuser.username, validuser.password);
    await productsPage.assertOnProductsPage();
  });

  test('Zur DetailPage navigieren beim Klick auf Produktname @regression', async () => {
    await productsPage.clickProductByName(products[0].name);
    await productDetailsPage.assertOnDetailPage();
  });

  test('Zur DetailPage navigieren beim Klick auf Produktbild @regression', async () => {
    await productsPage.clickProductImageByName(products[0].name);
    await productDetailsPage.assertOnDetailPage();
  });

  for (const product of products) {
    test(`Korrekte Details anzeigen für ${product.name} @regression`, async () => {
      await productsPage.clickProductByName(product.name);
      await productDetailsPage.assertOnDetailPage();

      await productDetailsPage.assertProductName(product.name);
      await productDetailsPage.assertProductPrice(product.price);
      await productDetailsPage.assertProductDescription(product.description);
      await productDetailsPage.assertProductImageVisible();
    });
  }

  test('In-den-Cart-Schaltfläche fügt Artikel zum Warenkorb hinzu @smoke @regression', async () => {
    await productsPage.clickProductByName(products[0].name);
    await productDetailsPage.assertOnDetailPage();

// Vor dem Hinzufügen – der „In den Warenkorb“-Button sollte sichtbar sein.
    await productDetailsPage.assertAddToCartButtonVisible();

    await productDetailsPage.addToCart();

// Nach dem Hinzufügen – Badge zeigt 1 an, Entfernen-Button erscheint.
    await productDetailsPage.assertCartBadgeCount(1);
    await productDetailsPage.assertRemoveButtonVisible();
    await productDetailsPage.assertAddToCartButtonNotVisible();
  });


test('Remove-Button entfernt Artikel aus dem Warenkorb @regression', async () => {
    await productsPage.clickProductByName(products[0].name);
    await productDetailsPage.addToCart();

// Überprüfen, ob das Element hinzugefügt wurde
    await productDetailsPage.assertCartBadgeCount(1);
    await productDetailsPage.assertRemoveButtonVisible();

    await productDetailsPage.removeFromCart();

// Nach dem Entfernen – Badge verschwunden, „In den Cart-Button wieder da
    await productDetailsPage.assertCartBadgeNotVisible();
    await productDetailsPage.assertAddToCartButtonVisible();
  });

  test('Zurück-zur-Produktliste-Schaltfläche navigiert zum Inventar @regression', async () => {
    await productsPage.clickProductByName(products[0].name);
    await productDetailsPage.assertOnDetailPage();

    await productDetailsPage.goBackToProducts();

    await productsPage.assertOnProductsPage();
  });

  test('Von der Detailseite zur Warenkorbseite navigieren @regression', async () => {
    await productsPage.clickProductByName(products[0].name);
    await productDetailsPage.addToCart();

    await productDetailsPage.goToCart();

    await cartPage.assertOnCartPage();
    await cartPage.assertItemInCart(products[0].name);
    await cartPage.assertItemPrice(products[0].name, products[0].price);
  });

});