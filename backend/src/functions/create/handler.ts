import { TodoEntity } from "src/entity/todo.entity";
import { middyfy } from "@libs/lambda";

import * as AWS from "aws-sdk";
import { v1 as uuidv1 } from "uuid";
import { formatJSONResponse } from "@libs/api-gateway";
import { TodoDto } from "./dto";
import dayjs from "dayjs";
import { isoVerbose } from "@libs/date-formatter";
interface ProcessEnv {
  [key: string]: string | undefined;
}
const dynamoDb = createDynamoDBClient();

const createTodo = async (event) => {
  const body: TodoDto = event.body;

  const todo = body.todo;

  const entity: TodoEntity = {
    id: uuidv1(),
    todo,
    updatedAt: dayjs().format(isoVerbose),
  };

  const params = {
    TableName: process.env.TODO_TABLE_NAME,
    Item: entity,
  };

  let createdResult;
  try {
    createdResult = await dynamoDb.put(params).promise();
  } catch (e) {
    console.log(e);
  }

  return formatJSONResponse(201, {
    message: createdResult,
  });
};
function createDynamoDBClient() {
  console.log(process.env);
  if (process.env.IS_OFFLINE) {
    return new AWS.DynamoDB.DocumentClient({
      region: process.env.DB_LOCAL_REGION,
      endpoint: process.env.DB_LOCAL_ENDPOINT,
    });
  }

  return new AWS.DynamoDB.DocumentClient();
}
export const main = middyfy(createTodo);
