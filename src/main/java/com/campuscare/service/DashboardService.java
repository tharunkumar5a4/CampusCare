package com.campuscare.service;

import com.campuscare.dto.ComplaintResponse;
import com.campuscare.dto.DashboardStatsResponse;
import com.campuscare.entity.Complaint;
import com.campuscare.entity.Priority;
import com.campuscare.entity.Role;
import com.campuscare.entity.Status;
import com.campuscare.repository.CategoryRepository;
import com.campuscare.repository.ComplaintRepository;
import com.campuscare.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public DashboardStatsResponse getAdminDashboardStats() {
        DashboardStatsResponse stats = new DashboardStatsResponse();

        stats.setTotalComplaints(complaintRepository.count());
        stats.setOpenCount(complaintRepository.countByStatus(Status.OPEN));
        stats.setAssignedCount(complaintRepository.countByStatus(Status.ASSIGNED));
        stats.setInProgressCount(complaintRepository.countByStatus(Status.IN_PROGRESS));
        stats.setResolvedCount(complaintRepository.countByStatus(Status.RESOLVED));
        stats.setClosedCount(complaintRepository.countByStatus(Status.CLOSED));

        stats.setTotalStudents(userRepository.countByRole(Role.STUDENT));
        stats.setTotalStaff(userRepository.countByRole(Role.STAFF));

        // Category counts
        Map<String, Long> categoryCounts = new HashMap<>();
        categoryRepository.findAll().forEach(category -> {
            long count = complaintRepository.findAllByOrderByCreatedAtDesc()
                    .stream()
                    .filter(c -> c.getCategory() != null && c.getCategory().getId().equals(category.getId()))
                    .count();
            categoryCounts.put(category.getName(), count);
        });
        stats.setCategoryCounts(categoryCounts);

        List<ComplaintResponse> recent = complaintRepository.findTop5ByOrderByCreatedAtDesc()
                .stream()
                .map(ComplaintResponse::new)
                .collect(Collectors.toList());
        stats.setRecentComplaints(recent);

        List<ComplaintResponse> highPriority = complaintRepository.findTop5ByPriorityOrderByCreatedAtDesc(Priority.HIGH)
                .stream()
                .map(ComplaintResponse::new)
                .collect(Collectors.toList());
        stats.setHighPriorityComplaints(highPriority);

        return stats;
    }

    public DashboardStatsResponse getStudentDashboardStats(Long studentId) {
        DashboardStatsResponse stats = new DashboardStatsResponse();
        List<Complaint> studentComplaints = complaintRepository.findByStudentIdOrderByCreatedAtDesc(studentId);

        stats.setTotalComplaints(studentComplaints.size());
        stats.setOpenCount(studentComplaints.stream().filter(c -> c.getStatus() == Status.OPEN).count());
        stats.setAssignedCount(studentComplaints.stream().filter(c -> c.getStatus() == Status.ASSIGNED).count());
        stats.setInProgressCount(studentComplaints.stream().filter(c -> c.getStatus() == Status.IN_PROGRESS).count());
        stats.setResolvedCount(studentComplaints.stream().filter(c -> c.getStatus() == Status.RESOLVED).count());
        stats.setClosedCount(studentComplaints.stream().filter(c -> c.getStatus() == Status.CLOSED).count());

        List<ComplaintResponse> recent = studentComplaints.stream()
                .limit(5)
                .map(ComplaintResponse::new)
                .collect(Collectors.toList());
        stats.setRecentComplaints(recent);

        return stats;
    }

    public DashboardStatsResponse getStaffDashboardStats(Long staffId) {
        DashboardStatsResponse stats = new DashboardStatsResponse();
        List<Complaint> staffComplaints = complaintRepository.findByAssignedStaffIdOrderByCreatedAtDesc(staffId);

        stats.setTotalComplaints(staffComplaints.size());
        stats.setOpenCount(staffComplaints.stream().filter(c -> c.getStatus() == Status.OPEN).count());
        stats.setAssignedCount(staffComplaints.stream().filter(c -> c.getStatus() == Status.ASSIGNED).count());
        stats.setInProgressCount(staffComplaints.stream().filter(c -> c.getStatus() == Status.IN_PROGRESS).count());
        stats.setResolvedCount(staffComplaints.stream().filter(c -> c.getStatus() == Status.RESOLVED).count());
        stats.setClosedCount(staffComplaints.stream().filter(c -> c.getStatus() == Status.CLOSED).count());

        List<ComplaintResponse> recent = staffComplaints.stream()
                .limit(5)
                .map(ComplaintResponse::new)
                .collect(Collectors.toList());
        stats.setRecentComplaints(recent);

        return stats;
    }
}
