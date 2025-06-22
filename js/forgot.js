import { showPopup } from "./signup.js";
import { WEB_APP_URL } from "../database_server.js";

document.addEventListener("DOMContentLoaded", () => {
    const forgotForm = document.getElementById("forgotForm");
    const sendOtpBtn = document.getElementById("sendOtpBtn");
    const otpSection = document.getElementById("otpSection");
    const verifyOtpBtn = document.getElementById("verifyOtpBtn");
    const popup = document.getElementById("popup");
  
    let generatedOTP = "";
    let matchedUser = null;
  
    forgotForm.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const email = document.getElementById("email").value.trim().toLowerCase();
      const Database_Users = JSON.parse(sessionStorage.getItem("Database_Users") || "[]");
  
      matchedUser = Database_Users.find(user => user.email.toLowerCase() === email);
  
      if (!matchedUser) {
        showPopup("Email not found. Please try again.", "error", popup);
        return;
      }
  
      // Generate 6-digit OTP
      generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
  
      // Send OTP using App Script
      fetch( WEB_APP_URL + "?email=" + encodeURIComponent(email) + "&otp=" + generatedOTP )
        .then(response => response.text())
        .then(result => {
          showPopup("OTP sent to your email.", "success", popup);
          otpSection.style.display = "block";
        })
        .catch(error => {
          showPopup("Failed to send OTP. Try again later.", "error", popup);
          console.error(error);
        });
    });
  
    verifyOtpBtn.addEventListener("click", () => {
      const enteredOtp = document.getElementById("otp").value.trim();
  
      if (enteredOtp === generatedOTP) {
        localStorage.setItem("currentUser", matchedUser.username);
        showPopup("Signed in successfully!", "success", popup);
  
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 1000);
      } else {
        showPopup("Invalid OTP. Please try again.", "error", popup);
      }
    });
});
