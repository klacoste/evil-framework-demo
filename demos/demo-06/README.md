# Demo 06: Counter Without React

This demo proves the framework can render without React.

## Overview

- Commands update domain state.
- Domains notify subscribers.
- `mount` re-evaluates selectors.
- If selector outputs changed, the view re-renders by `replaceChildren`.

This is a non-optimized starting point: no diffs, no reconciliation, and full
subtree replacement per view/mount. See next section for details.

## Run

```bash
npm install
npm run dev
```

## Performance Notes

This renderer is intentionally naive (full subtree replacement per mount). In a small-to-medium app it can still feel fine if you keep mounts scoped (many small mounts instead of one giant root) and updates aren’t happening on every animation frame.

If you wanted to make this baseline-performant, high bang-for-buck next steps are:

1. **Batch and schedule renders** (coalesce multiple domain updates into one render per tick via `queueMicrotask` / `requestAnimationFrame`).
2. **Stop full subtree replacement for common updates** (patch text/attrs/classes in place instead of always calling `replaceChildren`).
3. **Preserve identity for lists** (keyed child reconciliation so updating a list doesn’t recreate every row and rebind events).

## How This Differs From Demo 01

Demo 01 uses React as the rendering adapter. Demo 06 swaps React out entirely and proves the same domain/selector model can drive a plain DOM renderer.

### 1) Multiple mounts instead of a React tree

Rather than one React root, we mount several small views so each can re-render independently:

```js
// src/main.js
mount(document.getElementById("value"), ValueView);
mount(document.getElementById("parity"), ParityView);
mount(document.getElementById("sign"), SignView);
mount(document.getElementById("controls"), ControlsView);
```

### 2) Views are “DOM factories” (no JSX)

Views still subscribe via `useSelector`, but they return real DOM nodes:

```js
// src/views/ValueView.js
const value = useSelector(CounterDomain.selectors.getValue);

const valueEl = document.createElement("p");
valueEl.textContent = String(value);
return valueEl;
```

### 3) A tiny renderer replaces React’s update mechanism

`mount()` records which selectors were used, subscribes to the right domains, and re-renders only when selector outputs change. Re-rendering is intentionally naive: it replaces the mounted subtree.

```js
// src/framework/mount.js
const nextNode = viewFn({ useSelector, renderCount });
updateSubscriptions(nextSelectorValues);
selectorValues = nextSelectorValues;
rootEl.replaceChildren(nextNode);
```

### 4) Selectors are attached to their domain (so the renderer can subscribe)

```js
// src/framework/createDomain.js
wrappedSelector.__domain = domain;
domain.selectors[name] = wrappedSelector;
```
