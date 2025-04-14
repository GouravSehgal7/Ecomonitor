const express = require('express')
require('./crons/dailycron')
require('./crons/minutescron')
require('dotenv').config()
const cores = require('cors')
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(cores({
    origin: `${process.env.BACKEND_URL}`,
  }));

app.listen(PORT, () => {
    console.log(`Server is running on :${PORT}`);
  });