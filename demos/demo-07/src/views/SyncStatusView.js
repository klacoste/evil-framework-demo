import { SyncDomain } from "../domains/syncDomain";

export function SyncStatusView({ useSelector }) {
  const status = useSelector(SyncDomain.selectors.getStatus);
  const error = useSelector(SyncDomain.selectors.getError);

  const wrapper = document.createElement("div");
  wrapper.className = "status-row";

  const label = document.createElement("span");
  label.className = "meta-label";
  label.textContent = "Status";

  const value = document.createElement("span");
  value.className = `meta-value status-${status}`;
  value.textContent = status;

  wrapper.append(label, value);

  if (error) {
    const errorText = document.createElement("p");
    errorText.className = "error-text";
    errorText.textContent = error;
    wrapper.append(errorText);
  }

  return wrapper;
}
