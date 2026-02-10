const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password, age, gender } = req.body;

  if (!firstName || !lastName || !emailId || !password || !age || !gender) {
    throw new Error("All fields are required");
  }

  const trimmedFirstName = firstName.trim();
  const trimmedLastName = lastName.trim();
  const trimmedEmail = emailId.trim().toLowerCase();

  if (!validator.isLength(trimmedFirstName, { min: 2, max: 50 })) {
    throw new Error("First name must be between 2 and 50 characters");
  }

  if (!validator.isLength(trimmedLastName, { min: 2, max: 50 })) {
    throw new Error("Last name must be between 2 and 50 characters");
  }

  if (
    !validator.isAlpha(trimmedFirstName, "en-US", { ignore: " " }) ||
    !validator.isAlpha(trimmedLastName, "en-US", { ignore: " " })
  ) {
    throw new Error("Name must contain only letters");
  }

  if (!validator.isEmail(trimmedEmail)) {
    throw new Error("Email is not valid");
  }

  if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    throw new Error(
      "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol"
    );
  }
  if (age === undefined || age === null) {
    throw new Error("Age is required");
  }

  if (!Number.isInteger(age)) {
    throw new Error("Age must be a valid integer");
  }

  if (age < 18 || age > 50) {
    throw new Error("Age must be between 18 and 50");
  }
  if (!["male", "female", "others"].includes(gender)) {
    throw new Error("Gender data is not valid");
  }

  return {
    firstName: trimmedFirstName,
    lastName: trimmedLastName,
    emailId: trimmedEmail,
    password,
    age,
    gender,
  };
};


const validateLogin = (req) => {
  const { emailId, password } = req.body;


  if (!emailId || !password) {
    throw new Error("Email and password are required");
  }


  const normalizedEmail = emailId.trim().toLowerCase();


  if (!validator.isEmail(normalizedEmail)) {
    throw new Error("Invalid email address");
  }


  if ( password.length === 0) {
    throw new Error("Password is required");
  }

 
  return {
    emailId: normalizedEmail,
    password,
  };
};



module.exports = {
  validateSignUpData,
  validateLogin
};
