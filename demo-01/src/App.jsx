import { CounterDomain } from "./domains/counterDomain";
import { useSelector } from "./framework/useSelector";
import "./styles.css";

function CounterView() {
  const value = useSelector(CounterDomain.selectors.getValue);
  const isEven = useSelector(CounterDomain.selectors.isEven);
  const sign = useSelector(CounterDomain.selectors.sign);

  return (
    <section className="card">
      <h1>Counter</h1>
      <p className="value">{value}</p>
      <div className="meta">
        <span>{isEven ? "Even" : "Odd"}</span>
        <span>{sign}</span>
      </div>
      <div className="actions">
        <button onClick={CounterDomain.commands.decrement} aria-label="decrement">
          -
        </button>
        <button onClick={CounterDomain.commands.reset}>Reset</button>
        <button onClick={CounterDomain.commands.increment} aria-label="increment">
          +
        </button>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <main className="container">
      <CounterView />
    </main>
  );
}
