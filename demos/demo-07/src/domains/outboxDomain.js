import { createDomain } from "../framework/createDomain";

export const OutboxDomain = createDomain({
  initialState: { ops: [] },
  commands: {
    enqueue(state, op) {
      return { ...state, ops: [...state.ops, op] };
    },
    coalescePatchTitle(state, op) {
      const lastOp = state.ops[state.ops.length - 1];
      if (
        lastOp &&
        lastOp.type === "patchTitle" &&
        lastOp.todoId === op.todoId
      ) {
        const nextOps = state.ops.slice(0, -1).concat(op);
        return { ...state, ops: nextOps };
      }
      return { ...state, ops: [...state.ops, op] };
    },
    removeById(state, opId) {
      return { ...state, ops: state.ops.filter((op) => op.opId !== opId) };
    },
    clear(state) {
      return { ...state, ops: [] };
    },
  },
  selectors: {
    getOps(state) {
      return state.ops;
    },
    getCount(state) {
      return state.ops.length;
    },
    hasOps(state) {
      return state.ops.length > 0;
    },
  },
});
