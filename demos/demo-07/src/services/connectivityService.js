import { ConnectivityDomain } from "../domains/connectivityDomain";

export const ConnectivityService = {
  goOnline() {
    ConnectivityDomain.commands.setOnline();
  },
  goOffline() {
    ConnectivityDomain.commands.setOffline();
  },
};
