export function computeTextDiff(prevText, nextText) {
  if (prevText === nextText) {
    return { index: 0, deleteCount: 0, insertText: "" };
  }

  const prevLength = prevText.length;
  const nextLength = nextText.length;
  const minLength = Math.min(prevLength, nextLength);

  let prefix = 0;
  while (prefix < minLength && prevText[prefix] === nextText[prefix]) {
    prefix += 1;
  }

  let suffix = 0;
  while (
    suffix < minLength - prefix &&
    prevText[prevLength - 1 - suffix] ===
      nextText[nextLength - 1 - suffix]
  ) {
    suffix += 1;
  }

  return {
    index: prefix,
    deleteCount: prevLength - prefix - suffix,
    insertText: nextText.slice(prefix, nextLength - suffix),
  };
}

export function encodeUpdateBase64(update) {
  let binary = "";
  update.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

export function decodeUpdateBase64(updateB64) {
  const binary = atob(updateB64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
