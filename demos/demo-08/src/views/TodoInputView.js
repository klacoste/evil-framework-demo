import { TodoDomain } from "../domains/todoDomain";
import { ConflictDomain } from "../domains/conflictDomain";
import { SyncDomain } from "../domains/syncDomain";
import { TodoService } from "../services/todoService";

let wrapper;
let input;

export function TodoInputView({ useSelector }) {
  const title = useSelector(TodoDomain.selectors.getTitle);
  const hasConflict = useSelector(ConflictDomain.selectors.hasConflict);
  const isSyncing = useSelector(SyncDomain.selectors.isSyncing);

  if (!wrapper) {
    wrapper = document.createElement("div");
    wrapper.className = "field";

    const label = document.createElement("label");
    label.textContent = "Title";

    input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Type a title...";
    input.addEventListener("input", (event) => {
      TodoService.editTitle(event.target.value);
    });

    wrapper.append(label, input);
  }

  if (input && input.value !== title) {
    input.value = title;
  }

  if (input) {
    input.disabled = hasConflict || isSyncing;
  }

  return wrapper;
}
