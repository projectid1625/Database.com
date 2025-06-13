// import database_users -->

import { showPopup } from "./signup.js";

const WEB_APP_URL ="https://script.google.com/macros/s/AKfycbwFF1_l3an_J4Yvr_OfxH0c5NQJQFdffYRz2xardflAQhZQWQGZx8H_6RyGlPtALET_/exec";

const Database = {

    request_url: WEB_APP_URL,

    Send_request: ( data_type, store_data, _arguments_ ) => {

        const request = new XMLHttpRequest();

        request.open( "GET", Database.request_url + '?type=' + data_type + _arguments_ );

        request.onload = () => { sessionStorage.setItem( store_data, request.responseText ); };

        request.send( null );

    },

    Read_Data: ( data_location, category ) => {

        Database.Send_request( 'Read', data_location, '&category=' + category );

    },

    Update_Data: ( category, cell, data ) => {

        Database.Send_request( 'Update', 'DATABASE', '&category=' + category + '&cell=' + cell
        + '&status=100' + '&data=' + data );

    },

    Create_Data: ( category, data ) => {

        Database.Send_request( 'Create', 'DATABASE', '&category=' + category + '&data=' +
        Database.Json.stringify( data ) );

    },

    Delete_Data: ( category, cell ) => {

        Database.Send_request( 'Delete', 'DATABASE', '&category=' + category + '&cell=' + cell );

    }

};

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

        // Extract_Users_Data();

    };

};

export { WEB_APP_URL, Create_Users };