let counter = 0;

export function nextOpId() {
  counter += 1;
  return `op_${counter}`;
}
