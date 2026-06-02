import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { validuser } from '../data/users';
import { products, TOTAL_PRODUCTS, sortOptions } from '../data/products';

test.describe('Products', () => {

  let loginPage:     LoginPage;
  let inventoryPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    loginPage     = new LoginPage(page);
    inventoryPage = new ProductsPage(page);

    await loginPage.navigate();
    await loginPage.login(validuser.username, validuser.password);
    await inventoryPage.assertOnProductsPage();
  });

  test('should display Products page after login @regression', async () => {
    await inventoryPage.assertOnProductsPage();
  });

  test('should display all 6 products @regression', async () => {
    await inventoryPage.assertProductCount(TOTAL_PRODUCTS);
  });

  test('should display all product images @regression', async () => {
    await inventoryPage.assertAllImagesVisible();
  });

  // Product details

  for (const product of products) {
    test(`should display details for ${product.name} @regression`, async () => {
      await inventoryPage.assertProductDetails(
        product.name,
        product.price,
        product.description
      );
    });
  }

  // Sorting

  for (const sort of sortOptions) {
    test(`should sort products by ${sort.label} @regression`, async () => {
      await inventoryPage.sortBy(sort.option);

      const expected = (() => {
        switch (sort.option) {
          case 'az':
            return [...products]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(p => p.name);
          case 'za':
            return [...products]
              .sort((a, b) => b.name.localeCompare(a.name))
              .map(p => p.name);
          case 'lohi':
            return [...products]
              .sort((a, b) => a.price - b.price)
              .map(p => p.name);
          case 'hilo':
            return [...products]
              .sort((a, b) => b.price - a.price)
              .map(p => p.name);
        }
      })();

      await inventoryPage.assertProductNamesInOrder(expected);
    });
  }
  // Product details

  test('should navigate to product detail on name click @regression', async ({ page }) => {
    await inventoryPage.clickProductByName(products[0].name);
    await test.expect(page).toHaveURL(/inventory-item\.html/);
  });

  test('should navigate to product detail on image click @regression', async ({ page }) => {
    await inventoryPage.clickProductImageByName(products[0].name);
    await test.expect(page).toHaveURL(/inventory-item\.html/);
  });

});