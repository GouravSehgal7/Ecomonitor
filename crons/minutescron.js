const cron = require('node-cron');
const { handler } = require('../utils/helper1'); // Your handler function

// Run the cron job every 5 minutes
cron.schedule('* * * * *', async () => {
  console.log("Running the min job...");
  await handler(); // Run your handler function (your logic to update Redis)
});
