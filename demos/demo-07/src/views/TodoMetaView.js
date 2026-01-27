import { TodoDomain } from "../domains/todoDomain";

export function TodoMetaView({ useSelector }) {
  const version = useSelector(TodoDomain.selectors.getVersion);

  const wrapper = document.createElement("div");
  wrapper.className = "meta-row";

  const label = document.createElement("span");
  label.className = "meta-label";
  label.textContent = "Local version";

  const value = document.createElement("span");
  value.className = "meta-value";
  value.textContent = String(version);

  wrapper.append(label, value);
  return wrapper;
}
