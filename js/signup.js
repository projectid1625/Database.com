import { Database } from "./database_server.js";

if ( window.location.pathname.includes('signup.html') ) {

  const form = document.getElementById("signupForm");
  const popup = document.getElementById("popup");

  const submit_button = form.querySelector('button');

  submit_button.addEventListener('click', (e) => {

    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const email = document.getElementById("email").value;

    // Load users from sessionStorage
    let users = JSON.parse(sessionStorage.getItem("Database_Users")) || [];

    // Check if username already exists
    const exists = users.some(user => user.username == username);
    const exists2 = users.some(user => user.email == email);

    if (exists) { showPopup("❌ Username already taken!", "error", popup ); return; };

    if (exists2) { showPopup("❌ This email is already used!", "error", popup); return; };

    users.push({username:username, password:password, email:email});
    sessionStorage.setItem("Database_Users", JSON.stringify(users));

    // Save current user to session
    localStorage.setItem("currentUser", username);

    Database.Create_Data( 'Users', [ username, password, email ] );

    showPopup( "✅ Successfully Signed Up 👍", 'success', popup );

    return setTimeout(() => {

      window.location.href = "./dashboard.html";

    }, 2000);

  });

};

function showPopup( message, type, popup ) {

  popup.textContent = message;
  popup.className = `popup ${type}`;
  popup.classList.remove("hidden");
  setTimeout(() => popup.classList.add("hidden"), 3000);

};

export { showPopup };