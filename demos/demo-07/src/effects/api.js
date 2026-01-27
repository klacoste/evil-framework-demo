const DELAY_MS = 300;

let serverTodo = { id: "t1", title: "Buy milk", version: 1 };

function delay() {
  return new Promise((resolve) => setTimeout(resolve, DELAY_MS));
}

function nextServerTitle() {
  return `${serverTodo.title} (server edit)`;
}

export const api = {
  async getTodo() {
    await delay();
    return { ...serverTodo };
  },
  async simulateServerEdit() {
    await delay();
    serverTodo = {
      ...serverTodo,
      title: nextServerTitle(),
      version: serverTodo.version + 1,
    };
    return { ...serverTodo };
  },
  async pushOps(ops) {
    await delay();
    if (!ops.length) {
      return { ok: true, todo: { ...serverTodo } };
    }

    const [op] = ops;
    if (op.baseVersion !== serverTodo.version) {
      return { ok: false, conflict: { opId: op.opId, serverTodo: { ...serverTodo } } };
    }

    if (op.type === "patchTitle" && op.todoId === "t1") {
      serverTodo = {
        ...serverTodo,
        title: op.patch.title,
        version: serverTodo.version + 1,
      };
    }

    return { ok: true, todo: { ...serverTodo } };
  },
};
