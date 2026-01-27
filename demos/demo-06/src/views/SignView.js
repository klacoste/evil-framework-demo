import { CounterDomain } from "../domains/counterDomain";

export function SignView({ useSelector, renderCount }) {
  const sign = useSelector(CounterDomain.selectors.sign);

  const wrapper = document.createElement("div");
  wrapper.className = "pill";

  const label = document.createElement("span");
  label.textContent = sign;

  const counter = document.createElement("span");
  counter.className = "render-count";
  counter.textContent = `render ${renderCount}`;

  wrapper.append(label, counter);

  return wrapper;
}
