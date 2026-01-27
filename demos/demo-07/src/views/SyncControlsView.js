import { SyncDomain } from "../domains/syncDomain";
import { ServerService } from "../services/serverService";
import { SyncService } from "../services/syncService";

export function SyncControlsView({ useSelector }) {
  const isSyncing = useSelector(SyncDomain.selectors.isSyncing);

  const wrapper = document.createElement("div");
  wrapper.className = "actions";

  const simulate = document.createElement("button");
  simulate.type = "button";
  simulate.className = "button-secondary";
  simulate.textContent = "Simulate server edit";
  simulate.addEventListener("click", () => {
    ServerService.simulateServerEdit();
  });

  const syncNow = document.createElement("button");
  syncNow.type = "button";
  syncNow.textContent = isSyncing ? "Syncing..." : "Sync now";
  syncNow.disabled = isSyncing;
  syncNow.addEventListener("click", () => {
    SyncService.syncNow();
  });

  wrapper.append(simulate, syncNow);
  return wrapper;
}
