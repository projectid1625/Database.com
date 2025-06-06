const form = document.getElementById("signupForm");
const popup = document.getElementById("popup");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  // Load users from sessionStorage
  let users = JSON.parse(sessionStorage.getItem("Database_Users")) || [];

  // Check if username already exists
  const exists = users.some(user => user.username === username);
  if (exists) {
    showPopup("❌ Username already taken!", "error");
    return;
  }

  // Add new user
  users.push({ username, password });
  sessionStorage.setItem("Database_Users", JSON.stringify(users));

  // Save current user to session
  sessionStorage.setItem("currentUser", username);

  showPopup("✅ Welcome to MyDB Cloud! Redirecting...", "success");

  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 2000);
});

function showPopup(message, type) {
  popup.textContent = message;
  popup.className = `popup ${type}`;
  popup.classList.remove("hidden");
  setTimeout(() => popup.classList.add("hidden"), 3000);
}
