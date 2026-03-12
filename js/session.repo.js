/** * VaxMinder - db/session.repo.js */ (function (global) {
  function createSessionRepo(ctx) {
    const { engine, keys } = ctx;
    return {
      set(usuario) {
        const session = {
          id_usuario: usuario.id_usuario,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          tipo_sangre: usuario.tipo_sangre,
          fecha_nacimiento: usuario.fecha_nacimiento,
        };
        engine.setObject(keys.SESSION, session);
      },
      get() {
        try {
          return JSON.parse(localStorage.getItem(keys.SESSION));
        } catch (_) {
          return null;
        }
      },
      clear() {
        engine.remove(keys.SESSION);
      },
      require() {
        const session = this.get();
        if (!session) {
          window.location.href = "/index.html";
          return null;
        }
        return session;
      },
    };
  }
  global.VaxSessionRepo = { createSessionRepo };
})(window);
