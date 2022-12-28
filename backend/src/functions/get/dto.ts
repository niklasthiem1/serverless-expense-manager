export default {
  type: "array",
  items: {
    type: "object",
    properties: {
      name: { type: "string" },
    },
    required: ["todo"],
  },
} as const;
