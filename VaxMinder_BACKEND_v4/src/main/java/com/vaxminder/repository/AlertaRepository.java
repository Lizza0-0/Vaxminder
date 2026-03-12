package com.vaxminder.repository;

import com.vaxminder.model.Alerta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AlertaRepository extends JpaRepository<Alerta, Integer> {

    List<Alerta> findByIdUsuarioOrderByFechaAlertaAsc(Integer idUsuario);

    List<Alerta> findByIdUsuarioAndEstado(Integer idUsuario, String estado);

    Long countByIdUsuarioAndEstado(Integer idUsuario, String estado);
}
