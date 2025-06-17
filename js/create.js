document.addEventListener("DOMContentLoaded", () => {
    const createForm = document.getElementById("createForm");
  
    createForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const securityCode = document.getElementById("securityCode").value.trim();
      const dbType = document.getElementById("dbType").value;
      const owner = sessionStorage.getItem("currentUser");
  
      if (!securityCode || !dbType) {
        showPopup("Please fill in all fields.", "error");
        return;
      }
  
      // Construct the database object
      const newDatabase = {
        security_code: encodeURIComponent(securityCode),
        database_type: encodeURIComponent(dbType),
        owner: encodeURIComponent(owner),
        data: encodeURIComponent(JSON.stringify([]))  // Empty database
      };
  
      try {
        // 🔒 Leave this section for you to integrate Google Sheets API or Apps Script request
        // Example placeholder (you will replace with actual URL and method)
        /*
        const response = await fetch("YOUR_GOOGLE_SCRIPT_URL", {
          method: "POST",
          body: JSON.stringify(newDatabase),
          headers: {
            "Content-Type": "application/json"
          }
        });
        const result = await response.json();
        */
  
        // Simulate success (remove when real request is added)
        showPopup("Database created successfully!", "success");
  
        // Optional: redirect after success
        // window.location.href = "dashboard.html";
  
      } catch (error) {
        showPopup("Failed to create database. Please try again.", "error");
        console.error(error);
      }
    });
  });
  