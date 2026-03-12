package com.vaxminder.repository;

import com.vaxminder.model.CentroMedico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CentroMedicoRepository extends JpaRepository<CentroMedico, Integer> {

    List<CentroMedico> findByCiudadIgnoreCase(String ciudad);

    List<CentroMedico> findByTipoCentroIgnoreCase(String tipoCentro);

    List<CentroMedico> findAllByOrderByNombreCentroAsc();
}
