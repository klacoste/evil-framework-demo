import { storage } from "../effects/storage";
import { api } from "../effects/api";
import { TodoDomain } from "../domains/todoDomain";
import { OutboxDomain } from "../domains/outboxDomain";
import { SyncDomain } from "../domains/syncDomain";

export const BootstrapService = {
  async initializeApp() {
    const snapshot = await storage.loadSnapshot();

    if (snapshot) {
      if (snapshot.todo) {
        TodoDomain.commands.setTodo(snapshot.todo);
      }
      if (snapshot.outbox) {
        OutboxDomain.commands.clear();
        snapshot.outbox.forEach((op) => OutboxDomain.commands.enqueue(op));
      }
      SyncDomain.commands.setIdle();
      return;
    }

    const todo = await api.getTodo();
    TodoDomain.commands.setTodo(todo);
    SyncDomain.commands.setIdle();
  },
};
