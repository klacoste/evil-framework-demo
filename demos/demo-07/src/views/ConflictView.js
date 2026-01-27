import { ConflictDomain } from "../domains/conflictDomain";
import { ConflictService } from "../services/conflictService";

export function ConflictView({ useSelector }) {
  const conflict = useSelector(ConflictDomain.selectors.getConflict);

  if (!conflict) {
    return document.createDocumentFragment();
  }

  const wrapper = document.createElement("div");
  wrapper.className = "conflict-panel";

  const title = document.createElement("h2");
  title.textContent = "Conflict detected";

  const mineRow = document.createElement("div");
  mineRow.className = "conflict-row";
  const mineLabel = document.createElement("span");
  mineLabel.textContent = "Mine title";
  const mineValue = document.createElement("strong");
  mineValue.textContent = conflict.minePatch.title;
  mineRow.append(mineLabel, mineValue);

  const serverRow = document.createElement("div");
  serverRow.className = "conflict-row";
  const serverLabel = document.createElement("span");
  serverLabel.textContent = "Server title";
  const serverValue = document.createElement("strong");
  serverValue.textContent = conflict.serverTodo.title;
  serverRow.append(serverLabel, serverValue);

  const versionRow = document.createElement("div");
  versionRow.className = "conflict-row";
  const versionLabel = document.createElement("span");
  versionLabel.textContent = "Server version";
  const versionValue = document.createElement("strong");
  versionValue.textContent = String(conflict.serverTodo.version);
  versionRow.append(versionLabel, versionValue);

  const actions = document.createElement("div");
  actions.className = "actions";

  const useServer = document.createElement("button");
  useServer.type = "button";
  useServer.className = "button-secondary";
  useServer.textContent = "Use server";
  useServer.addEventListener("click", () => {
    ConflictService.useServer();
  });

  const keepMine = document.createElement("button");
  keepMine.type = "button";
  keepMine.textContent = "Keep mine";
  keepMine.addEventListener("click", () => {
    ConflictService.keepMine();
  });

  actions.append(useServer, keepMine);
  wrapper.append(title, mineRow, serverRow, versionRow, actions);
  return wrapper;
}
