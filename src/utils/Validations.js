const AppError = require("./AppError");
var validator = require("validator");

function validateSignupData(reqBody) {
  const {
    firstName,
    lastName,
    age,
    gender,
    email,
    password,
    photoUrl,
    skills,
    about,
  } = reqBody;

  if (!validator.isLength(firstName, { min: 2, max: 12 })) {
    throw new Error(
      "min characters length is 2 and max charcter length is 12",
      400
    );
  }

  if (age < 14 || age > 92) {
    throw new Error(" your age should be between 14  and 92", 400);
  }

  if (!["Male", "Female", "Others"].includes(gender)) {
    throw new Error("gender should only be Male, Female or Others", 400);
  }

  if (!validator.isEmail(email)) {
    throw new Error("pls enter  a valid email");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error("pls enter  a strong password");
  }

  if (skills) {
    let uniqueSkills = [...new Set(skills)];

    if (uniqueSkills.length > 10) {
      throw new Error("skill count should be less than 10");
    }
  }
}

module.exports = {
  validateSignupData,
};
