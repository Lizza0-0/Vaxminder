/**
 * alertas.js
 * Gestiona listado, filtros y cambios de estado de las alertas del usuario.
 */
const session = DB.Session.require();
let filtroActual = "";

function renderAlertas() {
  let alertas = DB.Alertas.getByUsuario(session.id_usuario);

  if (filtroActual) {
    alertas = alertas.filter((a) => a.estado === filtroActual);
  }

  alertas = [...alertas].sort(
    (a, b) => new Date(a.fecha_alerta) - new Date(b.fecha_alerta),
  );

  const container = document.getElementById("alertas-container");

  if (alertas.length === 0) {
    container.innerHTML =
      '<div class="empty-state"><div class="empty-icon">🔔</div><div class="empty-title">Sin alertas</div><div class="empty-desc">No hay alertas con este filtro.</div></div>';
    return;
  }

  container.innerHTML = alertas
    .map((a) => {
      const days = daysFromNow(a.fecha_alerta);
      const tipoIcon =
        {
          recordatorio: "⏰",
          refuerzo: "💉",
          vencimiento: "⚠️",
        }[a.tipo_alerta] || "🔔";

      const bannerType =
        a.estado === "descartada" || a.estado === "leída"
          ? "info"
          : days < 0
            ? "danger"
            : days <= 7
              ? "warning"
              : "info";

      const acciones =
        a.estado === "pendiente" || a.estado === "enviada"
          ? `<div style="display:flex; gap:8px; margin-top:10px;"><button class="btn btn-sm btn-ghost" onclick="cambiarEstado(${a.id_alerta}, 'leída')">✅ Marcar leída</button><button class="btn btn-sm btn-ghost" onclick="cambiarEstado(${a.id_alerta}, 'descartada')" style="color:var(--clr-danger);">✖ Descartar</button></div>`
          : "";

      return `<div class="alert-banner ${bannerType}" style="margin-bottom:10px; align-items:flex-start;"><span class="alert-icon">${tipoIcon}</span><div class="alert-body" style="flex:1;"><div class="alert-title" style="display:flex; align-items:center; gap:8px;">${a.tipo_alerta.charAt(0).toUpperCase() + a.tipo_alerta.slice(1)} ${alertaBadge(a.estado)} <span style="margin-left:auto; font-size:12px; opacity:.7;">${formatDate(a.fecha_alerta)}</span></div><div class="alert-msg mt-1">${a.mensaje}</div>${acciones}</div></div>`;
    })
    .join("");
}

function cambiarEstado(id, estado) {
  DB.Alertas.updateEstado(id, estado);
  updateAlertBadge();
  renderAlertas();
  showToast(`Alerta marcada como ${estado}.`, "success");
}

document.querySelectorAll("[data-filtro]").forEach((btn) => {
  btn.addEventListener("click", function () {
    filtroActual = this.dataset.filtro;

    document.querySelectorAll("[data-filtro]").forEach((b) => {
      b.className = "btn btn-sm btn-ghost";
    });

    this.className = "btn btn-sm btn-accent";
    renderAlertas();
  });
});

document.getElementById("btn-marcar-todas").addEventListener("click", () => {
  DB.Alertas.getPendientesByUsuario(session.id_usuario).forEach((a) => {
    DB.Alertas.updateEstado(a.id_alerta, "leída");
  });

  updateAlertBadge();
  renderAlertas();
  showToast("Todas las alertas marcadas como leídas.", "success");
});

document
  .getElementById("btn-nueva")
  .addEventListener("click", () => openModal("modal-alerta"));

document.getElementById("btn-guardar-alerta").addEventListener("click", () => {
  const ok = validateForm([
    {
      el: document.getElementById("tipo_alerta"),
      rule: "required",
      msg: "Selecciona tipo.",
    },
    {
      el: document.getElementById("fecha_alerta"),
      rule: "required",
      msg: "Fecha requerida.",
    },
    {
      el: document.getElementById("mensaje_alerta"),
      rule: "required",
      msg: "Escribe un mensaje.",
    },
  ]);

  if (!ok) return;

  DB.Alertas.save({
    id_usuario: session.id_usuario,
    tipo_alerta: document.getElementById("tipo_alerta").value,
    fecha_alerta: document.getElementById("fecha_alerta").value,
    mensaje: document.getElementById("mensaje_alerta").value,
    estado: "pendiente",
  });

  closeModal("modal-alerta");
  document.getElementById("form-alerta").reset();

  updateAlertBadge();
  renderAlertas();
  showToast("Alerta creada exitosamente.", "success");
});

renderAlertas();
