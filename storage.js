(function () {
  const KEY = 'cleannl-miniapp-data-v1';

  window.CleanStore = {
    load() {
      try {
        const raw = localStorage.getItem(KEY);
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      return JSON.parse(JSON.stringify(window.CLEAN_DEFAULT_DATA || {}));
    },

    save(data) {
      localStorage.setItem(KEY, JSON.stringify(data));
    },

    reset() {
      localStorage.removeItem(KEY);
      return JSON.parse(JSON.stringify(window.CLEAN_DEFAULT_DATA || {}));
    }
  };
})();
