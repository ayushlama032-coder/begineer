// Centralized environment configuration.
// Why this matters: reading process.env everywhere creates duplication and hidden bugs.
// Pattern: "configuration module" used by most production backends.

export const env = {
  PORT: Number(process.env.PORT) || 3000,
  JWT_SECRET: process.env.JWT_SECRET || "dev-super-secret-change-in-production",
  DATA_FILE: process.env.DATA_FILE || "src/data/database.json"
};
