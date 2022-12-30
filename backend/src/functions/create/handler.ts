import { middyfy } from "@libs/lambda";

import { formatJSONResponse } from "@libs/api-gateway";
import { TodoService } from "src/service/todo.service";
import { HttpStatus } from "@libs/http-codes";

const createTodo = async (event) => {
  const todoDto = event.body;
  const todoService = new TodoService();

  const createdResult = await todoService.createTodo(todoDto);

  return formatJSONResponse(HttpStatus.CREATED, {
    message: createdResult,
  });
};

export const main = middyfy(createTodo);
