export const api = {
  fetchUser() {
    const shouldFail = Math.random() < 1 / 3;

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
