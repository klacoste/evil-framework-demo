import { TodoDomain } from "../domains/todoDomain";
import { OutboxDomain } from "../domains/outboxDomain";
import { storage } from "../effects/storage";
import { nextOpId } from "../utils/ids";

export const TodoService = {
  async editTitle(nextTitle) {
    const todo = TodoDomain.selectors.getTodo(TodoDomain.getState());

    TodoDomain.commands.setTitle(nextTitle);

    const op = {
      opId: nextOpId(),
      type: "patchTitle",
      todoId: todo.id,
      patch: { title: nextTitle },
      baseVersion: todo.version,
      createdAt: Date.now(),
    };

    OutboxDomain.commands.coalescePatchTitle(op);
    await storage.saveSnapshot({
      todo: TodoDomain.selectors.getTodo(TodoDomain.getState()),
      outbox: OutboxDomain.selectors.getOps(OutboxDomain.getState()),
    });
  },
};
