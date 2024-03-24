import { Page, Locator, expect } from '@playwright/test';

class HomePage {
    readonly page: Page;
    readonly usernameInputField: Locator;
    readonly passwordInputField: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInputField = page.locator('#user-name');
        this.passwordInputField = page.locator('xpath=//*[@id="password"]');
        this.loginButton = page.getByRole('button', { name: 'Login' });
    }

    async navigate() {
        await this.page.goto('/');
    }

    async login(username: string, password: string) {
        this.navigate();
        await this.usernameInputField.fill(username);
        await this.passwordInputField.fill(password);
        await this.loginButton.click();
        expect(this.page).toHaveURL(`${process.env.URL}/inventory.html`);
    }
}

export default HomePage;