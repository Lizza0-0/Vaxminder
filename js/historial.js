/**
 * historial.js
 * Muestra el historial de vacunacion con filtros, detalle y eliminacion.
 */
const session = DB.Session.require();
let currentId = null;

function getEstadoTexto(r, v) {
  if (!v) return "sin_datos";

  if (r.numero_dosis >= v.dosis_requeridas) {
    if (r.proxima_dosis_fecha && isOverdue(r.proxima_dosis_fecha))
      return "vencida";
    return "completa";
  }

  if (r.proxima_dosis_fecha && isOverdue(r.proxima_dosis_fecha))
    return "vencida";
  return "pendiente";
}

function renderTabla() {
  const buscar = document.getElementById("buscar").value.toLowerCase();
  const filtroEstado = document.getElementById("filtro-estado").value;
  const vacCat = DB.VacunasCatalogo.getAll();
  const centros = DB.CentrosMedicos.getAll();

  let registros = DB.RegistroVacunacion.getByUsuario(session.id_usuario);

  if (buscar) {
    registros = registros.filter((r) => {
      const v = vacCat.find((vac) => vac.id_vacuna === r.id_vacuna);
      return v && v.nombre_vacuna.toLowerCase().includes(buscar);
    });
  }

  if (filtroEstado) {
    registros = registros.filter((r) => {
      const v = vacCat.find((vac) => vac.id_vacuna === r.id_vacuna);
      return getEstadoTexto(r, v) === filtroEstado;
    });
  }

  const container = document.getElementById("tabla-historial");

  if (registros.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">📋</div><div class="empty-title">Sin registros</div><div class="empty-desc">No hay vacunas registradas con ese filtro.</div><a href="vacunas.html" class="btn btn-accent btn-sm mt-2">➕ Registrar primera vacuna</a></div>`;
    return;
  }

  const rows = [...registros]
    .reverse()
    .map((r) => {
      const v = vacCat.find((vac) => vac.id_vacuna === r.id_vacuna);
      const c = centros.find((cen) => cen.id_centro === r.id_centro_medico);
      const estado = getEstadoTexto(r, v);

      const badgeMap = {
        completa: '<span class="badge badge-success">Completa</span>',
        pendiente: '<span class="badge badge-warning">Pendiente</span>',
        vencida: '<span class="badge badge-danger">Vencida</span>',
        sin_datos: '<span class="badge badge-muted">Sin datos</span>',
      };

      return `<tr><td><strong>${v ? v.nombre_vacuna : "—"}</strong></td><td>${formatDate(r.fecha_aplicacion)}</td><td>${r.numero_dosis} / ${v ? v.dosis_requeridas : "?"}</td><td>${r.lote_vacuna || '<span class="text-muted">—</span>'}</td><td>${c ? c.nombre_centro : '<span class="text-muted">—</span>'}</td><td>${r.proxima_dosis_fecha ? formatDate(r.proxima_dosis_fecha) : '<span class="text-muted">—</span>'}</td><td>${badgeMap[estado]}</td><td><button class="btn btn-ghost btn-sm" onclick="verDetalle(${r.id_registro})">Ver</button></td></tr>`;
    })
    .join("");

  container.innerHTML = `<div class="table-wrapper"><table class="data-table"><thead><tr><th>Vacuna</th><th>Fecha Aplicacion</th><th>Dosis</th><th>Lote</th><th>Centro Medico</th><th>Proxima Dosis</th><th>Estado</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

function verDetalle(id) {
  currentId = id;
  const r = DB.RegistroVacunacion.getById(id);
  const v = DB.VacunasCatalogo.getById(r.id_vacuna);
  const c = DB.CentrosMedicos.getById(r.id_centro_medico);

  document.getElementById("modal-detalle-body").innerHTML =
    `<dl style="display:grid; grid-template-columns:1fr 1fr; gap:12px 20px; font-size:14px;"><div><dt class="text-muted text-sm">Vacuna</dt><dd class="font-bold">${v ? v.nombre_vacuna : "—"}</dd></div><div><dt class="text-muted text-sm">Fecha aplicacion</dt><dd>${formatDate(r.fecha_aplicacion)}</dd></div><div><dt class="text-muted text-sm">Dosis</dt><dd>${r.numero_dosis} de ${v ? v.dosis_requeridas : "?"}</dd></div><div><dt class="text-muted text-sm">Lote</dt><dd>${r.lote_vacuna || "—"}</dd></div><div><dt class="text-muted text-sm">Centro medico</dt><dd>${c ? c.nombre_centro : "—"}</dd></div><div><dt class="text-muted text-sm">Proxima dosis</dt><dd>${formatDate(r.proxima_dosis_fecha)}</dd></div><div style="grid-column:span 2;"><dt class="text-muted text-sm">Observaciones</dt><dd>${r.observaciones || "—"}</dd></div></dl>`;

  openModal("modal-detalle");
}

document.getElementById("btn-eliminar").addEventListener("click", () => {
  if (!currentId) return;
  if (!confirm("Eliminar este registro?")) return;

  DB.RegistroVacunacion.delete(currentId);
  closeModal("modal-detalle");
  showToast("Registro eliminado.", "info");
  renderTabla();
});

document.getElementById("buscar").addEventListener("input", renderTabla);
document
  .getElementById("filtro-estado")
  .addEventListener("change", renderTabla);

renderTabla();
