package com.campuscare.dto;

import com.campuscare.entity.Priority;
import jakarta.validation.constraints.NotNull;

public class PriorityUpdateRequest {

    @NotNull(message = "Priority is required")
    private Priority priority;

    public PriorityUpdateRequest() {
    }

    public PriorityUpdateRequest(Priority priority) {
        this.priority = priority;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }
}
