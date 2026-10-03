import { api } from '../api.js';

export const adminPages = {
  async renderDashboard(container) {
    try {
      const res = await api.admin.getDashboard();
      const stats = res.data || {};
      const categoryCounts = stats.categoryCounts || {};

      container.innerHTML = `
        <div class="card-header" style="margin-bottom: 1.5rem;">
          <div>
            <h2 class="top-bar-title">Admin Dashboard</h2>
            <p style="font-size: 0.875rem; color: var(--text-muted);">Campus Complaint Management & Analytics Overview</p>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-title">Total Complaints</span>
            <span class="stat-value">${stats.totalComplaints || 0}</span>
          </div>
          <div class="stat-card">
            <span class="stat-title">Open</span>
            <span class="stat-value" style="color: var(--status-open-text);">${stats.openCount || 0}</span>
          </div>
          <div class="stat-card">
            <span class="stat-title">In Progress</span>
            <span class="stat-value" style="color: var(--status-progress-text);">${stats.inProgressCount || 0}</span>
          </div>
          <div class="stat-card">
            <span class="stat-title">Resolved</span>
            <span class="stat-value" style="color: var(--status-resolved-text);">${stats.resolvedCount || 0}</span>
          </div>
          <div class="stat-card">
            <span class="stat-title">Total Students</span>
            <span class="stat-value">${stats.totalStudents || 0}</span>
          </div>
          <div class="stat-card">
            <span class="stat-title">Staff Members</span>
            <span class="stat-value">${stats.totalStaff || 0}</span>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem;">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Recent Complaints</h3>
              <a href="#admin/complaints" class="btn btn-secondary btn-sm">View All Complaints</a>
            </div>
            ${this.renderAdminTable(stats.recentComplaints || [])}
          </div>

          <div class="card">
            <h3 class="card-title" style="margin-bottom: 1.25rem;">Complaints by Category</h3>
            <div style="display: flex; flex-direction: column; gap: 0.85rem;">
              ${Object.entries(categoryCounts).map(([catName, count]) => `
                <div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 500; margin-bottom: 0.25rem;">
                    <span>${catName}</span>
                    <span style="font-weight: 700;">${count}</span>
                  </div>
                  <div style="background-color: var(--border-color); height: 6px; border-radius: 999px; overflow: hidden;">
                    <div style="background-color: var(--primary); height: 100%; width: ${stats.totalComplaints ? Math.min(100, Math.round((count / stats.totalComplaints) * 100)) : 0}%;"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      container.innerHTML = `<div class="card" style="color: red;">Error: ${err.message}</div>`;
    }
  },

  async renderComplaintsList(container) {
    try {
      const [compRes, catRes, staffRes] = await Promise.all([
        api.admin.getComplaints(),
        api.categories.getAll(),
        api.admin.getStaffList(),
      ]);

      const complaints = compRes.data || [];
      const categories = catRes.data || [];
      const staffList = staffRes.data || [];

      container.innerHTML = `
        <div class="card-header" style="margin-bottom: 1.5rem;">
          <div>
            <h2 class="top-bar-title">All Complaints Management</h2>
            <p style="font-size: 0.875rem; color: var(--text-muted);">Assign staff, update priorities, and manage complaint lifecycle</p>
          </div>
        </div>

        <div class="card">
          <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.25rem;">
            <input type="text" id="admin-search" class="form-control" placeholder="Search by title, location, ID..." style="max-width: 240px;" />
            
            <select id="admin-status-filter" class="form-select" style="max-width: 160px;">
              <option value="">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>

            <select id="admin-cat-filter" class="form-select" style="max-width: 180px;">
              <option value="">All Categories</option>
              ${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
            </select>

            <select id="admin-prio-filter" class="form-select" style="max-width: 150px;">
              <option value="">All Priorities</option>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="URGENT">URGENT</option>
            </select>
          </div>

          <div id="admin-table-container">
            ${this.renderAdminTable(complaints, staffList)}
          </div>
        </div>
      `;

      // Filter Handlers
      const triggerFilter = async () => {
        const search = document.getElementById('admin-search').value.trim();
        const status = document.getElementById('admin-status-filter').value;
        const categoryId = document.getElementById('admin-cat-filter').value;
        const priority = document.getElementById('admin-prio-filter').value;

        const res = await api.admin.getComplaints({ search, status, categoryId, priority });
        document.getElementById('admin-table-container').innerHTML = this.renderAdminTable(res.data || [], staffList);
        this.attachTableHandlers(container, staffList);
      };

      document.getElementById('admin-search').addEventListener('input', triggerFilter);
      document.getElementById('admin-status-filter').addEventListener('change', triggerFilter);
      document.getElementById('admin-cat-filter').addEventListener('change', triggerFilter);
      document.getElementById('admin-prio-filter').addEventListener('change', triggerFilter);

      this.attachTableHandlers(container, staffList);
    } catch (err) {
      container.innerHTML = `<div class="card" style="color: red;">Error: ${err.message}</div>`;
    }
  },

  async renderComplaintDetails(container, id) {
    try {
      const [compRes, staffRes] = await Promise.all([
        api.student.getDetails(id),
        api.admin.getStaffList(),
      ]);

      const c = compRes.data || {};
      const staffList = staffRes.data || [];

      container.innerHTML = `
        <div style="margin-bottom: 1rem;">
          <a href="#admin/complaints" style="display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.875rem; color: var(--text-muted);">
            ← Back to All Complaints
          </a>
        </div>

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem;">
          <div>
            <div class="card">
              <div class="card-header" style="align-items: flex-start; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
                <div>
                  <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem;">
                    <span class="badge badge-${c.status}">${c.status}</span>
                    <span class="badge priority-${c.priority}">${c.priority} PRIORITY</span>
                    <span style="font-size: 0.8rem; color: var(--text-muted);">ID: #${c.id}</span>
                  </div>
                  <h2 style="font-size: 1.3rem; font-weight: 700;">${c.title}</h2>
                </div>
              </div>

              <!-- Admin Controls Panel -->
              <div style="background-color: var(--bg-main); border: 1px solid var(--border-color); padding: 1.25rem; border-radius: var(--radius-sm); margin: 1.25rem 0;">
                <h4 style="font-size: 0.9rem; font-weight: 600; margin-bottom: 1rem;">Administrative Control Panel</h4>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                  <div>
                    <label class="form-label" style="font-size:0.8rem;">Assign Staff Member</label>
                    <div style="display:flex; gap:0.5rem;">
                      <select id="admin-assign-select" class="form-select">
                        <option value="">Select Staff</option>
                        ${staffList.map(s => `<option value="${s.id}" ${c.staffId === s.id ? 'selected' : ''}>${s.name} (${s.email})</option>`).join('')}
                      </select>
                      <button id="admin-assign-btn" class="btn btn-primary btn-sm">Assign</button>
                    </div>
                  </div>

                  <div>
                    <label class="form-label" style="font-size:0.8rem;">Change Priority</label>
                    <div style="display:flex; gap:0.5rem;">
                      <select id="admin-prio-select" class="form-select">
                        <option value="LOW" ${c.priority === 'LOW' ? 'selected' : ''}>LOW</option>
                        <option value="MEDIUM" ${c.priority === 'MEDIUM' ? 'selected' : ''}>MEDIUM</option>
                        <option value="HIGH" ${c.priority === 'HIGH' ? 'selected' : ''}>HIGH</option>
                        <option value="URGENT" ${c.priority === 'URGENT' ? 'selected' : ''}>URGENT</option>
                      </select>
                      <button id="admin-prio-btn" class="btn btn-secondary btn-sm">Set</button>
                    </div>
                  </div>
                </div>
              </div>

              <div style="margin: 1.25rem 0;">
                <h4 style="font-size: 0.85rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600; margin-bottom: 0.35rem;">Student</h4>
                <p style="font-size: 0.95rem; font-weight: 500;">👤 ${c.studentName || 'Student'} (${c.studentEmail})</p>
              </div>

              <div style="margin: 1.25rem 0;">
                <h4 style="font-size: 0.85rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600; margin-bottom: 0.35rem;">Location</h4>
                <p style="font-size: 0.95rem; font-weight: 500;">📍 ${c.location}</p>
              </div>

              <div style="margin: 1.25rem 0;">
                <h4 style="font-size: 0.85rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600; margin-bottom: 0.35rem;">Description</h4>
                <p style="font-size: 0.95rem; white-space: pre-line;">${c.description}</p>
              </div>
            </div>

            <!-- Comments -->
            <div class="card">
              <h3 class="card-title" style="margin-bottom: 1rem;">Comments & Notes</h3>
              <div class="comments-list">
                ${c.comments && c.comments.length > 0 ? c.comments.map(cmt => `
                  <div class="comment-item">
                    <div class="comment-header">
                      <span class="comment-author">${cmt.userName} (${cmt.userRole})</span>
                      <span class="comment-time">${new Date(cmt.createdAt).toLocaleString()}</span>
                    </div>
                    <div class="comment-text">${cmt.message}</div>
                  </div>
                `).join('') : `<p style="font-size:0.875rem; color:var(--text-muted);">No comments</p>`}
              </div>
            </div>
          </div>

          <!-- Timeline Sidebar -->
          <div>
            <div class="card">
              <h3 class="card-title" style="margin-bottom: 1rem;">Full Audit Timeline</h3>
              <div class="timeline">
                ${c.history && c.history.length > 0 ? c.history.map(h => `
                  <div class="timeline-item">
                    <div class="timeline-marker"></div>
                    <div class="timeline-content">
                      <div class="timeline-header">
                        <span class="timeline-title">${h.newStatus}</span>
                        <span class="timeline-date">${new Date(h.changedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <div class="timeline-note">${h.note || ''}</div>
                      <div style="font-size:0.75rem; color:var(--text-light); margin-top:0.25rem;">By ${h.changedByName || 'System'}</div>
                    </div>
                  </div>
                `).join('') : '<p style="font-size: 0.85rem; color: var(--text-muted);">No history</p>'}
              </div>
            </div>
          </div>
        </div>
      `;

      // Handlers
      document.getElementById('admin-assign-btn').addEventListener('click', async () => {
        const staffId = document.getElementById('admin-assign-select').value;
        if (!staffId) return alert('Select a staff member first');
        try {
          await api.admin.assignStaff(id, staffId, 'Staff assigned by Administrator');
          this.renderComplaintDetails(container, id);
        } catch (err) {
          alert(err.message);
        }
      });

      document.getElementById('admin-prio-btn').addEventListener('click', async () => {
        const priority = document.getElementById('admin-prio-select').value;
        try {
          await api.admin.updatePriority(id, priority);
          this.renderComplaintDetails(container, id);
        } catch (err) {
          alert(err.message);
        }
      });
    } catch (err) {
      container.innerHTML = `<div class="card" style="color: red;">Error: ${err.message}</div>`;
    }
  },

  async renderUsersList(container) {
    try {
      const res = await api.admin.getUsers();
      const users = res.data || [];

      container.innerHTML = `
        <div class="card-header" style="margin-bottom: 1.5rem;">
          <div>
            <h2 class="top-bar-title">User Management</h2>
            <p style="font-size: 0.875rem; color: var(--text-muted);">Manage registered students, staff members, and administrators</p>
          </div>
        </div>

        <div class="card">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${users.map(u => `
                  <tr>
                    <td>#${u.id}</td>
                    <td style="font-weight:600;">${u.name}</td>
                    <td>${u.email}</td>
                    <td>${u.phone || 'N/A'}</td>
                    <td>
                      <select class="form-select role-select" data-id="${u.id}" style="padding:0.25rem 0.5rem; font-size:0.8rem; width:auto;">
                        <option value="STUDENT" ${u.role === 'STUDENT' ? 'selected' : ''}>STUDENT</option>
                        <option value="STAFF" ${u.role === 'STAFF' ? 'selected' : ''}>STAFF</option>
                        <option value="ADMIN" ${u.role === 'ADMIN' ? 'selected' : ''}>ADMIN</option>
                      </select>
                    </td>
                    <td>
                      <span class="badge ${u.active ? 'badge-RESOLVED' : 'badge-CLOSED'}">
                        ${u.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button class="btn btn-secondary btn-sm toggle-user-btn" data-id="${u.id}">
                        ${u.active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;

      // Role change handler
      container.querySelectorAll('.role-select').forEach(sel => {
        sel.addEventListener('change', async (e) => {
          const id = e.target.dataset.id;
          const role = e.target.value;
          try {
            await api.admin.updateUserRole(id, role);
            alert(`User #${id} role updated to ${role}`);
          } catch (err) {
            alert(err.message);
            this.renderUsersList(container);
          }
        });
      });

      // Toggle status handler
      container.querySelectorAll('.toggle-user-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const id = e.target.dataset.id;
          try {
            await api.admin.toggleUserStatus(id);
            this.renderUsersList(container);
          } catch (err) {
            alert(err.message);
          }
        });
      });
    } catch (err) {
      container.innerHTML = `<div class="card" style="color: red;">Error: ${err.message}</div>`;
    }
  },

  async renderCategoriesList(container) {
    try {
      const res = await api.categories.getAll();
      const categories = res.data || [];

      container.innerHTML = `
        <div class="card-header" style="margin-bottom: 1.5rem;">
          <div>
            <h2 class="top-bar-title">Complaint Categories Management</h2>
            <p style="font-size: 0.875rem; color: var(--text-muted);">Manage campus issue classification categories</p>
          </div>
          <button id="add-cat-btn" class="btn btn-primary">+ Add New Category</button>
        </div>

        <div class="card">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Category Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${categories.map(c => `
                  <tr>
                    <td>#${c.id}</td>
                    <td style="font-weight: 600;">${c.name}</td>
                    <td>${c.description || 'N/A'}</td>
                    <td>
                      <span class="badge ${c.active ? 'badge-RESOLVED' : 'badge-CLOSED'}">
                        ${c.active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td>
                      <button class="btn btn-secondary btn-sm edit-cat-btn" data-id="${c.id}" data-name="${c.name}" data-desc="${c.description || ''}" data-active="${c.active}">Edit</button>
                      ${c.active ? `<button class="btn btn-danger btn-sm delete-cat-btn" data-id="${c.id}">Deactivate</button>` : ''}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;

      // Add Category modal/prompt
      document.getElementById('add-cat-btn').addEventListener('click', async () => {
        const name = prompt('Enter new category name:');
        if (!name) return;
        const description = prompt('Enter description (optional):', '');

        try {
          await api.categories.create({ name, description, active: true });
          this.renderCategoriesList(container);
        } catch (err) {
          alert(err.message);
        }
      });

      // Edit Category
      container.querySelectorAll('.edit-cat-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const id = e.target.dataset.id;
          const oldName = e.target.dataset.name;
          const oldDesc = e.target.dataset.desc;
          const oldActive = e.target.dataset.active === 'true';

          const name = prompt('Update category name:', oldName);
          if (!name) return;
          const description = prompt('Update description:', oldDesc);

          try {
            await api.categories.update(id, { name, description, active: oldActive });
            this.renderCategoriesList(container);
          } catch (err) {
            alert(err.message);
          }
        });
      });

      // Deactivate Category
      container.querySelectorAll('.delete-cat-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const id = e.target.dataset.id;
          if (confirm('Deactivate this category?')) {
            try {
              await api.categories.delete(id);
              this.renderCategoriesList(container);
            } catch (err) {
              alert(err.message);
            }
          }
        });
      });
    } catch (err) {
      container.innerHTML = `<div class="card" style="color: red;">Error: ${err.message}</div>`;
    }
  },

  renderAdminTable(complaints, staffList = []) {
    if (!complaints || complaints.length === 0) {
      return `<p style="padding: 1.5rem; text-align: center; color: var(--text-muted);">No complaints matching current filters.</p>`;
    }

    return `
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Student</th>
              <th>Category</th>
              <th>Staff Assigned</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${complaints.map(c => `
              <tr>
                <td style="font-weight: 600;">#${c.id}</td>
                <td>
                  <div style="font-weight: 600;">${c.title}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">📍 ${c.location}</div>
                </td>
                <td style="font-size: 0.85rem;">${c.studentName || 'Student'}</td>
                <td>${c.categoryName || 'General'}</td>
                <td style="font-size: 0.85rem;">
                  ${c.staffName ? `👤 ${c.staffName}` : '<span style="color:var(--text-light); font-style:italic;">Unassigned</span>'}
                </td>
                <td><span class="badge priority-${c.priority}">${c.priority}</span></td>
                <td><span class="badge badge-${c.status}">${c.status}</span></td>
                <td>
                  <a href="#admin/complaints/${c.id}" class="btn btn-secondary btn-sm">Manage</a>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  attachTableHandlers(container, staffList) {},
};
