import * as joi from "joi";

const envSchema = joi
  .object({
    TODO_TABLE_NAME: joi.string().required(),
    DB_LOCAL_REGION: joi.string().required(),
    DB_LOCAL_ENDPOINT: joi.string().required(),
    IS_OFFLINE: joi.boolean().required(),
  })
  .unknown(true);

export function validateEnv(env) {
  const validationResult = envSchema.validate(env);

  if (validationResult.error) {
    console.error(
      `Env validation failed: ${validationResult.error.details.map(
        (details) => details.message
      )}`
    );
    process.exit(1);
  }
}
