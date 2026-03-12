/** * VaxMinder - db/core.js * Utilidades base de almacenamiento y llaves de tablas. */ (function (
  global,
) {
  const KEYS = {
    USUARIOS: "vax_usuarios",
    VACUNAS_CATALOGO: "vax_vacunas_catalogo",
    CENTROS_MEDICOS: "vax_centros_medicos",
    REGISTRO_VACUNACION: "vax_registro_vacunacion",
    ALERTAS: "vax_alertas",
    HISTORIAL_PDF: "vax_historial_pdf",
    SESSION: "vax_session",
    COUNTERS: "vax_counters",
  };
  function createStorageEngine(storage) {
    return {
      getArray(key) {
        try {
          return JSON.parse(storage.getItem(key)) || [];
        } catch (_) {
          return [];
        }
      },
      setArray(key, value) {
        storage.setItem(key, JSON.stringify(value));
      },
      getObject(key) {
        try {
          return JSON.parse(storage.getItem(key)) || {};
        } catch (_) {
          return {};
        }
      },
      setObject(key, value) {
        storage.setItem(key, JSON.stringify(value));
      },
      nextId(table) {
        const counters = this.getObject(KEYS.COUNTERS);
        counters[table] = (counters[table] || 0) + 1;
        this.setObject(KEYS.COUNTERS, counters);
        return counters[table];
      },
      remove(key) {
        storage.removeItem(key);
      },
    };
  }
  global.VaxDBCore = { KEYS, createStorageEngine };
})(window);
