export function createDomain({ initialState, commands, selectors }) {
  let state = initialState;
  const listeners = new Set();

  function getState() {
    return state;
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function setState(nextState) {
    if (Object.is(nextState, state)) {
      return;
    }
    state = nextState;
    listeners.forEach((listener) => listener());
  }

  const domain = {
    getState,
    subscribe,
    commands: {},
    selectors: {},
  };

  Object.entries(commands).forEach(([name, command]) => {
    domain.commands[name] = () => {
      const nextState = command(state);
      setState(nextState);
    };
  });

  Object.entries(selectors).forEach(([name, selector]) => {
    const wrappedSelector = (currentState) => selector(currentState);
    wrappedSelector.__domain = domain;
    domain.selectors[name] = wrappedSelector;
  });

  return domain;
}
