// --- Firebase SDK is required in your HTML before this script ---
// Example (in <head> of admin.html):
// <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js"></script>
// <script>
//    const firebaseConfig = { ... }; // <-- YOUR CONFIG HERE
//    firebase.initializeApp(firebaseConfig);
//    const db = firebase.firestore();
// </script>
// <script src="admin.js"></script>

document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('login-section');
    const adminPanel = document.getElementById('admin-panel');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const newsForm = document.getElementById('news-form');
    const logoutButton = document.getElementById('logout-button');
    const clearNewsButton = document.getElementById('clear-news-button');

    const ADMIN_PASSWORD = 'password123';

    if (sessionStorage.getItem('isAdmin') === 'true') showAdminPanel();

    function showAdminPanel() {
        loginSection.classList.add('hidden');
        adminPanel.classList.remove('hidden');
    }
    function showLogin() {
        loginSection.classList.remove('hidden');
        adminPanel.classList.add('hidden');
        sessionStorage.removeItem('isAdmin');
    }

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

    logoutButton.addEventListener('click', () => showLogin());

    // --- FIRESTORE CODE ---
    newsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        const imageUrl = document.getElementById('imageUrl').value;
        const date = new Date().toISOString().split('T')[0];

        try {
            await db.collection("news").add({
                title,
                content,
                imageUrl,
                date,
                created: firebase.firestore.FieldValue.serverTimestamp()
            });
            alert('News article posted successfully!');
            newsForm.reset();
        } catch(err) {
            alert("Failed to post news: " + err.message);
        }
    });

    clearNewsButton.addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete ALL news articles? This cannot be undone.')) {
            // Delete all news docs from Firestore
            try {
                const snap = await db.collection("news").get();
                const batch = db.batch();
                snap.forEach(doc => batch.delete(doc.ref));
                await batch.commit();
                alert('All news articles have been cleared.');
            } catch(err) {
                alert("Failed to clear news: " + err.message);
            }
        }
    });
});
