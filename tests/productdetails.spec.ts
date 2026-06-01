import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { CartPage } from '../pages/CartPage';
import { validuser } from '../data/users';
import { products } from '../data/products';

test.describe('Product Detail Page', () => {

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

  // ─── Page load & content ──────────────────────────────────────────

  test('should navigate to detail page on product name click @smoke @regression', async () => {
    await productsPage.clickProductByName(products[0].name);
    await productDetailsPage.assertOnDetailPage();
  });

  test('should navigate to detail page on product image click @regression', async () => {
    await productsPage.clickProductImageByName(products[0].name);
    await productDetailsPage.assertOnDetailPage();
  });

  // Product details driven from products.ts — one test per product
  for (const product of products) {
    test(`should display correct details for ${product.name} @regression`, async () => {
      await productsPage.clickProductByName(product.name);
      await productDetailsPage.assertOnDetailPage();

      await productDetailsPage.assertProductName(product.name);
      await productDetailsPage.assertProductPrice(product.price);
      await productDetailsPage.assertProductDescription(product.description);
      await productDetailsPage.assertProductImageVisible();
    });
  }

  // ─── Add to cart ──────────────────────────────────────────────────

  test('PD_02 - Add to cart button adds item to cart @smoke @regression', async () => {
    await productsPage.clickProductByName(products[0].name);
    await productDetailsPage.assertOnDetailPage();

    // Before adding — add to cart button should be visible
    await productDetailsPage.assertAddToCartButtonVisible();

    await productDetailsPage.addToCart();

    // After adding — badge shows 1, remove button appears
    await productDetailsPage.assertCartBadgeCount(1);
    await productDetailsPage.assertRemoveButtonVisible();
    await productDetailsPage.assertAddToCartButtonNotVisible();
  });

  // ─── Remove from cart ─────────────────────────────────────────────

  test('PD_03 - Remove button removes item from cart @regression', async () => {
    await productsPage.clickProductByName(products[0].name);
    await productDetailsPage.addToCart();

    // Verify item was added
    await productDetailsPage.assertCartBadgeCount(1);
    await productDetailsPage.assertRemoveButtonVisible();

    await productDetailsPage.removeFromCart();

    // After removing — badge gone, add to cart button back
    await productDetailsPage.assertCartBadgeNotVisible();
    await productDetailsPage.assertAddToCartButtonVisible();
  });

  // ─── Navigation ───────────────────────────────────────────────────

  test('PD_04 - Back to Products button navigates to inventory @regression', async () => {
    await productsPage.clickProductByName(products[0].name);
    await productDetailsPage.assertOnDetailPage();

    await productDetailsPage.goBackToProducts();

    await productsPage.assertOnProductsPage();
  });

  test('should navigate to cart page from detail page @regression', async () => {
    await productsPage.clickProductByName(products[0].name);
    await productDetailsPage.addToCart();

    await productDetailsPage.goToCart();

    await cartPage.assertOnCartPage();
    await cartPage.assertItemInCart(products[0].name);
    await cartPage.assertItemPrice(products[0].name, products[0].price);
  });

});