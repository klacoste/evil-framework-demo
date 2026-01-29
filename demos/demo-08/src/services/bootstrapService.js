import { ConnectivityDomain } from "../domains/connectivityDomain";
import { EngineService } from "./engineService";

function getClientId() {
  const key = "demo-08-client-id";
  const existing = sessionStorage.getItem(key);
  if (existing) {
    return existing;
  }
  const generated = crypto?.randomUUID
    ? `client_${crypto.randomUUID()}`
    : `client_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  sessionStorage.setItem(key, generated);
  return generated;
}

export const BootstrapService = {
  initializeApp() {
    EngineService.start();
    const clientId = getClientId();
    EngineService.init(clientId);
    EngineService.setOnline(
      ConnectivityDomain.selectors.isOnline(ConnectivityDomain.getState())
    );
    EngineService.loadSnapshot();
  },
};
