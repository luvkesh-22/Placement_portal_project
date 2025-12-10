// ===== STATE MANAGEMENT =====
const state = {
  user: null,
  jobs: [],
  applications: [],
  users: [
    { id: 1, email: 'admin@placement.com', password: 'Admin@123', fullName: 'Placement Officer', role: 'admin' },
    { id: 2, email: 'student1@college.com', password: 'Student@123', fullName: 'Rajesh Kumar', role: 'student' },
    { id: 3, email: 'student2@college.com', password: 'Student@123', fullName: 'Priya Sharma', role: 'student' }
  ],
  sampleJobs: [
    {
      id: 1,
      company: 'JP Morgan Chase',
      title: 'Senior Software Engineer',
      location: 'Mumbai',
      salary: '20,00,000 - 25,00,000',
      skills: ['Java', 'Spring Boot', 'AWS'],
      description: 'Backend development role with cutting-edge fintech solutions.',
      deadline: '2025-12-31',
      applications: 127,
      minCGPA: 8.0
    },
    {
      id: 2,
      company: 'Amazon',
      title: 'SDE Internship',
      location: 'Bangalore',
      salary: '15,00,000 - 18,00,000',
      skills: ['Python', 'JavaScript', 'System Design'],
      description: '6-month internship with Amazon tech division.',
      deadline: '2026-01-15',
      applications: 89,
      minCGPA: 7.5
    },
    {
      id: 3,
      company: 'Google',
      title: 'Associate Product Manager',
      location: 'Hyderabad',
      salary: '16,00,000 - 20,00,000',
      skills: ['Analytics', 'Leadership', 'Product Management'],
      description: 'Shape next-generation Google products.',
      deadline: '2026-01-20',
      applications: 156,
      minCGPA: 8.5
    },
    {
      id: 4,
      company: 'Microsoft',
      title: 'Cloud Solutions Architect',
      location: 'Delhi',
      salary: '17,00,000 - 22,00,000',
      skills: ['Azure', 'AWS', 'Infrastructure'],
      description: 'Design enterprise cloud solutions.',
      deadline: '2026-02-10',
      applications: 73,
      minCGPA: 8.2
    },
    {
      id: 5,
      company: 'Accenture',
      title: 'Associate Software Engineer',
      location: 'Pune',
      salary: '7,00,000 - 9,00,000',
      skills: ['Java', 'SQL', 'Web Development'],
      description: 'Entry-level role for fresh graduates.',
      deadline: '2025-12-25',
      applications: 312,
      minCGPA: 6.5
    }
  ]
};


// ===== INITIALIZE APP =====
function initApp() {
  // Load users (including newly signed up students)
  const savedUsers = localStorage.getItem('users');
  if (savedUsers) {
    state.users = JSON.parse(savedUsers);
  }

  // Load data from localStorage
  const savedJobs = localStorage.getItem('jobs');
  const savedApps = localStorage.getItem('applications');
  const savedUser = localStorage.getItem('user');
  
  if (savedJobs) state.jobs = JSON.parse(savedJobs);
  else state.jobs = state.sampleJobs;
  
  if (savedApps) state.applications = JSON.parse(savedApps);
  if (savedUser) state.user = JSON.parse(savedUser);
  
  render();
  attachEventListeners();
}


// ===== MAIN RENDER FUNCTION =====
function render() {
  const app = document.getElementById('app');
  const navUserName = document.getElementById('navUserName');
  const navLogoutBtn = document.getElementById('navLogoutBtn');
  const sidebar = document.getElementById('sidebar');

  if (!state.user) {
    app.innerHTML = renderLoginPage();
    navUserName.textContent = 'Guest';
    navLogoutBtn.classList.add('hidden');
    if (sidebar) sidebar.classList.add('hidden');
  } else {
    if (sidebar) sidebar.classList.remove('hidden');
    if (state.user.role === 'admin') {
      app.innerHTML = renderAdminDashboard();
    } else {
      app.innerHTML = renderStudentDashboard();
    }
    navUserName.textContent = state.user.fullName;
    navLogoutBtn.classList.remove('hidden');
  }

  attachEventListeners(); // reattach for newly rendered content
}


// ===== LOGIN PAGE =====
function renderLoginPage() {
  return `
    <div class="hero">
      <h1>College Placement Portal</h1>
      <p>Your Gateway to Career Success</p>
      <div class="hero-stats">
        <div class="stat-card">
          <div class="stat-value">50+</div>
          <div class="stat-label">Companies</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">1,250+</div>
          <div class="stat-label">Applications</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">92%</div>
          <div class="stat-label">Placement Rate</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">₹15L</div>
          <div class="stat-label">Avg Salary</div>
        </div>
      </div>
    </div>

    <div class="card text-center" style="max-width: 450px; margin: 24px auto;">
      <div class="card-body">
        <h2 style="margin-bottom: 16px;">Sign In</h2>
        <p style="color: var(--dark-text-secondary); margin-bottom: 24px;">
          Use demo credentials to explore admin and student views
        </p>
        <form id="loginForm">
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" id="loginEmail" class="form-control" placeholder="admin@placement.com" required>
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" id="loginPassword" class="form-control" placeholder="Admin@123" required>
          </div>
          <button type="submit" class="btn btn-primary btn-full">Sign In</button>
        </form>
        <div style="margin-top: 20px; font-size: 13px; color: var(--dark-text-secondary);">
          <strong>Admin:</strong> admin@placement.com / Admin@123<br>
          <strong>Student:</strong> student1@college.com / Student@123
        </div>
        <div style="margin-top: 16px; font-size: 13px;">
          New student?
          <button type="button" class="btn btn-secondary btn-sm" id="openSignupBtn">
            Create Account
          </button>
        </div>
      </div>
    </div>
  `;
}


// ===== ADMIN DASHBOARD =====
function renderAdminDashboard() {
  const totalApps = state.applications.length;
  const placed = state.applications.filter(a => a.status === 'selected').length;
  
  return `
    <h1 style="margin-bottom: 24px;">Admin Dashboard</h1>
    
    <div class="dashboard-grid">
      <div class="metric-card">
        <div class="metric-value">${state.jobs.length}</div>
        <div class="metric-label">Active Jobs</div>
      </div>
      <div class="metric-card">
        <div class="metric-value">${totalApps}</div>
        <div class="metric-label">Total Applications</div>
      </div>
      <div class="metric-card">
        <div class="metric-value">${placed}</div>
        <div class="metric-label">Placements</div>
      </div>
      <div class="metric-card">
        <div class="metric-value">₹15L</div>
        <div class="metric-label">Avg Salary</div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">Job Postings</div>
      <div class="card-body">
        <button class="btn btn-primary mb-16" onclick="openCreateJobModal()">+ Create New Job</button>
        <table>
          <thead>
            <tr>
              <th>Company</th>
              <th>Title</th>
              <th>Location</th>
              <th>Applications</th>
              <th>Deadline</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${state.jobs.map(job => `
              <tr>
                <td><strong>${job.company}</strong></td>
                <td>${job.title}</td>
                <td>${job.location}</td>
                <td><span class="badge badge-info">${job.applications}</span></td>
                <td>${job.deadline}</td>
                <td>
                  <button class="btn btn-secondary btn-sm" onclick="editJob(${job.id})">Edit</button>
                  <button class="btn btn-outline btn-sm" onclick="deleteJob(${job.id})">Delete</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div class="card">
      <div class="card-header">Recent Applications</div>
      <div class="card-body">
        ${state.applications.length ? `
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Job</th>
                <th>Applied</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${state.applications.slice(0, 10).map(app => `
                <tr>
                  <td>${app.studentName}</td>
                  <td>${app.jobTitle}</td>
                  <td>${app.appliedDate}</td>
                  <td><span class="badge ${getStatusBadgeClass(app.status)}">${app.status}</span></td>
                  <td>
                    <select onchange="updateApplicationStatus(${app.id}, this.value)" style="padding: 4px 8px; font-size: 12px;">
                      <option value="pending" ${app.status === 'pending' ? 'selected' : ''}>Pending</option>
                      <option value="shortlisted" ${app.status === 'shortlisted' ? 'selected' : ''}>Shortlisted</option>
                      <option value="selected" ${app.status === 'selected' ? 'selected' : ''}>Selected</option>
                      <option value="rejected" ${app.status === 'rejected' ? 'selected' : ''}>Rejected</option>
                    </select>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <button class="btn btn-primary mt-16" onclick="exportCSV()">📥 Export CSV</button>
        ` : '<p style="color: var(--dark-text-secondary);">No applications yet.</p>'}
      </div>
    </div>
  `;
}


// ===== STUDENT DASHBOARD =====
function renderStudentDashboard() {
  const studentApps = state.applications.filter(a => a.studentEmail === state.user.email);
  const shortlisted = studentApps.filter(a => a.status === 'shortlisted').length;
  
  return `
    <h1>Welcome, ${state.user.fullName}! 👋</h1>
    
    <div class="dashboard-grid">
      <div class="metric-card">
        <div class="metric-value">${studentApps.length}</div>
        <div class="metric-label">Jobs Applied</div>
      </div>
      <div class="metric-card">
        <div class="metric-value">${shortlisted}</div>
        <div class="metric-label">Shortlisted</div>
      </div>
      <div class="metric-card">
        <div class="metric-value">${state.jobs.length}</div>
        <div class="metric-label">Active Jobs</div>
      </div>
      <div class="metric-card">
        <div class="metric-value">₹15L</div>
        <div class="metric-label">Avg Package</div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">Available Jobs</div>
      <div class="card-body">
        ${state.jobs.map(job => `
          <div class="job-card" onclick="openJobDetails(${job.id})">
            <div class="job-header">
              <div>
                <div class="job-title">${job.title}</div>
                <div class="job-company">${job.company}</div>
              </div>
              <span class="badge badge-info">${job.applications} apps</span>
            </div>
            <div class="job-meta">
              <span>📍 ${job.location}</span>
              <span>💰 ₹${job.salary}</span>
              <span>📅 ${job.deadline}</span>
              <span>CGPA ≥ ${job.minCGPA}</span>
            </div>
            <div class="job-skills">
              ${job.skills.map(skill => `<span class="tag tag-${skill.toLowerCase().replace(/\s+/g, '-')}">${skill}</span>`).join('')}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid var(--dark-border);">
              <span style="color: var(--accent-green); font-weight: 600;">₹${job.salary}</span>
              <button class="btn btn-primary btn-sm" onclick="applyJob(event, ${job.id})">Apply Now</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="card">
      <div class="card-header">My Applications</div>
      <div class="card-body">
        ${studentApps.length ? `
          <table>
            <thead>
              <tr>
                <th>Job</th>
                <th>Company</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${studentApps.map(app => `
                <tr>
                  <td>${app.jobTitle}</td>
                  <td>${app.company}</td>
                  <td>${app.appliedDate}</td>
                  <td><span class="badge ${getStatusBadgeClass(app.status)}">${app.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : '<p style="color: var(--dark-text-secondary);">No applications yet. Start applying!</p>'}
      </div>
    </div>
  `;
}


// ===== UTILITY FUNCTIONS =====
function getStatusBadgeClass(status) {
  const classes = {
    'pending': 'badge-warning',
    'shortlisted': 'badge-info',
    'selected': 'badge-success',
    'rejected': 'badge-danger'
  };
  return classes[status] || 'badge-info';
}

function showToast(message, type = 'info') {
  const toastRoot = document.getElementById('toast-root');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toastRoot.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function closeModal() {
  document.getElementById('modal-root').classList.remove('show');
}


// ===== AUTH FUNCTIONS =====
function login(email, password) {
  const user = state.users.find(u => u.email === email && u.password === password);
  if (!user) {
    showToast('Invalid credentials!', 'error');
    return false;
  }
  
  state.user = { ...user };
  localStorage.setItem('user', JSON.stringify(state.user));
  render();
  showToast('Login successful!', 'success');
  return true;
}

function logout() {
  state.user = null;
  localStorage.removeItem('user');
  render();
  showToast('Logged out successfully', 'info');
}


// ===== SIGNUP FUNCTIONS =====
function openSignupModal() {
  const modalRoot = document.getElementById('modal-root');
  modalRoot.innerHTML = `
    <div class="modal-content">
      <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 20px;border-bottom:1px solid var(--dark-border);background:var(--dark-bg-elevated);">
        <h2>Student Signup</h2>
        <button onclick="closeModal()" style="background:none;border:none;font-size:22px;color:var(--dark-text-secondary);cursor:pointer;">&times;</button>
      </div>
      <div style="padding:20px;">
        <form id="signupForm">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" id="signupName" class="form-control" required>
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" id="signupEmail" class="form-control" required>
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" id="signupPassword" class="form-control" required>
          </div>
          <div class="form-group">
            <label class="form-label">Confirm Password</label>
            <input type="password" id="signupConfirm" class="form-control" required>
          </div>
          <button type="submit" class="btn btn-primary btn-full">Create Account</button>
        </form>
      </div>
    </div>
  `;
  modalRoot.classList.add('show');

  const form = document.getElementById('signupForm');
  form.addEventListener('submit', handleSignup);
}

function handleSignup(e) {
  e.preventDefault();
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value.trim();
  const confirm = document.getElementById('signupConfirm').value.trim();

  if (!name || !email || !password || !confirm) {
    showToast('Please fill all fields', 'warning');
    return;
  }
  if (password !== confirm) {
    showToast('Passwords do not match', 'error');
    return;
  }

  const existing = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    showToast('Email already registered. Please login.', 'warning');
    return;
  }

  const newUser = {
    id: state.users.length ? Math.max(...state.users.map(u => u.id)) + 1 : 1,
    email,
    password,
    fullName: name,
    role: 'student'
  };

  state.users.push(newUser);
  localStorage.setItem('users', JSON.stringify(state.users));

  showToast('Account created! Logged in as student.', 'success');
  state.user = { ...newUser };
  localStorage.setItem('user', JSON.stringify(state.user));
  closeModal();
  render();
}


// ===== JOB FUNCTIONS =====
function openCreateJobModal() {
  document.getElementById('modal-root').innerHTML = `
    <div class="modal-content">
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid var(--dark-border); background: var(--dark-bg-elevated);">
        <h2>Create New Job</h2>
        <button onclick="closeModal()" style="background: none; border: none; font-size: 24px; color: var(--dark-text-secondary); cursor: pointer;">&times;</button>
      </div>
      <div style="padding: 20px;">
        <form id="jobForm">
          <div class="form-group">
            <label class="form-label">Company Name</label>
            <input type="text" id="jobCompany" class="form-control" required>
          </div>
          <div class="form-group">
            <label class="form-label">Job Title</label>
            <input type="text" id="jobTitle" class="form-control" required>
          </div>
          <div class="form-group">
            <label class="form-label">Location</label>
            <input type="text" id="jobLocation" class="form-control" required>
          </div>
          <div class="form-group">
            <label class="form-label">Salary Range</label>
            <input type="text" id="jobSalary" class="form-control" placeholder="e.g., 15,00,000 - 20,00,000" required>
          </div>
          <div class="form-group">
            <label class="form-label">Minimum CGPA</label>
            <input type="number" id="jobCGPA" class="form-control" min="0" max="10" step="0.1" value="7.0" required>
          </div>
          <div class="form-group">
            <label class="form-label">Application Deadline</label>
            <input type="date" id="jobDeadline" class="form-control" required>
          </div>
          <button type="submit" class="btn btn-primary btn-full">Create Job</button>
        </form>
      </div>
    </div>
  `;
  document.getElementById('modal-root').classList.add('show');
  
  document.getElementById('jobForm').addEventListener('submit', saveJob);
}

function saveJob(e) {
  e.preventDefault();
  const company = document.getElementById('jobCompany').value.trim();
  const title = document.getElementById('jobTitle').value.trim();
  const location = document.getElementById('jobLocation').value.trim();
  const salary = document.getElementById('jobSalary').value.trim();
  const cgpa = parseFloat(document.getElementById('jobCGPA').value);
  const deadline = document.getElementById('jobDeadline').value;

  if (!company || !title || !location || !salary || !deadline || isNaN(cgpa)) {
    showToast('Please fill all fields correctly', 'warning');
    return;
  }

  const newJob = {
    id: state.jobs.length ? Math.max(...state.jobs.map(j => j.id)) + 1 : 1,
    company,
    title,
    location,
    salary,
    skills: ['Java', 'Python'], // sample skills
    description: 'New opportunity added by admin',
    deadline,
    applications: 0,
    minCGPA: cgpa
  };
  
  state.jobs.push(newJob);
  localStorage.setItem('jobs', JSON.stringify(state.jobs));
  closeModal();
  render();
  showToast('Job created successfully!', 'success');
}

function deleteJob(id) {
  if (confirm('Are you sure you want to delete this job?')) {
    state.jobs = state.jobs.filter(job => job.id !== id);
    localStorage.setItem('jobs', JSON.stringify(state.jobs));
    render();
    showToast('Job deleted!', 'success');
  }
}

function editJob(id) {
  showToast('Edit functionality can be added as enhancement', 'info');
}

function applyJob(e, jobId) {
  e.stopPropagation();
  const job = state.jobs.find(j => j.id === jobId);
  const existing = state.applications.find(a => a.jobId === jobId && a.studentEmail === state.user.email);
  
  if (existing) {
    showToast('You have already applied for this job!', 'warning');
    return;
  }
  
  const application = {
    id: state.applications.length ? Math.max(...state.applications.map(a => a.id)) + 1 : 1,
    jobId,
    jobTitle: job.title,
    company: job.company,
    studentEmail: state.user.email,
    studentName: state.user.fullName,
    status: 'pending',
    appliedDate: new Date().toLocaleDateString()
  };
  
  state.applications.push(application);
  job.applications += 1;
  
  localStorage.setItem('applications', JSON.stringify(state.applications));
  localStorage.setItem('jobs', JSON.stringify(state.jobs));
  
  render();
  showToast('Application submitted successfully!', 'success');
}

function updateApplicationStatus(appId, status) {
  const app = state.applications.find(a => a.id === appId);
  if (app) {
    app.status = status;
    localStorage.setItem('applications', JSON.stringify(state.applications));
    render();
    showToast(`Status updated to ${status}!`, 'success');
  }
}

function exportCSV() {
  if (!state.applications.length) {
    showToast('No applications to export', 'warning');
    return;
  }
  
  const headers = ['Student Name', 'Email', 'Job Title', 'Company', 'Applied Date', 'Status'];
  const rows = state.applications.map(app => [
    app.studentName,
    app.studentEmail,
    app.jobTitle,
    app.company,
    app.appliedDate,
    app.status
  ]);
  
  let csv = headers.join(',') + '\n';
  rows.forEach(row => csv += row.join(',') + '\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'placement-applications.csv';
  a.click();
  URL.revokeObjectURL(url);
  
  showToast('CSV exported successfully!', 'success');
}

function openJobDetails(id) {
  showToast('Job details view coming soon!', 'info');
}


// ===== EVENT LISTENERS =====
function attachEventListeners() {
  // Login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value.trim();
      login(email, password);
    });
  }
  
  // Signup open button (on login page)
  const signupBtn = document.getElementById('openSignupBtn');
  if (signupBtn) {
    signupBtn.addEventListener('click', openSignupModal);
  }

  // Logout button
  const logoutBtn = document.getElementById('navLogoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
}


// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', initApp);
