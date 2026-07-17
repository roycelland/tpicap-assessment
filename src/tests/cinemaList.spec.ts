import { accessSync } from 'node:fs';
import { test } from '../fixture/basePage';
import testData from '../testdata/testdata.json';

test.describe('Cinema List Management Functionality', () => {
    test.beforeEach(async ({ loginPage, homePage }) => {
        // Login to the application before each test
        await loginPage.navigateToLoginPage();
        await loginPage.enterUsername(process.env.APP_USERNAME!);
        await loginPage.enterPassword(process.env.APP_PASSWORD!);
        await loginPage.clickLoginButton();
        await homePage.verifyWelcomeMessageIsVisible();
        // Navigate to the Cinema List tab
        await homePage.clickCinemaListTab();
        await homePage.commonComponents.verifyTabHeader('Cinema List');
    });
    
    test('Empty state shows no scheduled cinema shows message', async ({ homePage }) => {
        await homePage.cinemaListComponents.verifyMessageWhenListIsEmpty('No cinema shows scheduled yet');
    });

    test('New Show button navigates to the Details tab', async ({ homePage }) => {
        await homePage.cinemaListComponents.clickNewShowButton();
        await homePage.commonComponents.verifyTabHeader('Cinema Scheduler');
    });

    test('Export button is disabled when no shows exist', async ({ homePage }) => {
        await homePage.cinemaListComponents.verifyExportButtonIsDisabled();
        await homePage.cinemaListComponents.clickNewShowButton();
        await filOutForm(homePage);
    });
    
    test('Cinema List tab displays header in a table', async ({ homePage }) => {
        await homePage.clickDetailsTab();
        await filOutForm(homePage);
        await homePage.detailsTabComponents.clickSaveButton();
        await homePage.detailsTabComponents.clickBackButton();
        await homePage.cinemaListComponents.verifyTableHeaderAreInOrder(testData.cinemaTableList);
    }); 

    test('Export button downloads all records when shows exist', async ({ homePage }) => {
        await homePage.clickDetailsTab();
        await createMultipleShows(homePage, 6 );
        await homePage.detailsTabComponents.clickSaveButton();
        await homePage.detailsTabComponents.clickBackButton();
        await homePage.cinemaListComponents.verifyExportButtonIsWorking();
    });

    test.describe('Pagination Validation', () => {
        test('Pagination displays 10 records per page', async ({ homePage }) => {
            await homePage.clickDetailsTab();
            await createMultipleShows(homePage, 15);
            await homePage.detailsTabComponents.clickBackButton();
            await homePage.cinemaListComponents.verifyPaginationElementsAreVisible();
        });

        test('Pagination navigation is working as intended', async ({ homePage }) => {
            await homePage.clickDetailsTab();
            await createMultipleShows(homePage, 15);
            await homePage.detailsTabComponents.clickBackButton();
            await homePage.cinemaListComponents.clickPaginationElement('Next');
            await homePage.cinemaListComponents.verifyPaginationLabelForNavigation('2')
            await homePage.cinemaListComponents.clickPaginationElement('Previous');
            await homePage.cinemaListComponents.verifyPaginationLabelForNavigation('1')
            await homePage.cinemaListComponents.clickPaginationElement('2');
            await homePage.cinemaListComponents.verifyPaginationLabelForNavigation('2')
            await homePage.cinemaListComponents.clickPaginationElement('1');
            await homePage.cinemaListComponents.verifyPaginationLabelForNavigation('1')
        });
    });

    test.describe('Sorting Functionality', () => {
        test('Sort columns by Schedule ID', async ({ homePage }) => {
            await homePage.clickDetailsTab();
            await createMultipleShows(homePage, 10);
            await homePage.detailsTabComponents.clickBackButton();

            await homePage.cinemaListComponents.clickHeaderTitleForSorting("Schedule ID");
            await getColumnAndValidate(homePage, 0, 'asc');
            await homePage.cinemaListComponents.clickHeaderTitleForSorting("Schedule ID");
            await getColumnAndValidate(homePage, 0, 'desc');
        });
        test('Sort columns by Movie Title', async ({ homePage }) => {
            await homePage.clickDetailsTab();
            await createMultipleShows(homePage, 10);
            await homePage.detailsTabComponents.clickBackButton();

            await homePage.cinemaListComponents.clickHeaderTitleForSorting("Movie Title");
            await getColumnAndValidate(homePage, 1, 'asc');
            await homePage.cinemaListComponents.clickHeaderTitleForSorting("Movie Title");
            await getColumnAndValidate(homePage, 1, 'desc');
        });
        test('Sort columns by Theater', async ({ homePage }) => {
            await homePage.clickDetailsTab();
            await createMultipleShows(homePage, 10);
            await homePage.detailsTabComponents.clickBackButton();

            await homePage.cinemaListComponents.clickHeaderTitleForSorting("Theater");
            await getColumnAndValidate(homePage, 2, 'asc');
            await homePage.cinemaListComponents.clickHeaderTitleForSorting("Theater");
            await getColumnAndValidate(homePage, 2, 'desc');
        });

        test('Sort columns by Show Date', async ({ homePage }) => {
            await homePage.clickDetailsTab();
            await createMultipleShows(homePage, 10);
            await homePage.detailsTabComponents.clickBackButton();

            await homePage.cinemaListComponents.clickHeaderTitleForSorting("Show Date");
            await getColumnAndValidate(homePage, 3, 'asc');
            await homePage.cinemaListComponents.clickHeaderTitleForSorting("Show Date");
            await getColumnAndValidate(homePage, 3, 'desc');
        });
    });
});

//Reusable Functions

async function filOutForm(homePage: any) {
    await homePage.detailsTabComponents.enterMovieTitle('Ava');
    await homePage.detailsTabComponents.selectTheater(testData.theater[1]);
    await homePage.detailsTabComponents.enterShowDate(testData.date.valid.value!);
    await homePage.detailsTabComponents.enterShowTime(testData.time.valid.value!);
    await homePage.detailsTabComponents.enterTicketPrice(testData.ticketPrice.valid.value!);
}

function getRandomWeekdayDate(): string {
    const maxAttempts = 30;
    let attempts = 0;

    while (attempts < maxAttempts) {
        const randomOffset = Math.floor(Math.random() * 30) + 1;
        const candidateDate = new Date();
        candidateDate.setDate(candidateDate.getDate() + randomOffset);

        if (candidateDate.getDay() !== 0 && candidateDate.getDay() !== 6) {
            const year = candidateDate.getFullYear();
            const month = String(candidateDate.getMonth() + 1).padStart(2, '0');
            const day = String(candidateDate.getDate()).padStart(2, '0');
            return `${day}/${month}/${year}`;
        }

        attempts++;
    }

    return testData.date.valid.value!;
}

async function createMultipleShows(homePage: any, count: number) {
    for (let i = 1; i <= count; i++) {
        const movieTitle = testData.movieTitle[(i - 1) % testData.movieTitle.length];
        const theater = testData.theater[(i - 1) % testData.theater.length];
        const hours = (10 + (i - 1)) % 24;
        const time = `${hours.toString().padStart(2, '0')}:00`;
        const showDate = getRandomWeekdayDate();

        await homePage.clickDetailsTab();
        await homePage.detailsTabComponents.enterMovieTitle(movieTitle);
        await homePage.detailsTabComponents.selectTheater(theater);
        await homePage.detailsTabComponents.enterShowDate(showDate);
        await homePage.detailsTabComponents.enterShowTime(time);
        await homePage.detailsTabComponents.enterTicketPrice(testData.ticketPrice.valid.value!);
        await homePage.detailsTabComponents.clickSaveButton();
        await homePage.detailsTabComponents.clickResetButton();
    }
}

async function getColumnAndValidate(homePage: any, index: number,order:   'asc' | 'desc' = 'asc'){
    await homePage.cinemaListComponents.getColumnValues(index);
    await homePage.cinemaListComponents.verifySortingIsCorrect(index, order);
}