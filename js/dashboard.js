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
      const index = dbUsers.findIndex(user => user.username == currentUser);

      if ( index == -1 ) {

        showPopup( 'The Current User does not found ! ', 'error' ); return closeModal();

      };
      
      if ( modalLabel.textContent.includes('username') ) {

        const check = dbUsers.findIndex( user => user.username.toLowerCase() == newValue.toLowerCase() );

        if ( check != -1 ) {

          showPopup('Sorry ! This Username is used...', 'error');

        } else {

          var databases_conf = JSON.parse( sessionStorage.getItem( 'databases_conf' ) );

          var changed_data = [];

          databases_conf = databases_conf.map(
            
            (obj,index) => {

              if ( obj.owner === currentUser ) {

                changed_data.push( index );

                return { ...obj, owner : newValue };

              } return obj;
            
            }
            
          );
          
          sessionStorage.setItem( 'databases_conf', JSON.stringify( databases_conf ) );

          dbUsers[index].username = newValue;
          sessionStorage.setItem( 'Database_Users', JSON.stringify( dbUsers ) );

          localStorage.setItem( 'currentUser', newValue )

          var cell = index + 2;
          cell = cell.toString();
          cell = 'A' + cell;

          Database.Update_Data( 'Users', cell, newValue );

          Database.Update_Owners( changed_data, newValue );

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

            const name_card = document.createElement( 'h4' );
            name_card.innerHTML = db.name;

            const database_type_card = document.createElement( 'p' );
            database_type_card.innerHTML = 'Type: ' +  db.database_type + ' Database';

            const api_key_card = document.createElement( 'p' );
            api_key_card.innerHTML = `<strong>API Key:</strong> ${db.api_key}`;

            const security_code_card = document.createElement( 'p' );
            security_code_card.innerHTML = `<strong>Security Code:</strong> ${db.security_code}`;

            const action_box = document.createElement( 'div' );
            action_box.className = 'db-actions';

            const delete_button = document.createElement( 'button' );
            delete_button.className = 'delete-btn';
            delete_button.id = db.name;
            delete_button.title = 'Delete';

            const delete_button_icon = document.createElement( 'i' );
            delete_button_icon.className = 'fas fa-trash-alt';

            delete_button.appendChild( delete_button_icon );

            const Edit_button = document.createElement( 'button' );
            Edit_button.className = 'edit-btn';
            Edit_button.id = db.name;
            Edit_button.title = 'Edit';

            const Edit_button_icon = document.createElement( 'i' );
            Edit_button_icon.className = 'fas fa-pencil-alt';

            Edit_button.appendChild( Edit_button_icon );

            delete_button.addEventListener( 'click', ( btn ) => {

              var databases_conf = JSON.parse( sessionStorage.getItem( 'databases_conf' ) );
              var index = databases_conf.findIndex( element => element.name == btn.currentTarget.id );
              const api_key = databases_conf[ index ].api_key;
              databases_conf.splice( index, 1 );
              databases_conf = JSON.stringify( databases_conf );
              sessionStorage.setItem( 'databases_conf', databases_conf );

              if ( sessionStorage.getItem( 'DATABASE' ) != null ) {

                sessionStorage.removeItem( 'DATABASE' );

              };

              function wait() {

                setTimeout( () => {

                  if ( sessionStorage.getItem( 'DATABASE' ) != null ) {

                    return window.location.reload();
  
                  } else { return wait(); };

                },1000 )
                
              };
          
              Database.Delete_Database( api_key ); delete_button.disabled = true;
              delete_button.style.cursor = "not-allowed"; wait();

            });

            Edit_button.addEventListener( 'click', ( btn ) => {

              var databases_conf = JSON.parse( sessionStorage.getItem( 'databases_conf' ) );
              var index = databases_conf.findIndex( element => element.name == btn.id );

              console.log( databases_conf[ index ][ 'api_key' ] );

              // Edit Table

            });

            action_box.appendChild( Edit_button );
            action_box.appendChild( delete_button );

            card.appendChild( name_card );
            card.appendChild( database_type_card );
            card.appendChild( api_key_card );
            card.appendChild( security_code_card );
            card.appendChild( action_box );
      
            section.appendChild(card);

          });
        }

      } else { return start_listing(); };

    },2000 );

  };

};