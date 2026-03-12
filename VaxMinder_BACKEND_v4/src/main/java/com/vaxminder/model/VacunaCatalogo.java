package com.vaxminder.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "VACUNAS_CATALOGO")
public class VacunaCatalogo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_vacuna")
    private Integer idVacuna;

    @Column(name = "nombre_vacuna", nullable = false, length = 150)
    private String nombreVacuna;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "edad_recomendada", length = 50)
    private String edadRecomendada;

    @Column(name = "dosis_requeridas", nullable = false)
    private Integer dosisRequeridas;

    @Column(name = "intervalo_dosis_dias")
    private Integer intervaloDosisDias;

    @Column(name = "requiere_refuerzo", nullable = false)
    private Boolean requiereRefuerzo;

    public VacunaCatalogo() {}

    public VacunaCatalogo(Integer idVacuna, String nombreVacuna, String descripcion,
                          String edadRecomendada, Integer dosisRequeridas,
                          Integer intervaloDosisDias, Boolean requiereRefuerzo) {
        this.idVacuna = idVacuna;
        this.nombreVacuna = nombreVacuna;
        this.descripcion = descripcion;
        this.edadRecomendada = edadRecomendada;
        this.dosisRequeridas = dosisRequeridas;
        this.intervaloDosisDias = intervaloDosisDias;
        this.requiereRefuerzo = requiereRefuerzo;
    }

    public Integer getIdVacuna() {
        return idVacuna;
    }

    public void setIdVacuna(Integer idVacuna) {
        this.idVacuna = idVacuna;
    }

    public String getNombreVacuna() {
        return nombreVacuna;
    }

    public void setNombreVacuna(String nombreVacuna) {
        this.nombreVacuna = nombreVacuna;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getEdadRecomendada() {
        return edadRecomendada;
    }

    public void setEdadRecomendada(String edadRecomendada) {
        this.edadRecomendada = edadRecomendada;
    }

    public Integer getDosisRequeridas() {
        return dosisRequeridas;
    }

    public void setDosisRequeridas(Integer dosisRequeridas) {
        this.dosisRequeridas = dosisRequeridas;
    }

    public Integer getIntervaloDosisDias() {
        return intervaloDosisDias;
    }

    public void setIntervaloDosisDias(Integer intervaloDosisDias) {
        this.intervaloDosisDias = intervaloDosisDias;
    }

    public Boolean getRequiereRefuerzo() {
        return requiereRefuerzo;
    }

    public void setRequiereRefuerzo(Boolean requiereRefuerzo) {
        this.requiereRefuerzo = requiereRefuerzo;
    }

    @Override
    public String toString() {
        return "VacunaCatalogo{" +
                "idVacuna=" + idVacuna +
                ", nombreVacuna='" + nombreVacuna + '\'' +
                ", dosisRequeridas=" + dosisRequeridas +
                ", requiereRefuerzo=" + requiereRefuerzo +
                '}';
    }
}
