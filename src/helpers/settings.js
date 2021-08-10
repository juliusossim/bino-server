import dotenv from 'dotenv';

dotenv.config();
export const jwtSecret = process.env.JWT_SECRET;
export const refreshTokenSecrtet = process.env.RFT_SECRET;
export const testClient = process.env.TEST_CLIENT;
export const productionClient = process.env.PRODUCTION_CLIENT;
export const appPort = process.env.PORT;

export const databaseConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DATABASE,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
};
