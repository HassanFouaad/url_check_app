require("dotenv").config();
const bcrypt = require("bcrypt");

const hashPassword = async (plain) => {
  return await bcrypt.hash(plain, 10);
};
module.exports = {
  up: async (queryInterface) =>
    queryInterface.bulkInsert(
      "user",
      [
        {
          username: process.env.INIT_USER_USERNAME,
          password: await hashPassword(process.env.INIT_USER_PASSWORD),
        },
      ],
      {}
    ),

  down: (queryInterface) => {},
};
