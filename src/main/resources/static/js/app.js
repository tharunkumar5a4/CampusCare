import { api } from './api.js';
import { authPage } from './pages/authPage.js';
import { studentPages } from './pages/studentPages.js';
import { staffPages } from './pages/staffPages.js';
import { adminPages } from './pages/adminPages.js';

class App {
  constructor() {
    this.container = document.getElementById('app-root');
    window.addEventListener('hashchange', () => this.handleRoute());
    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  async init() {
    await this.handleRoute();
  }

  async handleRoute() {
    let hash = window.location.hash || '#login';
    const user = api.getUser();
    const token = api.getToken();

    // If unauthenticated, redirect to login unless on register
    if (!token || !user) {
      if (hash !== '#register') {
        hash = '#login';
      }
    } else if (hash === '#login' || hash === '#register') {
      // If already logged in, redirect to respective role dashboard
      if (user.role === 'STUDENT') hash = '#student/dashboard';
      else if (user.role === 'STAFF') hash = '#staff/dashboard';
      else if (user.role === 'ADMIN') hash = '#admin/dashboard';
    }

    if (hash === '#login') {
      authPage.renderLogin(this.container);
      return;
    }

    if (hash === '#register') {
      authPage.renderRegister(this.container);
      return;
    }

    // Authenticated Layout Container
    this.renderMainLayout(user, hash);
    const contentArea = document.getElementById('main-content');

    // Route Parser
    const parts = hash.replace('#', '').split('/');
    const rolePrefix = parts[0];
    const page = parts[1] || 'dashboard';
    const param = parts[2];

    // Role Security Routing Check
    if (rolePrefix.toUpperCase() !== user.role && user.role !== 'ADMIN') {
      contentArea.innerHTML = `<div class="card" style="color:red; padding:2rem;">Unauthorized Access to ${rolePrefix} section.</div>`;
      return;
    }

    // Student Routes
    if (rolePrefix === 'student') {
      if (page === 'dashboard') await studentPages.renderDashboard(contentArea);
      else if (page === 'complaints' && !param) await studentPages.renderComplaintsList(contentArea);
      else if (page === 'complaints' && param === 'new') await studentPages.renderNewComplaint(contentArea);
      else if (page === 'complaints' && param) await studentPages.renderComplaintDetails(contentArea, param);
      else await studentPages.renderDashboard(contentArea);
    }
    // Staff Routes
    else if (rolePrefix === 'staff') {
      if (page === 'dashboard') await staffPages.renderDashboard(contentArea);
      else if (page === 'complaints' && !param) await staffPages.renderComplaintsList(contentArea);
      else if (page === 'complaints' && param) await staffPages.renderComplaintDetails(contentArea, param);
      else await staffPages.renderDashboard(contentArea);
    }
    // Admin Routes
    else if (rolePrefix === 'admin') {
      if (page === 'dashboard') await adminPages.renderDashboard(contentArea);
      else if (page === 'complaints' && !param) await adminPages.renderComplaintsList(contentArea);
      else if (page === 'complaints' && param) await adminPages.renderComplaintDetails(contentArea, param);
      else if (page === 'users') await adminPages.renderUsersList(contentArea);
      else if (page === 'categories') await adminPages.renderCategoriesList(contentArea);
      else await adminPages.renderDashboard(contentArea);
    }
  }

  renderMainLayout(user, currentHash) {
    const isStudent = user.role === 'STUDENT';
    const isStaff = user.role === 'STAFF';
    const isAdmin = user.role === 'ADMIN';

    this.container.innerHTML = `
      <div id="app-layout">
        <!-- Sidebar -->
        <aside class="sidebar" id="sidebar">
          <div class="sidebar-header">
            <div class="brand-logo">CC</div>
            <div>
              <div class="brand-title">CampusCare</div>
              <div class="brand-subtitle">Campus Complaint System</div>
            </div>
          </div>

          <nav class="sidebar-nav">
            ${isStudent ? `
              <a href="#student/dashboard" class="nav-item ${currentHash.includes('dashboard') ? 'active' : ''}">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                Dashboard
              </a>
              <a href="#student/complaints" class="nav-item ${currentHash.includes('complaints') ? 'active' : ''}">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                My Complaints
              </a>
              <a href="#student/complaints/new" class="nav-item">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Submit Complaint
              </a>
            ` : ''}

            ${isStaff ? `
              <a href="#staff/dashboard" class="nav-item ${currentHash.includes('dashboard') ? 'active' : ''}">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                Dashboard
              </a>
              <a href="#staff/complaints" class="nav-item ${currentHash.includes('complaints') ? 'active' : ''}">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                Assigned Complaints
              </a>
            ` : ''}

            ${isAdmin ? `
              <a href="#admin/dashboard" class="nav-item ${currentHash.includes('dashboard') ? 'active' : ''}">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                Dashboard
              </a>
              <a href="#admin/complaints" class="nav-item ${currentHash.includes('complaints') ? 'active' : ''}">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                All Complaints
              </a>
              <a href="#admin/users" class="nav-item ${currentHash.includes('users') ? 'active' : ''}">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                User Management
              </a>
              <a href="#admin/categories" class="nav-item ${currentHash.includes('categories') ? 'active' : ''}">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
                Category Management
              </a>
            ` : ''}
          </nav>

          <div class="sidebar-footer">
            <div class="user-badge">
              <span class="user-name">${user.name}</span>
              <span class="user-role">${user.role}</span>
            </div>
            <button id="logout-btn" title="Sign Out" style="background:none; border:none; cursor:pointer; color:var(--text-muted);">
              <svg style="width:20px;height:20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            </button>
          </div>
        </aside>

        <!-- Main Wrapper -->
        <div class="main-wrapper">
          <header class="top-bar">
            <div style="display:flex; align-items:center; gap:1rem;">
              <button class="mobile-menu-btn" id="mobile-toggle">☰</button>
              <div class="top-bar-title">CampusCare Complaint Portal</div>
            </div>
            <div class="top-bar-actions">
              <span class="badge badge-RESOLVED">${user.role} PORTAL</span>
            </div>
          </header>

          <main class="content-container" id="main-content">
            <!-- Dynamic Page Content -->
          </main>
        </div>
      </div>
    `;

    // Logout Handler
    document.getElementById('logout-btn').addEventListener('click', () => {
      api.clearAuth();
      window.location.hash = '#login';
    });

    // Mobile Toggle Handler
    const mobileBtn = document.getElementById('mobile-toggle');
    const sidebar = document.getElementById('sidebar');
    if (mobileBtn && sidebar) {
      mobileBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
    }
  }
}

new App();
