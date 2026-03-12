/** * VaxMinder - db/vacunas-catalogo.repo.js */ (function (global) {
  function createVacunasCatalogoRepo(ctx) {
    const { engine, keys } = ctx;
    return {
      getAll() {
        return engine.getArray(keys.VACUNAS_CATALOGO);
      },
      getById(id) {
        return this.getAll().find((v) => v.id_vacuna === id) || null;
      },
      save(vacuna) {
        const list = this.getAll();
        const nuevo = {
          id_vacuna: engine.nextId("vacunas_catalogo"),
          nombre_vacuna: vacuna.nombre_vacuna.trim(),
          descripcion: vacuna.descripcion || null,
          edad_recomendada: vacuna.edad_recomendada || null,
          dosis_requeridas: parseInt(vacuna.dosis_requeridas, 10),
          intervalo_dosis_dias: vacuna.intervalo_dosis_dias
            ? parseInt(vacuna.intervalo_dosis_dias, 10)
            : null,
          requiere_refuerzo: !!vacuna.requiere_refuerzo,
        };
        list.push(nuevo);
        engine.setArray(keys.VACUNAS_CATALOGO, list);
        return nuevo;
      },
      delete(id) {
        const list = this.getAll().filter((v) => v.id_vacuna !== id);
        engine.setArray(keys.VACUNAS_CATALOGO, list);
      },
    };
  }
  global.VaxVacunasCatalogoRepo = { createVacunasCatalogoRepo };
})(window);
