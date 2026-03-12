CREATE DATABASE IF NOT EXISTS vaxminder_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE vaxminder_db;


CREATE TABLE USUARIOS (
    id_usuario       INT          NOT NULL AUTO_INCREMENT,
    nombre           VARCHAR(100) NOT NULL,
    apellido         VARCHAR(100) NOT NULL,
    email            VARCHAR(150) NOT NULL UNIQUE,
    contrasena       VARCHAR(255) NOT NULL,
    fecha_nacimiento DATE         NOT NULL,
    tipo_sangre      VARCHAR(5)   NULL,
    telefono         VARCHAR(20)  NULL,
    fecha_registro   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_usuario)
);


CREATE TABLE VACUNAS_CATALOGO (
    id_vacuna            INT          NOT NULL AUTO_INCREMENT,
    nombre_vacuna        VARCHAR(150) NOT NULL,
    descripcion          TEXT         NULL,
    edad_recomendada     VARCHAR(50)  NULL,
    dosis_requeridas     INT          NOT NULL,
    intervalo_dosis_dias INT          NULL,
    requiere_refuerzo    BOOLEAN      NOT NULL DEFAULT FALSE,
    PRIMARY KEY (id_vacuna)
);


CREATE TABLE CENTROS_MEDICOS (
    id_centro     INT          NOT NULL AUTO_INCREMENT,
    nombre_centro VARCHAR(200) NOT NULL,
    direccion     VARCHAR(255) NOT NULL,
    ciudad        VARCHAR(100) NOT NULL,
    telefono      VARCHAR(20)  NULL,
    tipo_centro   VARCHAR(50)  NULL,
    PRIMARY KEY (id_centro)
);


CREATE TABLE REGISTRO_VACUNACION (
    id_registro         INT         NOT NULL AUTO_INCREMENT,
    id_usuario          INT         NOT NULL,
    id_vacuna           INT         NOT NULL,
    fecha_aplicacion    DATE        NOT NULL,
    numero_dosis        INT         NOT NULL,
    lote_vacuna         VARCHAR(50) NULL,
    id_centro_medico    INT         NULL,
    observaciones       TEXT        NULL,
    proxima_dosis_fecha DATE        NULL,
    PRIMARY KEY (id_registro)
);


CREATE TABLE ALERTAS (
    id_alerta    INT         NOT NULL AUTO_INCREMENT,
    id_usuario   INT         NOT NULL,
    id_registro  INT         NULL,
    tipo_alerta  VARCHAR(50) NOT NULL,
    fecha_alerta DATE        NOT NULL,
    mensaje      TEXT        NOT NULL,
    estado       VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    fecha_envio  TIMESTAMP   NULL,
    PRIMARY KEY (id_alerta)
);


CREATE TABLE HISTORIAL_PDF (
    id_historial     INT          NOT NULL AUTO_INCREMENT,
    id_usuario       INT          NOT NULL,
    fecha_generacion TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    nombre_archivo   VARCHAR(255) NOT NULL,
    ruta_archivo     VARCHAR(500) NOT NULL,
    PRIMARY KEY (id_historial)
);
