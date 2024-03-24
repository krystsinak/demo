import { Page, Locator } from '@playwright/test';

class CartPage {
    readonly page: Page;
    readonly itemName: Locator;
    readonly itemPrice: Locator;
    readonly removeButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.itemName = page.locator('xpath=//*[@class="inventory_item_name"]');
        this.itemPrice = page.locator('xpath=//*[@class="inventory_item_price"]');
        this.removeButton = page.getByRole('button', { name: 'Remove' });
    }

    async navigate() {
        await this.page.goto('/cart.html');
    }
}

export default CartPage;