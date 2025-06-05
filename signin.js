document.getElementById("signinForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  // Get users from sessionStorage
  let users = JSON.parse(sessionStorage.getItem("Database_Users") || "[]");

  // Check if username exists
  const user = users.find(u => u.username === username);

  if (!user) {
    showPopup("Username not found!", "error");
    return;
  }

  // Check if password matches
  if (user.password !== password) {
    showPopup("Incorrect password! Please try again.", "error");
    return;
  }

  // If both match, redirect to dashboard
  localStorage.setItem("MyDB_CurrentUser", JSON.stringify(user));
  window.location.href = "dashboard.html";
});

// Function to show popups
function showPopup(message, type) {
  const popup = document.createElement("div");
  popup.classList.add("popup", type);
  popup.innerText = message;
  
  document.body.appendChild(popup);
  
  setTimeout(() => {
    popup.remove();
  }, 3000); // Remove popup after 3 seconds
}
