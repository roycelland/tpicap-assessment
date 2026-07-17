import {test as base} from '@playwright/test';
import LoginPage from '../pages/login.page';
import HomePage from '../pages/home.page';
import CommonComponents from '../page-components/common.components';
import CinemaListTabComponents from '../page-components/cinemaListTab.components';
import DetailsTabComponents from '../page-components/detailsTab.components';

export const test = base.extend<{
    loginPage: LoginPage;
    homePage: HomePage;
    commonComponents: CommonComponents;
    cinemaListPage: CinemaListTabComponents;
    detailsPage: DetailsTabComponents;
    
}>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    commonComponents: async ({ page }, use) => {
        await use(new CommonComponents(page));
    },
    cinemaListPage: async ({ page }, use) => {
        await use(new CinemaListTabComponents(page));
    },
    detailsPage: async ({ page }, use) => {
        await use(new DetailsTabComponents(page));
    }
});
