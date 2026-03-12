/** * VaxMinder - storage.js * Fachada de base de datos para mantener compatibilidad con DB.* * mientras cada tabla vive en su repositorio independiente. */
(function (global) {
  const core = global.VaxDBCore;
  if (!core) {
    throw new Error("VaxDBCore no fue cargado.");
  }
  const KEYS = core.KEYS;
  const engine = core.createStorageEngine(localStorage);
  const Usuarios = global.VaxUsuariosRepo.createUsuariosRepo({
    engine,
    keys: KEYS,
  });
  const Session = global.VaxSessionRepo.createSessionRepo({
    engine,
    keys: KEYS,
  });
  const VacunasCatalogo =
    global.VaxVacunasCatalogoRepo.createVacunasCatalogoRepo({
      engine,
      keys: KEYS,
    });
  const CentrosMedicos = global.VaxCentrosMedicosRepo.createCentrosMedicosRepo({
    engine,
    keys: KEYS,
  });
  const Alertas = global.VaxAlertasRepo.createAlertasRepo({
    engine,
    keys: KEYS,
  });
  const RegistroVacunacion =
    global.VaxRegistroVacunacionRepo.createRegistroVacunacionRepo({
      engine,
      keys: KEYS,
      vacunasCatalogoRepo: VacunasCatalogo,
      alertasRepo: Alertas,
    });
  const HistorialPDF = global.VaxHistorialPdfRepo.createHistorialPdfRepo({
    engine,
    keys: KEYS,
  });
  const DB = {
    KEYS,
    _get(key) {
      return engine.getArray(key);
    },
    _set(key, value) {
      engine.setArray(key, value);
    },
    _getObj(key) {
      return engine.getObject(key);
    },
    nextId(table) {
      return engine.nextId(table);
    },
    Usuarios,
    Session,
    VacunasCatalogo,
    CentrosMedicos,
    RegistroVacunacion,
    Alertas,
    HistorialPDF,
    seed() {
      if (engine.getArray(KEYS.VACUNAS_CATALOGO).length === 0) {
        const vacunas = [
          {
            id_vacuna: 1,
            nombre_vacuna: "BCG",
            descripcion: "Vacuna contra tuberculosis",
            edad_recomendada: "Recien nacido",
            dosis_requeridas: 1,
            intervalo_dosis_dias: null,
            requiere_refuerzo: false,
          },
          {
            id_vacuna: 2,
            nombre_vacuna: "Hepatitis B",
            descripcion: "Prevencion de hepatitis B",
            edad_recomendada: "0-12 anos",
            dosis_requeridas: 3,
            intervalo_dosis_dias: 30,
            requiere_refuerzo: false,
          },
          {
            id_vacuna: 3,
            nombre_vacuna: "DPT (Pentavalente)",
            descripcion: "Difteria, tetanos, tosferina, Hib, hepatitis B",
            edad_recomendada: "2-18 meses",
            dosis_requeridas: 4,
            intervalo_dosis_dias: 60,
            requiere_refuerzo: true,
          },
          {
            id_vacuna: 4,
            nombre_vacuna: "Polio (IPV)",
            descripcion: "Vacuna inactivada contra poliomielitis",
            edad_recomendada: "2-18 meses",
            dosis_requeridas: 4,
            intervalo_dosis_dias: 60,
            requiere_refuerzo: false,
          },
          {
            id_vacuna: 5,
            nombre_vacuna: "Rotavirus",
            descripcion: "Prevencion de gastroenteritis por rotavirus",
            edad_recomendada: "2-6 meses",
            dosis_requeridas: 2,
            intervalo_dosis_dias: 60,
            requiere_refuerzo: false,
          },
          {
            id_vacuna: 6,
            nombre_vacuna: "Neumococo",
            descripcion: "Prevencion de infecciones neumococicas",
            edad_recomendada: "2-24 meses",
            dosis_requeridas: 3,
            intervalo_dosis_dias: 60,
            requiere_refuerzo: true,
          },
          {
            id_vacuna: 7,
            nombre_vacuna: "Influenza",
            descripcion: "Vacuna anual contra gripe estacional",
            edad_recomendada: "6 meses en adelante",
            dosis_requeridas: 1,
            intervalo_dosis_dias: 365,
            requiere_refuerzo: true,
          },
          {
            id_vacuna: 8,
            nombre_vacuna: "Triple Viral (MMR)",
            descripcion: "Sarampion, paperas, rubeola",
            edad_recomendada: "12-15 meses",
            dosis_requeridas: 2,
            intervalo_dosis_dias: 1460,
            requiere_refuerzo: false,
          },
          {
            id_vacuna: 9,
            nombre_vacuna: "Varicela",
            descripcion: "Prevencion de varicela",
            edad_recomendada: "12-18 meses",
            dosis_requeridas: 2,
            intervalo_dosis_dias: 1460,
            requiere_refuerzo: false,
          },
          {
            id_vacuna: 10,
            nombre_vacuna: "VPH",
            descripcion: "Virus del papiloma humano",
            edad_recomendada: "9-14 anos",
            dosis_requeridas: 2,
            intervalo_dosis_dias: 180,
            requiere_refuerzo: false,
          },
          {
            id_vacuna: 11,
            nombre_vacuna: "Fiebre Amarilla",
            descripcion: "Obligatoria para viajes a zonas endemicas",
            edad_recomendada: "1 ano en adelante",
            dosis_requeridas: 1,
            intervalo_dosis_dias: null,
            requiere_refuerzo: false,
          },
          {
            id_vacuna: 12,
            nombre_vacuna: "COVID-19",
            descripcion: "Prevencion de COVID-19",
            edad_recomendada: "5 anos en adelante",
            dosis_requeridas: 2,
            intervalo_dosis_dias: 21,
            requiere_refuerzo: true,
          },
        ];
        engine.setArray(KEYS.VACUNAS_CATALOGO, vacunas);
        engine.setObject(KEYS.COUNTERS, {
          ...engine.getObject(KEYS.COUNTERS),
          vacunas_catalogo: 12,
        });
      }
      if (engine.getArray(KEYS.CENTROS_MEDICOS).length === 0) {
        const centros = [
          {
            id_centro: 1,
            nombre_centro: "Hospital Universitario San Vicente Fundacion",
            direccion: "Calle 64 #51D-154",
            ciudad: "Medellin",
            telefono: "604 444 1333",
            tipo_centro: "Hospital",
          },
          {
            id_centro: 2,
            nombre_centro: "Clinica Las Americas",
            direccion: "Diagonal 75B #2A-80",
            ciudad: "Medellin",
            telefono: "604 342 1010",
            tipo_centro: "Clinica",
          },
          {
            id_centro: 3,
            nombre_centro: "Centro de Salud Belen",
            direccion: "Carrera 80 #30-10",
            ciudad: "Medellin",
            telefono: "604 385 0020",
            tipo_centro: "Centro de Salud",
          },
          {
            id_centro: 4,
            nombre_centro: "IPS Comfama",
            direccion: "Carrera 45 #48-45",
            ciudad: "Medellin",
            telefono: "604 511 4747",
            tipo_centro: "IPS",
          },
        ];
        engine.setArray(KEYS.CENTROS_MEDICOS, centros);
        engine.setObject(KEYS.COUNTERS, {
          ...engine.getObject(KEYS.COUNTERS),
          centros_medicos: 4,
        });
      }
    },
  };
  DB.seed();
  global.DB = DB;
})(window);
