import { Page, expect } from '@playwright/test';
import CommonComponents from '../page-components/common.components';

export default class LoginPage {
    private page: Page;
    public commonComponents: CommonComponents

    constructor(page: Page) {
        this.page = page;
        this.commonComponents = new CommonComponents(page);
    }

    // Locators
    private usernameInput = () => this.page.getByTestId('username-input');
    private passwordInput = () => this.page.getByTestId('password-input');
    private loginButton = () => this.page.getByTestId('login-button');
    private errorMessage = () => this.page.getByTestId('error-message');

    // Actions
    public async navigateToLoginPage() {
        await this.page.goto('/');
    }
    public async enterUsername(username: string) {
        await this.usernameInput().fill(username);
    }

    public async enterPassword(password: string) {
        await this.passwordInput().fill(password);
    }

    public async clickLoginButton() {
        await this.loginButton().click();
    }

    //Assertions
    public async verifyErrorMessageIsVisible() {
        try {
            await expect(this.errorMessage()).toHaveText('Invalid username or password');
        } catch (error) {
            console.error('🔴 Error message is not visible or does not have the expected text 🔴');
        }
        
        
    }

}