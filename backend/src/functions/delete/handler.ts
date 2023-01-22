import { formatJSONResponse } from "@libs/api-gateway";
import { HttpStatus } from "@libs/http-codes";
import { middyfy } from "@libs/lambda";
import { APIGatewayProxyResult } from "aws-lambda";
import { TodoService } from "src/service/todo.service";

const deleteTodo = async (event): Promise<APIGatewayProxyResult> => {
  const todoService = new TodoService();
  const deleteId = event.pathParameters.todoId;

  await todoService.deleteTodo(deleteId);

  return formatJSONResponse(HttpStatus.SUCCESS, {
    message: { id: deleteId },
  });
};
export const main = middyfy(deleteTodo);
