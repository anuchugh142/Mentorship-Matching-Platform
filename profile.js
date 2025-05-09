// Check if user is logged in
const loggedInUserId = localStorage.getItem('loggedInUserId');
if (!loggedInUserId) {
    window.location.href = 'index.html';
}

// Initialize profiles in localStorage if not exists
if (!localStorage.getItem('profiles')) {
    localStorage.setItem('profiles', JSON.stringify([]));
}

// Get DOM elements
const profileForm = document.getElementById('profileForm');
const skillsInput = document.getElementById('skills');
const interestsInput = document.getElementById('interests');
const skillsTagsContainer = document.getElementById('skillsTags');
const interestsTagsContainer = document.getElementById('interestsTags');

// Load existing profile if available
const profiles = JSON.parse(localStorage.getItem('profiles'));
const existingProfile = profiles.find(p => p.userId === parseInt(loggedInUserId));

if (existingProfile) {
    // Pre-fill the form
    document.querySelector(`input[name="role"][value="${existingProfile.role}"]`).checked = true;
    skillsInput.value = existingProfile.skills.join(', ');
    interestsInput.value = existingProfile.interests.join(', ');
    document.getElementById('bio').value = existingProfile.bio;
    
    // Display existing tags
    displayTags(existingProfile.skills, skillsTagsContainer);
    displayTags(existingProfile.interests, interestsTagsContainer);
}

// Handle skills and interests input
function handleTagsInput(input, container) {
    const tags = input.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    displayTags(tags, container);
}

skillsInput.addEventListener('input', () => handleTagsInput(skillsInput, skillsTagsContainer));
interestsInput.addEventListener('input', () => handleTagsInput(interestsInput, interestsTagsContainer));

// Display tags
function displayTags(tags, container) {
    container.innerHTML = tags.map(tag => `
        <span class="tag">
            ${tag}
            <span class="remove-tag" onclick="removeTag(this, '${tag}')">&times;</span>
        </span>
    `).join('');
}

// Remove tag
function removeTag(element, tag) {
    const container = element.parentElement.parentElement;
    const input = container.previousElementSibling;
    const tags = input.value.split(',').map(t => t.trim()).filter(t => t !== tag);
    input.value = tags.join(', ');
    displayTags(tags, container);
}

// Handle form submission
profileForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const role = document.querySelector('input[name="role"]:checked').value;
    const skills = skillsInput.value.split(',').map(skill => skill.trim()).filter(skill => skill);
    const interests = interestsInput.value.split(',').map(interest => interest.trim()).filter(interest => interest);
    const bio = document.getElementById('bio').value.trim();

    // Validate
    if (!role || skills.length === 0 || interests.length === 0 || !bio) {
        showToast('Please fill in all fields', 'error');
        return;
    }

    // Create profile object
    const profile = {
        userId: parseInt(loggedInUserId),
        role,
        skills,
        interests,
        bio
    };

    // Update profiles in localStorage
    const profiles = JSON.parse(localStorage.getItem('profiles'));
    const existingIndex = profiles.findIndex(p => p.userId === parseInt(loggedInUserId));
    
    if (existingIndex !== -1) {
        profiles[existingIndex] = profile;
    } else {
        profiles.push(profile);
    }

    localStorage.setItem('profiles', JSON.stringify(profiles));

    // Show success message
    showToast('Profile saved successfully!');

    // Redirect to discover page after 2 seconds
    setTimeout(() => {
        window.location.href = 'discover.html';
    }, 2000);
});

// Helper function to show messages
function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
} 