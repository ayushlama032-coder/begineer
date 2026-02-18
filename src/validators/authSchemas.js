function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validateRegister(input) {
  const errors = [];

  if (typeof input.name !== "string" || input.name.length < 2 || input.name.length > 80) {
    errors.push("name must be a string between 2 and 80 chars");
  }

  if (typeof input.email !== "string" || !isEmail(input.email)) {
    errors.push("email must be valid");
  }

  if (typeof input.password !== "string" || input.password.length < 6 || input.password.length > 100) {
    errors.push("password must be a string between 6 and 100 chars");
  }

  return errors;
}

export function validateLogin(input) {
  const errors = [];

  if (typeof input.email !== "string" || !isEmail(input.email)) {
    errors.push("email must be valid");
  }

  if (typeof input.password !== "string" || input.password.length < 6 || input.password.length > 100) {
    errors.push("password must be a string between 6 and 100 chars");
  }

  return errors;
}
