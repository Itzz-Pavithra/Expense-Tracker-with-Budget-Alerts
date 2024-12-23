// auth.js - Authentication utility functions
const AUTH_KEY = 'budgetwise_auth';

// User management functions
export const getUsers = () => {
    return JSON.parse(localStorage.getItem('users') || '[]');
};

export const saveUsers = (users) => {
    localStorage.setItem('users', JSON.stringify(users));
};

export const findUserByEmail = (email) => {
    const users = getUsers();
    return users.find(user => user.email === email);
};

export const validatePassword = (password) => {
    return password.length >= 6;
};

// Session management
export const setCurrentUser = (user) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify({
        isLoggedIn: true,
        user: { ...user, password: undefined } // Never store password in session
    }));
};

export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem(AUTH_KEY) || '{}');
};

export const logout = () => {
    localStorage.removeItem(AUTH_KEY);
};

// Password reset functions
export const setResetToken = (email, token) => {
    const resetTokens = JSON.parse(localStorage.getItem('resetTokens') || '{}');
    resetTokens[email] = {
        token,
        expires: Date.now() + 3600000 // 1 hour expiry
    };
    localStorage.setItem('resetTokens', JSON.stringify(resetTokens));
};

export const validateResetToken = (email, token) => {
    const resetTokens = JSON.parse(localStorage.getItem('resetTokens') || '{}');
    const resetData = resetTokens[email];
    return resetData && 
           resetData.token === token && 
           resetData.expires > Date.now();
};