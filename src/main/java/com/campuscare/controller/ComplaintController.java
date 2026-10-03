package com.campuscare.controller;

import com.campuscare.dto.*;
import com.campuscare.entity.Priority;

import com.campuscare.security.UserPrincipal;
import com.campuscare.service.ComplaintService;
import com.campuscare.service.DashboardService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<ComplaintResponse>>> getMyComplaints(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<ComplaintResponse> complaints = complaintService.getStudentComplaints(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Complaints fetched successfully", complaints));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ComplaintResponse>> createComplaint(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("location") String location,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam(value = "priority", required = false) Priority priority,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        ComplaintRequest request = new ComplaintRequest(title, description, location, categoryId, priority);
        ComplaintResponse response = complaintService.createComplaint(request, file, userPrincipal.getUser());
        return ResponseEntity.ok(ApiResponse.success("Complaint submitted successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ComplaintResponse>> getComplaintDetails(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        ComplaintResponse response = complaintService.getComplaintDetails(id, userPrincipal.getUser());
        return ResponseEntity.ok(ApiResponse.success("Complaint details retrieved", response));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<ApiResponse<CommentResponse>> addComment(
            @PathVariable Long id,
            @Valid @RequestBody CommentRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        CommentResponse comment = complaintService.addComment(id, request.getMessage(), userPrincipal.getUser());
        return ResponseEntity.ok(ApiResponse.success("Comment added successfully", comment));
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<ApiResponse<List<CommentResponse>>> getComments(@PathVariable Long id) {
        List<CommentResponse> comments = complaintService.getComments(id);
        return ResponseEntity.ok(ApiResponse.success("Comments retrieved", comments));
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<ApiResponse<List<ComplaintHistoryResponse>>> getHistory(@PathVariable Long id) {
        List<ComplaintHistoryResponse> history = complaintService.getHistory(id);
        return ResponseEntity.ok(ApiResponse.success("History timeline retrieved", history));
    }

    @PostMapping("/{id}/close")
    public ResponseEntity<ApiResponse<ComplaintResponse>> closeComplaint(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        ComplaintResponse response = complaintService.closeComplaint(id, userPrincipal.getUser());
        return ResponseEntity.ok(ApiResponse.success("Complaint closed successfully", response));
    }

    @GetMapping("/dashboard/student")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getStudentDashboard(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        DashboardStatsResponse stats = dashboardService.getStudentDashboardStats(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Student dashboard stats retrieved", stats));
    }
}
