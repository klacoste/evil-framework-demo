export function openClientDb(clientId) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(`demo-09-${clientId}`, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("kv")) {
        db.createObjectStore("kv");
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export function readKey(db, key) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction("kv", "readonly");
    const store = tx.objectStore("kv");
    const request = store.get(key);

    request.onsuccess = () => {
      resolve(request.result ?? null);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export function writeKey(db, key, value) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction("kv", "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.objectStore("kv").put(value, key);
  });
}
