package com.vaxminder.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "REGISTRO_VACUNACION")
public class RegistroVacunacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_registro")
    private Integer idRegistro;

    @Column(name = "id_usuario", nullable = false)
    private Integer idUsuario;

    @Column(name = "id_vacuna", nullable = false)
    private Integer idVacuna;

    @Column(name = "fecha_aplicacion", nullable = false)
    private LocalDate fechaAplicacion;

    @Column(name = "numero_dosis", nullable = false)
    private Integer numeroDosis;

    @Column(name = "lote_vacuna", length = 50)
    private String loteVacuna;

    @Column(name = "id_centro_medico")
    private Integer idCentroMedico;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;

    @Column(name = "proxima_dosis_fecha")
    private LocalDate proximaDosisFecha;

    public RegistroVacunacion() {}

    public RegistroVacunacion(Integer idRegistro, Integer idUsuario, Integer idVacuna,
                              LocalDate fechaAplicacion, Integer numeroDosis, String loteVacuna,
                              Integer idCentroMedico, String observaciones,
                              LocalDate proximaDosisFecha) {
        this.idRegistro = idRegistro;
        this.idUsuario = idUsuario;
        this.idVacuna = idVacuna;
        this.fechaAplicacion = fechaAplicacion;
        this.numeroDosis = numeroDosis;
        this.loteVacuna = loteVacuna;
        this.idCentroMedico = idCentroMedico;
        this.observaciones = observaciones;
        this.proximaDosisFecha = proximaDosisFecha;
    }

    public Integer getIdRegistro() {
        return idRegistro;
    }

    public void setIdRegistro(Integer idRegistro) {
        this.idRegistro = idRegistro;
    }

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Integer getIdVacuna() {
        return idVacuna;
    }

    public void setIdVacuna(Integer idVacuna) {
        this.idVacuna = idVacuna;
    }

    public LocalDate getFechaAplicacion() {
        return fechaAplicacion;
    }

    public void setFechaAplicacion(LocalDate fechaAplicacion) {
        this.fechaAplicacion = fechaAplicacion;
    }

    public Integer getNumeroDosis() {
        return numeroDosis;
    }

    public void setNumeroDosis(Integer numeroDosis) {
        this.numeroDosis = numeroDosis;
    }

    public String getLoteVacuna() {
        return loteVacuna;
    }

    public void setLoteVacuna(String loteVacuna) {
        this.loteVacuna = loteVacuna;
    }

    public Integer getIdCentroMedico() {
        return idCentroMedico;
    }

    public void setIdCentroMedico(Integer idCentroMedico) {
        this.idCentroMedico = idCentroMedico;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    public LocalDate getProximaDosisFecha() {
        return proximaDosisFecha;
    }

    public void setProximaDosisFecha(LocalDate proximaDosisFecha) {
        this.proximaDosisFecha = proximaDosisFecha;
    }

    @Override
    public String toString() {
        return "RegistroVacunacion{" +
                "idRegistro=" + idRegistro +
                ", idUsuario=" + idUsuario +
                ", idVacuna=" + idVacuna +
                ", fechaAplicacion=" + fechaAplicacion +
                ", numeroDosis=" + numeroDosis +
                '}';
    }
}
