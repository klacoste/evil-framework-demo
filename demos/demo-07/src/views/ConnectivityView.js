import { ConnectivityDomain } from "../domains/connectivityDomain";
import { ConnectivityService } from "../services/connectivityService";

export function ConnectivityView({ useSelector }) {
  const isOnline = useSelector(ConnectivityDomain.selectors.isOnline);

  const wrapper = document.createElement("div");
  wrapper.className = "connectivity";

  const status = document.createElement("span");
  status.className = `status ${isOnline ? "online" : "offline"}`;
  status.textContent = isOnline ? "Online" : "Offline";

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

  wrapper.append(status, toggle);
  return wrapper;
}
