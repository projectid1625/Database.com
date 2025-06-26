import { Database } from "../database_server.js";

document.addEventListener("DOMContentLoaded", () => {
    const createForm = document.getElementById("createForm");
  
    createForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const dbName = document.getElementById("dbName").value.trim();
      const securityCode = document.getElementById("securityCode").value.trim();
      const dbType = document.getElementById("dbType").value;
      const owner = localStorage.getItem("currentUser");
      const popup = document.getElementById("popup");
  
      if (!securityCode || !dbType || !dbName) {
        showPopup("Please fill in all fields.", "error", popup);
        return;
      };

      function generateSecureApiKey() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, dec => ('0' + dec.toString(16)).slice(-2)).join('');
      };

      var api_key = generateSecureApiKey();

      check_api_key();

      function check_api_key() {

        try {
        
          const databases_conf = JSON.parse( sessionStorage.getItem( 'databases_conf' ) );
  
          const catch_match = databases_conf.some(key => key.api_key == api_key);
  
          if (catch_match) {

            api_key = generateSecureApiKey();

          };
  
        } catch (error) {
  
          alert( error );
  
          return window.location.assign( './dashboard.html' );
          
        };

      };

      var newDatabase = [ dbName, api_key, securityCode, dbType, owner ];

      newDatabase = newDatabase.map(item => { return encodeURIComponent( item ); });

      sessionStorage.setItem( 'create_database', JSON.stringify( newDatabase ) );

      return window.location.assign( "./createTable.html" );

    });
    
  });
  