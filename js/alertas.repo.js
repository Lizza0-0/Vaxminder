/** * VaxMinder - db/alertas.repo.js */ (function (global) {
  function createAlertasRepo(ctx) {
    const { engine, keys } = ctx;
    return {
      getAll() {
        return engine.getArray(keys.ALERTAS);
      },
      getByUsuario(idUser) {
        return this.getAll().filter((a) => a.id_usuario === idUser);
      },
      getPendientesByUsuario(idUser) {
        return this.getByUsuario(idUser).filter(
          (a) => a.estado === "pendiente" || a.estado === "enviada",
        );
      },
      save(alerta) {
        const list = this.getAll();
        const nueva = {
          id_alerta: engine.nextId("alertas"),
          id_usuario: alerta.id_usuario,
          id_registro: alerta.id_registro || null,
          tipo_alerta: alerta.tipo_alerta,
          fecha_alerta: alerta.fecha_alerta,
          mensaje: alerta.mensaje,
          estado: alerta.estado || "pendiente",
          fecha_envio: null,
        };
        list.push(nueva);
        engine.setArray(keys.ALERTAS, list);
        return nueva;
      },
      updateEstado(id, estado) {
        const list = this.getAll();
        const idx = list.findIndex((a) => a.id_alerta === id);
        if (idx === -1) {
          return;
        }
        list[idx].estado = estado;
        list[idx].fecha_envio =
          estado === "leída" ? new Date().toISOString() : list[idx].fecha_envio;
        engine.setArray(keys.ALERTAS, list);
      },
      delete(id) {
        const list = this.getAll().filter((a) => a.id_alerta !== id);
        engine.setArray(keys.ALERTAS, list);
      },
    };
  }
  global.VaxAlertasRepo = { createAlertasRepo };
})(window);
