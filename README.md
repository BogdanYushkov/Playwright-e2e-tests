# Playwright-e2e-tests
## Description
This project contains automated end-to-end tests for the web application, developed using the Playwright framework. The tests are executed in a CI/CD pipeline set up with GitHub Actions. The main goal is to ensure that the application functions as expected in different browsers, making the deployment process more reliable.

The pipeline is designed to automatically run Playwright tests on every push to the `main` branch or on pull requests to it. Here is how it works:

1. **Install Dependencies**: Installs all required system dependencies for Playwright and project dependencies using `npm`.
2. **Run Playwright Tests**: Executes the Playwright tests, generating results in the `allure-results` folder.
3. **Generate Allure Report**: Generates a detailed report from the test results using Allure.
4. **Deploy Report**: Deploys the generated Allure report to GitHub Pages on the `gh-pages` branch. The deployment ensures that the latest test results are always available on the live page.
5. **Clear Old Reports**: Removes old report data before deploying the new one.

The pipeline is fully automated using **GitHub Actions** and is triggered on every push to the `main` branch or when a pull request is made.
