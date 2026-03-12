/**
 * dashboard.js
 * Renderiza resumen de vacunacion: estadisticas, alertas y proximas dosis.
 */
const session = DB.Session.require();

function renderDashboard() {
  const registros = DB.RegistroVacunacion.getByUsuario(session.id_usuario);
  const alertas = DB.Alertas.getPendientesByUsuario(session.id_usuario);
  const pdfs = DB.HistorialPDF.getByUsuario(session.id_usuario);
  const vacCat = DB.VacunasCatalogo.getAll();

  const pendientes = registros.filter((r) => {
    const v = vacCat.find((vac) => vac.id_vacuna === r.id_vacuna);
    return v && r.numero_dosis < v.dosis_requeridas;
  });

  document.getElementById("stat-total").textContent = registros.length;
  document.getElementById("stat-pendientes").textContent = pendientes.length;
  document.getElementById("stat-alertas").textContent = alertas.length;
  document.getElementById("stat-pdfs").textContent = pdfs.length;

  const aList = document.getElementById("alertas-list");
  if (alertas.length === 0) {
    aList.innerHTML =
      '<div class="empty-state"><div class="empty-icon">🎉</div><div class="empty-title">Sin alertas pendientes</div><div class="empty-desc">Estas al dia con tus vacunas.</div></div>';
  } else {
    aList.innerHTML = alertas
      .slice(0, 4)
      .map((a) => {
        const days = daysFromNow(a.fecha_alerta);
        const type = days < 0 ? "danger" : days <= 7 ? "warning" : "info";
        return `<div class="alert-banner ${type}" style="margin-bottom:8px;">
					<span class="alert-icon">${type === "danger" ? "🔴" : type === "warning" ? "🟡" : "🔵"}</span>
					<div class="alert-body">
						<div class="alert-title">${a.tipo_alerta === "recordatorio" ? "Recordatorio" : "Refuerzo"}</div>
						<div class="alert-msg">${a.mensaje}</div>
					</div>
				</div>`;
      })
      .join("");
  }

  const vList = document.getElementById("vacunas-recientes");
  if (registros.length === 0) {
    vList.innerHTML =
      '<div class="empty-state"><div class="empty-icon">💉</div><div class="empty-title">Sin vacunas registradas</div><a href="vacunas.html" class="btn btn-accent btn-sm mt-2">Registrar primera vacuna</a></div>';
  } else {
    const recientes = [...registros].reverse().slice(0, 5);
    vList.innerHTML = `<table class="data-table"><thead><tr><th>Vacuna</th><th>Fecha</th><th>Dosis</th></tr></thead><tbody>
			${recientes
        .map((r) => {
          const v = vacCat.find((vac) => vac.id_vacuna === r.id_vacuna);
          return `<tr>
						<td>${v ? v.nombre_vacuna : "—"}</td>
						<td>${formatDate(r.fecha_aplicacion)}</td>
						<td>${r.numero_dosis}/${v ? v.dosis_requeridas : "?"}</td>
					</tr>`;
        })
        .join("")}
		</tbody></table>`;
  }

  const proximas = registros
    .filter((r) => r.proxima_dosis_fecha)
    .sort(
      (a, b) =>
        new Date(a.proxima_dosis_fecha) - new Date(b.proxima_dosis_fecha),
    )
    .slice(0, 5);

  const pList = document.getElementById("proximas-dosis");
  if (proximas.length === 0) {
    pList.innerHTML =
      '<p class="text-muted text-sm">No hay dosis proximas programadas.</p>';
  } else {
    pList.innerHTML = `<table class="data-table"><thead><tr><th>Vacuna</th><th>Proxima dosis</th><th>Estado</th></tr></thead><tbody>
			${proximas
        .map((r) => {
          const v = vacCat.find((vac) => vac.id_vacuna === r.id_vacuna);
          const days = daysFromNow(r.proxima_dosis_fecha);
          const badge =
            days < 0
              ? '<span class="badge badge-danger">Vencida</span>'
              : days <= 7
                ? '<span class="badge badge-warning">Esta semana</span>'
                : days <= 30
                  ? '<span class="badge badge-info">Proximo mes</span>'
                  : '<span class="badge badge-success">En plazo</span>';
          return `<tr>
						<td>${v ? v.nombre_vacuna : "—"}</td>
						<td>${formatDate(r.proxima_dosis_fecha)}</td>
						<td>${badge}</td>
					</tr>`;
        })
        .join("")}
		</tbody></table>`;
  }
}

renderDashboard();
