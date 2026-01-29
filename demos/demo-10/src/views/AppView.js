import { CounterDomain } from "../domains/counterDomain";
import { html } from "../framework/renderer/html";

export function AppView({ useSelector, renderCount }) {
  const value = useSelector(CounterDomain.selectors.getValue);
  const isEven = useSelector(CounterDomain.selectors.isEven);
  const sign = useSelector(CounterDomain.selectors.sign);

  const keepInputFocused = (event) => {
    event.preventDefault();
  };

  const handleInput = (event) => {
    const next = event.target.value;
    if (next.trim() === "") {
      return;
    }
    const parsed = Number.parseInt(next, 10);
    if (Number.isNaN(parsed)) {
      return;
    }
    CounterDomain.commands.setValue(parsed);
  };

  return html`
    <div class="app">
      <div class="value-row">
        <div class="value">${value}</div>
        <div class="render-count">Render cycles ${renderCount}</div>
      </div>

      <div class="pill-row">
        <div class="pill">
          <span>Parity</span>
          <strong>${isEven ? "even" : "odd"}</strong>
        </div>
        <div class="pill">
          <span>Sign</span>
          <strong>${sign}</strong>
        </div>
      </div>

      <div class="field">
        <label for="counter-input">Counter value</label>
        <input
          id="counter-input"
          type="text"
          inputmode="numeric"
          .value=${String(value)}
          @input=${handleInput}
        />
      </div>

      <div class="actions">
        <button
          @mousedown=${keepInputFocused}
          @click=${CounterDomain.commands.decrement}
        >
          Decrement
        </button>
        <button
          @mousedown=${keepInputFocused}
          @click=${CounterDomain.commands.reset}
        >
          Reset
        </button>
        <button
          @mousedown=${keepInputFocused}
          @click=${CounterDomain.commands.increment}
        >
          Increment
        </button>
      </div>
    </div>
  `;
}
