import { TodoDomain } from "../domains/todoDomain";
import { EngineService } from "./engineService";
import { nextOpId } from "../utils/ids";

export const TodoService = {
  editTitle(nextTitle) {
    const todo = TodoDomain.selectors.getTodo(TodoDomain.getState());
    TodoDomain.commands.setTitle(nextTitle);
    EngineService.enqueuePatchTitle({
      opId: nextOpId(),
      title: nextTitle,
      baseVersion: todo.version,
      createdAt: Date.now(),
    });
  },
};
