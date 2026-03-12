package com.vaxminder.repository;

import com.vaxminder.model.VacunaCatalogo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VacunaCatalogoRepository extends JpaRepository<VacunaCatalogo, Integer> {

    List<VacunaCatalogo> findByNombreVacunaContainingIgnoreCase(String nombre);

    List<VacunaCatalogo> findByRequiereRefuerzoTrue();

    boolean existsByNombreVacunaIgnoreCase(String nombreVacuna);

    List<VacunaCatalogo> findAllByOrderByNombreVacunaAsc();
}
