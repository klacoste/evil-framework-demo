import { OutboxDomain } from "../domains/outboxDomain";

export function OutboxView({ useSelector }) {
  const count = useSelector(OutboxDomain.selectors.getCount);

  const wrapper = document.createElement("div");
  wrapper.className = "meta-row";

  const label = document.createElement("span");
  label.className = "meta-label";
  label.textContent = "Pending ops";

  const value = document.createElement("span");
  value.className = "meta-value";
  value.textContent = String(count);

  wrapper.append(label, value);
  return wrapper;
}
