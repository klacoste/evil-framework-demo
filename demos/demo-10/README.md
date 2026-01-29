# Demo 10 — Safer Renderer

Demo 6’s renderer replaces entire subtrees on every update, which breaks inputs (focus/selection), makes event cleanup easy to miss, and forces fully imperative DOM construction. Demo 10 keeps the same selector-driven model but swaps the renderer for a small template‑parts system with stable nodes.

## Renderer ideology (why it stays “dumb”)

This renderer is intentionally an **adapter**, not a UI framework:

* **No implicit dependencies:** views don’t “auto-track” reactive reads. The only dependencies are the selectors explicitly passed to `useSelector(...)`.
* **No hidden orchestration:** the renderer does not fetch data, manage effects, or schedule work beyond “update the parts whose values changed”.
* **Stable, inspectable updates:** templates create DOM once; parts update in place. Cleanup is explicit via the `mount()` disposer.

## Approach

* **Template parts:** `html\`...\`` returns a `TemplateResult`, and `render()` instantiates the DOM once, then updates only the dynamic parts (text, attributes, properties, boolean attrs, events).
* **Stable nodes:** parts update in place; no subtree replacement on updates.
* **Explicit subscriptions:** `mount()` only re-renders when subscribed selectors change.

## Key concepts (with snippets)

### Template parts (no VDOM)

Dynamic values become “parts” (text/attr/prop/bool/event) that update in place:

```js
import { html } from "./framework/renderer/html";

html`<div class=${klass}>Value: ${value}</div>`;
```

Supported bindings:

```js
html`
  <input .value=${String(value)} ?disabled=${isDisabled} @input=${onInput} />
  <button @click=${onClick}>Click</button>
`;
```

### Selector-driven updates (same model as Demo 6)

`mount()` runs the view function, tracks which selectors were read, and re-runs only when those selector outputs change:

```js
mount(rootEl, ({ useSelector }) => {
  const value = useSelector(CounterDomain.selectors.getValue);
  return html`<p>${value}</p>`;
});
```

### Event parts (no duplication + cleanup)

Event parts attach one DOM listener per element/event and keep a mutable handler reference. Each mount uses an `AbortController` scope so unmount removes listeners automatically:

```js
// EventPart constructor (simplified)
el.addEventListener("click", listener, { signal: scope.abortController.signal });
```

### Input safety (focus + selection)

`PropPart` updates `.value` without replacing the input. When focused, it preserves selection ranges and avoids writing the same value repeatedly.

Also: clicking buttons normally steals focus. The demo prevents that by cancelling focus-on-mousedown:

```js
const keepInputFocused = (e) => e.preventDefault();
html`<button @mousedown=${keepInputFocused} @click=${inc}>Increment</button>`;
```

## Run

```
npm install
npm run dev
```

## Manual Test Checklist

1. Basic counter works: increment/decrement/reset.
2. Derived state updates: even/odd and sign.
3. **Input focus retention:**
   * Click into the value input, put cursor in the middle.
   * Click increment.
   * The input stays focused and the cursor/selection is not reset to the end.
4. **Input selection retention:**
   * Select a range of characters in the value input.
   * Click decrement.
   * The selection remains (or degrades gracefully without throwing).
5. **No event duplication:**
   * Click increment 20 times; value increases by exactly 20.
6. Reload page:
   * App still works; no console errors.
