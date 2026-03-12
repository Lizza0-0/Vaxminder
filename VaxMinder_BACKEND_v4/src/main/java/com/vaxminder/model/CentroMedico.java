package com.vaxminder.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "CENTROS_MEDICOS")
public class CentroMedico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_centro")
    private Integer idCentro;

    @Column(name = "nombre_centro", nullable = false, length = 200)
    private String nombreCentro;

    @Column(name = "direccion", nullable = false, length = 255)
    private String direccion;

    @Column(name = "ciudad", nullable = false, length = 100)
    private String ciudad;

    @Column(name = "telefono", length = 20)
    private String telefono;

    @Column(name = "tipo_centro", length = 50)
    private String tipoCentro;

    public CentroMedico() {}

    public CentroMedico(Integer idCentro, String nombreCentro, String direccion,
                        String ciudad, String telefono, String tipoCentro) {
        this.idCentro = idCentro;
        this.nombreCentro = nombreCentro;
        this.direccion = direccion;
        this.ciudad = ciudad;
        this.telefono = telefono;
        this.tipoCentro = tipoCentro;
    }

    public Integer getIdCentro() {
        return idCentro;
    }

    public void setIdCentro(Integer idCentro) {
        this.idCentro = idCentro;
    }

    public String getNombreCentro() {
        return nombreCentro;
    }

    public void setNombreCentro(String nombreCentro) {
        this.nombreCentro = nombreCentro;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getCiudad() {
        return ciudad;
    }

    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getTipoCentro() {
        return tipoCentro;
    }

    public void setTipoCentro(String tipoCentro) {
        this.tipoCentro = tipoCentro;
    }

    @Override
    public String toString() {
        return "CentroMedico{" +
                "idCentro=" + idCentro +
                ", nombreCentro='" + nombreCentro + '\'' +
                ", ciudad='" + ciudad + '\'' +
                ", tipoCentro='" + tipoCentro + '\'' +
                '}';
    }
}
