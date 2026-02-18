import { validateLogin, validateRegister } from "../validators/authSchemas.js";

export function createAuthController(authService) {
  return {
    register: async (body) => {
      const errors = validateRegister(body);

      if (errors.length > 0) {
        const error = new Error("Validation failed");
        error.statusCode = 400;
        error.details = errors;
        throw error;
      }

      return authService.register(body);
    },

    login: async (body) => {
      const errors = validateLogin(body);

      if (errors.length > 0) {
        const error = new Error("Validation failed");
        error.statusCode = 400;
        error.details = errors;
        throw error;
      }

      return authService.login(body);
    }
  };
}
