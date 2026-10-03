package com.campuscare.dto;

import jakarta.validation.constraints.NotNull;

public class AssignStaffRequest {

    @NotNull(message = "Staff ID is required")
    private Long staffId;

    private String note;

    public AssignStaffRequest() {
    }

    public AssignStaffRequest(Long staffId, String note) {
        this.staffId = staffId;
        this.note = note;
    }

    public Long getStaffId() {
        return staffId;
    }

    public void setStaffId(Long staffId) {
        this.staffId = staffId;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
