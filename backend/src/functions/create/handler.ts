import { middyfy } from "@libs/lambda";

import { formatJSONResponse } from "@libs/api-gateway";
import { TodoService } from "src/service/todo.service";

const createTodo = async (event) => {
  const todoDto = event.body;
  const todoService = new TodoService();

  console.log("todo", todoDto);
  const createdResult = await todoService.createTodo(todoDto);

  return formatJSONResponse(201, {
    message: createdResult,
  });
};

export const main = middyfy(createTodo);
