import { api } from '../api.js';

export const studentPages = {
  async renderDashboard(container) {
    try {
      const res = await api.student.getDashboard();
      const stats = res.data || {};
      const recent = stats.recentComplaints || [];

      container.innerHTML = `
        <div class="card-header" style="margin-bottom: 1.5rem;">
          <div>
            <h2 class="top-bar-title">Student Dashboard</h2>
            <p style="font-size: 0.875rem; color: var(--text-muted);">Overview of your submitted complaints</p>
          </div>
          <a href="#student/complaints/new" class="btn btn-primary">
            <svg style="width:16px;height:16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Submit Complaint
          </a>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-title">Total Submitted</span>
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
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Recent Complaints</h3>
            <a href="#student/complaints" class="btn btn-secondary btn-sm">View All</a>
          </div>
          ${this.renderComplaintsTable(recent)}
        </div>
      `;
    } catch (err) {
      container.innerHTML = `<div class="card" style="color: red;">Error loading dashboard: ${err.message}</div>`;
    }
  },

  async renderComplaintsList(container) {
    try {
      const res = await api.student.getComplaints();
      const complaints = res.data || [];

      container.innerHTML = `
        <div class="card-header" style="margin-bottom: 1.5rem;">
          <div>
            <h2 class="top-bar-title">My Complaints</h2>
            <p style="font-size: 0.875rem; color: var(--text-muted);">Track and manage your reported issues</p>
          </div>
          <a href="#student/complaints/new" class="btn btn-primary">Submit Complaint</a>
        </div>

        <div class="card">
          <div class="card-header">
            <div style="display:flex; gap:0.5rem; align-items:center;">
              <span style="font-size:0.875rem; font-weight:500;">Filter by Status:</span>
              <select id="status-filter" class="form-select" style="width: auto; padding: 0.35rem 0.75rem;">
                <option value="">All Statuses</option>
                <option value="OPEN">Open</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
          </div>
          <div id="table-wrapper">
            ${this.renderComplaintsTable(complaints)}
          </div>
        </div>
      `;

      const filterEl = document.getElementById('status-filter');
      filterEl.addEventListener('change', () => {
        const val = filterEl.value;
        const filtered = val ? complaints.filter(c => c.status === val) : complaints;
        document.getElementById('table-wrapper').innerHTML = this.renderComplaintsTable(filtered);
      });
    } catch (err) {
      container.innerHTML = `<div class="card" style="color: red;">Error loading complaints: ${err.message}</div>`;
    }
  },

  async renderNewComplaint(container) {
    try {
      const catRes = await api.categories.getActive();
      const categories = catRes.data || [];

      container.innerHTML = `
        <div class="card" style="max-width: 680px; margin: 0 auto;">
          <div class="card-header" style="border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
            <h2 class="card-title" style="font-size: 1.25rem;">Submit New Complaint</h2>
          </div>

          <form id="new-complaint-form" style="margin-top: 1.25rem;">
            <div id="form-error" style="display: none; padding: 0.75rem; border-radius: 6px; margin-bottom: 1rem;" class="toast-error"></div>

            <div class="form-group">
              <label class="form-label" for="comp-title">Complaint Title *</label>
              <input type="text" id="comp-title" class="form-control" placeholder="Brief summary of the issue (e.g. Projector HDMI port broken)" required />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label" for="comp-category">Category *</label>
                <select id="comp-category" class="form-select" required>
                  <option value="">Select Category</option>
                  ${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" for="comp-priority">Priority</label>
                <select id="comp-priority" class="form-select">
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM" selected>MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="URGENT">URGENT</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="comp-location">Location / Building / Room *</label>
              <input type="text" id="comp-location" class="form-control" placeholder="e.g. Academic Block B, Room 302" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="comp-description">Detailed Description *</label>
              <textarea id="comp-description" class="form-control" placeholder="Describe the issue in detail so staff can resolve it effectively..." required></textarea>
            </div>

            <div class="form-group">
              <label class="form-label" for="comp-file">Optional Attachment (Photo / Document)</label>
              <input type="file" id="comp-file" class="form-control" accept="image/*,.pdf,.doc,.docx" />
            </div>

            <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem;">
              <a href="#student/complaints" class="btn btn-secondary">Cancel</a>
              <button type="submit" class="btn btn-primary">Submit Complaint</button>
            </div>
          </form>
        </div>
      `;

      document.getElementById('new-complaint-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const errEl = document.getElementById('form-error');
        errEl.style.display = 'none';

        const formData = new FormData();
        formData.append('title', document.getElementById('comp-title').value.trim());
        formData.append('categoryId', document.getElementById('comp-category').value);
        formData.append('priority', document.getElementById('comp-priority').value);
        formData.append('location', document.getElementById('comp-location').value.trim());
        formData.append('description', document.getElementById('comp-description').value.trim());

        const fileInput = document.getElementById('comp-file');
        if (fileInput.files.length > 0) {
          formData.append('file', fileInput.files[0]);
        }

        try {
          const res = await api.student.createComplaint(formData);
          if (res.success && res.data) {
            window.location.hash = `#student/complaints/${res.data.id}`;
          }
        } catch (err) {
          errEl.textContent = err.message || 'Failed to submit complaint';
          errEl.style.display = 'block';
        }
      });
    } catch (err) {
      container.innerHTML = `<div class="card" style="color: red;">Error: ${err.message}</div>`;
    }
  },

  async renderComplaintDetails(container, id) {
    try {
      const res = await api.student.getDetails(id);
      const c = res.data || {};

      container.innerHTML = `
        <div style="margin-bottom: 1rem;">
          <a href="#student/complaints" style="display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.875rem; color: var(--text-muted);">
            ← Back to My Complaints
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
                ${c.status === 'RESOLVED' ? `
                  <button id="close-btn" class="btn btn-success btn-sm">Confirm & Close Complaint</button>
                ` : ''}
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
              <h3 class="card-title" style="margin-bottom: 1rem;">Discussion & Support Comments</h3>
              
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

              ${c.status !== 'CLOSED' ? `
                <form id="comment-form" style="margin-top: 1rem; display: flex; gap: 0.75rem;">
                  <input type="text" id="comment-input" class="form-control" placeholder="Write a comment..." required />
                  <button type="submit" class="btn btn-primary" style="white-space: nowrap;">Send</button>
                </form>
              ` : ''}
            </div>
          </div>

          <!-- Sidebar Timeline & Info -->
          <div>
            <div class="card">
              <h3 class="card-title" style="margin-bottom: 1rem;">Complaint Details</h3>
              <div style="font-size: 0.875rem; display: flex; flex-direction: column; gap: 0.75rem;">
                <div>
                  <span style="color: var(--text-muted);">Category:</span>
                  <div style="font-weight: 600;">${c.categoryName || 'Uncategorized'}</div>
                </div>
                <div>
                  <span style="color: var(--text-muted);">Assigned Staff:</span>
                  <div style="font-weight: 600;">${c.staffName ? `👤 ${c.staffName}` : 'Unassigned'}</div>
                </div>
                <div>
                  <span style="color: var(--text-muted);">Created On:</span>
                  <div style="font-weight: 500;">${new Date(c.createdAt).toLocaleString()}</div>
                </div>
                ${c.resolvedAt ? `
                  <div>
                    <span style="color: var(--text-muted);">Resolved On:</span>
                    <div style="font-weight: 500; color: var(--status-resolved-text);">${new Date(c.resolvedAt).toLocaleString()}</div>
                  </div>
                ` : ''}
              </div>
            </div>

            <!-- Vertical Timeline -->
            <div class="card">
              <h3 class="card-title" style="margin-bottom: 1rem;">Progress Timeline</h3>
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
                      <div style="font-size:0.75rem; color:var(--text-light); margin-top:0.25rem;">By ${h.changedByName || 'System'} (${h.changedByRole})</div>
                    </div>
                  </div>
                `).join('') : '<p style="font-size: 0.85rem; color: var(--text-muted);">No history record</p>'}
              </div>
            </div>
          </div>
        </div>
      `;

      // Handlers
      const closeBtn = document.getElementById('close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', async () => {
          if (confirm('Are you sure you want to close this complaint?')) {
            try {
              await api.student.closeComplaint(id);
              this.renderComplaintDetails(container, id);
            } catch (err) {
              alert(err.message);
            }
          }
        });
      }

      const commentForm = document.getElementById('comment-form');
      if (commentForm) {
        commentForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const input = document.getElementById('comment-input');
          const msg = input.value.trim();
          if (!msg) return;

          try {
            await api.student.addComment(id, msg);
            this.renderComplaintDetails(container, id);
          } catch (err) {
            alert(err.message);
          }
        });
      }
    } catch (err) {
      container.innerHTML = `<div class="card" style="color: red;">Error loading complaint details: ${err.message}</div>`;
    }
  },

  renderComplaintsTable(complaints) {
    if (!complaints || complaints.length === 0) {
      return `<p style="padding: 1.5rem; text-align: center; color: var(--text-muted);">No complaints found.</p>`;
    }

    return `
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Created Date</th>
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
                <td>${c.categoryName || 'General'}</td>
                <td><span class="badge priority-${c.priority}">${c.priority}</span></td>
                <td><span class="badge badge-${c.status}">${c.status}</span></td>
                <td style="font-size: 0.85rem; color: var(--text-muted);">${new Date(c.createdAt).toLocaleDateString()}</td>
                <td>
                  <a href="#student/complaints/${c.id}" class="btn btn-secondary btn-sm">View Details</a>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },
};
