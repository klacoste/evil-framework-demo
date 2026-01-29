import { DocDomain } from "../domains/docDomain";
import { DocService } from "../services/docService";

let wrapper;
let textarea;

export function DocEditorView({ useSelector }) {
  const text = useSelector(DocDomain.selectors.getText);

  if (!wrapper) {
    wrapper = document.createElement("div");
    wrapper.className = "editor";

    const label = document.createElement("label");
    label.textContent = "Shared document";

    textarea = document.createElement("textarea");
    textarea.placeholder = "Type something together...";
    textarea.addEventListener("input", (event) => {
      DocService.setText(event.target.value);
    });

    wrapper.append(label, textarea);
  }

  if (textarea && textarea.value !== text) {
    const isFocused = document.activeElement === textarea;
    const selectionStart = isFocused ? textarea.selectionStart : null;
    const selectionEnd = isFocused ? textarea.selectionEnd : null;
    const selectionDirection = isFocused ? textarea.selectionDirection : "none";
    textarea.value = text;
    if (isFocused && selectionStart !== null && selectionEnd !== null) {
      const max = text.length;
      const nextStart = Math.min(selectionStart, max);
      const nextEnd = Math.min(selectionEnd, max);
      textarea.setSelectionRange(nextStart, nextEnd, selectionDirection);
    }
  }

  return wrapper;
}
