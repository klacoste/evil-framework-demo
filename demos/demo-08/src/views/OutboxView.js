import { OutboxDomain } from "../domains/outboxDomain";

export function OutboxView({ useSelector }) {
  const ops = useSelector(OutboxDomain.selectors.getOps);

  const wrapper = document.createElement("div");
  wrapper.className = "outbox";

  const countRow = document.createElement("div");
  countRow.className = "meta-row";
  const countLabel = document.createElement("span");
  countLabel.className = "meta-label";
  countLabel.textContent = "Pending ops";
  const countValue = document.createElement("span");
  countValue.className = "meta-value";
  countValue.textContent = String(ops.length);
  countRow.append(countLabel, countValue);
  wrapper.append(countRow);

  if (!ops.length) {
    const empty = document.createElement("p");
    empty.className = "muted-text";
    empty.textContent = "Outbox is empty.";
    wrapper.append(empty);
    return wrapper;
  }

  const list = document.createElement("ul");
  list.className = "outbox-list";

  ops.forEach((op) => {
    const item = document.createElement("li");
    item.className = "outbox-item";

    const idRow = document.createElement("div");
    idRow.className = "meta-row";
    const idLabel = document.createElement("span");
    idLabel.className = "meta-label";
    idLabel.textContent = "Op";
    const idValue = document.createElement("span");
    idValue.className = "meta-value";
    idValue.textContent = op.opId;
    idRow.append(idLabel, idValue);

    const baseRow = document.createElement("div");
    baseRow.className = "meta-row";
    const baseLabel = document.createElement("span");
    baseLabel.className = "meta-label";
    baseLabel.textContent = "Base version";
    const baseValue = document.createElement("span");
    baseValue.className = "meta-value";
    baseValue.textContent = String(op.baseVersion);
    baseRow.append(baseLabel, baseValue);

    const patchRow = document.createElement("div");
    patchRow.className = "meta-row";
    const patchLabel = document.createElement("span");
    patchLabel.className = "meta-label";
    patchLabel.textContent = "Patch title";
    const patchValue = document.createElement("span");
    patchValue.className = "meta-value";
    patchValue.textContent = op.patch.title;
    patchRow.append(patchLabel, patchValue);

    item.append(idRow, baseRow, patchRow);
    list.append(item);
  });

  wrapper.append(list);
  return wrapper;
}
