export const api = {
  _callCount: 0,
  fetchUser() {
    this._callCount += 1;
    const shouldFail = this._callCount % 2 === 0;

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldFail) {
          reject(new Error("Failed to load user. Please retry."));
          return;
        }

        resolve({
          id: 42,
          name: "Alex Rivera",
          email: "alex.rivera@example.com",
        });
      }, 700);
    });
  },
};
