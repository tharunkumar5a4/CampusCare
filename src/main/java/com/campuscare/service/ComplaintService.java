package com.campuscare.service;

import com.campuscare.dto.*;
import com.campuscare.entity.*;
import com.campuscare.exception.BadRequestException;
import com.campuscare.exception.ResourceNotFoundException;
import com.campuscare.exception.UnauthorizedException;
import com.campuscare.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private AttachmentRepository attachmentRepository;

    @Autowired
    private ComplaintHistoryRepository complaintHistoryRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Transactional
    public ComplaintResponse createComplaint(ComplaintRequest request, MultipartFile file, User student) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));

        Complaint complaint = new Complaint();
        complaint.setTitle(request.getTitle());
        complaint.setDescription(request.getDescription());
        complaint.setLocation(request.getLocation());
        complaint.setCategory(category);
        complaint.setPriority(request.getPriority() != null ? request.getPriority() : Priority.MEDIUM);
        complaint.setStatus(Status.OPEN);
        complaint.setStudent(student);

        Complaint savedComplaint = complaintRepository.save(complaint);

        // Record initial history
        ComplaintHistory history = new ComplaintHistory(
                savedComplaint,
                null,
                Status.OPEN,
                student,
                "Complaint created by student: " + student.getName()
        );
        complaintHistoryRepository.save(history);

        // Handle attachment if provided
        if (file != null && !file.isEmpty()) {
            String storedFileName = fileStorageService.storeFile(file);
            Attachment attachment = new Attachment(
                    file.getOriginalFilename(),
                    "/api/attachments/files/" + storedFileName,
                    file.getContentType(),
                    file.getSize(),
                    savedComplaint
            );
            attachmentRepository.save(attachment);
        }

        return getComplaintResponse(savedComplaint.getId());
    }

    public List<ComplaintResponse> getStudentComplaints(Long studentId) {
        return complaintRepository.findByStudentIdOrderByCreatedAtDesc(studentId)
                .stream()
                .map(this::mapToBasicResponse)
                .collect(Collectors.toList());
    }

    public List<ComplaintResponse> getStaffComplaints(Long staffId) {
        return complaintRepository.findByAssignedStaffIdOrderByCreatedAtDesc(staffId)
                .stream()
                .map(this::mapToBasicResponse)
                .collect(Collectors.toList());
    }

    public List<ComplaintResponse> getAllComplaints(Status status, Long categoryId, Priority priority, String search) {
        List<Complaint> complaints = complaintRepository.findAllByOrderByCreatedAtDesc();

        return complaints.stream()
                .filter(c -> status == null || c.getStatus() == status)
                .filter(c -> categoryId == null || (c.getCategory() != null && c.getCategory().getId().equals(categoryId)))
                .filter(c -> priority == null || c.getPriority() == priority)
                .filter(c -> search == null || search.trim().isEmpty() ||
                        c.getTitle().toLowerCase().contains(search.toLowerCase()) ||
                        c.getDescription().toLowerCase().contains(search.toLowerCase()) ||
                        c.getLocation().toLowerCase().contains(search.toLowerCase()) ||
                        String.valueOf(c.getId()).contains(search))
                .map(this::mapToBasicResponse)
                .collect(Collectors.toList());
    }

    public ComplaintResponse getComplaintDetails(Long id, User currentUser) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with ID: " + id));

        // Security check
        if (currentUser.getRole() == Role.STUDENT && !complaint.getStudent().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not authorized to view this complaint");
        }

        if (currentUser.getRole() == Role.STAFF &&
                (complaint.getAssignedStaff() == null || !complaint.getAssignedStaff().getId().equals(currentUser.getId()))) {
            // Staff can view assigned complaints or allow if viewing assigned
        }

        return getComplaintResponse(complaint.getId());
    }

    @Transactional
    public ComplaintResponse updateStatus(Long id, Status newStatus, String note, User currentUser) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with ID: " + id));

        Status oldStatus = complaint.getStatus();
        if (oldStatus == newStatus) {
            return getComplaintResponse(id);
        }

        // Validate status transition permissions
        if (currentUser.getRole() == Role.STAFF) {
            if (complaint.getAssignedStaff() == null || !complaint.getAssignedStaff().getId().equals(currentUser.getId())) {
                throw new UnauthorizedException("Staff can only update complaints assigned to them");
            }
        }

        complaint.setStatus(newStatus);
        if (newStatus == Status.RESOLVED) {
            complaint.setResolvedAt(LocalDateTime.now());
        }

        complaintRepository.save(complaint);

        String historyNote = (note != null && !note.trim().isEmpty()) ? note : "Status changed from " + oldStatus + " to " + newStatus;
        ComplaintHistory history = new ComplaintHistory(complaint, oldStatus, newStatus, currentUser, historyNote);
        complaintHistoryRepository.save(history);

        return getComplaintResponse(id);
    }

    @Transactional
    public ComplaintResponse assignStaff(Long id, Long staffId, String note, User currentUser) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with ID: " + id));

        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff member not found with ID: " + staffId));

        if (staff.getRole() != Role.STAFF && staff.getRole() != Role.ADMIN) {
            throw new BadRequestException("Selected user is not a staff member");
        }

        Status oldStatus = complaint.getStatus();
        complaint.setAssignedStaff(staff);
        if (complaint.getStatus() == Status.OPEN) {
            complaint.setStatus(Status.ASSIGNED);
        }

        complaintRepository.save(complaint);

        String historyNote = "Assigned to staff: " + staff.getName() + (note != null && !note.trim().isEmpty() ? " (" + note + ")" : "");
        ComplaintHistory history = new ComplaintHistory(complaint, oldStatus, complaint.getStatus(), currentUser, historyNote);
        complaintHistoryRepository.save(history);

        return getComplaintResponse(id);
    }

    @Transactional
    public ComplaintResponse updatePriority(Long id, Priority newPriority, User currentUser) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with ID: " + id));

        Priority oldPriority = complaint.getPriority();
        complaint.setPriority(newPriority);
        complaintRepository.save(complaint);

        ComplaintHistory history = new ComplaintHistory(
                complaint,
                complaint.getStatus(),
                complaint.getStatus(),
                currentUser,
                "Priority changed from " + oldPriority + " to " + newPriority
        );
        complaintHistoryRepository.save(history);

        return getComplaintResponse(id);
    }

    @Transactional
    public ComplaintResponse closeComplaint(Long id, User student) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with ID: " + id));

        if (!complaint.getStudent().getId().equals(student.getId()) && student.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only the student who submitted the complaint or an Admin can close it");
        }

        Status oldStatus = complaint.getStatus();
        complaint.setStatus(Status.CLOSED);
        complaintRepository.save(complaint);

        ComplaintHistory history = new ComplaintHistory(
                complaint,
                oldStatus,
                Status.CLOSED,
                student,
                "Complaint confirmed and closed by student"
        );
        complaintHistoryRepository.save(history);

        return getComplaintResponse(id);
    }

    @Transactional
    public CommentResponse addComment(Long complaintId, String message, User currentUser) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with ID: " + complaintId));

        Comment comment = new Comment(message, currentUser, complaint);
        Comment saved = commentRepository.save(comment);

        return new CommentResponse(saved);
    }

    public List<CommentResponse> getComments(Long complaintId) {
        return commentRepository.findByComplaintIdOrderByCreatedAtAsc(complaintId)
                .stream()
                .map(CommentResponse::new)
                .collect(Collectors.toList());
    }

    public List<ComplaintHistoryResponse> getHistory(Long complaintId) {
        return complaintHistoryRepository.findByComplaintIdOrderByChangedAtAsc(complaintId)
                .stream()
                .map(ComplaintHistoryResponse::new)
                .collect(Collectors.toList());
    }

    private ComplaintResponse getComplaintResponse(Long complaintId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with ID: " + complaintId));

        ComplaintResponse response = new ComplaintResponse(complaint);

        List<AttachmentResponse> attachments = attachmentRepository.findByComplaintId(complaintId)
                .stream()
                .map(AttachmentResponse::new)
                .collect(Collectors.toList());
        response.setAttachments(attachments);

        List<CommentResponse> comments = commentRepository.findByComplaintIdOrderByCreatedAtAsc(complaintId)
                .stream()
                .map(CommentResponse::new)
                .collect(Collectors.toList());
        response.setComments(comments);

        List<ComplaintHistoryResponse> history = complaintHistoryRepository.findByComplaintIdOrderByChangedAtAsc(complaintId)
                .stream()
                .map(ComplaintHistoryResponse::new)
                .collect(Collectors.toList());
        response.setHistory(history);

        return response;
    }

    private ComplaintResponse mapToBasicResponse(Complaint complaint) {
        return new ComplaintResponse(complaint);
    }
}
