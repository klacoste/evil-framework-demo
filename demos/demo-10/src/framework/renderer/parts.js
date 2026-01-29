function coerceText(value) {
  return value == null ? "" : String(value);
}

function preserveSelection(element, nextValue) {
  const isFocused = document.activeElement === element;
  const selectionStart = isFocused ? element.selectionStart : null;
  const selectionEnd = isFocused ? element.selectionEnd : null;
  const selectionDirection = isFocused ? element.selectionDirection : "none";
  element.value = nextValue;
  if (
    isFocused &&
    typeof selectionStart === "number" &&
    typeof selectionEnd === "number"
  ) {
    const max = nextValue.length;
    const nextStart = Math.min(selectionStart, max);
    const nextEnd = Math.min(selectionEnd, max);
    try {
      element.setSelectionRange(nextStart, nextEnd, selectionDirection);
    } catch (error) {
    }
  }
}

export class TextPart {
  constructor(node) {
    this.node = node;
    this.value = undefined;
  }

  setValue(value) {
    const next = coerceText(value);
    if (Object.is(this.value, next)) return;
    this.value = next;
    this.node.textContent = next;
  }
}

export class AttrPart {
  constructor(element, name) {
    this.element = element;
    this.name = name;
    this.value = undefined;
  }

  setValue(value) {
    if (Object.is(this.value, value)) return;
    this.value = value;
    if (value == null) {
      this.element.removeAttribute(this.name);
      return;
    }
    this.element.setAttribute(this.name, String(value));
  }
}

export class BoolAttrPart {
  constructor(element, name) {
    this.element = element;
    this.name = name;
    this.value = undefined;
  }

  setValue(value) {
    const next = Boolean(value);
    if (Object.is(this.value, next)) return;
    this.value = next;
    if (next) {
      this.element.setAttribute(this.name, "");
    } else {
      this.element.removeAttribute(this.name);
    }
  }
}

export class PropPart {
  constructor(element, name) {
    this.element = element;
    this.name = name;
    this.value = undefined;
  }

  setValue(value) {
    if (this.name === "value") {
      const next = coerceText(value);
      if (this.element.value === next) {
        this.value = next;
        return;
      }
      this.value = next;
      preserveSelection(this.element, next);
      return;
    }

    if (Object.is(this.value, value)) return;
    this.value = value;
    this.element[this.name] = value;
  }
}

export class EventPart {
  constructor(element, name, scope) {
    this.element = element;
    this.name = name;
    this.handler = null;
    this.listener = (event) => {
      if (this.handler) {
        this.handler(event);
      }
    };
    this.element.addEventListener(this.name, this.listener, {
      signal: scope.abortController.signal,
    });
  }

  setValue(value) {
    this.handler = typeof value === "function" ? value : null;
  }
}
