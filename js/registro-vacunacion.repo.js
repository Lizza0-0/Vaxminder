/** * VaxMinder - db/registro-vacunacion.repo.js */ (function (global) {
  function createRegistroVacunacionRepo(ctx) {
    const { engine, keys, vacunasCatalogoRepo, alertasRepo } = ctx;
    return {
      getAll() {
        return engine.getArray(keys.REGISTRO_VACUNACION);
      },
      getByUsuario(idUser) {
        return this.getAll().filter((r) => r.id_usuario === idUser);
      },
      getById(id) {
        return this.getAll().find((r) => r.id_registro === id) || null;
      },
      save(registro) {
        const list = this.getAll();
        const nuevo = {
          id_registro: engine.nextId("registro_vacunacion"),
          id_usuario: registro.id_usuario,
          id_vacuna: parseInt(registro.id_vacuna, 10),
          fecha_aplicacion: registro.fecha_aplicacion,
          numero_dosis: parseInt(registro.numero_dosis, 10),
          lote_vacuna: registro.lote_vacuna || null,
          id_centro_medico: registro.id_centro_medico
            ? parseInt(registro.id_centro_medico, 10)
            : null,
          observaciones: registro.observaciones || null,
          proxima_dosis_fecha: registro.proxima_dosis_fecha || null,
        };
        list.push(nuevo);
        engine.setArray(keys.REGISTRO_VACUNACION, list);
        if (nuevo.proxima_dosis_fecha) {
          const vacuna = vacunasCatalogoRepo.getById(nuevo.id_vacuna);
          alertasRepo.save({
            id_usuario: nuevo.id_usuario,
            id_registro: nuevo.id_registro,
            tipo_alerta: "recordatorio",
            fecha_alerta: nuevo.proxima_dosis_fecha,
            mensaje: `Recuerda aplicarte la proxima dosis de ${vacuna ? vacuna.nombre_vacuna : "vacuna"} el ${nuevo.proxima_dosis_fecha}.`,
            estado: "pendiente",
          });
        }
        return nuevo;
      },
      delete(id) {
        const list = this.getAll().filter((r) => r.id_registro !== id);
        engine.setArray(keys.REGISTRO_VACUNACION, list);
      },
    };
  }
  global.VaxRegistroVacunacionRepo = { createRegistroVacunacionRepo };
})(window);
