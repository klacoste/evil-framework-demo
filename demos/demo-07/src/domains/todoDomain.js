import { createDomain } from "../framework/createDomain";

export const TodoDomain = createDomain({
  initialState: {
    todo: { id: "t1", title: "Buy milk", version: 1 },
  },
  commands: {
    setTodo(state, todo) {
      return { ...state, todo };
    },
    setTitle(state, title) {
      return { ...state, todo: { ...state.todo, title } };
    },
    setVersion(state, version) {
      return { ...state, todo: { ...state.todo, version } };
    },
  },
  selectors: {
    getTodo(state) {
      return state.todo;
    },
    getTitle(state) {
      return state.todo.title;
    },
    getVersion(state) {
      return state.todo.version;
    },
  },
});
