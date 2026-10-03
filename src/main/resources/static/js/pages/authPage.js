import { api } from '../api.js';

export const authPage = {
  renderLogin(container) {
    container.innerHTML = `
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-brand">
            <div class="auth-brand-logo">CC</div>
            <h2 class="brand-title" style="font-size: 1.4rem;">CampusCare</h2>
            <p class="brand-subtitle">Campus Complaint Management System</p>
          </div>
          
          <form id="login-form">
            <div id="auth-alert" style="display: none; padding: 0.75rem; font-size: 0.85rem; border-radius: 6px; margin-bottom: 1rem;" class="toast-error"></div>

            <div class="form-group">
              <label class="form-label" for="login-email">Email Address</label>
              <input type="email" id="login-email" class="form-control" placeholder="e.g. student@campuscare.com" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="login-password">Password</label>
              <input type="password" id="login-password" class="form-control" placeholder="Enter your password" required />
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; padding: 0.75rem; margin-top: 0.5rem;">
              Sign In
            </button>
          </form>

          <div style="text-align: center; margin-top: 1.5rem; font-size: 0.875rem; color: var(--text-muted);">
            Don't have a student account? <a href="#register" style="font-weight: 600;">Register here</a>
          </div>

          <div style="margin-top: 2rem; padding-top: 1.25rem; border-top: 1px solid var(--border-color); font-size: 0.8rem; color: var(--text-muted);">
            <strong>Demo Credentials:</strong><br/>
            • <b>Student:</b> student@campuscare.com / student123<br/>
            • <b>Staff:</b> staff@campuscare.com / staff123<br/>
            • <b>Admin:</b> admin@campuscare.com / admin123
          </div>
        </div>
      </div>
    `;

    document.getElementById('login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const alertEl = document.getElementById('auth-alert');
      alertEl.style.display = 'none';

      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;

      try {
        const res = await api.auth.login({ email, password });
        if (res.success && res.data) {
          api.setAuth(res.data.token, res.data);
          
          // Redirect based on role
          const role = res.data.role;
          if (role === 'STUDENT') window.location.hash = '#student/dashboard';
          else if (role === 'STAFF') window.location.hash = '#staff/dashboard';
          else if (role === 'ADMIN') window.location.hash = '#admin/dashboard';
          else window.location.hash = '#login';
        }
      } catch (err) {
        alertEl.textContent = err.message || 'Invalid email or password';
        alertEl.style.display = 'block';
      }
    });
  },

  renderRegister(container) {
    container.innerHTML = `
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-brand">
            <div class="auth-brand-logo">CC</div>
            <h2 class="brand-title" style="font-size: 1.4rem;">CampusCare</h2>
            <p class="brand-subtitle">Student Registration</p>
          </div>
          
          <form id="register-form">
            <div id="register-alert" style="display: none; padding: 0.75rem; font-size: 0.85rem; border-radius: 6px; margin-bottom: 1rem;" class="toast-error"></div>

            <div class="form-group">
              <label class="form-label" for="reg-name">Full Name</label>
              <input type="text" id="reg-name" class="form-control" placeholder="e.g. Alex Morgan" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="reg-email">Campus Email</label>
              <input type="email" id="reg-email" class="form-control" placeholder="e.g. alex@campus.edu" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="reg-password">Password</label>
              <input type="password" id="reg-password" class="form-control" placeholder="Minimum 6 characters" minlength="6" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="reg-phone">Phone Number (Optional)</label>
              <input type="tel" id="reg-phone" class="form-control" placeholder="e.g. 9876543210" />
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; padding: 0.75rem; margin-top: 0.5rem;">
              Create Student Account
            </button>
          </form>

          <div style="text-align: center; margin-top: 1.5rem; font-size: 0.875rem; color: var(--text-muted);">
            Already registered? <a href="#login" style="font-weight: 600;">Sign In</a>
          </div>
        </div>
      </div>
    `;

    document.getElementById('register-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const alertEl = document.getElementById('register-alert');
      alertEl.style.display = 'none';

      const name = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const password = document.getElementById('reg-password').value;
      const phone = document.getElementById('reg-phone').value.trim();

      try {
        const res = await api.auth.register({ name, email, password, phone });
        if (res.success && res.data) {
          api.setAuth(res.data.token, res.data);
          window.location.hash = '#student/dashboard';
        }
      } catch (err) {
        alertEl.textContent = err.message || 'Registration failed';
        alertEl.style.display = 'block';
      }
    });
  },
};
