package com.campuscare.service;

import com.campuscare.entity.*;
import com.campuscare.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private ComplaintHistoryRepository complaintHistoryRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedCategories();
        seedUsers();
        seedSampleComplaints();
    }

    private void seedCategories() {
        if (categoryRepository.count() == 0) {
            List<Category> categories = Arrays.asList(
                    new Category(null, "Electrical", "Power outages, broken switches, wiring problems", true),
                    new Category(null, "Plumbing", "Water leakage, blocked pipes, tap repair", true),
                    new Category(null, "Cleanliness", "Waste disposal, washroom cleaning, sanitation", true),
                    new Category(null, "IT Support", "Wi-Fi issues, lab computer failure, projector glitch", true),
                    new Category(null, "Classroom", "Broken podium, whiteboards, air conditioning", true),
                    new Category(null, "Laboratory", "Equipment breakdown, safety apparatus issues", true),
                    new Category(null, "Furniture", "Damaged desks, broken chairs, cupboard repair", true),
                    new Category(null, "Security", "Gate clearance, lost item reporting, CCTV maintenance", true),
                    new Category(null, "Hostel", "Room maintenance, hot water supply, lock repair", true),
                    new Category(null, "Other", "General complaints and campus inquiry", true)
            );
            categoryRepository.saveAll(categories);
            System.out.println(">>> Seeded 10 default complaint categories.");
        }
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            String defaultPass = passwordEncoder.encode("admin123");
            String staffPass = passwordEncoder.encode("staff123");
            String studentPass = passwordEncoder.encode("student123");

            User admin = new User(null, "System Administrator", "admin@campuscare.com", defaultPass, Role.ADMIN, "9876543210", true);
            User staff1 = new User(null, "Robert Maintenance", "staff@campuscare.com", staffPass, Role.STAFF, "9876543211", true);
            User staff2 = new User(null, "David IT Support", "staff2@campuscare.com", staffPass, Role.STAFF, "9876543212", true);
            User student1 = new User(null, "Alex Morgan", "student@campuscare.com", studentPass, Role.STUDENT, "9876543213", true);
            User student2 = new User(null, "Emma Watson", "student2@campuscare.com", studentPass, Role.STUDENT, "9876543214", true);

            userRepository.saveAll(Arrays.asList(admin, staff1, staff2, student1, student2));
            System.out.println(">>> Seeded default users (ADMIN, STAFF, STUDENT).");
        }
    }

    private void seedSampleComplaints() {
        if (complaintRepository.count() == 0) {
            User student1 = userRepository.findByEmail("student@campuscare.com").orElse(null);
            User student2 = userRepository.findByEmail("student2@campuscare.com").orElse(null);
            User staff1 = userRepository.findByEmail("staff@campuscare.com").orElse(null);
            User staff2 = userRepository.findByEmail("staff2@campuscare.com").orElse(null);
            User admin = userRepository.findByEmail("admin@campuscare.com").orElse(null);

            Category electrical = categoryRepository.findByName("Electrical").orElse(null);
            Category itSupport = categoryRepository.findByName("IT Support").orElse(null);
            Category plumbing = categoryRepository.findByName("Plumbing").orElse(null);

            if (student1 != null && electrical != null) {
                // Complaint 1: OPEN
                Complaint c1 = new Complaint();
                c1.setTitle("Projector HDMI port flickering in Hall 3B");
                c1.setDescription("The main projector HDMI input cuts out every 5 minutes during lectures. Please inspect the ceiling mount unit.");
                c1.setLocation("Academic Block B, Room 302");
                c1.setCategory(itSupport);
                c1.setPriority(Priority.HIGH);
                c1.setStatus(Status.OPEN);
                c1.setStudent(student1);
                c1 = complaintRepository.save(c1);

                complaintHistoryRepository.save(new ComplaintHistory(c1, null, Status.OPEN, student1, "Submitted initial complaint"));

                // Complaint 2: IN_PROGRESS
                Complaint c2 = new Complaint();
                c2.setTitle("Water leakage near Hostel Block 4 Entrance");
                c2.setDescription("Continuous pipe leak causing water pooling near the main entrance stairs. Poses slipping hazard.");
                c2.setLocation("Hostel Block 4 Ground Floor");
                c2.setCategory(plumbing);
                c2.setPriority(Priority.URGENT);
                c2.setStatus(Status.IN_PROGRESS);
                c2.setStudent(student1);
                c2.setAssignedStaff(staff1);
                c2 = complaintRepository.save(c2);

                complaintHistoryRepository.save(new ComplaintHistory(c2, null, Status.OPEN, student1, "Submitted complaint"));
                complaintHistoryRepository.save(new ComplaintHistory(c2, Status.OPEN, Status.ASSIGNED, admin, "Assigned to Robert Maintenance"));
                complaintHistoryRepository.save(new ComplaintHistory(c2, Status.ASSIGNED, Status.IN_PROGRESS, staff1, "Technician dispatched with replacement valve"));

                commentRepository.save(new Comment("Inspecting the main inlet pipe now. Will shut off water temporarily.", staff1, c2));
                commentRepository.save(new Comment("Thank you for the quick response! Please inform us when water supply resumes.", student1, c2));

                // Complaint 3: RESOLVED
                Complaint c3 = new Complaint();
                c3.setTitle("Broken ceiling fan switch in Lab 102");
                c3.setDescription("Switch board slot #3 is loose and sparking when turned on.");
                c3.setLocation("Science Complex, Floor 1");
                c3.setCategory(electrical);
                c3.setPriority(Priority.MEDIUM);
                c3.setStatus(Status.RESOLVED);
                c3.setStudent(student2 != null ? student2 : student1);
                c3.setAssignedStaff(staff1);
                c3.setResolvedAt(LocalDateTime.now().minusHours(2));
                c3 = complaintRepository.save(c3);

                complaintHistoryRepository.save(new ComplaintHistory(c3, null, Status.OPEN, student2, "Submitted complaint"));
                complaintHistoryRepository.save(new ComplaintHistory(c3, Status.OPEN, Status.ASSIGNED, admin, "Assigned to Robert Maintenance"));
                complaintHistoryRepository.save(new ComplaintHistory(c3, Status.ASSIGNED, Status.IN_PROGRESS, staff1, "Repair started"));
                complaintHistoryRepository.save(new ComplaintHistory(c3, Status.IN_PROGRESS, Status.RESOLVED, staff1, "Replaced entire switch unit and tested circuit. Working normally."));

                commentRepository.save(new Comment("Switch assembly replaced with new modular unit.", staff1, c3));
            }
            System.out.println(">>> Seeded initial demonstration complaints.");
        }
    }
}
