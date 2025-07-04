import { Database } from "../database_server.js";

const currentUser = localStorage.getItem("currentUser");
const logout_btn = document.getElementById('logoutBtn');

if (!currentUser) { window.location.href = "./signin.html"; }
else {
  
  const welcomeMsg = document.getElementById("usernamePlaceholder");

  if (welcomeMsg) { welcomeMsg.textContent = currentUser; }

}

logout_btn.addEventListener('click', () => {

    localStorage.removeItem('currentUser');

    window.location.href = './index.html';

});

//Popup

function showPopup(message, type) {
  const popup = document.getElementById("popup");
  const popupMessage = document.getElementById("popupMessage");

  popupMessage.textContent = message;
  popup.className = `popup show ${type}`;

  setTimeout(() => {
    popup.classList.remove("show");
  }, 3000);
}

// Show profile panel when button is clicked
document.getElementById('profileBtn').addEventListener('click', () => {

  const databaseUsers = JSON.parse(sessionStorage.getItem('Database_Users')) || [];
  const currentUser = localStorage.getItem('currentUser');

  const found = databaseUsers.find(u => u.username === currentUser);
  if (found) {
    document.getElementById('profileUsername').value = found.username;
    document.getElementById('profilePassword').value = found.password;
    document.getElementById('profileEmail').value = found.email;
  }
});

// Toggle password visibility
document.getElementById('togglePassword').addEventListener('click', () => {
  const passField = document.getElementById('profilePassword');
  const icon = document.getElementById('togglePassword');
  
  if (passField.type === 'password') {
    passField.type = 'text';
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  } else {
    passField.type = 'password';
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
  }
});

const profileBtn = document.getElementById('profileBtn');
const profileSidebar = document.getElementById('profileSidebar');
const closeProfile = document.getElementById('closeProfile');
const toggleEye = document.getElementById('togglePassword');
const passInput = document.getElementById('profilePassword');

// Toggle sidebar visibility
profileBtn.addEventListener('click', () => {
  profileSidebar.classList.toggle('visible');

  if (profileSidebar.classList.contains('visible')) {
    const users = JSON.parse(sessionStorage.getItem('Database_Users')) || [];
    const currentUser = localStorage.getItem('currentUser');
    const user = users.find(u => u.username === currentUser);

    if (user) {
      document.getElementById('profileUsername').value = user.username;
      passInput.value = user.password;
      passInput.type = 'password';
      toggleEye.className = 'fas fa-eye';
    }
  }
});

// Close button inside panel
closeProfile.addEventListener('click', () => {
  profileSidebar.classList.remove('visible');
});

document.addEventListener("DOMContentLoaded", () => {
  const modalOverlay = document.getElementById("changeModalOverlay");
  const modalLabel = document.getElementById("modalLabel");
  const modalInput = document.getElementById("modalInput");
  const confirmBtn = document.getElementById("modalConfirmBtn");
  const cancelBtn = document.getElementById("cancelBtn");

  const showModal = (labelText, isPassword = false) => {
    modalLabel.textContent = labelText;
    modalInput.value = "";
    modalInput.type = isPassword ? "password" : "text";
    modalOverlay.style.display = "flex";
  };

  const closeModal = () => {
    modalOverlay.style.display = "none";
  };

  // Change Username Button Click
  document.getElementById("changeUsernameBtn").addEventListener("click", () => {
    showModal("Enter your new username:");
  });

  // Change Password Button Click
  document.getElementById("changePasswordBtn").addEventListener("click", () => {
    showModal("Enter your new password:", true);
  });

  // Confirm Button Click
  confirmBtn.addEventListener("click", () => {
    const newValue = modalInput.value.trim();
    if (newValue !== "") {

      const dbUsersString = sessionStorage.getItem("Database_Users");
      const currentUser = localStorage.getItem("currentUser");

      const dbUsers = JSON.parse(dbUsersString);
      const index = dbUsers.findIndex(user => user.username === currentUser);

      if ( index == -1 ) {

        showPopup( 'The Current User does not found ! ', 'error' ); return closeModal();

      };
      
      if ( modalLabel.textContent.includes('username') ) {

        const check = dbUsers.findIndex( user => user.username == newValue );

        if ( check != -1 ) {

          showPopup('Sorry ! This Username is used...', 'error');

        } else {

          dbUsers[index].username = newValue;
          sessionStorage.setItem( 'Database_Users', JSON.stringify( dbUsers ) );

          localStorage.setItem( 'currentUser', newValue )

          var cell = index + 2;
          cell = cell.toString();
          cell = 'A' + cell;

          Database.Update_Data( 'Users', cell, newValue );

          showPopup( 'Username changed successfully', 'success' );

        };

      } else {

        dbUsers[index].password = newValue;
        sessionStorage.setItem( 'Database_Users', JSON.stringify( dbUsers ) );

        var cell = index + 2;
        cell = cell.toString();
        cell = 'B' + cell;

        Database.Update_Data( 'Users', cell, newValue );

        showPopup( 'Password changed successfully', 'success' );

      };

      
      return setTimeout( () => {

        closeModal(); return window.location.reload();

      },3000 );

    };

  });

  cancelBtn.addEventListener( "click", closeModal );
  
});

window.onload = () => {

  if ( sessionStorage.getItem( 'database_table' ) != null ) {

    const data_of_database = sessionStorage.getItem( "database_table" );
    const api_key = sessionStorage.getItem( 'api_key' );

    const data = [ api_key, data_of_database ];

    // Creation..

    const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLScM7asS2Unrka8Js5mXj1m3niYmLpge9n6-HHZTMnHtlxLC8w/formResponse";

    const entryId = "entry.1731731696";
    const formData = new FormData();

    formData.append(entryId, JSON.stringify(data));

    fetch(formUrl, {
        method: "POST",
        mode: "no-cors",
        body: formData
    });

    sessionStorage.removeItem( 'database_table' );
    sessionStorage.removeItem( 'create_database' );
    sessionStorage.removeItem( 'api_key' );

  };

  if ( sessionStorage.getItem( 'databases_conf' ) == null ) {

    Database.Read_Data( 'databases_conf', 'Databases' );

  };

  start_listing();

  function start_listing() {

    setTimeout( () => {

      if ( sessionStorage.getItem( 'databases_conf' ) != null ) {

        const databases_conf = JSON.parse( sessionStorage.getItem( 'databases_conf' ) );
        const currentUser = localStorage.getItem("currentUser");
        const section = document.querySelector(".databases-list");
        const placeholder = section.querySelector(".db-list-empty");

        const userDBs = databases_conf.filter(db => db.owner === currentUser);

        if (userDBs.length > 0) {
          placeholder.remove();
      
          userDBs.forEach((db) => {
            const card = document.createElement("div");
            card.className = "db-card";
      
            card.innerHTML = `
              <h4>📁 ${db.name} </h4>
              <p>Type: ${db.database_type} Database</p>
              <p><strong>API Key:</strong> ${db.api_key}</p>
              <p><strong>Security Code:</strong> ${db.security_code}</p>
              <div class="db-actions">
                <button class="edit-btn" id="${db.name}" title="Edit"><i class="fas fa-pencil-alt"></i></button>
                <button class="delete-btn" id="${db.name}" title="Delete"><i class="fas fa-trash-alt"></i></button>
              </div>
            `;
      
            section.appendChild(card);
          });
        }

      } else { return start_listing(); };

    },2000 );

  };

  setTimeout( () => {

    const delete_buttons = document.querySelectorAll(".delete-btn");

    console.log( delete_buttons );

  },2000 );

  // delete_buttons.forEach(btn => {

  //   btn.addEventListener("click", () => {
  
  //     var databases_conf = JSON.parse( sessionStorage.getItem( 'databases_conf' ) );
  //     var index = databases_conf.findIndex( element => element.name == btn.id );
  //     databases_conf.splice( index, 1 );
  //     databases_conf = JSON.stringify( databases_conf );
  //     sessionStorage.setItem( 'databases_conf', databases_conf );
  //     index += 2;
  
  //     console.log( index );
  
  //     Database.Delete_Data( 'Databases', index );
  
  //   });
  
  // });
  
  // document.querySelectorAll(".edit-btn").forEach(btn => {
  //   btn.addEventListener("click", () => {
  //     // Edit
  //   });
  // });  

};