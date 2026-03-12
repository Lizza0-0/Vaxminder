/** * VaxMinder - db/centros-medicos.repo.js */ (function (global) {
  function createCentrosMedicosRepo(ctx) {
    const { engine, keys } = ctx;
    return {
      getAll() {
        return engine.getArray(keys.CENTROS_MEDICOS);
      },
      getById(id) {
        return this.getAll().find((c) => c.id_centro === id) || null;
      },
      save(centro) {
        const list = this.getAll();
        const nuevo = {
          id_centro: engine.nextId("centros_medicos"),
          nombre_centro: centro.nombre_centro.trim(),
          direccion: centro.direccion.trim(),
          ciudad: centro.ciudad.trim(),
          telefono: centro.telefono || null,
          tipo_centro: centro.tipo_centro || null,
        };
        list.push(nuevo);
        engine.setArray(keys.CENTROS_MEDICOS, list);
        return nuevo;
      },
      update(id, datos) {
        const list = this.getAll();
        const idx = list.findIndex((c) => c.id_centro === id);
        if (idx === -1) {
          throw new Error("Centro no encontrado.");
        }
        list[idx] = { ...list[idx], ...datos };
        engine.setArray(keys.CENTROS_MEDICOS, list);
        return list[idx];
      },
      delete(id) {
        const list = this.getAll().filter((c) => c.id_centro !== id);
        engine.setArray(keys.CENTROS_MEDICOS, list);
      },
    };
  }
  global.VaxCentrosMedicosRepo = { createCentrosMedicosRepo };
})(window);
