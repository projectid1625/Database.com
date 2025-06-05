document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const dbType = document.getElementById("dbType").value;

  // Get current users
  let users = JSON.parse(sessionStorage.getItem("Database_Users") || "[]");

  // Check if username already exists
  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    showPopup("❌ Username already exists. Please choose another one.", "error");
    return;
  }

  // Create new user object
  const newUser = { username, password, dbType };

  // Add to array and update sessionStorage
  users.push(newUser);
  sessionStorage.setItem("Database_Users", JSON.stringify(users));

  // Save to localStorage as logged in user
  localStorage.setItem("MyDB_CurrentUser", JSON.stringify(newUser));

  // Show welcome and tutorial popups
  showPopup("🎉 Welcome to MyDB Cloud!", "success");
  
  setTimeout(() => {
    showPopup("📘 Tutorial: Your selected DB is " + dbType + ". You can now start using it!", "info");
  }, 2000);

  // Redirect after tutorial popup
  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 4500);
});

// Function to show popups
function showPopup(message, type) {
  const popup = document.createElement("div");
  popup.classList.add("popup", type);
  popup.innerText = message;

  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 3000);
}
