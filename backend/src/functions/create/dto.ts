export default {
  type: "object",
  properties: {
    name: { type: "string" },
    id: { type: "string" },
  },
  required: ["todo"],
} as const;

export type TodoDto = {
  id?: string;
  todo: string;
};
