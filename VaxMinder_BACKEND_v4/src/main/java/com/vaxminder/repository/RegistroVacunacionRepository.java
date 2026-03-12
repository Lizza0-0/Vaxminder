package com.vaxminder.repository;

import com.vaxminder.model.RegistroVacunacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RegistroVacunacionRepository extends JpaRepository<RegistroVacunacion, Integer> {

    List<RegistroVacunacion> findByIdUsuarioOrderByFechaAplicacionDesc(Integer idUsuario);

    List<RegistroVacunacion> findByIdUsuarioAndIdVacuna(Integer idUsuario, Integer idVacuna);

    Long countByIdUsuario(Integer idUsuario);
}
