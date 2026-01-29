import { ServerDomain } from "../domains/serverDomain";
import { SyncDomain } from "../domains/syncDomain";
import { ServerService } from "../services/serverService";

export function ServerMetaView({ useSelector }) {
  const serverTodo = useSelector(ServerDomain.selectors.getTodo);
  const isConnected = useSelector(SyncDomain.selectors.isConnected);

  const wrapper = document.createElement("div");
  wrapper.className = "server-meta";

  const header = document.createElement("div");
  header.className = "meta-row";
  const headerLabel = document.createElement("span");
  headerLabel.className = "meta-label";
  headerLabel.textContent = "Last known server";
  header.append(headerLabel);

  if (serverTodo) {
    const titleRow = document.createElement("div");
    titleRow.className = "meta-row";
    const titleLabel = document.createElement("span");
    titleLabel.className = "meta-label";
    titleLabel.textContent = "Server title";
    const titleValue = document.createElement("span");
    titleValue.className = "meta-value";
    titleValue.textContent = serverTodo.title;
    titleRow.append(titleLabel, titleValue);

    const versionRow = document.createElement("div");
    versionRow.className = "meta-row";
    const versionLabel = document.createElement("span");
    versionLabel.className = "meta-label";
    versionLabel.textContent = "Server version";
    const versionValue = document.createElement("span");
    versionValue.className = "meta-value";
    versionValue.textContent = String(serverTodo.version);
    versionRow.append(versionLabel, versionValue);

    wrapper.append(header, titleRow, versionRow);
  } else {
    const empty = document.createElement("p");
    empty.className = "muted-text";
    empty.textContent = "No server updates yet.";
    wrapper.append(header, empty);
  }

  const actions = document.createElement("div");
  actions.className = "actions";
  const simulate = document.createElement("button");
  simulate.type = "button";
  simulate.className = "button-secondary";
  simulate.textContent = "Simulate server edit";
  simulate.disabled = !isConnected;
  simulate.addEventListener("click", () => {
    ServerService.simulateServerEdit();
  });
  actions.append(simulate);
  wrapper.append(actions);

  return wrapper;
}
