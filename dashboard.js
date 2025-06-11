const currentUser = sessionStorage.getItem("currentUser");
const logout_btn = document.getElementById('logoutBtn');

if (!currentUser) { window.location.href = "./signin.html"; }
else {
  
  const welcomeMsg = document.getElementById("usernamePlaceholder");

  if (welcomeMsg) { welcomeMsg.textContent = currentUser; }

}

logout_btn.addEventListener('click', () => {

    sessionStorage.removeItem('currentUser');

    window.location.href = './index.html';

});
