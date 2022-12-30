import AWS from "aws-sdk";
import { TodoEntity } from "./entity/todo.entity";

export class TodoRepository {
  constructor(
    private readonly dynamoDbClient = createDynamoDBClient(),
    private readonly tableName = process.env.TODO_TABLE_NAME
  ) {}

  public async createTodo(todoEntity: TodoEntity): Promise<TodoEntity> {
    const putParams = {
      TableName: this.tableName,
      Item: todoEntity,
    };

    await this.dynamoDbClient.put(putParams).promise();
    return todoEntity;
  }

  public async scanAllTodos(): Promise<TodoEntity[]> {
    const result = await this.dynamoDbClient
      .scan({
        TableName: this.tableName,
      })
      .promise();

    return result.Items as TodoEntity[];
  }

  async deleteTodoById(id: string) {
    console.log(id);
    return await this.dynamoDbClient
      .delete({
        TableName: this.tableName,
        Key: { id },
      })
      .promise();
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    return new AWS.DynamoDB.DocumentClient({
      region: process.env.DB_LOCAL_REGION,
      endpoint: process.env.DB_LOCAL_ENDPOINT,
    });
  }

  return new AWS.DynamoDB.DocumentClient();
}
