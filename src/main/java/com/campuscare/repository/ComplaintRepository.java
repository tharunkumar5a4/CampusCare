package com.campuscare.repository;

import com.campuscare.entity.Complaint;
import com.campuscare.entity.Priority;
import com.campuscare.entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long>, JpaSpecificationExecutor<Complaint> {

    List<Complaint> findByStudentIdOrderByCreatedAtDesc(Long studentId);

    List<Complaint> findByAssignedStaffIdOrderByCreatedAtDesc(Long staffId);

    List<Complaint> findAllByOrderByCreatedAtDesc();

    long countByStatus(Status status);

    long countByStudentId(Long studentId);

    long countByStudentIdAndStatus(Long studentId, Status status);

    long countByAssignedStaffId(Long staffId);

    long countByAssignedStaffIdAndStatus(Long staffId, Status status);

    List<Complaint> findTop5ByOrderByCreatedAtDesc();

    List<Complaint> findTop5ByPriorityOrderByCreatedAtDesc(Priority priority);
}
