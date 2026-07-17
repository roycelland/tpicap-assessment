import { test } from '../fixture/basePage';
import testData from '../testdata/testdata.json';

test.describe('Details Tab Functionality', () => {
    test.beforeEach(async ({ loginPage, homePage }) => {
        // Login to the application before each test
        await loginPage.navigateToLoginPage();
        await loginPage.enterUsername(process.env.APP_USERNAME!);
        await loginPage.enterPassword(process.env.APP_PASSWORD!);
        await loginPage.clickLoginButton();
        await homePage.verifyWelcomeMessageIsVisible();
        // Navigate to the Details tab
        await homePage.clickDetailsTab();
        await homePage.commonComponents.verifyTabHeader('Cinema Scheduler');
    });

    test('Movie Title typeahead shows available movies in alphabetical order', async ({ homePage }) => {
        await homePage.detailsTabComponents.focusMovieTitleField();
        const suggestions = await homePage.detailsTabComponents.getMovieTitleSuggestions();
        await homePage.detailsTabComponents.verifyMovieTitleSuggestionsAreInAlphabeticalOrder(suggestions);
    });

    test('Theater dropdown contains six theater options', async ({ homePage }) => {
        const theaterOptions = await homePage.detailsTabComponents.getTheaterDropdownOptions();
        await homePage.detailsTabComponents.verifyTheaterDropdownOptionsCount(theaterOptions, 6);
    });

    test.describe('Show Date Validations', () => {
        test('Show Date is required', async ({ homePage }) => {
            await homePage.detailsTabComponents.enterShowDate(testData.date.empty.value!);
            await homePage.detailsTabComponents.clickSaveButton();
            await homePage.detailsTabComponents.verifyShowDateFieldValidationError(testData.date.empty.expectedMessage!);
        });
        test('Date must be in dd/mm/yyyy format', async ({ homePage }) => {
            await homePage.detailsTabComponents.enterShowDate(testData.date.invalid.value!);
            await homePage.detailsTabComponents.clickSaveButton();
            await homePage.detailsTabComponents.verifyShowDateFieldValidationError(testData.date.invalid.expectedMessage!);
        });
        test('Show Date must be weekday', async ({ homePage }) => {
            await homePage.detailsTabComponents.enterShowDate(testData.date.weekend.value!);
            await homePage.detailsTabComponents.clickSaveButton();
            await homePage.detailsTabComponents.verifyShowDateFieldValidationError(testData.date.weekend.expectedMessage!);
        });
        test('Invalid Date', async ({ homePage }) => {
            await homePage.detailsTabComponents.enterShowDate(testData.date.feb30.value!);
            await homePage.detailsTabComponents.clickSaveButton();
            await homePage.detailsTabComponents.verifyShowDateFieldValidationError(testData.date.feb30.expectedMessage!);
            await homePage.detailsTabComponents.clickResetButton();
            await homePage.detailsTabComponents.enterShowDate(testData.date.feb29.value!);
            await homePage.detailsTabComponents.clickSaveButton();
            await homePage.detailsTabComponents.verifyShowDateFieldValidationError(testData.date.feb29.expectedMessage!);           
        });
    });

    test.describe('Show Time Validations', () => {
        test('Show Time is required', async ({ homePage }) => {
            await homePage.detailsTabComponents.enterShowTime(testData.time.empty.value!);
            await homePage.detailsTabComponents.clickSaveButton();
            await homePage.detailsTabComponents.verifyShowTimeFieldValidationError(testData.time.empty.expectedMessage!);
        });
        test('Time must be in HH:MM format', async ({ homePage }) => {
            await homePage.detailsTabComponents.enterShowTime(testData.time.invalid.value!);
            await homePage.detailsTabComponents.clickSaveButton();
            await homePage.detailsTabComponents.verifyShowTimeFieldValidationError(testData.time.invalid.expectedMessage!);
        });
        test('Time is more than 24:59', async ({ homePage }) => {
            await homePage.detailsTabComponents.enterShowTime(testData.time.time25.value!);
            await homePage.detailsTabComponents.clickSaveButton();
            await homePage.detailsTabComponents.verifyShowTimeFieldValidationError(testData.time.time25.expectedMessage!);
        });
    });

    test.describe('Ticket Price Validations', () => {
        test('Value must be greater than or equal to 0', async ({ homePage }) => {
            await homePage.detailsTabComponents.enterTicketPrice(testData.ticketPrice.negative.value!);
            await homePage.detailsTabComponents.clickSaveButton();
            await homePage.detailsTabComponents.verifyHiddenErrorMessage(testData.ticketPrice.negative.expectedMessage!);
        });
        test('Ticket Price must be a valid positive number', async ({ homePage }) => {
            await homePage.detailsTabComponents.enterTicketPrice(testData.ticketPrice.invalid.value!);
            await homePage.detailsTabComponents.clickSaveButton();
            await homePage.detailsTabComponents.verifyTicketPriceFieldValidationError(testData.ticketPrice.invalid.expectedMessage!);
        });
    });

    test('Ticket Price calculates discounts automatically', async ({ homePage }) => {
        await filOutForm(homePage)
        await homePage.detailsTabComponents.clickSaveButton();
        await homePage.detailsTabComponents.verifyDiscountPrices(testData.discount.student, testData.discount.senior);
    });
    
    test('End Date automatically calculates as Show Date plus 7 days', async ({ homePage }) => {
        await filOutForm(homePage)
        await homePage.detailsTabComponents.clickSaveButton();
        await homePage.detailsTabComponents.verifyEndDateValue();
    });

    test.describe('Notes field is limited to 50 characters', () => {
        test('Input 51 character in Note Field', async ({ homePage }) => {
            await homePage.detailsTabComponents.enterNotes(testData.notes.invalid);
            const actualNotes = await homePage.detailsTabComponents.getActualNotes();
            await homePage.detailsTabComponents.verifyActualNoteCounts(actualNotes);
        });
        test('Input 50 character in Note Field', async ({ homePage }) => {
            await homePage.detailsTabComponents.enterNotes(testData.notes.valid);
            const actualNotes = await homePage.detailsTabComponents.getActualNotes();
            await homePage.detailsTabComponents.verifyActualNoteCounts(actualNotes);
        });
    });

    test('Form buttons display in order Save, Reset, Back', async ({ homePage }) => {
        const buttonSeq = await homePage.detailsTabComponents.getButtonSequence();
        await homePage.detailsTabComponents.verifyTheSequenceOftheButtons(buttonSeq);
    });

    test('Back button navigates back to the Cinema List tab', async ({ homePage }) => {
        await homePage.detailsTabComponents.clickBackButton();
        await homePage.commonComponents.verifyTabHeader('Cinema List');
    });

    test('Reset button clears all Details form fields', async ({ homePage }) => {
        await filOutForm(homePage)
        await homePage.detailsTabComponents.clickResetButton();
        await homePage.detailsTabComponents.verifyFieldAreReset();
    });

    test('Duplicate show is prevented for same theater, movie, date, and time', async ({ homePage }) => {
        for(let i = 0; i <=2; i++){
        await filOutForm(homePage)
        await homePage.detailsTabComponents.clickSaveButton();
        }
        await homePage.detailsTabComponents.verifyErrorBannerIsVisible();
        await homePage.detailsTabComponents.clickBackButton();

        await homePage.cinemaListComponents.verifyDuplicationOfData();
    });

    test('Saved show appears in Cinema List with auto-generated Schedule ID and success banner', async ({ homePage }) => {
        await filOutForm(homePage)
        await homePage.detailsTabComponents.clickSaveButton();
        await homePage.detailsTabComponents.verifySuccessBannerIsVisible();
        await homePage.detailsTabComponents.clickBackButton();
        await homePage.cinemaListComponents.verifySavedMovieDetailsAreCorrect(['Avatar 3', testData.theater[1],testData.date.valid.value!,testData.time.valid.value!]);
        await homePage.cinemaListComponents.verifyScheduleIDisVisibleAndGenerated();
    });
});

async function filOutForm(homePage: any) {
    await homePage.detailsTabComponents.enterMovieTitle('Ava');
    await homePage.detailsTabComponents.selectTheater(testData.theater[1]);
    await homePage.detailsTabComponents.enterShowDate(testData.date.valid.value!);
    await homePage.detailsTabComponents.enterShowTime(testData.time.valid.value!);
    await homePage.detailsTabComponents.enterTicketPrice(testData.ticketPrice.valid.value!);
}