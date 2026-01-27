import { CounterDomain } from "../domains/counterDomain";

export function ControlsView({ renderCount }) {
  const actions = document.createElement("div");
  actions.className = "actions";

  const decrement = document.createElement("button");
  decrement.type = "button";
  decrement.textContent = "-";
  decrement.setAttribute("aria-label", "decrement");
  decrement.addEventListener("click", CounterDomain.commands.decrement);

  const reset = document.createElement("button");
  reset.type = "button";
  reset.textContent = "Reset";
  reset.addEventListener("click", CounterDomain.commands.reset);

  const increment = document.createElement("button");
  increment.type = "button";
  increment.textContent = "+";
  increment.setAttribute("aria-label", "increment");
  increment.addEventListener("click", CounterDomain.commands.increment);

  actions.append(decrement, reset, increment);

  const wrapper = document.createElement("div");
  wrapper.className = "controls-block";

  const counter = document.createElement("span");
  counter.className = "render-count";
  counter.textContent = `render ${renderCount}`;

  wrapper.append(actions, counter);
  return wrapper;
}
