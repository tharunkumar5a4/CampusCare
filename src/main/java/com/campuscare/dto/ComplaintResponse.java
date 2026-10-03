package com.campuscare.dto;

import com.campuscare.entity.Complaint;
import com.campuscare.entity.Priority;
import com.campuscare.entity.Status;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ComplaintResponse {
    private Long id;
    private String title;
    private String description;
    private String location;
    private Long categoryId;
    private String categoryName;
    private Priority priority;
    private Status status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;

    private Long studentId;
    private String studentName;
    private String studentEmail;

    private Long staffId;
    private String staffName;
    private String staffEmail;

    private List<AttachmentResponse> attachments = new ArrayList<>();
    private List<CommentResponse> comments = new ArrayList<>();
    private List<ComplaintHistoryResponse> history = new ArrayList<>();

    public ComplaintResponse() {
    }

    public ComplaintResponse(Complaint complaint) {
        this.id = complaint.getId();
        this.title = complaint.getTitle();
        this.description = complaint.getDescription();
        this.location = complaint.getLocation();
        this.priority = complaint.getPriority();
        this.status = complaint.getStatus();
        this.createdAt = complaint.getCreatedAt();
        this.updatedAt = complaint.getUpdatedAt();
        this.resolvedAt = complaint.getResolvedAt();

        if (complaint.getCategory() != null) {
            this.categoryId = complaint.getCategory().getId();
            this.categoryName = complaint.getCategory().getName();
        }

        if (complaint.getStudent() != null) {
            this.studentId = complaint.getStudent().getId();
            this.studentName = complaint.getStudent().getName();
            this.studentEmail = complaint.getStudent().getEmail();
        }

        if (complaint.getAssignedStaff() != null) {
            this.staffId = complaint.getAssignedStaff().getId();
            this.staffName = complaint.getAssignedStaff().getName();
            this.staffEmail = complaint.getAssignedStaff().getEmail();
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
    }

    public Long getStaffId() {
        return staffId;
    }

    public void setStaffId(Long staffId) {
        this.staffId = staffId;
    }

    public String getStaffName() {
        return staffName;
    }

    public void setStaffName(String staffName) {
        this.staffName = staffName;
    }

    public String getStaffEmail() {
        return staffEmail;
    }

    public void setStaffEmail(String staffEmail) {
        this.staffEmail = staffEmail;
    }

    public List<AttachmentResponse> getAttachments() {
        return attachments;
    }

    public void setAttachments(List<AttachmentResponse> attachments) {
        this.attachments = attachments;
    }

    public List<CommentResponse> getComments() {
        return comments;
    }

    public void setComments(List<CommentResponse> comments) {
        this.comments = comments;
    }

    public List<ComplaintHistoryResponse> getHistory() {
        return history;
    }

    public void setHistory(List<ComplaintHistoryResponse> history) {
        this.history = history;
    }
}
