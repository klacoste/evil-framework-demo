import { StatsDomain } from "../domains/statsDomain";

function formatTimestamp(value) {
  if (!value) return "—";
  return new Date(value).toLocaleTimeString();
}

export function StatsView({ useSelector }) {
  const stats = useSelector(StatsDomain.selectors.getStats);

  const wrapper = document.createElement("div");
  wrapper.className = "stats-grid";

  const rows = [
    ["Local tx", stats.localTransactions],
    ["Outbound queued", stats.outboundQueued],
    ["Outbound sent", stats.outboundSent],
    ["Inbound received", stats.inboundReceived],
    ["Remote applied", stats.remoteApplied],
    ["Last server seen", formatTimestamp(stats.lastServerSeenAt)],
  ];

  rows.forEach(([labelText, valueText]) => {
    const row = document.createElement("div");
    row.className = "meta-row";
    const label = document.createElement("span");
    label.className = "meta-label";
    label.textContent = labelText;
    const value = document.createElement("span");
    value.className = "meta-value";
    value.textContent = String(valueText);
    row.append(label, value);
    wrapper.append(row);
  });

  return wrapper;
}
