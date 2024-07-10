// Generate referral code
const generateReferralCode = async (code, name) => {
  let first4 = "";
  let nameSub = name.substring(0, 4);
  nameSub = nameSub.replace(/ /g, "");
  console.log("nameSub => ", nameSub, code);
  if (nameSub.length < 4) {
    const updateName = name.replace(/ /g, "");
    first4 = getRandomCharacters(updateName, 4);
  } else {
    first4 = nameSub;
  }
  first4 = first4.toUpperCase();
  console.log("first4 => ", first4);
  return first4 + code + "SCM";
};

module.exports = generateReferralCode;

function getRandomCharacters(str, length) {
  if (length > str.length) {
    // default
    return "SKRY";
  }

  let result = "";
  let characters = str.split("");
  for (let i = 0; i < length; i++) {
    // Get a random index
    let randomIndex = Math.floor(Math.random() * characters.length);
    // Add the character at that index to the result
    result += characters[randomIndex];
    // Remove the character from the array to avoid duplicates
    characters.splice(randomIndex, 1);
  }
  return result;
}
