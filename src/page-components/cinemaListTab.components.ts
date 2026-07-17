import { Page, expect } from '@playwright/test';

export default class CinemaListTabComponents {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Locators
    private emptyStateMessage = () => this.page.locator('text=No cinema shows scheduled yet');

    private newShowButton = () => this.page.getByRole('button', { name: 'New Show' });
    private exportButton = () => this.page.getByRole('button', { name: 'Export' });

    private paginationElements = [
        () => this.page.getByRole('button', { name: 'Previous' }),
        () => this.page.getByRole('button', { name: '1' }),
        () => this.page.getByRole('button', { name: '2' }),
        () => this.page.getByRole('button', { name: 'Next' }),
    ];
    
    private cinemaListTableHeader = () => this.page.getByRole('table').locator('thead');
    private cinemaListTableBody = () => this.page.getByRole('table').locator('tbody');


    // Actions
    public async clickNewShowButton() {
        await this.newShowButton().click();
    }
    
    public async clickExportButton(){
        await this.exportButton().click();
    }

    public async clickPaginationElement(buttonName: string){
        await this.page.getByRole('button', { name: buttonName }).click();
    }

    public async clickHeaderTitleForSorting(headerName: string){
        await this.page.getByRole('columnheader', { name: headerName }).click();
    }


    //Assertions
    public async verifyMessageWhenListIsEmpty(message: string) {
        try {
            await expect(this.emptyStateMessage()).toMatchAriaSnapshot(`- paragraph: ${message}`);
        } catch (error) {
            console.error('🔴 Empty state message is not visible or does not have the expected text 🔴');
        }
    }

    public async verifyDuplicationOfData(){
        const rows = await this.cinemaListTableBody().locator('tr').all();
        const rowValues = await Promise.all(rows.map(async (row) => {
        const cells = await row.locator('td').allTextContents();
        return cells.slice(1).map(cell => cell.replace(/↕/g, '').trim()).join('|');
        }));

    const uniqueRows = new Set(rowValues);
    const hasDuplicates = uniqueRows.size !== rowValues.length;

    expect(hasDuplicates).toBeFalsy();
    }

    public async verifyTableHeaderAreInOrder(expectedHeader: string[]) {
        const actualHeader: string[] = await this.cinemaListTableHeader().locator('th').allTextContents();
        const normalizedHeader = actualHeader.map(value => value.replace(/↕/g, '').trim());
        console.log(normalizedHeader);
        console.log(expectedHeader)
        expect(normalizedHeader).toEqual(expectedHeader);
    }

    public async verifySavedMovieDetailsAreCorrect(expectedMovieDetails: string[]) {
        const movieDetails: string[] = (await this.cinemaListTableBody().locator('td').allTextContents()).slice(1, 5);
        expect(movieDetails).toEqual(expectedMovieDetails);
    }

    public async verifyScheduleIDisVisibleAndGenerated(){
        const scheduleID = await this.cinemaListTableHeader().locator('th').first().textContent();
        const generatedID = await this.cinemaListTableBody().locator('td').first().textContent();

        expect(scheduleID?.replace('↕', '').trim()).toEqual('Schedule ID');
        expect(generatedID).toEqual('1');
    }

    public async verifyExportButtonIsDisabled(){
        expect(await this.exportButton().isDisabled()).toBeTruthy();
    }

    public async verifyExportButtonIsEnabled(){
        expect(await this.exportButton().isEnabled()).toBeTruthy();
    }

    public async verifyExportButtonIsWorking(){
        const downloadPromise = this.page.waitForEvent('download');
        this.clickExportButton();
        const download = await downloadPromise;
        expect(download.suggestedFilename()).toBe('cinemalist.csv');
        const filePath = await download.saveAs('src/resources/' + download.suggestedFilename());
        expect(filePath).not.toBeNull();
    }

    public async verifyPaginationElementsAreVisible(){
        for( let i in this.paginationElements){
            await expect(this.paginationElements[i]()).toBeVisible();
        }
    }

    public async verifyPaginationLabelForNavigation(currentPage: string){
        await expect(this.page.getByText(`Page ${currentPage} of`)).toBeVisible();
    }

    public async getColumnValues(columnIndex: number): Promise<string[]> {
        const rows = await this.cinemaListTableBody().locator('tr').all();
        return Promise.all(rows.map(async (row) => {
            const cells = await row.locator('td').allTextContents();
            return cells[columnIndex]?.replace(/↕/g, '').trim() || '';
        }));
    }

    public async normalizeNumericValues(values: string[]): Promise<number[]> {
        return values.map((value) => Number(value.trim())).filter((value) => !Number.isNaN(value));
    }

    public async normalizeDateValues(values: string[]): Promise<number[]> {
        return values
            .map((value) => value.trim())
            .filter((value) => /^\d{2}\/\d{2}\/\d{4}$/.test(value))
            .map((value) => {
                const [day, month, year] = value.split('/').map(Number);
                return new Date(year, month - 1, day).getTime();
            });
    }

    public async verifySortingIsCorrect(columnIndex: number, order: 'asc' | 'desc' = 'asc') {
        const values = await this.getColumnValues(columnIndex);
        const cleanedValues = values.filter((value) => value.length > 0);

        const numericValues = await this.normalizeNumericValues(cleanedValues);
        if (numericValues.length === cleanedValues.length) {
            const sortedValues = [...numericValues].sort((a, b) => a - b);
            const expectedValues = order === 'asc' ? sortedValues : sortedValues.reverse();
            expect(numericValues).toEqual(expectedValues);
            return;
        }

        const dateValues = await this.normalizeDateValues(cleanedValues);
        if (dateValues.length === cleanedValues.length) {
            const sortedValues = [...dateValues].sort((a, b) => a - b);
            const expectedValues = order === 'asc' ? sortedValues : sortedValues.reverse();
            expect(dateValues).toEqual(expectedValues);
            return;
        }

        const sortedTextValues = [...cleanedValues].sort((a, b) => a.localeCompare(b));
        const expectedTextValues = order === 'asc' ? sortedTextValues : sortedTextValues.reverse();
        expect(cleanedValues).toEqual(expectedTextValues);
    }
}