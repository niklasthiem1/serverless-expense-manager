import type { AWS } from "@serverless/typescript";

import hello from "@functions/hello";
import createTodoFn from "@functions/create";
import getTodosFn from "@functions/get";
import * as dotenv from "dotenv";
dotenv.config();

//FIXME env validation
const env: any = process.env;

const serverlessConfiguration: AWS = {
  app: "todo",
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
    },
  },
  resources: {
    Resources: {
      TodoAppTable: {
        Type: "AWS::DynamoDB::Table",
        DeletionPolicy: "Retain",
        Properties: {
          AttributeDefinitions: [
            { AttributeName: "id", AttributeType: "S" },
            { AttributeName: "todo", AttributeType: "S" },
          ],
          KeySchema: [
            { AttributeName: "id", KeyType: "HASH" },
            { AttributeName: "todo", KeyType: "RANGE" },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
          TableName: env.TODO_TABLE_NAME,
        },
      },
    },
  },
  // import the function via paths
  functions: { hello, createTodoFn, getTodosFn },
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
