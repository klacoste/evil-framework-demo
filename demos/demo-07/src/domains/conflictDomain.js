import { createDomain } from "../framework/createDomain";

export const ConflictDomain = createDomain({
  initialState: { conflict: null },
  commands: {
    setConflict(state, conflict) {
      return { ...state, conflict };
    },
    clear(state) {
      return { ...state, conflict: null };
    },
  },
  selectors: {
    getConflict(state) {
      return state.conflict;
    },
    hasConflict(state) {
      return state.conflict !== null;
    },
  },
});
