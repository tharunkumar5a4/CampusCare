package com.campuscare.controller;

import com.campuscare.dto.*;
import com.campuscare.entity.Status;
import com.campuscare.security.UserPrincipal;
import com.campuscare.service.ComplaintService;
import com.campuscare.service.DashboardService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
public class StaffController {

    @Autowired
    private ComplaintService complaintService;

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/complaints")
    public ResponseEntity<ApiResponse<List<ComplaintResponse>>> getAssignedComplaints(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<ComplaintResponse> complaints = complaintService.getStaffComplaints(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Assigned complaints retrieved", complaints));
    }

    @GetMapping("/complaints/{id}")
    public ResponseEntity<ApiResponse<ComplaintResponse>> getComplaintDetails(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        ComplaintResponse response = complaintService.getComplaintDetails(id, userPrincipal.getUser());
        return ResponseEntity.ok(ApiResponse.success("Complaint details retrieved", response));
    }

    @PutMapping("/complaints/{id}/status")
    public ResponseEntity<ApiResponse<ComplaintResponse>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        ComplaintResponse response = complaintService.updateStatus(id, request.getStatus(), request.getNote(), userPrincipal.getUser());
        return ResponseEntity.ok(ApiResponse.success("Status updated successfully", response));
    }

    @PutMapping("/complaints/{id}/resolve")
    public ResponseEntity<ApiResponse<ComplaintResponse>> resolveComplaint(
            @PathVariable Long id,
            @RequestBody(required = false) StatusUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        String note = (request != null) ? request.getNote() : "Complaint resolved by staff member";
        ComplaintResponse response = complaintService.updateStatus(id, Status.RESOLVED, note, userPrincipal.getUser());
        return ResponseEntity.ok(ApiResponse.success("Complaint marked as resolved", response));
    }

    @PostMapping("/complaints/{id}/comments")
    public ResponseEntity<ApiResponse<CommentResponse>> addComment(
            @PathVariable Long id,
            @Valid @RequestBody CommentRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        CommentResponse comment = complaintService.addComment(id, request.getMessage(), userPrincipal.getUser());
        return ResponseEntity.ok(ApiResponse.success("Comment added", comment));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getStaffDashboard(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        DashboardStatsResponse stats = dashboardService.getStaffDashboardStats(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Staff dashboard stats retrieved", stats));
    }
}
