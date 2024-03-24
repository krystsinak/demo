import { test, expect } from '@playwright/test';
import HomePage from '../pages/home.page';
import ProductsPage from '../pages/products.page';
import CartPage from '../pages/cart.page';

const users: string[] = [
  process.env.STANDARD_USER_USERNAME!, 
  process.env.LOCKED_OUT_USER_USERNAME!, 
  process.env.PROBLEM_USER_USERNAME!,
  process.env.PERFORMANCE_GLITCH_USER_USERNAME!, 
  process.env.ERROR_USER_USERNAME!, 
  process.env.VISUAL_USER_USERNAME!
];
const password: string = process.env.PASSWORD!;

  for (const username of users) {
    test.describe(`testing Products page with ${username}`, () => {
      test.beforeEach(async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.login(username, password);
      })
    
      test('add first item and verify cart badge updated @smoke', async ({ page }) => {
        const productsPage = new ProductsPage(page);
    
        await productsPage.productAddToCartButtons.first().click();

        expect(await productsPage.shoppingCartBadge.textContent()).toEqual("1");
      })

      test('add first item and verify correct item was added @smoke', async ({ page }) => {
        const productsPage = new ProductsPage(page);    

        let productName = await productsPage.productNames.first().textContent();
        let productPrice = await productsPage.productPrices.first().textContent();
    
        await productsPage.productAddToCartButtons.first().click();
    
        await productsPage.clickCartIcon();
    
        const cartPage = new CartPage(page);
    
        let cartItemName = await cartPage.itemName.textContent();
        let cartItemPrice = await cartPage.itemPrice.textContent();
    
        expect(productName).toEqual(cartItemName);
        expect(productPrice).toEqual(cartItemPrice);
      })

      test('remove first item and verify cart badge updated @smoke', async ({ page }) => {
        const productsPage = new ProductsPage(page);
    
        await productsPage.productAddToCartButtons.first().click();

        await productsPage.productRemoveButtons.first().click();
        
        await expect(productsPage.shoppingCartBadge).toHaveCount(0);
      })

      test('remove first item from the cart page @smoke', async ({ page }) => {
        const productsPage = new ProductsPage(page);
    
        await productsPage.productAddToCartButtons.first().click();
    
        const cartPage = new CartPage(page);
        cartPage.navigate();

        await cartPage.removeButton.click();

        await expect(cartPage.itemName).toHaveCount(0);
        await expect(cartPage.itemPrice).toHaveCount(0);
      })

      test('add all items and verify cart badge updated', async ({ page }) => {
        const productsPage = new ProductsPage(page);
        const itemCount = await productsPage.productAddToCartButtons.count();

        await productsPage.addAllItems();

        expect(await productsPage.shoppingCartBadge.textContent()).toEqual(itemCount.toString());
      })

      test('remove all items and verify cart badge updated', async ({ page }) => {
        const productsPage = new ProductsPage(page);
  
        await productsPage.addAllItems();
        await productsPage.removeAllItems();

        await expect(productsPage.shoppingCartBadge).toHaveCount(0);
      })

      test('sort items by name Z-A', async ({ page }) => {
        const productsPage = new ProductsPage(page);
    
        await productsPage.sortProducts('Name (Z to A)');
    
        let productNames = await productsPage.productNames.allTextContents();

        for (let i = 0; i < productNames.length-2; i++) {
          let currentProductName = productNames[i];
          let nextProductName = productNames[i+1];
          
          expect(currentProductName.localeCompare(nextProductName)).toBeGreaterThan(0);
        }
      })

      test('sort items by price low-high', async ({ page }) => {
        const productsPage = new ProductsPage(page);
    
        await productsPage.sortProducts('Price (low to high)');
    
        let sortedProducts = await productsPage.productPrices.allTextContents();
        let sortedProductsPrices = sortedProducts.map(s => s.substring(1)).map(s => Number(s));
      
        for (let i = 0; i < sortedProductsPrices.length-2; i++) {
          let currentProductPrice = sortedProductsPrices[i];
          let nextProductPrice = sortedProductsPrices[i+1];
          
          expect(currentProductPrice).toBeLessThanOrEqual(nextProductPrice);
        }
      })
  })
}