import { createDomain } from "../framework/createDomain";

export const OutboxDomain = createDomain({
  initialState: { ops: [] },
  commands: {
    setOps(state, ops) {
      return { ...state, ops: [...ops] };
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
