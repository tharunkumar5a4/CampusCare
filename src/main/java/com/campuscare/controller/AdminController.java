package com.campuscare.controller;

import com.campuscare.dto.*;
import com.campuscare.entity.Priority;
import com.campuscare.entity.Status;
import com.campuscare.security.UserPrincipal;
import com.campuscare.service.ComplaintService;
import com.campuscare.service.DashboardService;
import com.campuscare.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private ComplaintService complaintService;

    @Autowired
    private UserService userService;

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/complaints")
    public ResponseEntity<ApiResponse<List<ComplaintResponse>>> getAllComplaints(
            @RequestParam(required = false) Status status,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) String search) {
        List<ComplaintResponse> complaints = complaintService.getAllComplaints(status, categoryId, priority, search);
        return ResponseEntity.ok(ApiResponse.success("Complaints list retrieved", complaints));
    }

    @PutMapping("/complaints/{id}/assign")
    public ResponseEntity<ApiResponse<ComplaintResponse>> assignStaff(
            @PathVariable Long id,
            @Valid @RequestBody AssignStaffRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        ComplaintResponse response = complaintService.assignStaff(id, request.getStaffId(), request.getNote(), userPrincipal.getUser());
        return ResponseEntity.ok(ApiResponse.success("Staff assigned successfully", response));
    }

    @PutMapping("/complaints/{id}/priority")
    public ResponseEntity<ApiResponse<ComplaintResponse>> updatePriority(
            @PathVariable Long id,
            @Valid @RequestBody PriorityUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        ComplaintResponse response = complaintService.updatePriority(id, request.getPriority(), userPrincipal.getUser());
        return ResponseEntity.ok(ApiResponse.success("Priority updated successfully", response));
    }

    @PutMapping("/complaints/{id}/status")
    public ResponseEntity<ApiResponse<ComplaintResponse>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        ComplaintResponse response = complaintService.updateStatus(id, request.getStatus(), request.getNote(), userPrincipal.getUser());
        return ResponseEntity.ok(ApiResponse.success("Status updated successfully", response));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("Users list retrieved", users));
    }

    @GetMapping("/staff")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getStaffMembers() {
        List<UserResponse> staff = userService.getStaffMembers();
        return ResponseEntity.ok(ApiResponse.success("Staff list retrieved", staff));
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserRole(
            @PathVariable Long id,
            @Valid @RequestBody UserRoleUpdateRequest request) {
        UserResponse response = userService.updateUserRole(id, request.getRole());
        return ResponseEntity.ok(ApiResponse.success("User role updated", response));
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<UserResponse>> toggleUserStatus(@PathVariable Long id) {
        UserResponse response = userService.toggleUserStatus(id);
        return ResponseEntity.ok(ApiResponse.success("User active status updated", response));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getAdminDashboard() {
        DashboardStatsResponse stats = dashboardService.getAdminDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Admin dashboard stats retrieved", stats));
    }
}
