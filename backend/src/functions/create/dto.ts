export default {
  type: "object",
  properties: {
    name: { type: "string" },
  },
  required: ["todo"],
} as const;

export type CreateTodoDto = {
  todo: string;
};
