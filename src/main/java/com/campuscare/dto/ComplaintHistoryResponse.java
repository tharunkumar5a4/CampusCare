package com.campuscare.dto;

import com.campuscare.entity.ComplaintHistory;
import com.campuscare.entity.Role;
import com.campuscare.entity.Status;
import java.time.LocalDateTime;

public class ComplaintHistoryResponse {
    private Long id;
    private Status oldStatus;
    private Status newStatus;
    private Long changedById;
    private String changedByName;
    private Role changedByRole;
    private LocalDateTime changedAt;
    private String note;

    public ComplaintHistoryResponse() {
    }

    public ComplaintHistoryResponse(ComplaintHistory history) {
        this.id = history.getId();
        this.oldStatus = history.getOldStatus();
        this.newStatus = history.getNewStatus();
        this.changedAt = history.getChangedAt();
        this.note = history.getNote();
        if (history.getChangedBy() != null) {
            this.changedById = history.getChangedBy().getId();
            this.changedByName = history.getChangedBy().getName();
            this.changedByRole = history.getChangedBy().getRole();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Status getOldStatus() {
        return oldStatus;
    }

    public void setOldStatus(Status oldStatus) {
        this.oldStatus = oldStatus;
    }

    public Status getNewStatus() {
        return newStatus;
    }

    public void setNewStatus(Status newStatus) {
        this.newStatus = newStatus;
    }

    public Long getChangedById() {
        return changedById;
    }

    public void setChangedById(Long changedById) {
        this.changedById = changedById;
    }

    public String getChangedByName() {
        return changedByName;
    }

    public void setChangedByName(String changedByName) {
        this.changedByName = changedByName;
    }

    public Role getChangedByRole() {
        return changedByRole;
    }

    public void setChangedByRole(Role changedByRole) {
        this.changedByRole = changedByRole;
    }

    public LocalDateTime getChangedAt() {
        return changedAt;
    }

    public void setChangedAt(LocalDateTime changedAt) {
        this.changedAt = changedAt;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
