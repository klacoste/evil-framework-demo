import { ConnectivityDomain } from "../domains/connectivityDomain";
import { SyncDomain } from "../domains/syncDomain";
import { ConnectivityService } from "../services/connectivityService";

export function ConnectivityView({ useSelector }) {
  const isOnline = useSelector(ConnectivityDomain.selectors.isOnline);
  const status = useSelector(SyncDomain.selectors.getStatus);
  const isConnected = useSelector(SyncDomain.selectors.isConnected);
  const isConnecting = useSelector(SyncDomain.selectors.isConnecting);
  const error = useSelector(SyncDomain.selectors.getError);

  const wrapper = document.createElement("div");
  wrapper.className = "connectivity-panel";

  const topRow = document.createElement("div");
  topRow.className = "connectivity-row";

  const statusPill = document.createElement("span");
  statusPill.className = `status ${isOnline ? "online" : "offline"}`;
  statusPill.textContent = isOnline ? "Online" : "Offline";

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "button-secondary";
  toggle.textContent = isOnline ? "Go offline" : "Go online";
  toggle.addEventListener("click", () => {
    if (isOnline) {
      ConnectivityService.goOffline();
    } else {
      ConnectivityService.goOnline();
    }
  });

  topRow.append(statusPill, toggle);

  const connectionRow = document.createElement("div");
  connectionRow.className = "meta-row";
  const connectionLabel = document.createElement("span");
  connectionLabel.className = "meta-label";
  connectionLabel.textContent = "Connection";
  const connectionValue = document.createElement("span");
  connectionValue.className = `meta-value ${
    isConnected ? "connection-connected" : "connection-disconnected"
  }`;
  connectionValue.textContent = isConnected ? "Connected" : "Disconnected";
  connectionRow.append(connectionLabel, connectionValue);

  const actions = document.createElement("div");
  actions.className = "actions";
  const connectButton = document.createElement("button");
  connectButton.type = "button";
  connectButton.textContent = isConnected ? "Disconnect" : "Connect";
  connectButton.className = isConnected ? "button-secondary" : "";
  connectButton.disabled = isConnecting;
  connectButton.addEventListener("click", () => {
    if (isConnected) {
      ConnectivityService.disconnect();
    } else {
      ConnectivityService.connect();
    }
  });
  actions.append(connectButton);

  const statusRow = document.createElement("div");
  statusRow.className = "status-row";
  const statusLabel = document.createElement("span");
  statusLabel.className = "meta-label";
  statusLabel.textContent = "Engine status";
  const statusValue = document.createElement("span");
  statusValue.className = `meta-value status-${status}`;
  statusValue.textContent = status;
  statusRow.append(statusLabel, statusValue);

  wrapper.append(topRow, connectionRow, actions, statusRow);

  if (error) {
    const errorText = document.createElement("p");
    errorText.className = "error-text";
    errorText.textContent = error;
    wrapper.append(errorText);
  }

  return wrapper;
}
