/**
 * vacunas.js
 * Maneja el formulario de registro de dosis y sugerencia de proxima fecha.
 */
const session = DB.Session.require();

const selVacuna = document.getElementById("id_vacuna");
DB.VacunasCatalogo.getAll().forEach((v) => {
  selVacuna.innerHTML += `<option value="${v.id_vacuna}">${v.nombre_vacuna} (${v.dosis_requeridas} dosis)</option>`;
});

const selCentro = document.getElementById("id_centro_medico");
DB.CentrosMedicos.getAll().forEach((c) => {
  selCentro.innerHTML += `<option value="${c.id_centro}">${c.nombre_centro}</option>`;
});

selVacuna.addEventListener("change", function () {
  const v = DB.VacunasCatalogo.getById(parseInt(this.value, 10));
  const infoBox = document.getElementById("vacuna-info");

  if (v) {
    document.getElementById("vac-nombre").textContent = v.nombre_vacuna;
    document.getElementById("vac-desc").textContent =
      `${v.descripcion || ""} · ${v.dosis_requeridas} dosis · ${v.edad_recomendada || ""}`;
    infoBox.style.display = "flex";

    if (v.intervalo_dosis_dias) {
      const fech = document.getElementById("fecha_aplicacion").value;
      if (fech) sugerirProxima(fech, v.intervalo_dosis_dias);
    }
  } else {
    infoBox.style.display = "none";
  }
});

function sugerirProxima(fechaBase, dias) {
  const d = new Date(`${fechaBase}T12:00:00`);
  d.setDate(d.getDate() + dias);

  document.getElementById("proxima_dosis_fecha").value = d
    .toISOString()
    .split("T")[0];

  const hint = document.getElementById("proxima-hint");
  hint.style.display = "block";
  hint.style.color = "var(--clr-accent)";
  hint.textContent = `Sugerida automaticamente (+${dias} dias). Se creara una alerta.`;
}

document
  .getElementById("fecha_aplicacion")
  .addEventListener("change", function () {
    const v = DB.VacunasCatalogo.getById(parseInt(selVacuna.value, 10));
    if (v && v.intervalo_dosis_dias)
      sugerirProxima(this.value, v.intervalo_dosis_dias);
  });

document.getElementById("form-vacuna").addEventListener("submit", function (e) {
  e.preventDefault();

  const ok = validateForm([
    {
      el: document.getElementById("id_vacuna"),
      rule: "required",
      msg: "Selecciona una vacuna.",
    },
    {
      el: document.getElementById("fecha_aplicacion"),
      rule: "required",
      msg: "Fecha requerida.",
    },
    {
      el: document.getElementById("numero_dosis"),
      rule: "required",
      msg: "Indica el numero de dosis.",
    },
  ]);

  if (!ok) return;

  try {
    DB.RegistroVacunacion.save({
      id_usuario: session.id_usuario,
      id_vacuna: document.getElementById("id_vacuna").value,
      fecha_aplicacion: document.getElementById("fecha_aplicacion").value,
      numero_dosis: document.getElementById("numero_dosis").value,
      lote_vacuna: document.getElementById("lote_vacuna").value,
      id_centro_medico: document.getElementById("id_centro_medico").value,
      proxima_dosis_fecha: document.getElementById("proxima_dosis_fecha").value,
      observaciones: document.getElementById("observaciones").value,
    });

    showToast("Vacuna registrada exitosamente.", "success");
    setTimeout(() => (window.location.href = "historial.html"), 1200);
  } catch (err) {
    showToast(err.message, "error");
  }
});
