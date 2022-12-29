import { formatJSONResponse } from "@libs/api-gateway";
import { HttpStatus } from "@libs/http-codes";
import { middyfy } from "@libs/lambda";
import { APIGatewayProxyResult } from "aws-lambda";
import { TodoService } from "src/service/todo.service";

const getTodo = async (): Promise<APIGatewayProxyResult> => {
  const todoService = new TodoService();

  const todos = await todoService.getAllTodos();

  return formatJSONResponse(HttpStatus.SUCCESS, {
    message: todos,
  });
};
export const main = middyfy(getTodo);
