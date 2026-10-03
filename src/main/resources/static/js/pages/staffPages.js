import { api } from '../api.js';

export const staffPages = {
  async renderDashboard(container) {
    try {
      const res = await api.staff.getDashboard();
      const stats = res.data || {};
      const recent = stats.recentComplaints || [];

      container.innerHTML = `
        <div class="card-header" style="margin-bottom: 1.5rem;">
          <div>
            <h2 class="top-bar-title">Staff Dashboard</h2>
            <p style="font-size: 0.875rem; color: var(--text-muted);">Assigned complaint assignments & resolution queue</p>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-title">Total Assigned</span>
            <span class="stat-value">${stats.totalComplaints || 0}</span>
          </div>
          <div class="stat-card">
            <span class="stat-title">Assigned (Pending)</span>
            <span class="stat-value" style="color: var(--status-assigned-text);">${stats.assignedCount || 0}</span>
          </div>
          <div class="stat-card">
            <span class="stat-title">In Progress</span>
            <span class="stat-value" style="color: var(--status-progress-text);">${stats.inProgressCount || 0}</span>
          </div>
          <div class="stat-card">
            <span class="stat-title">Resolved</span>
            <span class="stat-value" style="color: var(--status-resolved-text);">${stats.resolvedCount || 0}</span>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Assigned Complaints</h3>
            <a href="#staff/complaints" class="btn btn-secondary btn-sm">View All Queue</a>
          </div>
          ${this.renderStaffTable(recent)}
        </div>
      `;
    } catch (err) {
      container.innerHTML = `<div class="card" style="color: red;">Error: ${err.message}</div>`;
    }
  },

  async renderComplaintsList(container) {
    try {
      const res = await api.staff.getAssignedComplaints();
      const complaints = res.data || [];

      container.innerHTML = `
        <div class="card-header" style="margin-bottom: 1.5rem;">
          <div>
            <h2 class="top-bar-title">Assigned Complaints</h2>
            <p style="font-size: 0.875rem; color: var(--text-muted);">Manage and resolve assigned maintenance issues</p>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div style="display:flex; gap:0.5rem; align-items:center;">
              <span style="font-size:0.875rem; font-weight:500;">Filter by Status:</span>
              <select id="staff-status-filter" class="form-select" style="width: auto; padding: 0.35rem 0.75rem;">
                <option value="">All Statuses</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
          </div>
          <div id="staff-table-wrapper">
            ${this.renderStaffTable(complaints)}
          </div>
        </div>
      `;

      const filterEl = document.getElementById('staff-status-filter');
      filterEl.addEventListener('change', () => {
        const val = filterEl.value;
        const filtered = val ? complaints.filter(c => c.status === val) : complaints;
        document.getElementById('staff-table-wrapper').innerHTML = this.renderStaffTable(filtered);
      });
    } catch (err) {
      container.innerHTML = `<div class="card" style="color: red;">Error: ${err.message}</div>`;
    }
  },

  async renderComplaintDetails(container, id) {
    try {
      const res = await api.staff.getDetails(id);
      const c = res.data || {};

      container.innerHTML = `
        <div style="margin-bottom: 1rem;">
          <a href="#staff/complaints" style="display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.875rem; color: var(--text-muted);">
            ← Back to Assigned Complaints
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

              <!-- Staff Action Bar -->
              <div style="background-color: var(--primary-light); padding: 1.25rem; border-radius: var(--radius-sm); margin: 1.25rem 0;">
                <h4 style="font-size: 0.9rem; font-weight: 600; color: var(--primary); margin-bottom: 0.75rem;">Staff Action Panel</h4>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
                  ${c.status === 'ASSIGNED' ? `
                    <button id="start-work-btn" class="btn btn-primary btn-sm">▶ Start Work (Set IN PROGRESS)</button>
                  ` : ''}
                  
                  ${c.status === 'IN_PROGRESS' || c.status === 'ASSIGNED' ? `
                    <button id="resolve-modal-btn" class="btn btn-success btn-sm">✔ Mark as RESOLVED</button>
                  ` : ''}

                  <div style="display:flex; align-items:center; gap:0.5rem; margin-left:auto;">
                    <span style="font-size:0.85rem; font-weight:500;">Change Status:</span>
                    <select id="staff-status-select" class="form-select" style="width:auto; padding:0.35rem 0.65rem; font-size:0.85rem;">
                      <option value="ASSIGNED" ${c.status === 'ASSIGNED' ? 'selected' : ''}>ASSIGNED</option>
                      <option value="IN_PROGRESS" ${c.status === 'IN_PROGRESS' ? 'selected' : ''}>IN_PROGRESS</option>
                      <option value="RESOLVED" ${c.status === 'RESOLVED' ? 'selected' : ''}>RESOLVED</option>
                    </select>
                    <button id="update-status-btn" class="btn btn-secondary btn-sm">Update</button>
                  </div>
                </div>
              </div>

              <div style="margin: 1.25rem 0;">
                <h4 style="font-size: 0.85rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600; margin-bottom: 0.35rem;">Student Info</h4>
                <p style="font-size: 0.95rem; font-weight: 500;">👤 ${c.studentName || 'Student'} (${c.studentEmail || 'N/A'})</p>
              </div>

              <div style="margin: 1.25rem 0;">
                <h4 style="font-size: 0.85rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600; margin-bottom: 0.35rem;">Location</h4>
                <p style="font-size: 0.95rem; font-weight: 500;">📍 ${c.location}</p>
              </div>

              <div style="margin: 1.25rem 0;">
                <h4 style="font-size: 0.85rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600; margin-bottom: 0.35rem;">Description</h4>
                <p style="font-size: 0.95rem; white-space: pre-line;">${c.description}</p>
              </div>

              ${c.attachments && c.attachments.length > 0 ? `
                <div style="margin: 1.25rem 0; padding-top: 1rem; border-top: 1px solid var(--border-color);">
                  <h4 style="font-size: 0.85rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600; margin-bottom: 0.5rem;">Attachments</h4>
                  <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
                    ${c.attachments.map(att => `
                      <a href="${att.filePath}" target="_blank" class="btn btn-secondary btn-sm" style="display:inline-flex; align-items:center; gap:0.4rem;">
                        📎 ${att.fileName}
                      </a>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
            </div>

            <!-- Comments Section -->
            <div class="card">
              <h3 class="card-title" style="margin-bottom: 1rem;">Comments & Work Notes</h3>
              <div class="comments-list">
                ${c.comments && c.comments.length > 0 ? c.comments.map(cmt => `
                  <div class="comment-item">
                    <div class="comment-header">
                      <span class="comment-author">${cmt.userName} <span style="font-size:0.75rem; color:var(--primary); font-weight:600;">(${cmt.userRole})</span></span>
                      <span class="comment-time">${new Date(cmt.createdAt).toLocaleString()}</span>
                    </div>
                    <div class="comment-text">${cmt.message}</div>
                  </div>
                `).join('') : `<p style="font-size: 0.875rem; color: var(--text-muted);">No comments added yet.</p>`}
              </div>

              <form id="staff-comment-form" style="margin-top: 1rem; display: flex; gap: 0.75rem;">
                <input type="text" id="staff-comment-input" class="form-control" placeholder="Add work update / resolution note..." required />
                <button type="submit" class="btn btn-primary" style="white-space: nowrap;">Post Note</button>
              </form>
            </div>
          </div>

          <!-- Sidebar Timeline -->
          <div>
            <div class="card">
              <h3 class="card-title" style="margin-bottom: 1rem;">Metadata</h3>
              <div style="font-size: 0.875rem; display: flex; flex-direction: column; gap: 0.75rem;">
                <div>
                  <span style="color: var(--text-muted);">Category:</span>
                  <div style="font-weight: 600;">${c.categoryName || 'Uncategorized'}</div>
                </div>
                <div>
                  <span style="color: var(--text-muted);">Created Date:</span>
                  <div style="font-weight: 500;">${new Date(c.createdAt).toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div class="card">
              <h3 class="card-title" style="margin-bottom: 1rem;">Audit History</h3>
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
      const startBtn = document.getElementById('start-work-btn');
      if (startBtn) {
        startBtn.addEventListener('click', async () => {
          try {
            await api.staff.updateStatus(id, 'IN_PROGRESS', 'Work started by staff member');
            this.renderComplaintDetails(container, id);
          } catch (err) {
            alert(err.message);
          }
        });
      }

      const resolveBtn = document.getElementById('resolve-modal-btn');
      if (resolveBtn) {
        resolveBtn.addEventListener('click', async () => {
          const note = prompt('Enter resolution summary note for the student:', 'Issue inspected and successfully repaired.');
          if (note !== null) {
            try {
              await api.staff.resolveComplaint(id, note);
              this.renderComplaintDetails(container, id);
            } catch (err) {
              alert(err.message);
            }
          }
        });
      }

      const updateBtn = document.getElementById('update-status-btn');
      if (updateBtn) {
        updateBtn.addEventListener('click', async () => {
          const status = document.getElementById('staff-status-select').value;
          const note = prompt('Enter status change note:', `Status updated to ${status}`);
          if (note !== null) {
            try {
              await api.staff.updateStatus(id, status, note);
              this.renderComplaintDetails(container, id);
            } catch (err) {
              alert(err.message);
            }
          }
        });
      }

      const commentForm = document.getElementById('staff-comment-form');
      if (commentForm) {
        commentForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const msg = document.getElementById('staff-comment-input').value.trim();
          if (!msg) return;

          try {
            await api.staff.addComment(id, msg);
            this.renderComplaintDetails(container, id);
          } catch (err) {
            alert(err.message);
          }
        });
      }
    } catch (err) {
      container.innerHTML = `<div class="card" style="color: red;">Error: ${err.message}</div>`;
    }
  },

  renderStaffTable(complaints) {
    if (!complaints || complaints.length === 0) {
      return `<p style="padding: 1.5rem; text-align: center; color: var(--text-muted);">No assigned complaints.</p>`;
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
                <td>${c.studentName || 'Student'}</td>
                <td>${c.categoryName || 'General'}</td>
                <td><span class="badge priority-${c.priority}">${c.priority}</span></td>
                <td><span class="badge badge-${c.status}">${c.status}</span></td>
                <td>
                  <a href="#staff/complaints/${c.id}" class="btn btn-primary btn-sm">Manage & Resolve</a>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },
};
