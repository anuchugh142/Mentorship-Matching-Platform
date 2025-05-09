# Mentor Platform Documentation

## Table of Contents
1. [Authentication System](#1-authentication-system)
2. [Profile Management](#2-profile-management)
3. [User Discovery](#3-user-discovery)
4. [Mentorship Requests](#4-mentorship-requests)
5. [Data Storage](#5-data-storage)
6. [UI Components](#6-ui-components)
7. [Security Features](#7-security-features)
8. [Browser Compatibility](#8-browser-compatibility)
9. [Error Handling](#9-error-handling)
10. [Performance](#10-performance)

## 1. Authentication System

### Registration
- Email must be unique and valid
- Password must be at least 6 characters
- Name is required
- Upon successful registration:
  - User is redirected to profile setup
  - User data is stored in localStorage

### Login
- Email and password validation
- Automatic redirection based on profile status:
  - With profile → Discover page
  - Without profile → Profile setup
- Session management using localStorage

## 2. Profile Management

### Profile Setup
- Required fields:
  - Role (Mentor/Mentee)
  - Skills (minimum 1)
  - Bio (minimum 50 characters)
- Optional fields:
  - Interests
- Profile data structure:
```javascript
{
    userId: number,
    role: "mentor" | "mentee",
    skills: string[],
    interests: string[],
    bio: string
}
```

### Profile Editing
- All fields can be modified
- Changes are saved automatically
- Real-time validation
- Tag management for skills and interests

## 3. User Discovery

### Search and Filter
- Filter by role (Mentor/Mentee)
- Search by skills
- Real-time filtering
- Excludes:
  - Current user
  - Users with accepted connections

### User Cards
- Display:
  - Name
  - Role
  - Skills
  - Bio
  - Connection status
- Actions:
  - Send request
  - View profile

## 4. Mentorship Requests

### Sending Requests
- One active request per user pair
- Automatic validation for:
  - Existing requests
  - Self-requests
  - Duplicate requests

### Request Management
- View all requests:
  - Sent requests
  - Received requests
- Request statuses:
  - Pending
  - Accepted
  - Declined
- Actions:
  - Accept request
  - Decline request
  - Cancel sent request

## 5. Data Storage

### localStorage Structure
```javascript
// Users
localStorage.setItem('users', JSON.stringify([
    {
        id: number,
        name: string,
        email: string,
        password: string
    }
]));

// Profiles
localStorage.setItem('profiles', JSON.stringify([
    {
        userId: number,
        role: string,
        skills: string[],
        interests: string[],
        bio: string
    }
]));

// Requests
localStorage.setItem('requests', JSON.stringify([
    {
        fromUserId: number,
        toUserId: number,
        status: string,
        timestamp: number
    }
]));
```

## 6. UI Components

### Navigation
- Persistent navigation bar
- Role-based menu items
- Logout functionality

### Notifications
- Toast messages for:
  - Success actions
  - Error messages
  - System notifications
- Auto-dismissing after 3 seconds

### Forms
- Real-time validation
- Error messages
- Success indicators
- Loading states

## 7. Security Features

### Input Validation
- Email format validation
- Password strength requirements
- XSS prevention
- Input sanitization

### Session Management
- Secure login state
- Automatic logout on:
  - Browser close
  - Manual logout
  - Session timeout

## 8. Browser Compatibility

### Supported Browsers
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Mobile Support
- Responsive design
- Touch-friendly interface
- Mobile-optimized forms

## 9. Error Handling

### Common Errors
- Invalid credentials
- Duplicate email
- Network issues
- Storage limitations

### Error Messages
- User-friendly messages
- Clear action items
- Recovery suggestions

## 10. Performance

### Optimization
- Minimal DOM manipulation
- Efficient localStorage usage
- Debounced search
- Lazy loading

### Limitations
- localStorage size limits
- Browser compatibility
- Data persistence 