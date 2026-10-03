package com.campuscare.dto;

import com.campuscare.entity.Status;
import jakarta.validation.constraints.NotNull;

public class StatusUpdateRequest {

    @NotNull(message = "Status is required")
    private Status status;

    private String note;

    public StatusUpdateRequest() {
    }

    public StatusUpdateRequest(Status status, String note) {
        this.status = status;
        this.note = note;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
