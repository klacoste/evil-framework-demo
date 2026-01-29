import { ConnectivityDomain } from "../domains/connectivityDomain";
import { EngineService } from "./engineService";

export const ConnectivityService = {
  goOnline() {
    ConnectivityDomain.commands.setOnline();
    EngineService.setOnline(true);
  },
  goOffline() {
    ConnectivityDomain.commands.setOffline();
    EngineService.setOnline(false);
  },
  connect() {
    EngineService.connect();
  },
  disconnect() {
    EngineService.disconnect();
  },
};
