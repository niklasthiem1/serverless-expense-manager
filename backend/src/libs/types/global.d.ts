export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TODO_TABLE_NAME: string;
      DB_LOCAL_REGION: string;
      DB_LOCAL_ENDPOINT: string;
      IS_OFFLINE: string;
    }
  }
}
