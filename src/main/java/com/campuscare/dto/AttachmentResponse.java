package com.campuscare.dto;

import com.campuscare.entity.Attachment;
import java.time.LocalDateTime;

public class AttachmentResponse {
    private Long id;
    private String fileName;
    private String filePath;
    private String fileType;
    private Long fileSize;
    private LocalDateTime uploadedAt;

    public AttachmentResponse() {
    }

    public AttachmentResponse(Attachment attachment) {
        this.id = attachment.getId();
        this.fileName = attachment.getFileName();
        this.filePath = attachment.getFilePath();
        this.fileType = attachment.getFileType();
        this.fileSize = attachment.getFileSize();
        this.uploadedAt = attachment.getUploadedAt();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
}
