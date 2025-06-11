function showForm(form) {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const loginTab = document.getElementById("loginTab");
    const registerTab = document.getElementById("registerTab");
  
    // Hide both forms and deactivate tabs
    loginForm.classList.add("hidden");
    registerForm.classList.add("hidden");
    loginTab.classList.remove("active");
    registerTab.classList.remove("active");
  
    if (form === "login") {
      loginForm.classList.remove("hidden");
      loginTab.classList.add("active");
    } else {
      registerForm.classList.remove("hidden");
      registerTab.classList.add("active");
    }
  }
  
  // Show login by default on page load
  document.addEventListener("DOMContentLoaded", () => {
    showForm("login");
  
    // Handle register form submission
    document.getElementById("registerForm").addEventListener("submit", function (e) {
      e.preventDefault(); // Prevent actual form submission
  
      const inputs = this.querySelectorAll("input");
      const username = inputs[0].value.trim();
      const email = inputs[1].value.trim();
      const password = inputs[2].value;
      const confirmPassword = inputs[3].value;
      const termsAccepted = inputs[4].checked;
  
      if (!username || !email || !password || !confirmPassword) {
        alert("Please fill in all fields.");
        return;
      }
  
      if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }
  
      if (!termsAccepted) {
        alert("You must accept the terms & conditions.");
        return;
      }
  
      // Success message (you can replace this with real backend code later)
      alert("Registration successful!");
    });
  
    // Handle login form submission
    document.getElementById("loginForm").addEventListener("submit", function (e) {
      e.preventDefault(); // Prevent actual form submission
  
      const inputs = this.querySelectorAll("input");
      const emailOrUsername = inputs[0].value.trim();
      const password = inputs[1].value;
  
      if (!emailOrUsername || !password) {
        alert("Please enter your email/username and password.");
        return;
      }
  
      // Success message (replace with actual backend logic later)
      alert("Login successful!");
    });
  });
  