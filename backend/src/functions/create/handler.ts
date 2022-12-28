import { TodoEntity } from "@functions/entity/todo.entity";
import { middyfy } from "@libs/lambda";

import * as AWS from "aws-sdk";
import { v1 as uuidv1 } from "uuid";
import { formatJSONResponse } from "@libs/api-gateway";
import { CreateTodoDto } from "./dto";
import dayjs from "dayjs";
import { isoVerbose } from "@libs/date-formatter";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const envVars = process.env;

const createTodo = async (event) => {
  //TODO: besser dto types
  const body: CreateTodoDto = event.body;

  const todo = body.todo;

  const entity: TodoEntity = {
    id: uuidv1(),
    todo,
    updatedAt: dayjs().format(isoVerbose),
  };

  console.log(entity);
  console.log(entity);

  const params = {
    TableName: "todos",
    Item: entity,
  };

  console.log(envVars.TODO_TABLE_NAME);

  let createResult;
  try {
    createResult = await dynamoDb.put(params).promise();
  } catch (e) {
    console.log(e);
  }
  return formatJSONResponse(201, {
    message: createResult,
  });
};

export const main = middyfy(createTodo);
