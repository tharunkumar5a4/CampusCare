# CampusCare — Campus Complaint Management System

CampusCare is a clean, modern, Java Full Stack web application designed for college campus complaint tracking and resolution. It provides dedicated role-based portals for **Students**, **Staff Members**, and **Administrators** to streamline campus facility maintenance and issue tracking.

---

## 1. Project Overview & Objective

CampusCare enables students to submit facility/hardware issues, track progress in real-time, communicate with assigned staff, and confirm issue resolution. Administrative staff can manage categories, assign workload to maintenance staff, modify priorities, and monitor dashboard analytics.

Key goals of this implementation:
- **Clean Monolithic Architecture**: Layered Spring Boot backend (`Controller` → `Service` → `Repository` → `MySQL`).
- **Standard Full-Stack Concepts**: Demonstrates RESTful APIs, Spring Data JPA, Hibernate ORM, Spring Security, JWT authentication, Bean Validation, and responsive Vanilla JS/CSS single page frontend.
- **Academic Review Ready**: Easy to run, understand, and explain during project reviews and vivas.

---

## 2. Key Features by Role

### 👨‍🎓 Student Role
- **Student Registration & JWT Login**: Self-service student sign up and secure authentication.
- **Submit Complaints**: Report campus issues with title, category, priority, location, detailed description, and optional file attachments.
- **Track Status**: Real-time status tracking (`OPEN` → `ASSIGNED` → `IN_PROGRESS` → `RESOLVED` → `CLOSED`).
- **Interactive Timeline & Comments**: View progress audit logs and post comments/clarifications for staff.
- **Close Complaint**: Confirm completion once staff resolves the issue.

### 🛠️ Staff Role
- **Staff Portal & Dashboard**: View complaints assigned specifically to the logged-in staff member.
- **Status Updates**: Transition assigned complaints from `ASSIGNED` → `IN_PROGRESS` → `RESOLVED`.
- **Resolution Notes & Comments**: Add technical notes explaining repairs performed for student reference.

### 👑 Administrator Role
- **Admin Dashboard & Analytics**: Real-time metrics for total complaints, status breakdowns, category distribution, and high-priority alerts.
- **Complaint Management**: View, filter (by status, category, priority, keyword), assign complaints to staff, and change priorities.
- **User Management**: Manage registered students, staff members, update user roles, and activate/deactivate accounts safely.
- **Category Management**: Create, edit, and toggle active status for complaint categories.

---

## 3. Technology Stack

- **Backend Framework**: Java 21 LTS, Spring Boot 3.2.5
- **Security**: Spring Security, JJWT (JWT Token Authentication), BCrypt Password Hashing
- **Data Access**: Spring Data JPA, Hibernate ORM
- **Database**: MySQL Server 8.0
- **Validation**: Bean Validation (`jakarta.validation`)
- **Frontend**: HTML5, Vanilla CSS3 (Custom Design System), JavaScript (ES6+ Modules), Vite Build Tool
- **Build Tool**: Maven Wrapper (`mvnw` / `mvnw.cmd`)

---

## 4. System Architecture

```
Browser (Vanilla JS Single Page App)
        ↓  (HTTP REST / JSON / JWT)
Spring Security & JwtAuthenticationFilter
        ↓
REST Controllers (com.campuscare.controller)
        ↓
Service Layer (com.campuscare.service)
        ↓
Repository Layer (com.campuscare.repository)
        ↓
MySQL Database (campuscare)
```

---

## 5. Database Schema & Entities

The application auto-creates and updates the `campuscare` MySQL database schema using JPA/Hibernate:

1. **`users`**: `id`, `name`, `email` (unique), `password` (BCrypt), `role` (`STUDENT`, `STAFF`, `ADMIN`), `phone`, `active`, `created_at`, `updated_at`.
2. **`categories`**: `id`, `name` (unique), `description`, `active`.
3. **`complaints`**: `id`, `title`, `description`, `location`, `category_id`, `priority` (`LOW`, `MEDIUM`, `HIGH`, `URGENT`), `status` (`OPEN`, `ASSIGNED`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`), `student_id`, `staff_id`, `created_at`, `updated_at`, `resolved_at`.
4. **`comments`**: `id`, `message`, `complaint_id`, `user_id`, `created_at`.
5. **`attachments`**: `id`, `file_name`, `file_path`, `file_type`, `file_size`, `complaint_id`, `uploaded_at`.
6. **`complaint_history`**: `id`, `complaint_id`, `old_status`, `new_status`, `changed_by_user_id`, `note`, `changed_at`.

---

## 6. Sample Demo Credentials

The backend automatically seeds initial test users and demonstration data on first run:

| Role | Email | Password | Description |
|---|---|---|---|
| **ADMIN** | `admin@campuscare.com` | `admin123` | System Administrator |
| **STAFF** | `staff@campuscare.com` | `staff123` | Robert Maintenance (Facility & Plumbing) |
| **STAFF** | `staff2@campuscare.com` | `staff123` | David IT Support (IT & Security) |
| **STUDENT** | `student@campuscare.com` | `student123` | Alex Morgan |
| **STUDENT** | `student2@campuscare.com` | `student123` | Emma Watson |

---

## 7. Environment Configuration

CampusCare uses externalized environment variables with sensible local defaults:

| Variable | Default Value | Description |
|---|---|---|
| `DB_URL` | `jdbc:mysql://localhost:3306/campuscare?useSSL=false&serverTimezone=UTC` | Database JDBC URL |
| `DB_USERNAME` | `root` | Database user |
| `DB_PASSWORD` | `root` | Database password |
| `JWT_SECRET` | `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970` | Secret key for signing JWT tokens |
| `UPLOAD_DIR` | `uploads` | Directory for storing file uploads |

---

## 8. Quick Start & Execution Guide

### Prerequisites
1. **Java 17 or Java 21** installed.
2. **MySQL Server 8.0** running on `localhost:3306`.
3. Create database in MySQL:
   ```sql
   CREATE DATABASE IF NOT EXISTS campuscare;
   ```

### Option A: Run Single-Port Full Stack Application (Recommended)
You can run both backend REST APIs and serve the frontend web interface directly on port `8080`:

1. Open terminal in project root.
2. Execute Spring Boot:
   ```powershell
   .\mvnw.cmd spring-boot:run
   ```
   *(On Linux/macOS use `./mvnw spring-boot:run`)*
3. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

### Option B: Run Frontend via Vite Development Server (Optional)
If modifying frontend files with hot-reloading:
```bash
npm install
npm run dev
```
Open browser at `http://localhost:5173`. Requests to `/api/*` are automatically proxied to Spring Boot backend at `http://localhost:8080`.

---

## 9. Demonstration Workflow Walkthrough

For college reviews or viva demonstrations, follow this sequence:

1. **Sign in as Student**:
   - Log in with `student@campuscare.com` / `student123`.
   - Click **Submit Complaint**. Fill details (e.g. Title: *"Air conditioning broken in Library Room 204"*), select category, priority, attach photo/file, and submit.
   - Observe initial status `OPEN` and initial entry in progress timeline.
   - Log out.

2. **Sign in as Admin**:
   - Log in with `admin@campuscare.com` / `admin123`.
   - View Admin Dashboard stats and category breakdown.
   - Click **All Complaints**, find the submitted complaint, click **Manage**.
   - Assign the complaint to staff member *"Robert Maintenance"*. Note status transitions to `ASSIGNED`.
   - Log out.

3. **Sign in as Staff**:
   - Log in with `staff@campuscare.com` / `staff123`.
   - View Assigned Complaints dashboard.
   - Open complaint and click **Start Work** (`IN_PROGRESS`).
   - Add work notes in comment box.
   - Click **Mark as RESOLVED**, entering resolution summary note.
   - Log out.

4. **Student Confirmation**:
   - Log back in as `student@campuscare.com` / `student123`.
   - Open the complaint details.
   - Inspect the complete vertical progress timeline showing all transitions (`OPEN` → `ASSIGNED` → `IN_PROGRESS` → `RESOLVED`).
   - Click **Confirm & Close Complaint** (`CLOSED`).

---

## 10. Future Enhancements

- Real-time Email & SMS notifications via Spring Mail / Twilio.
- Automatic staff assignment based on category workload algorithms.
- Cloud storage integration (AWS S3 / Azure Blob Storage).
- Mobile App interface with push notifications.
- SLA monitoring & resolution escalation triggers.
