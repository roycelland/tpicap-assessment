# TPICAP Assessment

This project contains Playwright automation tests for the Cinema Scheduler application, along with BDD feature files for the assessment.

## Task 1 - Feature Files

The feature files for Task 1 are stored in [src/feature](src/feature):

- [src/feature/1. login.feature](src/feature/1.%20login.feature)
- [src/feature/2. cinema_list.feature](src/feature/2.%20cinema_list.feature)
- [src/feature/3. details.feature](src/feature/3.%20details.feature)

## Task 2 - Setup and Running the Tests

### Prerequisites

- Node.js 18 or later
- npm

### 1. Install project dependencies

From the project root, run:

```bash
npm install
```

### 2. Start the local development server

The local development server is already set up under [localdevserver/cinema-scheduler-master](localdevserver/cinema-scheduler-master).

If you want to start it manually, run:

```bash
cd localdevserver/cinema-scheduler-master
npm run dev -- --host 127.0.0.1
```

> Playwright is also configured to start this server automatically through [playwright.config.ts](playwright.config.ts), so you may not need to start it manually.

### 3. Run the tests

From the project root:

```bash
npx playwright test
```

### 4. View the HTML report

```bash
npx playwright show-report
```

## Project Structure

- [src/tests](src/tests) - Playwright test specs
- [src/pages](src/pages) - Page object classes
- [src/page-components](src/page-components) - UI component helpers
- [src/fixture](src/fixture) - Playwright fixtures
- [src/testdata](src/testdata) - Test data
- [localdevserver/cinema-scheduler-master](localdevserver/cinema-scheduler-master) - React/Vite app used by the tests
