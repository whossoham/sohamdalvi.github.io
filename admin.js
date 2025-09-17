document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('login-section');
    const adminPanel = document.getElementById('admin-panel');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const newsForm = document.getElementById('news-form');
    const logoutButton = document.getElementById('logout-button');
    const clearNewsButton = document.getElementById('clear-news-button');

    // IMPORTANT: This is a simple, insecure password for demonstration.
    // In a real application, this should be handled by a secure backend.
    const ADMIN_PASSWORD = 'password123';

    // Check if the user is already "logged in" using sessionStorage
    if (sessionStorage.getItem('isAdmin') === 'true') {
        showAdminPanel();
    }

    function showAdminPanel() {
        loginSection.classList.add('hidden');
        adminPanel.classList.remove('hidden');
    }

    function showLogin() {
        loginSection.classList.remove('hidden');
        adminPanel.classList.add('hidden');
        sessionStorage.removeItem('isAdmin');
    }

    // Handle login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = document.getElementById('password').value;
        if (password === ADMIN_PASSWORD) {
            sessionStorage.setItem('isAdmin', 'true');
            showAdminPanel();
            loginError.textContent = '';
        } else {
            loginError.textContent = 'Incorrect password.';
        }
        loginForm.reset();
    });

    // Handle logout
    logoutButton.addEventListener('click', () => {
        showLogin();
    });

    // Handle news article submission
    newsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;

        // Get existing news from localStorage or initialize an empty array
        const news = JSON.parse(localStorage.getItem('vjcNews')) || [];
        
        const newArticle = {
            date: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
            title: title,
            content: content
        };

        // Add the new article to the beginning of the array
        news.unshift(newArticle);

        // Save back to localStorage
        localStorage.setItem('vjcNews', JSON.stringify(news));

        alert('News article posted successfully!');
        newsForm.reset();
    });

    // Handle clearing all news
    clearNewsButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete ALL news articles? This cannot be undone.')) {
            localStorage.removeItem('vjcNews');
            alert('All news articles have been cleared.');
        }
    });
});
