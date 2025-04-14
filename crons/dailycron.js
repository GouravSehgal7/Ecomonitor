const cron = require('node-cron');
const { handler } = require('../utils/helper2'); // Your handler function

// Run the cron job every 5 minutes
cron.schedule('0 0 * * *', async () => {
  console.log("Running the cron job...");
  await handler(); // Run your handler function (your logic to update Redis)
});
