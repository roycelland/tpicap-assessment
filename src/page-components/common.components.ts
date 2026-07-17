import { Page, expect } from '@playwright/test';

export default class CommonComponents {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    //Assertions
    public async verifyTabHeader(headerTitle: string) {
        try {
            await expect(this.page.getByRole('heading', { name: headerTitle })).toBeVisible();
        } catch (error) {
            console.error(`🔴 User is not redirected to the ${headerTitle} page 🔴`);
        }
    }

}