import { test } from '../fixture/basePage';

test.describe('Login Page', () => {
    test.describe('Login Functionality', () => {
        test.beforeEach(async ({ loginPage }) => {
            // Navigate to the login page before running the tests
            await loginPage.navigateToLoginPage();
        });

        test('should login successfully with valid credentials', async ({ loginPage, homePage }) => {
            await loginPage.enterUsername(process.env.APP_USERNAME!);
            await loginPage.enterPassword(process.env.APP_PASSWORD!);
            await loginPage.clickLoginButton();
            // assertions to verify successful login
            await homePage.verifyWelcomeMessageIsVisible();
        });
        
        test('should display error message with invalid credentials', async ({ loginPage }) => {
            await loginPage.enterUsername('invalidUser');
            await loginPage.enterPassword('invalidPass');
            await loginPage.clickLoginButton();
            // assertions to verify error message has text 'Invalid username or password'
            await loginPage.verifyErrorMessageIsVisible();

            await loginPage.enterUsername(process.env.APP_USERNAME!+'test');
            await loginPage.enterPassword(process.env.APP_PASSWORD!+'test');
            await loginPage.clickLoginButton();
            // assertions to verify error message has text 'Invalid username or password'
            await loginPage.verifyErrorMessageIsVisible();
        });
    });
});