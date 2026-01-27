import { CounterDomain } from "../domains/counterDomain";

export function ValueView({ useSelector, renderCount }) {
  const value = useSelector(CounterDomain.selectors.getValue);

  const wrapper = document.createElement("div");
  wrapper.className = "value-block";

  const valueEl = document.createElement("p");
  valueEl.className = "value";
  valueEl.textContent = String(value);

  const counter = document.createElement("span");
  counter.className = "render-count";
  counter.textContent = `render ${renderCount}`;

  wrapper.append(valueEl, counter);
  return wrapper;
}
