/** * VaxMinder - db/historial-pdf.repo.js */ (function (global) {
  function createHistorialPdfRepo(ctx) {
    const { engine, keys } = ctx;
    return {
      getAll() {
        return engine.getArray(keys.HISTORIAL_PDF);
      },
      getByUsuario(idUser) {
        return this.getAll().filter((h) => h.id_usuario === idUser);
      },
      save(idUsuario, nombreArchivo) {
        const list = this.getAll();
        const nuevo = {
          id_historial: engine.nextId("historial_pdf"),
          id_usuario: idUsuario,
          fecha_generacion: new Date().toISOString(),
          nombre_archivo: nombreArchivo,
          ruta_archivo: `/carnets/${nombreArchivo}`,
        };
        list.push(nuevo);
        engine.setArray(keys.HISTORIAL_PDF, list);
        return nuevo;
      },
    };
  }
  global.VaxHistorialPdfRepo = { createHistorialPdfRepo };
})(window);
