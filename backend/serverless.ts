import type { AWS } from "@serverless/typescript";

import createTodoFn from "@functions/create";
import deleteTodoFn from "@functions/delete";
import getTodosFn from "@functions/get";
import * as dotenv from "dotenv";
import { validateEnv } from "@libs/validate/env-validator";

dotenv.config({ override: true });

//FIXME env validation
const env = process.env;

validateEnv(env);

const serverlessConfiguration: AWS = {
  app: "backend",
  org: "nikcherrypick",
  service: "backend",
  frameworkVersion: "3",
  plugins: [
    "serverless-esbuild",
    "serverless-offline",
    "serverless-dynamodb-local",
  ],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    region: "us-east-1",
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: [
          "dynamodb:DescribeTable",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
        ],
        Resource: "arn:aws:dynamodb:us-east-1:*:*",
      },
    ],
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      TODO_TABLE_NAME: env.TODO_TABLE_NAME,
      DB_LOCAL_REGION: env.DB_LOCAL_REGION,
      DB_LOCAL_ENDPOINT: env.DB_LOCAL_ENDPOINT,
      IS_OFFLINE: env.IS_OFFLINE,
    },
  },
  resources: {
    Resources: {
      TodoAppTable: {
        Type: "AWS::DynamoDB::Table",
        DeletionPolicy: "Retain",
        Properties: {
          AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
          KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
          TableName: env.TODO_TABLE_NAME,
        },
      },
    },
  },
  functions: { createTodoFn, getTodosFn, deleteTodoFn },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true,
    },
    "serverless-offline": { httpPort: 3000 },
    dynamodb: {
      start: { port: 8002, inMemory: true, migrate: true },
      stages: ["dev"],
    },
  },
};

module.exports = serverlessConfiguration;
