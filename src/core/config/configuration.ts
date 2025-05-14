export type ConfigurationType = ReturnType<typeof configuration>;

const configuration = () => ({
  PORT: Number.parseInt(process.env.PORT || '3000'),
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
  DB_NAME: process.env.DB_NAME,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: Number.parseInt(process.env.DB_PORT || '5432'),
  DB_TYPE: process.env.DB_TYPE,
  USERNAME: process.env.DB_NEST_USER,
  PASSWORD: process.env.DB_PASSWORD,
});

export default configuration;
