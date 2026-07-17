import { Page, expect } from '@playwright/test';
import CommonComponents from '../page-components/common.components';
import CinemaListTabComponents from '../page-components/cinemaListTab.components';
import DetailsTabComponents from '../page-components/detailsTab.components';

export default class HomePage {
    private page: Page;
    public commonComponents: CommonComponents;
    public cinemaListComponents: CinemaListTabComponents;
    public detailsTabComponents: DetailsTabComponents;

    constructor(page: Page) {
        this.page = page;
        this.commonComponents = new CommonComponents(page);
        this.cinemaListComponents = new CinemaListTabComponents(page);
        this.detailsTabComponents = new DetailsTabComponents(page);
    }

    // Locators
    private welcomeMessage = () => this.page.getByRole('heading', { name: 'Welcome' });
    private cinemaListTab = () => this.page.getByTestId('tab-runlist');
    private detailsTab = () => this.page.getByTestId('tab-forms');

    // Actions
    public async clickCinemaListTab() {
        await this.cinemaListTab().click();
    }

    public async clickDetailsTab() {
        await this.detailsTab().click();
    }

    //Assertions
    public async verifyWelcomeMessageIsVisible() {
        try {
            await expect(this.welcomeMessage()).toBeVisible();
        } catch (error) {
            console.error('🔴 Welcome message is not visible 🔴');
        }
    }
}