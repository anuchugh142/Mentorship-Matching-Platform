// Check if user is logged in
const loggedInUserId = localStorage.getItem('loggedInUserId');
if (!loggedInUserId) {
    window.location.href = 'index.html';
}

// Get DOM elements
const roleFilter = document.getElementById('roleFilter');
const skillSearch = document.getElementById('skillSearch');
const userCards = document.getElementById('userCards');
const noResults = document.getElementById('noResults');

// Initialize requests in localStorage if not exists
if (!localStorage.getItem('requests')) {
    localStorage.setItem('requests', JSON.stringify([]));
}

// Load and display users
function loadUsers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const profiles = JSON.parse(localStorage.getItem('profiles')) || [];
    const requests = JSON.parse(localStorage.getItem('requests')) || [];
    
    // Filter out current user and apply role/skill filters
    const filteredProfiles = profiles.filter(profile => {
        if (profile.userId === parseInt(loggedInUserId)) return false;
        
        // Check if there's an accepted request
        const hasAcceptedRequest = requests.some(r => 
            (r.fromUserId === parseInt(loggedInUserId) && r.toUserId === profile.userId && r.status === 'accepted') ||
            (r.fromUserId === profile.userId && r.toUserId === parseInt(loggedInUserId) && r.status === 'accepted')
        );
        
        if (hasAcceptedRequest) return false;
        
        const roleMatch = roleFilter.value === 'all' || profile.role === roleFilter.value;
        const skillMatch = !skillSearch.value || 
            profile.skills.some(skill => 
                skill.toLowerCase().includes(skillSearch.value.toLowerCase())
            );
        
        return roleMatch && skillMatch;
    });

    // Display results
    if (filteredProfiles.length === 0) {
        userCards.style.display = 'none';
        noResults.style.display = 'block';
    } else {
        userCards.style.display = 'grid';
        noResults.style.display = 'none';
        
        userCards.innerHTML = filteredProfiles.map(profile => {
            const user = users.find(u => u.id === profile.userId);
            const request = requests.find(r => 
                r.fromUserId === parseInt(loggedInUserId) && 
                r.toUserId === profile.userId
            );
            
            return createUserCard(user, profile, request);
        }).join('');

        // Add event listeners to the newly created buttons
        attachButtonListeners();
    }
}

// Create user card HTML
function createUserCard(user, profile, request) {
    if (!user || !profile) return '';
    
    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    
    return `
        <div class="user-card" data-user-id="${profile.userId}">
            <div class="user-header">
                <div class="request-avatar">${initials}</div>
                <div class="user-info">
                    <h3>${user.name}</h3>
                    <span class="user-role">${profile.role}</span>
                </div>
            </div>
            
            <div class="user-skills">
                <h4>Skills</h4>
                <div class="tag-list">
                    ${profile.skills.map(skill => `<span class="tag">${skill}</span>`).join('')}
                </div>
            </div>
            
            <div class="user-interests">
                <h4>Interests</h4>
                <div class="tag-list">
                    ${profile.interests.map(interest => `<span class="tag">${interest}</span>`).join('')}
                </div>
            </div>
            
            <div class="user-bio">
                ${profile.bio}
            </div>
            
            <button 
                class="request-btn ${request ? 'sent' : 'send'}"
                data-user-id="${profile.userId}"
                ${request ? 'disabled' : ''}
            >
                ${request ? 'Request Sent' : 'Send Request'}
            </button>
        </div>
    `;
}

// Attach event listeners to request buttons
function attachButtonListeners() {
    document.querySelectorAll('.request-btn.send').forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            sendRequest(userId);
        });
    });
}

// Send mentorship request
function sendRequest(toUserId) {
    const requests = JSON.parse(localStorage.getItem('requests')) || [];
    
    // Check if request already exists
    const existingRequest = requests.find(r => 
        r.fromUserId === parseInt(loggedInUserId) && 
        r.toUserId === parseInt(toUserId)
    );
    
    if (existingRequest) {
        showToast('You have already sent a request to this user.', 'error');
        return;
    }
    
    // Create new request
    const newRequest = {
        fromUserId: parseInt(loggedInUserId),
        toUserId: parseInt(toUserId),
        status: 'pending',
        timestamp: Date.now()
    };
    
    // Save request
    requests.push(newRequest);
    localStorage.setItem('requests', JSON.stringify(requests));
    
    // Update the specific card's button
    updateRequestButton(toUserId);
    
    // Show success message
    showToast('Request sent successfully!');
}

// Update request button for a specific user
function updateRequestButton(userId) {
    const card = document.querySelector(`.user-card[data-user-id="${userId}"]`);
    if (card) {
        const button = card.querySelector('.request-btn');
        button.className = 'request-btn sent';
        button.textContent = 'Request Sent';
        button.disabled = true;
    }
}

// Event listeners for filters
roleFilter.addEventListener('change', loadUsers);
skillSearch.addEventListener('input', loadUsers);

// Initial load
loadUsers(); 