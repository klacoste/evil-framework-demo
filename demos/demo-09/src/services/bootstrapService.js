import { ConnectivityDomain } from "../domains/connectivityDomain";
import { EngineDomain } from "../domains/engineDomain";
import { EngineService } from "./engineService";

function getClientId() {
  const key = "demo-09-client-id";
  const existing = sessionStorage.getItem(key);
  if (existing) return existing;
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
    EngineDomain.commands.setClientId(clientId);
    EngineService.init(clientId);
    EngineService.setOnline(
      ConnectivityDomain.selectors.isOnline(ConnectivityDomain.getState())
    );
    EngineService.load();
  },
};
