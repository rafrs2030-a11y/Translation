const serverless = require('serverless-http');
const app = require('../../server/index');

// Export the Express app as a Netlify Function
exports.handler = serverless(app);

