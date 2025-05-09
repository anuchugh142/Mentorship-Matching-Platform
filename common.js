// Load navbar
function loadNavbar() {
    const navbar = `
        <nav class="navbar">
            <div class="nav-brand">
                <a href="discover.html">Mentor Platform</a>
            </div>
            <div class="nav-links">
                <a href="discover.html" class="nav-link">Discover</a>
                <a href="requests.html" class="nav-link">Requests</a>
                <a href="profile.html" class="nav-link">Profile</a>
                <button onclick="logout()" class="nav-link logout-btn">Logout</button>
            </div>
        </nav>
    `;
    document.body.insertAdjacentHTML('afterbegin', navbar);
    highlightCurrentPage();
}

// Highlight current page in navbar
function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// Logout function
function logout() {
    localStorage.removeItem('loggedInUserId');
    window.location.href = 'index.html';
}

// Show toast notification
function showToast(message, type = 'success') {
    const toastContainer = document.querySelector('.toast-container') || 
        (() => {
            const container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
            return container;
        })();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Show loading indicator
function showLoading() {
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(loading);
}

// Hide loading indicator
function hideLoading() {
    const loading = document.querySelector('.loading');
    if (loading) {
        loading.remove();
    }
}

// Sanitize input to prevent XSS
function sanitizeInput(input) {
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Normalize whitespace and trim
function normalizeInput(input) {
    return input
        .trim()
        .replace(/\s+/g, ' ');
}

// Validate email format
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Check if user is logged in
function checkAuth() {
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    if (!loggedInUserId) {
        window.location.href = 'index.html';
    }
    return loggedInUserId;
}

// Call loadNavbar when the page loads
document.addEventListener('DOMContentLoaded', loadNavbar); 