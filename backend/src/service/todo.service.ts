import { TodoDto } from "@functions/create/dto";
import { isoVerbose } from "@libs/date-formatter";
import dayjs from "dayjs";
import { TodoEntity } from "src/repository/entity/todo.entity";
import { TodoRepository } from "src/repository/todo.repository";
import { v1 as uuidv1 } from "uuid";

export class TodoService {
  constructor(
    private readonly repository: TodoRepository = new TodoRepository()
  ) {}
  public async getAllTodos(): Promise<TodoDto[]> {
    const todos = await this.repository.scanAllTodos();

    return todos.map((todo) => {
      const { updatedAt, ...todoDto } = todo;

      return todoDto;
    });
  }

  public async createTodo(todoDto: TodoDto) {
    const { todo } = todoDto;

    const entity: TodoEntity = {
      id: uuidv1(),
      todo,
      updatedAt: dayjs().format(isoVerbose),
    };

    return await this.repository.createTodo(entity);
  }

  public async deleteTodo(id: string) {
    return await this.repository.deleteTodoById(id);
  }
}
