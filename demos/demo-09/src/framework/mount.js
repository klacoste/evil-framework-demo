import { createUseSelector } from "./useSelector";

export function mount(rootEl, viewFn) {
  if (!rootEl) {
    throw new Error("mount: rootEl is required.");
  }

  let selectorValues = new Map();
  const domainSubscriptions = new Map();
  let renderCount = 0;

  function updateSubscriptions(nextSelectorValues) {
    const nextDomains = new Set();

    for (const selector of nextSelectorValues.keys()) {
      const domain = selector.__domain;
      if (!domain) {
        throw new Error("Selector is not attached to a domain.");
      }
      nextDomains.add(domain);
    }

    for (const [domain, unsubscribe] of domainSubscriptions.entries()) {
      if (!nextDomains.has(domain)) {
        unsubscribe();
        domainSubscriptions.delete(domain);
      }
    }

    for (const domain of nextDomains) {
      if (!domainSubscriptions.has(domain)) {
        domainSubscriptions.set(domain, domain.subscribe(handleDomainChange));
      }
    }
  }

  function hasSelectorChanges() {
    for (const [selector, prevValue] of selectorValues.entries()) {
      const domain = selector.__domain;
      const nextValue = selector(domain.getState());
      if (!Object.is(prevValue, nextValue)) {
        return true;
      }
    }
    return false;
  }

  function handleDomainChange() {
    if (hasSelectorChanges()) {
      render();
    }
  }

  function render() {
    const nextSelectorValues = new Map();
    const useSelector = createUseSelector((selector, value) => {
      nextSelectorValues.set(selector, value);
    });

    renderCount += 1;
    const nextNode = viewFn({ useSelector, renderCount });
    updateSubscriptions(nextSelectorValues);
    selectorValues = nextSelectorValues;

    if (nextNode instanceof DocumentFragment) {
      rootEl.replaceChildren(nextNode);
      return;
    }

    if (
      rootEl.childNodes.length === 1 &&
      rootEl.firstChild === nextNode
    ) {
      return;
    }

    rootEl.replaceChildren(nextNode);
  }

  render();

  return () => {
    for (const unsubscribe of domainSubscriptions.values()) {
      unsubscribe();
    }
    domainSubscriptions.clear();
    rootEl.replaceChildren();
  };
}
