const User = require("../models/user");

// Function to generate a random 3-digit number
function generateRandomNumber() {
  return Math.floor(Math.random() * 900) + 100;
}

// Function to check if the number exists in the database
async function checkIfNumberExists(number) {
  try {
    const result = await User.findOne({ Code: "SCM" + number });
    return !!result; // Return true if result is not null or undefined, false otherwise
  } catch (error) {
    console.error("Error checking number:", error);
    return false; // Return false if an error occurs
  }
}

// Generate a random number and check if it exists
const generateAndCheckNumber = async () => {
  const randomNumber = generateRandomNumber();
  const exists = await checkIfNumberExists(randomNumber);

  if (exists) {
    console.log(`Number ${randomNumber} exists in the database.`);
    generateAndCheckNumber();
  } else {
    console.log(`Number ${randomNumber} does not exist in the database.`);
    return randomNumber;
  }
};

module.exports = generateAndCheckNumber;
