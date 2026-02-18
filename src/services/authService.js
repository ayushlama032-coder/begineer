import { randomUUID } from "crypto";
import { comparePassword, hashPassword } from "../utils/password.js";
import { signToken, verifyToken } from "../utils/token.js";

export class AuthService {
  constructor(userRepository, jwtSecret) {
    this.userRepository = userRepository;
    this.jwtSecret = jwtSecret;
  }

  async register({ name, email, password }) {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      const error = new Error("Email already in use");
      error.statusCode = 409;
      throw error;
    }

    const passwordHash = hashPassword(password);

    const user = await this.userRepository.create({
      id: randomUUID(),
      name,
      email,
      passwordHash,
      createdAt: new Date().toISOString()
    });

    return this.createAuthResponse(user);
  }

  async login({ email, password }) {
    const user = await this.userRepository.findByEmail(email);

    if (!user || !comparePassword(password, user.passwordHash)) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }

    return this.createAuthResponse(user);
  }

  verifyToken(token) {
    try {
      return verifyToken(token, this.jwtSecret);
    } catch {
      const error = new Error("Invalid or expired token");
      error.statusCode = 401;
      throw error;
    }
  }

  createAuthResponse(user) {
    const token = signToken({ sub: user.id, email: user.email }, this.jwtSecret);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    };
  }
}
