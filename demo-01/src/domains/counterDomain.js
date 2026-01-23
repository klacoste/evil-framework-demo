import { createDomain } from "../framework/createDomain";

export const CounterDomain = createDomain({
  initialState: { value: 0 },
  commands: {
    increment(state) {
      return { value: state.value + 1 };
    },
    decrement(state) {
      return { value: state.value - 1 };
    },
    reset() {
      return { value: 0 };
    },
  },
  selectors: {
    getValue(state) {
      return state.value;
    },
    isEven(state) {
      return state.value % 2 === 0;
    },
    sign(state) {
      if (state.value === 0) return "zero";
      return state.value > 0 ? "positive" : "negative";
    },
  },
});
