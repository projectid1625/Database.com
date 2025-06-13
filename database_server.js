// import database_users -->

import { showPopup } from "./signup.js";

const WEB_APP_URL ="https://script.google.com/macros/s/AKfycbzD_SxNovC5Sg8_24bp2xsz6kj8wuobAu5oLZX2ieo7vDKIQyCWi9UpIGm2J-JvBZw6/exec";

function Extract_Users_Data() {

    fetch( WEB_APP_URL ).then(response => response.json()).then(data => {

        sessionStorage.setItem("Database_Users", JSON.stringify(data));
    
    }).catch(error => {
    
        console.error("Error fetching users:", error);
    
    });

};

function Create_Users( newUser, URL_web_App ) {

    fetch( URL_web_App, {
        
        method: "POST",
        body: JSON.stringify(newUser),
        headers: { "Content-Type": "application/json" }

      }
      
    ).then(response => response.json()).then(result => {

        if (result.success) {

            showPopup("Signed Up Successfully !",'success');

        } else {

            const e = "Error:" + result.error;

            showPopup(e, 'error');

        }

    }).catch(err => console.error("Request failed", err));

};

// when app starts ==>

if ( window.location.pathname.includes('index.html') ) {

    if ( sessionStorage.getItem('Database_Users') == null ) {

        Extract_Users_Data();

    };

};

export { WEB_APP_URL, Create_Users };