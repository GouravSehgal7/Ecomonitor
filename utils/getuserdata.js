// Todo Server - services/userService.js
const axios = require("axios");
require('dotenv').config()
const getUser = async () => {
  const response = await axios.get(`${process.env.BACKEND_URL}/api/Userdata`);
  console.log(response.data.users);
  
  return response.data.users;
};

module.exports = { getUser };
