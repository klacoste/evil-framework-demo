import { useSyncExternalStore } from "react";

export function useSelector(selector) {
  const domain = selector.__domain;

  if (!domain) {
    throw new Error("Selector is not attached to a domain.");
  }

  const getSnapshot = () => selector(domain.getState());

  return useSyncExternalStore(domain.subscribe, getSnapshot, getSnapshot);
}
