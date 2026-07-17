import { Page, expect } from '@playwright/test';

export default class DetailsTabComponents {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }
    
    // Locators
    private movieTitleField = () => this.page.getByTestId('movieTitle-input');
    private movieTitleSuggestions = () => this.page.getByTestId('movieTitle-dropdown').locator('div');
    private theaterDropdown = () => this.page.getByTestId('theater-select');
    private theaterDropdownOptions = () => this.theaterDropdown().locator('option');
    private showDateField = () => this.page.getByTestId('showDate-input');
    private showTimeField = () => this.page.getByTestId('showTime-input');
    private ticketPriceField = () => this.page.getByTestId('ticketPrice-input');
    private studentDiscountPrice = () => this.page.getByTestId('discountPrice-input');
    private seniorDiscountPrice = () => this.page.getByTestId('seniorDiscountPrice-input');
    private endDateField = () => this.page.getByTestId('endDate-input');
    private notesField = () => this.page.getByTestId('notes-input');
    private buttonSequence = () => this.page.getByText('SaveResetBack');

    private saveButton = () => this.page.getByTestId('save-button');
    private resetButton = () => this.page.getByTestId('reset-button');
    private backButton = () => this.page.getByRole('button', { name: 'Back' });

    private showDateErrorMessage = () => this.page.getByTestId('showDate-error');
    private showTimeErrorMessage =() => this.page.getByTestId('showTime-error');
    private ticketPriceErrorMessage = () => this.page.getByTestId('ticketPrice-error');

    private errorBanner = () => this.page.getByTestId('error-banner');
    private successBanner = () => this.page.getByTestId('success-banner');



    // Actions
    public async focusMovieTitleField() {
        await this.movieTitleField().focus();
    }

    public async getMovieTitleSuggestions() {
        const suggestions = await this.movieTitleSuggestions().allTextContents();
        return suggestions;
    }

    public async enterMovieTitle(movie: string){
        this.movieTitleField().fill(movie);
        this.movieTitleSuggestions().first().click();
    }

    public async getTheaterDropdownOptions() {
        await this.theaterDropdown().click();
        const options = await this.theaterDropdownOptions().allTextContents();
        return options.slice(1); // Exclude the first option which is a placeholder
    }

    public async selectTheater(theater: string){
        this.theaterDropdown().selectOption(theater);
    }

    public async enterShowDate(date: string) {
        if(date===null){
            //do nothing
        }else{
            await this.showDateField().fill(date);
        }
        
    }

    public async enterShowTime(time: string) {
        if(time===null){
            //do nothing
        }else{
            await this.showTimeField().fill(time);
        }
        
    }

    public async enterTicketPrice(price: string){
        await this.ticketPriceField().fill(price);
    }

    public async clickSaveButton() {
        await this.saveButton().click();
    }

    public async clickResetButton() {
        await this.resetButton().click();
    }

    public async clickBackButton() {
        await this.backButton().click();
    }

    public async enterNotes(note: string){
        await this.notesField().fill(note);
    }

    public async getActualNotes(){
        return await this.notesField().inputValue();
    }

    public async getButtonSequence(){
        const buttons: string[] = await this.buttonSequence().allInnerTexts();
        return buttons[0].split('\n');
    }

    // Assertions
    public async verifyTheaterDropdownOptionsCount(options: string[], expectedCount: number) {
        expect(options).toHaveLength(expectedCount);
    }

    public async verifyMovieTitleSuggestionsAreInAlphabeticalOrder(suggestions: string[]) {
        try {
            const sortedSuggestions = [...suggestions].sort((a, b) => a.localeCompare(b));
            expect(suggestions).toEqual(sortedSuggestions);
        } catch (error) {
            console.error('Error occurred while verifying alphabetical order:');
            throw error;
        }
    }

    public async verifyEndDateValue(){
        const getEndDate = await this.endDateField().inputValue();
        const endDate = new Date(getEndDate);
        endDate.setDate(endDate.getDate() - 7);
        const formatter = new Intl.DateTimeFormat('en-US', {
            year: 'numeric',  
            month: '2-digit',
            day: '2-digit',
        });
        const parts = formatter.formatToParts(endDate);
        const partMap = Object.fromEntries(parts.map(p => [p.type, p.value]));
        const formattedEndDate = `${partMap.day}-${partMap.month}-${partMap.year}`;

        const getStartDate = await this.showDateField().inputValue();
        const formattedStartDate = getStartDate.replace(/\//g, '-');

        expect(formattedEndDate).toEqual(formattedStartDate);
    }

    public async verifyDiscountPrices(studentPercent: number, seniorPercent: number) {
        const priceValue = await this.ticketPriceField().inputValue();
        const price = parseFloat(priceValue);
    
        const expectedStudentPrice = parseFloat((price-(price * studentPercent / 100)).toFixed(2));
        const expectedSeniorPrice = parseFloat((price-(price * seniorPercent / 100)).toFixed(2));

        const actualStudentPrice = await this.studentDiscountPrice().inputValue();
        const actualSeniorPrice = await this.seniorDiscountPrice().inputValue();

        expect(parseFloat(actualStudentPrice)).toEqual(expectedStudentPrice);
        expect(parseFloat(actualSeniorPrice)).toEqual(expectedSeniorPrice);
    }

    public async verifyFieldAreReset(){
        await expect(this.showDateField()).toHaveValue('');
        await expect(this.showTimeField()).toHaveValue('');
        await expect(this.ticketPriceField()).toHaveValue('');
        await expect(this.endDateField()).toHaveValue('');
        await expect(this.studentDiscountPrice()).toHaveValue('');
        await expect(this.seniorDiscountPrice()).toHaveValue('');
        await expect(this.notesField()).toHaveValue('');
        await expect(this.movieTitleField()).toHaveValue('');
        await expect(this.theaterDropdown()).toHaveValue('');
    }

    public async verifyHiddenErrorMessage(expectedError: string){
        await expect(this.ticketPriceField()).toHaveJSProperty('validationMessage', expectedError);
    }

    public async verifyShowDateFieldValidationError(expectedError: string) {
        await expect(this.showDateErrorMessage()).toHaveText(expectedError);
    }

    public async verifyShowTimeFieldValidationError(expectedError: string) {
        await expect(this.showTimeErrorMessage()).toHaveText(expectedError);
    }

    public async verifyTicketPriceFieldValidationError(expectedError: string) {
        await expect(this.ticketPriceErrorMessage()).toHaveText(expectedError);
    }

    public async verifyActualNoteCounts(actualNotes: string){
        expect(actualNotes.length).toEqual(50);
    }

    public async verifyTheSequenceOftheButtons(buttons: string[]) {
        expect(buttons).toEqual(['Save', 'Reset', 'Back']);
    }

    public async verifyErrorBannerIsVisible(){
        await expect(this.errorBanner()).toBeVisible();
    }

    public async verifySuccessBannerIsVisible(){
        await expect(this.successBanner()).toBeVisible();
    }
    
}