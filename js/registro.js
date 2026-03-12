/**
 * registro.js
 * Maneja el formulario de registro de usuarios y apertura de sesion inicial.
 */

document
  .getElementById("register-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const errBox = document.getElementById("reg-error");
    errBox.style.display = "none";

    const ok = validateForm([
      {
        el: document.getElementById("nombre"),
        rule: "required",
        msg: "Campo requerido.",
      },
      {
        el: document.getElementById("apellido"),
        rule: "required",
        msg: "Campo requerido.",
      },
      {
        el: document.getElementById("email"),
        rule: "email",
        msg: "Correo invalido.",
      },
      {
        el: document.getElementById("contrasena"),
        rule: "minlen6",
        msg: "Minimo 6 caracteres.",
      },
      {
        el: document.getElementById("fecha_nacimiento"),
        rule: "required",
        msg: "Campo requerido.",
      },
    ]);

    if (!ok) return;

    try {
      const usuario = DB.Usuarios.save({
        nombre: document.getElementById("nombre").value,
        apellido: document.getElementById("apellido").value,
        email: document.getElementById("email").value,
        contrasena: document.getElementById("contrasena").value,
        fecha_nacimiento: document.getElementById("fecha_nacimiento").value,
        tipo_sangre: document.getElementById("tipo_sangre").value,
        telefono: document.getElementById("telefono").value,
      });

      DB.Session.set(usuario);
      showToast("Cuenta creada exitosamente.", "success");
      setTimeout(() => (window.location.href = "dashboard.html"), 1000);
    } catch (err) {
      document.getElementById("reg-error-msg").textContent = err.message;
      errBox.style.display = "flex";
    }
  });
