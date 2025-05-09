// Check if user is logged in
const loggedInUserId = localStorage.getItem('loggedInUserId');
if (!loggedInUserId) {
    window.location.href = 'index.html';
}

// Get DOM elements
const incomingRequestsContainer = document.getElementById('incomingRequests');
const sentRequestsContainer = document.getElementById('sentRequests');
const noIncomingRequests = document.getElementById('noIncomingRequests');
const noSentRequests = document.getElementById('noSentRequests');

// Initialize requests in localStorage if not exists
if (!localStorage.getItem('requests')) {
    localStorage.setItem('requests', JSON.stringify([]));
}

// Load and display requests
function loadRequests() {
    console.log('Loading requests...');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const profiles = JSON.parse(localStorage.getItem('profiles')) || [];
    const requests = JSON.parse(localStorage.getItem('requests')) || [];
    
    console.log('Current logged in user ID:', loggedInUserId);
    console.log('Available users:', users);
    console.log('Available profiles:', profiles);
    console.log('Existing requests:', requests);

    // Filter requests
    const incomingRequests = requests.filter(r => 
        r.toUserId === parseInt(loggedInUserId) && 
        r.status === 'pending'
    );
    
    const sentRequests = requests.filter(r => 
        r.fromUserId === parseInt(loggedInUserId)
    );
    
    console.log('Incoming requests:', incomingRequests);
    console.log('Sent requests:', sentRequests);

    // Display incoming requests
    if (incomingRequests.length === 0) {
        incomingRequestsContainer.style.display = 'none';
        noIncomingRequests.style.display = 'block';
    } else {
        incomingRequestsContainer.style.display = 'grid';
        noIncomingRequests.style.display = 'none';
        
        incomingRequestsContainer.innerHTML = incomingRequests.map(request => {
            const user = users.find(u => u.id === request.fromUserId);
            const profile = profiles.find(p => p.userId === request.fromUserId);
            
            if (!user || !profile) {
                console.error('Missing user or profile data:', { request, user, profile });
                return '';
            }
            
            return createIncomingRequestCard(user, profile, request);
        }).join('');

        // Add event listeners to the newly created buttons
        attachIncomingRequestListeners();
    }
    
    // Display sent requests
    if (sentRequests.length === 0) {
        sentRequestsContainer.style.display = 'none';
        noSentRequests.style.display = 'block';
    } else {
        sentRequestsContainer.style.display = 'grid';
        noSentRequests.style.display = 'none';
        
        sentRequestsContainer.innerHTML = sentRequests.map(request => {
            const user = users.find(u => u.id === request.toUserId);
            const profile = profiles.find(p => p.userId === request.toUserId);
            
            if (!user || !profile) {
                console.error('Missing user or profile data:', { request, user, profile });
                return '';
            }
            
            return createSentRequestCard(user, profile, request);
        }).join('');
    }
}

// Create incoming request card HTML
function createIncomingRequestCard(user, profile, request) {
    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    
    return `
        <div class="request-card" data-request-id="${request.fromUserId}">
            <div class="request-header">
                <div class="request-avatar">${initials}</div>
                <div class="request-info">
                    <h3>${user.name}</h3>
                    <span class="request-role">${profile.role}</span>
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
            
            <div class="request-actions">
                <button class="btn-accept" data-user-id="${request.fromUserId}">
                    Accept
                </button>
                <button class="btn-decline" data-user-id="${request.fromUserId}">
                    Decline
                </button>
            </div>
        </div>
    `;
}

// Create sent request card HTML
function createSentRequestCard(user, profile, request) {
    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    
    return `
        <div class="request-card">
            <div class="request-header">
                <div class="request-avatar">${initials}</div>
                <div class="request-info">
                    <h3>${user.name}</h3>
                    <span class="request-role">${profile.role}</span>
                    <div class="request-status status-${request.status}">
                        ${request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </div>
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
        </div>
    `;
}

// Attach event listeners to incoming request buttons
function attachIncomingRequestListeners() {
    document.querySelectorAll('.btn-accept').forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            handleRequest(userId, 'accepted');
        });
    });

    document.querySelectorAll('.btn-decline').forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            handleRequest(userId, 'declined');
        });
    });
}

// Handle request (accept/decline)
function handleRequest(fromUserId, newStatus) {
    if (newStatus === 'declined' && !confirm('Are you sure you want to decline this request?')) {
        return;
    }
    
    const requests = JSON.parse(localStorage.getItem('requests')) || [];
    const requestIndex = requests.findIndex(r => 
        r.fromUserId === parseInt(fromUserId) && 
        r.toUserId === parseInt(loggedInUserId)
    );
    
    if (requestIndex !== -1) {
        requests[requestIndex].status = newStatus;
        localStorage.setItem('requests', JSON.stringify(requests));
        
        // Show success message
        showToast(`Request ${newStatus} successfully!`);
        
        // Update the UI
        updateRequestCard(fromUserId, newStatus);
    }
}

// Update request card after action
function updateRequestCard(userId, status) {
    const card = document.querySelector(`.request-card[data-request-id="${userId}"]`);
    if (card) {
        // Remove the action buttons
        const actionsDiv = card.querySelector('.request-actions');
        if (actionsDiv) {
            actionsDiv.innerHTML = `
                <div class="request-status status-${status}">
                    ${status.charAt(0).toUpperCase() + status.slice(1)}
                </div>
            `;
        }
    }
}

// Initial load
document.addEventListener('DOMContentLoaded', loadRequests); 