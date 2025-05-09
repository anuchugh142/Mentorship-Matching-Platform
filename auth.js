// Initialize localStorage if empty
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
}

// Tab switching
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all tabs and forms
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding form
        button.classList.add('active');
        document.getElementById(`${button.dataset.tab}Form`).classList.add('active');
    });
});

// Registration form handling
document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    // Get existing users
    const users = JSON.parse(localStorage.getItem('users'));
    
    // Check if email already exists
    if (users.some(user => user.email === email)) {
        showMessage('registerMessage', 'Email already registered', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(), // Simple way to generate unique ID
        name,
        email,
        password // In a real app, this would be hashed
    };
    
    // Save user
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Save logged in user ID
    localStorage.setItem('loggedInUserId', newUser.id);
    
    // Show success message
    showMessage('registerMessage', 'Registration successful! Redirecting to profile setup...', 'success');
    
    // Redirect to profile setup after 2 seconds
    setTimeout(() => {
        window.location.href = 'profile.html';
    }, 2000);
});

// Login form handling
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Get users and profiles
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const profiles = JSON.parse(localStorage.getItem('profiles')) || [];
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Save logged in user ID
        localStorage.setItem('loggedInUserId', user.id);
        
        // Check if user has a profile
        const userProfile = profiles.find(p => p.userId === parseInt(user.id));
        
        console.log('User ID:', user.id);
        console.log('User Profile:', userProfile);
        console.log('All Profiles:', profiles);
        
        // Redirect based on profile existence
        if (userProfile) {
            console.log('Profile exists, redirecting to discover');
            showMessage('loginMessage', 'Login successful! Redirecting to discover page...', 'success');
            setTimeout(() => {
                window.location.href = 'discover.html';
            }, 1000);
        } else {
            console.log('No profile found, redirecting to profile setup');
            showMessage('loginMessage', 'Login successful! Please complete your profile...', 'success');
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 1000);
        }
    } else {
        showMessage('loginMessage', 'Invalid email or password', 'error');
    }
});

// Helper function to show messages
function showMessage(elementId, message, type) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.className = `message ${type}`;
    
    // Clear message after 3 seconds
    setTimeout(() => {
        element.textContent = '';
        element.className = 'message';
    }, 3000);
} 