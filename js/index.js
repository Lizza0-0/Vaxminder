/**
 * index.js
 * Controla el login de la pagina principal y crea la sesion del usuario.
 */

if (DB.Session.get()) {
  window.location.href = "pages/dashboard.html";
}

document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const errBox = document.getElementById("login-error");

  if (!email || !password) {
    errBox.style.display = "flex";
    return;
  }

  const usuario = DB.Usuarios.validateLogin(email, password);

  if (usuario) {
    DB.Session.set(usuario);
    window.location.href = "pages/dashboard.html";
  } else {
    errBox.style.display = "flex";
  }
});
