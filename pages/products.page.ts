import { Page, Locator } from '@playwright/test';

class ProductsPage {
    readonly page: Page;
    readonly productCards: Locator;
    readonly productNames: Locator;
    readonly productPrices: Locator;
    readonly productAddToCartButtons: Locator;
    readonly shoppingCartLink: Locator;
    readonly shoppingCartBadge: Locator;
    readonly productRemoveButtons: Locator;
    readonly sortMenu: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productCards = page.locator('xpath=//div[@class="inventory_item"]');
        this.productNames = page.locator('xpath=//div[@class="inventory_item_description"]//a');
        this.productPrices = page.locator('xpath=//div[@class="inventory_item_price"]');
        this.productAddToCartButtons = page.getByRole('button', { name: 'Add to cart' });
        this.shoppingCartLink = page.locator('xpath=//a[@class="shopping_cart_link"]');
        this.shoppingCartBadge = page.locator('xpath=//span[@class="shopping_cart_badge"]');
        this.productRemoveButtons = page.getByRole('button', { name: 'Remove' });
        this.sortMenu = page.locator('xpath=//select[@class="product_sort_container"]');
    }  
    
    async sortProducts(sortingOption: string) {
        await this.sortMenu.click();
        await this.sortMenu.selectOption(sortingOption);
    }

    async clickCartIcon() {
        await this.shoppingCartLink.click();
    }

    async addAllItems() {
        const addToCartButtons = await this.productAddToCartButtons.all();
        for (let i = 0; i < addToCartButtons.length; i++){
          await addToCartButtons[0].click();
        }
    }

    async removeAllItems() {
        const removeButtons = await this.productRemoveButtons.all();
        for (let i = 0; i < removeButtons.length; i++){
          await removeButtons[0].click();
        }
    }
}

export default ProductsPage;