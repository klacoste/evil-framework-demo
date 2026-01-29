import { EngineService } from "./engineService";

export const ConflictService = {
  useServer() {
    EngineService.resolveUseServer();
  },
  keepMine() {
    EngineService.resolveKeepMine();
  },
};
