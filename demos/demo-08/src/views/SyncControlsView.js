import { SyncDomain } from "../domains/syncDomain";
import { SyncService } from "../services/syncService";

export function SyncControlsView({ useSelector }) {
  const isSyncing = useSelector(SyncDomain.selectors.isSyncing);

  const wrapper = document.createElement("div");
  wrapper.className = "actions";

  const syncNow = document.createElement("button");
  syncNow.type = "button";
  syncNow.textContent = isSyncing ? "Syncing..." : "Sync now (debug)";
  syncNow.disabled = isSyncing;
  syncNow.addEventListener("click", () => {
    SyncService.syncNow();
  });

  wrapper.append(syncNow);
  return wrapper;
}
