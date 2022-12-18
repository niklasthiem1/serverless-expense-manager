import CreateTodoDto from "./dto";
import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "post",
        path: "todo",
        request: {
          schemas: {
            "application/json": CreateTodoDto,
          },
        },
      },
    },
  ],
};
