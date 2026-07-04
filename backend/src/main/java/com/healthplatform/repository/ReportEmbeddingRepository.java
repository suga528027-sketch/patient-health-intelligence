package com.healthplatform.repository;

import com.healthplatform.model.ReportEmbedding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportEmbeddingRepository extends JpaRepository<ReportEmbedding, Long> {
    List<ReportEmbedding> findByReportId(Long reportId);

    @Modifying
    @Query("DELETE FROM ReportEmbedding r WHERE r.report.id = :reportId")
    void deleteByReportId(Long reportId);
}
