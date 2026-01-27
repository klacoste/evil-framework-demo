import { CounterDomain } from "../domains/counterDomain";

export function ParityView({ useSelector, renderCount }) {
  const isEven = useSelector(CounterDomain.selectors.isEven);

  const wrapper = document.createElement("div");
  wrapper.className = "pill";

  const label = document.createElement("span");
  label.textContent = isEven ? "Even" : "Odd";

  const counter = document.createElement("span");
  counter.className = "render-count";
  counter.textContent = `render ${renderCount}`;

  wrapper.append(label, counter);

  return wrapper;
}
