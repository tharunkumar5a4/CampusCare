package com.campuscare.dto;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DashboardStatsResponse {
    private long totalComplaints;
    private long openCount;
    private long assignedCount;
    private long inProgressCount;
    private long resolvedCount;
    private long closedCount;
    private long totalStudents;
    private long totalStaff;

    private Map<String, Long> categoryCounts = new HashMap<>();
    private List<ComplaintResponse> recentComplaints;
    private List<ComplaintResponse> highPriorityComplaints;

    public DashboardStatsResponse() {
    }

    public long getTotalComplaints() {
        return totalComplaints;
    }

    public void setTotalComplaints(long totalComplaints) {
        this.totalComplaints = totalComplaints;
    }

    public long getOpenCount() {
        return openCount;
    }

    public void setOpenCount(long openCount) {
        this.openCount = openCount;
    }

    public long getAssignedCount() {
        return assignedCount;
    }

    public void setAssignedCount(long assignedCount) {
        this.assignedCount = assignedCount;
    }

    public long getInProgressCount() {
        return inProgressCount;
    }

    public void setInProgressCount(long inProgressCount) {
        this.inProgressCount = inProgressCount;
    }

    public long getResolvedCount() {
        return resolvedCount;
    }

    public void setResolvedCount(long resolvedCount) {
        this.resolvedCount = resolvedCount;
    }

    public long getClosedCount() {
        return closedCount;
    }

    public void setClosedCount(long closedCount) {
        this.closedCount = closedCount;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getTotalStaff() {
        return totalStaff;
    }

    public void setTotalStaff(long totalStaff) {
        this.totalStaff = totalStaff;
    }

    public Map<String, Long> getCategoryCounts() {
        return categoryCounts;
    }

    public void setCategoryCounts(Map<String, Long> categoryCounts) {
        this.categoryCounts = categoryCounts;
    }

    public List<ComplaintResponse> getRecentComplaints() {
        return recentComplaints;
    }

    public void setRecentComplaints(List<ComplaintResponse> recentComplaints) {
        this.recentComplaints = recentComplaints;
    }

    public List<ComplaintResponse> getHighPriorityComplaints() {
        return highPriorityComplaints;
    }

    public void setHighPriorityComplaints(List<ComplaintResponse> highPriorityComplaints) {
        this.highPriorityComplaints = highPriorityComplaints;
    }
}
