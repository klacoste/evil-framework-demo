import { ConnectivityDomain } from "../domains/connectivityDomain";
import { OutboxDomain } from "../domains/outboxDomain";
import { SyncDomain } from "../domains/syncDomain";
import { ConflictDomain } from "../domains/conflictDomain";
import { TodoDomain } from "../domains/todoDomain";
import { api } from "../effects/api";
import { storage } from "../effects/storage";

export const SyncService = {
  async syncNow() {
    const isOnline = ConnectivityDomain.selectors.isOnline(
      ConnectivityDomain.getState()
    );
    if (!isOnline) {
      SyncDomain.commands.setError("Offline. Go online to sync.");
      return;
    }

    const ops = OutboxDomain.selectors.getOps(OutboxDomain.getState());
    if (!ops.length) {
      SyncDomain.commands.setIdle();
      return;
    }

    SyncDomain.commands.setSyncing();

    const response = await api.pushOps(ops);

    if (response.ok) {
      const serverTodo = response.todo;
      TodoDomain.commands.setVersion(serverTodo.version);
      TodoDomain.commands.setTitle(serverTodo.title);
      OutboxDomain.commands.removeById(ops[0].opId);
      ConflictDomain.commands.clear();
      await storage.saveSnapshot({
        todo: TodoDomain.selectors.getTodo(TodoDomain.getState()),
        outbox: OutboxDomain.selectors.getOps(OutboxDomain.getState()),
      });
      SyncDomain.commands.setIdle();
      return;
    }

    const conflictingOp = ops.find((op) => op.opId === response.conflict.opId);
    SyncDomain.commands.setConflict();
    ConflictDomain.commands.setConflict({
      opId: response.conflict.opId,
      baseVersion: conflictingOp?.baseVersion ?? 0,
      minePatch: conflictingOp?.patch ?? { title: "" },
      serverTodo: response.conflict.serverTodo,
    });
  },
};
