import {
  TextPart,
  AttrPart,
  BoolAttrPart,
  PropPart,
  EventPart,
} from "./parts";

const templateCache = new WeakMap();
const instanceCache = new WeakMap();

function markerFor(index) {
  return `{{p${index}}}`;
}

function getTemplate(strings) {
  if (templateCache.has(strings)) {
    return templateCache.get(strings);
  }

  const markers = strings.slice(0, -1).map((_, index) => markerFor(index));
  const htmlString = strings.reduce((acc, part, index) => {
    const marker = index < markers.length ? markers[index] : "";
    return acc + part + marker;
  }, "");

  const template = document.createElement("template");
  template.innerHTML = htmlString;
  const templateInfo = { template, strings, markers };
  templateCache.set(strings, templateInfo);
  return templateInfo;
}

function createParts(fragment, markers, scope) {
  const parts = new Array(markers.length);
  const markerRegex = /{{p(\d+)}}/g;
  const exactMarkerRegex = /^{{p(\d+)}}$/;

  const elements = fragment.querySelectorAll("*");
  elements.forEach((element) => {
    for (const attr of Array.from(element.attributes)) {
      const value = attr.value;
      const exactMatch = value.match(exactMarkerRegex);

      if (!exactMatch) {
        markerRegex.lastIndex = 0;
        if (markerRegex.test(value)) {
          markerRegex.lastIndex = 0;
          throw new Error(
            `Unsupported mixed attribute value for ${attr.name}`
          );
        }
        continue;
      }

      const index = Number(exactMatch[1]);
      const rawName = attr.name;
      element.removeAttribute(rawName);

      if (rawName.startsWith(".")) {
        parts[index] = new PropPart(element, rawName.slice(1));
      } else if (rawName.startsWith("?")) {
        parts[index] = new BoolAttrPart(element, rawName.slice(1));
      } else if (rawName.startsWith("@")) {
        parts[index] = new EventPart(element, rawName.slice(1), scope);
      } else {
        parts[index] = new AttrPart(element, rawName);
      }
    }
  });

  const textNodes = [];
  const walker = document.createTreeWalker(fragment, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    textNodes.push(node);
  }

  textNodes.forEach((textNode) => {
    const text = textNode.nodeValue ?? "";
    markerRegex.lastIndex = 0;
    if (!markerRegex.test(text)) {
      markerRegex.lastIndex = 0;
      return;
    }

    markerRegex.lastIndex = 0;
    const fragmentReplacement = document.createDocumentFragment();
    let lastIndex = 0;
    let match;
    while ((match = markerRegex.exec(text))) {
      const index = Number(match[1]);
      const staticText = text.slice(lastIndex, match.index);
      if (staticText) {
        fragmentReplacement.append(document.createTextNode(staticText));
      }
      const partNode = document.createTextNode("");
      fragmentReplacement.append(partNode);
      parts[index] = new TextPart(partNode);
      lastIndex = match.index + match[0].length;
    }
    const trailing = text.slice(lastIndex);
    if (trailing) {
      fragmentReplacement.append(document.createTextNode(trailing));
    }
    textNode.replaceWith(fragmentReplacement);
  });

  return parts;
}

class TemplateInstance {
  constructor(templateInfo, scope) {
    this.templateInfo = templateInfo;
    this.scope = scope;
    this.fragment = templateInfo.template.content.cloneNode(true);
    this.parts = createParts(this.fragment, templateInfo.markers, scope);
  }

  update(values) {
    this.parts.forEach((part, index) => {
      if (!part) return;
      part.setValue(values[index]);
    });
  }

  dispose() {
    this.parts = [];
  }
}

export function render(result, container, scope) {
  if (!container) {
    throw new Error("render: container is required.");
  }

  if (!result) {
    const prevInstance = instanceCache.get(container);
    if (prevInstance) {
      prevInstance.dispose();
      instanceCache.delete(container);
    }
    container.replaceChildren();
    return;
  }

  const templateInfo = getTemplate(result.strings);
  const prevInstance = instanceCache.get(container);

  if (!prevInstance || prevInstance.templateInfo.strings !== result.strings) {
    if (prevInstance) {
      prevInstance.dispose();
    }
    const nextInstance = new TemplateInstance(templateInfo, scope);
    container.replaceChildren(nextInstance.fragment);
    instanceCache.set(container, nextInstance);
    nextInstance.update(result.values);
    return;
  }

  prevInstance.update(result.values);
}
