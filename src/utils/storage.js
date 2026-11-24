// Обёртка над localStorage. В приватном режиме или при переполнении браузер кидает ошибки —
// try/catch не даёт сайту упасть, просто ничего не сохраняется.
export const storage = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* не получилось сохранить — не страшно */
    }
  },
};
