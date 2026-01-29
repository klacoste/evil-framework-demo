export function nextOpId() {
  if (crypto?.randomUUID) {
    return `op_${crypto.randomUUID()}`;
  }
  const random = Math.random().toString(16).slice(2);
  return `op_${Date.now()}_${random}`;
}
