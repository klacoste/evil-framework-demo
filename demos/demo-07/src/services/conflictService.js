import { ConflictDomain } from "../domains/conflictDomain";
import { OutboxDomain } from "../domains/outboxDomain";
import { TodoDomain } from "../domains/todoDomain";
import { SyncDomain } from "../domains/syncDomain";
import { storage } from "../effects/storage";
import { SyncService } from "./syncService";
import { nextOpId } from "../utils/ids";

export const ConflictService = {
  async useServer() {
    const conflict = ConflictDomain.selectors.getConflict(
      ConflictDomain.getState()
    );
    if (!conflict) return;

    TodoDomain.commands.setTodo(conflict.serverTodo);
    OutboxDomain.commands.removeById(conflict.opId);
    ConflictDomain.commands.clear();
    await storage.saveSnapshot({
      todo: TodoDomain.selectors.getTodo(TodoDomain.getState()),
      outbox: OutboxDomain.selectors.getOps(OutboxDomain.getState()),
    });
    SyncDomain.commands.setIdle();
  },
  async keepMine() {
    const conflict = ConflictDomain.selectors.getConflict(
      ConflictDomain.getState()
    );
    if (!conflict) return;

    OutboxDomain.commands.removeById(conflict.opId);
    OutboxDomain.commands.enqueue({
      opId: nextOpId(),
      type: "patchTitle",
      todoId: "t1",
      patch: conflict.minePatch,
      baseVersion: conflict.serverTodo.version,
      createdAt: Date.now(),
    });

    ConflictDomain.commands.clear();
    await storage.saveSnapshot({
      todo: TodoDomain.selectors.getTodo(TodoDomain.getState()),
      outbox: OutboxDomain.selectors.getOps(OutboxDomain.getState()),
    });

    await SyncService.syncNow();
  },
};
