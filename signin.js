document.getElementById("signinForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  // Get users from sessionStorage
  let users = JSON.parse(sessionStorage.getItem("Database_Users") || "[]");

  // Check for a matching user
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    alert("Sign-in successful ✅");
    
    // Store current user in localStorage
    localStorage.setItem("MyDB_CurrentUser", JSON.stringify(user));

    // Redirect to dashboard (you can create dashboard.html later)
    window.location.href = "dashboard.html";
  } else {
    alert("❌ Invalid username or password");
  }
});
