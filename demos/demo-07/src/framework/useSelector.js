export function createUseSelector(registerSelector) {
  return function useSelector(selector) {
    const domain = selector.__domain;

    if (!domain) {
      throw new Error("Selector is not attached to a domain.");
    }

    const value = selector(domain.getState());
    registerSelector(selector, value);
    return value;
  };
}
