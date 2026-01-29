import { EventLogDomain } from "../domains/eventLogDomain";

function formatTime(value) {
  return new Date(value).toLocaleTimeString();
}

export function EventLogView({ useSelector }) {
  const events = useSelector(EventLogDomain.selectors.getEvents);

  const wrapper = document.createElement("div");

  if (!events.length) {
    const empty = document.createElement("p");
    empty.className = "muted-text";
    empty.textContent = "No events yet.";
    wrapper.append(empty);
    return wrapper;
  }

  const list = document.createElement("ul");
  list.className = "event-log";

  events
    .slice()
    .reverse()
    .forEach((event) => {
      const item = document.createElement("li");
      item.className = "event-item";

      const meta = document.createElement("div");
      meta.className = "event-meta";
      const type = document.createElement("span");
      type.textContent = event.type;
      const time = document.createElement("span");
      time.textContent = formatTime(event.at);
      meta.append(type, time);

      item.append(meta);

      if (event.detail) {
        const detail = document.createElement("div");
        detail.className = "meta-row";
        const label = document.createElement("span");
        label.className = "meta-label";
        label.textContent = "Detail";
        const value = document.createElement("span");
        value.className = "meta-value";
        value.textContent = event.detail;
        detail.append(label, value);
        item.append(detail);
      }

      list.append(item);
    });

  wrapper.append(list);
  return wrapper;
}
