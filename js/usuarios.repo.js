/** * VaxMinder - db/usuarios.repo.js */ (function (global) {
  function createUsuariosRepo(ctx) {
    const { engine, keys } = ctx;
    return {
      getAll() {
        return engine.getArray(keys.USUARIOS);
      },
      getById(id) {
        return this.getAll().find((u) => u.id_usuario === id) || null;
      },
      getByEmail(email) {
        return (
          this.getAll().find((u) => u.email === email.toLowerCase()) || null
        );
      },
      save(usuario) {
        const list = this.getAll();
        if (this.getByEmail(usuario.email)) {
          throw new Error("El correo ya esta registrado.");
        }
        const nuevo = {
          id_usuario: engine.nextId("usuarios"),
          nombre: usuario.nombre.trim(),
          apellido: usuario.apellido.trim(),
          email: usuario.email.toLowerCase().trim(),
          contrasena: btoa(usuario.contrasena),
          fecha_nacimiento: usuario.fecha_nacimiento,
          tipo_sangre: usuario.tipo_sangre || null,
          telefono: usuario.telefono || null,
          fecha_registro: new Date().toISOString(),
        };
        list.push(nuevo);
        engine.setArray(keys.USUARIOS, list);
        return nuevo;
      },
      update(id, datos) {
        const list = this.getAll();
        const idx = list.findIndex((u) => u.id_usuario === id);
        if (idx === -1) {
          throw new Error("Usuario no encontrado.");
        }
        list[idx] = { ...list[idx], ...datos };
        engine.setArray(keys.USUARIOS, list);
        return list[idx];
      },
      validateLogin(email, contrasena) {
        const user = this.getByEmail(email);
        if (!user) return null;
        if (atob(user.contrasena) !== contrasena) return null;
        return user;
      },
    };
  }
  global.VaxUsuariosRepo = { createUsuariosRepo };
})(window);
