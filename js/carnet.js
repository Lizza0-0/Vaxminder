/**
 * carnet.js
 * Genera la vista del carnet digital y la exportacion del PDF.
 */
const session = DB.Session.require();

function renderCarnet() {
  DB.Usuarios.getById(session.id_usuario);

  const registros = DB.RegistroVacunacion.getByUsuario(session.id_usuario);
  const vacCat = DB.VacunasCatalogo.getAll();
  const centros = DB.CentrosMedicos.getAll();
  const now = new Date();
  const idCarnet = `VMR-${String(session.id_usuario).padStart(4, "0")}-${now.getFullYear()}`;

  document.getElementById("carnet-fecha").textContent =
    `Generado: ${now.toLocaleDateString("es-CO")}`;
  document.getElementById("carnet-id").textContent = idCarnet;
  document.getElementById("carnet-nombre").textContent =
    `${session.nombre} ${session.apellido}`;
  document.getElementById("carnet-sangre").textContent =
    session.tipo_sangre || "—";
  document.getElementById("carnet-fnac").textContent = formatDate(
    session.fecha_nacimiento,
  );

  const tbody = document.getElementById("carnet-tbody");

  if (registros.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="5" style="text-align:center; color:var(--clr-muted); padding:20px;">Sin vacunas registradas</td></tr>';
  } else {
    tbody.innerHTML = registros
      .map((r) => {
        const v = vacCat.find((vac) => vac.id_vacuna === r.id_vacuna);
        const c = centros.find((cen) => cen.id_centro === r.id_centro_medico);
        return `<tr><td><strong>${v ? v.nombre_vacuna : "—"}</strong></td><td>${formatDate(r.fecha_aplicacion)}</td><td>${r.numero_dosis} / ${v ? v.dosis_requeridas : "?"}</td><td>${r.lote_vacuna || "—"}</td><td>${c ? c.nombre_centro : "—"}</td></tr>`;
      })
      .join("");
  }

  renderHistorialPDFs();
}

function renderHistorialPDFs() {
  const historial = DB.HistorialPDF.getByUsuario(session.id_usuario);
  const container = document.getElementById("historial-pdfs");

  if (historial.length === 0) {
    container.innerHTML =
      '<p class="text-muted text-sm">Aun no has generado ningun carnet.</p>';
    return;
  }

  container.innerHTML = [...historial]
    .reverse()
    .slice(0, 5)
    .map(
      (h) =>
        `<div style="padding:10px 0; border-bottom:1px solid var(--clr-border); display:flex; justify-content:space-between; align-items:center;"><div><div class="text-sm font-bold">${h.nombre_archivo}</div><div class="text-muted" style="font-size:11px;">${new Date(h.fecha_generacion).toLocaleString("es-CO")}</div></div></div>`,
    )
    .join("");
}

document.getElementById("btn-descargar").addEventListener("click", () => {
  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const registros = DB.RegistroVacunacion.getByUsuario(session.id_usuario);
    const vacCat = DB.VacunasCatalogo.getAll();
    const centros = DB.CentrosMedicos.getAll();
    const now = new Date();

    doc.setFillColor(26, 107, 74);
    doc.rect(0, 0, 210, 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("VaxMinder", 14, 13);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Carnet Digital de Vacunacion", 14, 22);
    doc.text(`Generado: ${now.toLocaleDateString("es-CO")}`, 150, 22);

    doc.setTextColor(0, 0, 0);
    doc.setFillColor(230, 242, 237);
    doc.rect(14, 38, 182, 22, "F");
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("DATOS DEL PACIENTE", 16, 46);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Nombre: ${session.nombre} ${session.apellido}`, 16, 54);
    doc.text(
      `Tipo Sangre: ${session.tipo_sangre || "—"} Fecha Nac.: ${formatDate(session.fecha_nacimiento)}`,
      100,
      54,
    );

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("REGISTRO DE VACUNACION", 14, 72);

    const headers = ["Vacuna", "Fecha", "Dosis", "Lote", "Centro Medico"];
    const cols = [14, 70, 100, 120, 150];
    let y = 80;

    doc.setFillColor(26, 107, 74);
    doc.rect(14, y - 6, 182, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    headers.forEach((h, i) => doc.text(h, cols[i], y));

    y += 6;
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");

    registros.forEach((r, idx) => {
      const v = vacCat.find((vac) => vac.id_vacuna === r.id_vacuna);
      const c = centros.find((cen) => cen.id_centro === r.id_centro_medico);

      if (idx % 2 === 0) {
        doc.setFillColor(245, 249, 247);
        doc.rect(14, y - 4, 182, 8, "F");
      }

      doc.text(v ? v.nombre_vacuna.substring(0, 20) : "—", cols[0], y);
      doc.text(formatDate(r.fecha_aplicacion), cols[1], y);
      doc.text(`${r.numero_dosis}/${v ? v.dosis_requeridas : "?"}`, cols[2], y);
      doc.text(
        r.lote_vacuna ? r.lote_vacuna.substring(0, 12) : "—",
        cols[3],
        y,
      );
      doc.text(c ? c.nombre_centro.substring(0, 22) : "—", cols[4], y);

      y += 8;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.text(
      "Este carnet fue generado digitalmente por VaxMinder. CESDE 2026.",
      14,
      285,
    );

    const filename = `VaxMinder_Carnet_${session.nombre}_${now.getFullYear()}.pdf`;
    doc.save(filename);
    DB.HistorialPDF.save(session.id_usuario, filename);
    renderHistorialPDFs();
    showToast("Carnet descargado exitosamente.", "success");
  } catch (err) {
    showToast(`Error al generar el PDF: ${err.message}`, "error");
  }
});

renderCarnet();
