import { Database } from "./database_server.js";

if ( window.location.pathname.includes('signup.html') ) {

  const form = document.getElementById("signupForm");

  const submit_button = form.querySelector('button');

  submit_button.addEventListener('click', () => {

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    // Load users from sessionStorage
    let users = JSON.parse(sessionStorage.getItem("Database_Users")) || [];

    // Check if username already exists
    const exists = users.some(user => user.username == username);

    if (exists) {

      showPopup("❌ Username already taken!", "error"); return;
      
    }

    users.push({username:username, password:password});
    sessionStorage.setItem("Database_Users", JSON.stringify(users));

    // Save current user to session
    sessionStorage.setItem("currentUser", username);

    Database.Create_Data( 'Users', [ username, password ] )

    showPopup("Loading...", "success");

    setTimeout(() => {

      showPopup("✅ Welcome to MyDB Cloud! Redirecting...", "success");

    },5000);

    setTimeout(() => {

      window.location.href = "dashboard.html";

    }, 2000);

  });

};

function showPopup(message, type) {

  const popup = document.getElementById("popup");

  popup.textContent = message;
  popup.className = `popup ${type}`;
  popup.classList.remove("hidden");
  setTimeout(() => popup.classList.add("hidden"), 3000);

};

export { showPopup };