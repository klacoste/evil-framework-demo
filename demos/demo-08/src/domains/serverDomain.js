import { createDomain } from "../framework/createDomain";

export const ServerDomain = createDomain({
  initialState: { todo: null },
  commands: {
    setTodo(state, todo) {
      return { ...state, todo };
    },
    clear(state) {
      return { ...state, todo: null };
    },
  },
  selectors: {
    getTodo(state) {
      return state.todo;
    },
    hasTodo(state) {
      return Boolean(state.todo);
    },
  },
});
