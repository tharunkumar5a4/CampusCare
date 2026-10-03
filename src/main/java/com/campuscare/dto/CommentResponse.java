package com.campuscare.dto;

import com.campuscare.entity.Comment;
import com.campuscare.entity.Role;
import java.time.LocalDateTime;

public class CommentResponse {
    private Long id;
    private String message;
    private LocalDateTime createdAt;
    private Long userId;
    private String userName;
    private Role userRole;

    public CommentResponse() {
    }

    public CommentResponse(Comment comment) {
        this.id = comment.getId();
        this.message = comment.getMessage();
        this.createdAt = comment.getCreatedAt();
        if (comment.getUser() != null) {
            this.userId = comment.getUser().getId();
            this.userName = comment.getUser().getName();
            this.userRole = comment.getUser().getRole();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Role getUserRole() {
        return userRole;
    }

    public void setUserRole(Role userRole) {
        this.userRole = userRole;
    }
}
