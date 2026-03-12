/**
 * centros.js
 * Administra centros medicos: buscar, crear, editar y eliminar.
 */
const session = DB.Session.require();
const tipoBadge = {
  Hospital: "badge-info",
  Clínica: "badge-success",
  Clinica: "badge-success",
  "Centro de Salud": "badge-warning",
  IPS: "badge-muted",
  EPS: "badge-muted",
};

function renderCentros() {
  const buscar = document.getElementById("buscar").value.toLowerCase();
  let centros = DB.CentrosMedicos.getAll();
  if (buscar) {
    centros = centros.filter(
      (c) =>
        c.nombre_centro.toLowerCase().includes(buscar) ||
        c.ciudad.toLowerCase().includes(buscar),
    );
  }

  const grid = document.getElementById("centros-grid");
  if (centros.length === 0) {
    grid.innerHTML =
      '<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">🏥</div><div class="empty-title">Sin centros registrados</div><div class="empty-desc">Agrega el primero.</div></div>';
    return;
  }

  grid.innerHTML = centros
    .map(
      (c) => `<div class="card" style="padding:18px;">
				<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
					<div class="font-bold" style="font-size:15px;">${c.nombre_centro}</div>
					<span class="badge ${tipoBadge[c.tipo_centro] || "badge-muted"}">${c.tipo_centro || "Otro"}</span>
				</div>
				<div class="text-sm text-muted">📍 ${c.direccion}</div>
				<div class="text-sm text-muted">🏙 ${c.ciudad}</div>
				${c.telefono ? `<div class="text-sm text-muted">📞 ${c.telefono}</div>` : ""}
				<div style="display:flex; gap:8px; margin-top:14px;">
					<button class="btn btn-ghost btn-sm" onclick="editarCentro(${c.id_centro})">✏ Editar</button>
					<button class="btn btn-sm" style="background:#fdecea; color:var(--clr-danger); border:none;" onclick="eliminarCentro(${c.id_centro})">🗑</button>
				</div>
			</div>`,
    )
    .join("");
}

function abrirModal(id = null) {
  document.getElementById("centro-id").value = id || "";
  document.getElementById("modal-titulo").textContent = id
    ? "✏ Editar Centro"
    : "🏥 Nuevo Centro Medico";
  if (!id) {
    [
      "nombre_centro",
      "ciudad",
      "tipo_centro",
      "direccion",
      "telefono_centro",
    ].forEach((f) => {
      document.getElementById(f).value = "";
    });
  }
  openModal("modal-centro");
}

function editarCentro(id) {
  const c = DB.CentrosMedicos.getById(id);
  document.getElementById("centro-id").value = id;
  document.getElementById("nombre_centro").value = c.nombre_centro;
  document.getElementById("ciudad").value = c.ciudad;
  document.getElementById("tipo_centro").value = c.tipo_centro || "";
  document.getElementById("direccion").value = c.direccion;
  document.getElementById("telefono_centro").value = c.telefono || "";
  document.getElementById("modal-titulo").textContent = "✏ Editar Centro";
  openModal("modal-centro");
}

function eliminarCentro(id) {
  if (!confirm("Eliminar este centro medico?")) return;
  DB.CentrosMedicos.delete(id);
  renderCentros();
  showToast("Centro eliminado.", "info");
}

document.getElementById("btn-guardar").addEventListener("click", () => {
  const ok = validateForm([
    {
      el: document.getElementById("nombre_centro"),
      rule: "required",
      msg: "Campo requerido.",
    },
    {
      el: document.getElementById("ciudad"),
      rule: "required",
      msg: "Campo requerido.",
    },
    {
      el: document.getElementById("direccion"),
      rule: "required",
      msg: "Campo requerido.",
    },
  ]);
  if (!ok) return;

  const datos = {
    nombre_centro: document.getElementById("nombre_centro").value,
    ciudad: document.getElementById("ciudad").value,
    tipo_centro: document.getElementById("tipo_centro").value,
    direccion: document.getElementById("direccion").value,
    telefono: document.getElementById("telefono_centro").value,
  };

  const id = document.getElementById("centro-id").value;
  if (id) {
    DB.CentrosMedicos.update(parseInt(id, 10), datos);
    showToast("Centro actualizado.", "success");
  } else {
    DB.CentrosMedicos.save(datos);
    showToast("Centro agregado.", "success");
  }
  closeModal("modal-centro");
  renderCentros();
});

document.getElementById("buscar").addEventListener("input", renderCentros);
renderCentros();
