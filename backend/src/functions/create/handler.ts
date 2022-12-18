import { TodoEntity } from "@functions/entity/todo.entity";
import { middyfy } from "@libs/lambda";
import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";
import * as AWS from "aws-sdk";
import type { FromSchema } from "json-schema-to-ts";
import { v1 as uuidv1 } from "uuid";
import { formatJSONResponse } from "@libs/api-gateway";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, "body"> & {
  body: FromSchema<S>;
};

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<
  ValidatedAPIGatewayProxyEvent<S>,
  APIGatewayProxyResult
>;

const createTodo = async (event) => {
  console.log("A", event);
  //TODO: besser dto types
  const body = event.body;

  const todo = body.todo as string;

  const entity: TodoEntity = { id: uuidv1(), todo, updatedAt: new Date() };
  
  const params = {
    TableName: "todos",
    Item: entity,
  };

  try {
    const a = await dynamoDb.put(params).promise();
  } catch (e) {
    console.log(e);
  }
  return formatJSONResponse({
    message: `Servis`,
    event,
  });
};

export const main = middyfy(createTodo);

// const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
//   event
// ) => {
//   return formatJSONResponse({
//     message: `Hello ${event.body.name}, welcome to the exciting Serverless world!`,
//     event,
//   });
// };

// export const main = middyfy(hello);
