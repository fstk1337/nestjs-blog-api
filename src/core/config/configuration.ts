export type ConfigurationType = ReturnType<typeof configuration>;

const configuration = () => ({
  PORT: Number.parseInt(process.env.PORT || '3000'),
  DB_NAME: process.env.DB_NAME,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: Number.parseInt(process.env.DB_PORT || '5432'),
  DB_TYPE: process.env.DB_TYPE,
  USERNAME: process.env.DB_NEST_USER,
  PASSWORD: process.env.DB_PASSWORD,
  DATABASE_URL: process.env.DATABASE_URL,
});

export default configuration;
