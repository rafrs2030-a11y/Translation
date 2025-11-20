// Cypress configuration file
// This file exists to prevent Netlify plugin errors
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:3000',
    // Skip video recording to speed up builds
    video: false,
    // Only run tests if they exist
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
  },
});

