package com.vaxminder.repository;

import com.vaxminder.model.HistorialPDF;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HistorialPDFRepository extends JpaRepository<HistorialPDF, Integer> {

    List<HistorialPDF> findByIdUsuarioOrderByFechaGeneracionDesc(Integer idUsuario);

    Long countByIdUsuario(Integer idUsuario);
}
