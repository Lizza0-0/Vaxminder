/** * VaxMinder – utils.js * Funciones utilitarias compartidas por todas las páginas. */ // ── Toast notifications ───────────────────────────────────
function showToast(msg, type = "info", duration = 3500) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  const icons = { success: "", error: "X ", info: "", warning: "" };
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || ""}</span><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
} // ── Modal helpers ─────────────────────────────────────────
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add("open");
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove("open");
}
// Cerrar modal al hacer click en overlay
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-overlay")) {
    e.target.classList.remove("open");
  }
}); // ── Date helpers ──────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("T")[0].split("-");
  return `${d}/${m}/${y}`;
}
function daysFromNow(dateStr) {
  if (!dateStr) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + "T00:00:00");
  return Math.round((target - now) / 86400000);
}
function isOverdue(dateStr) {
  return daysFromNow(dateStr) < 0;
}
function isSoon(dateStr, days = 15) {
  const d = daysFromNow(dateStr);
  return d !== null && d >= 0 && d <= days;
} // ── Badge helpers ─────────────────────────────────────────
function estadoBadge(registro, vacuna) {
  if (!vacuna) return '<span class="badge badge-muted">Sin datos</span>';
  const dosisAplicadas = registro.numero_dosis;
  const dosisRequeridas = vacuna.dosis_requeridas;
  if (dosisAplicadas >= dosisRequeridas) {
    if (
      registro.proxima_dosis_fecha &&
      isOverdue(registro.proxima_dosis_fecha)
    ) {
      return '<span class="badge badge-danger">Refuerzo vencido</span>';
    }
    return '<span class="badge badge-success">Completa</span>';
  }
  if (registro.proxima_dosis_fecha && isOverdue(registro.proxima_dosis_fecha)) {
    return '<span class="badge badge-danger">Dosis vencida</span>';
  }
  return '<span class="badge badge-warning">Pendiente</span>';
}
function alertaBadge(estado) {
  const map = {
    pendiente: '<span class="badge badge-danger">Pendiente</span>',
    enviada: '<span class="badge badge-warning">Enviada</span>',
    leída: '<span class="badge badge-success">Leída</span>',
    descartada: '<span class="badge badge-muted">Descartada</span>',
  };
  return map[estado] || '<span class="badge badge-muted">—</span>';
} // ── Sidebar activo ────────────────────────────────────────
function setActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll(".nav-item").forEach((a) => {
    const href = a.getAttribute("href") || "";
    if (path.includes(href) && href !== "#") {
      a.classList.add("active");
    }
  });
} // ── Inicializar usuario en sidebar ────────────────────────
function initUserSidebar() {
  const session = DB.Session.get();
  if (!session) return;
  const nameEl = document.getElementById("sidebar-user-name");
  const avatarEl = document.getElementById("sidebar-avatar");
  if (nameEl) nameEl.textContent = `${session.nombre} ${session.apellido}`;
  if (avatarEl) avatarEl.textContent = session.nombre.charAt(0).toUpperCase();
} // ── Logout ────────────────────────────────────────────────
function logout() {
  DB.Session.clear();
  window.location.href = "../index.html";
} // ── Validación de formularios ─────────────────────────────
function validateForm(fields) {
  let valid = true;
  fields.forEach(({ el, msg, rule }) => {
    const errEl = el.parentElement.querySelector(".form-error");
    const value = el.value.trim();
    let ok = true;
    if (rule === "required" && !value) ok = false;
    if (rule === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      ok = false;
    if (rule === "minlen6" && value.length < 6) ok = false;
    if (!ok) {
      el.classList.add("error");
      if (errEl) {
        errEl.textContent = msg;
        errEl.style.display = "block";
      }
      valid = false;
    } else {
      el.classList.remove("error");
      if (errEl) errEl.style.display = "none";
    }
  });
  return valid;
} // ── Contador de alertas pendientes ────────────────────────
function updateAlertBadge() {
  const session = DB.Session.get();
  if (!session) return;
  const badge = document.getElementById("alert-badge");
  if (!badge) return;
  const count = DB.Alertas.getPendientesByUsuario(session.id_usuario).length;
  badge.textContent = count;
  badge.style.display = count > 0 ? "inline-flex" : "none";
} // Ejecutar al cargar
document.addEventListener("DOMContentLoaded", () => {
  setActiveNav();
  initUserSidebar();
  updateAlertBadge();
});
