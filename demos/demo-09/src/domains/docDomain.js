import { createDomain } from "../framework/createDomain";

export const DocDomain = createDomain({
  initialState: { text: "" },
  commands: {
    setText(state, text) {
      return { ...state, text };
    },
  },
  selectors: {
    getText(state) {
      return state.text;
    },
  },
});
