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

    // Add this after the logout function
// Add this after the logout function
async function handleFileUpload() {
  const fileInput = document.getElementById('fileInput');
  const expirySelect = document.getElementById('expiry');
  const file = fileInput.files[0];
  const expiryMinutes = parseInt(expirySelect.value);
  
  if (!file) return;

  try {
    // Generate unique filename
    const fileName = `${Date.now()}_${file.name}`;
    
    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('files')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('files')
      .getPublicUrl(fileName);

    // Save metadata
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + expiryMinutes);
    
    await supabase.from('files').insert({
      file_name: file.name,
      file_size: file.size,
      file_path: fileName,
      download_url: publicUrl,
      expires_at: expiresAt.toISOString()
    });

    // Update UI
    document.getElementById('fileLink').value = publicUrl;
    document.getElementById('linkContainer').style.display = 'flex';
    document.getElementById('uploadMessage').style.display = 'block';
  } catch (error) {
    console.error("Upload failed:", error);
    alert("Upload failed: " + error.message);
  }
}

// Update the event listener
document.addEventListener("DOMContentLoaded", function() {
  const fileInput = document.getElementById('fileInput');
  if (fileInput) {
    fileInput.addEventListener('change', handleFileUpload);
  }
});

// Add this after the upload function
async function downloadFile() {
  const url = document.getElementById('downloadLink').value;
  const filePath = url.split('/').pop();

  try {
    const { data: { publicUrl } } = supabase.storage
      .from('files')
      .getPublicUrl(filePath);

    // Create temporary download link
    const a = document.createElement('a');
    a.href = publicUrl;
    a.download = '';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error("Download failed:", error);
    alert("Download failed: " + error.message);
  }
}

});
  