// main.js
import { supabase } from './supabaseClient.js'

// Initialize Supabase
export async function initApp() {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    document.getElementById('authSection').classList.add('hidden');
    document.getElementById('fileSection').classList.remove('hidden');
    loadUserProfile();
  } else {
    showForm('login');
  }
  
  setupEventListeners();
}

// Form display function
export function showForm(form) {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const loginTab = document.getElementById("loginTab");
  const registerTab = document.getElementById("registerTab");
  const container = document.querySelector(".container");

  loginForm.classList.add("hidden");
  registerForm.classList.add("hidden");
  loginTab.classList.remove("active");
  registerTab.classList.remove("active");
  container?.classList.remove("active-form");

  if (form === "login") {
    loginForm.classList.remove("hidden");
    loginTab.classList.add("active");
  } else {
    registerForm.classList.remove("hidden");
    registerTab.classList.add("active");
  }

  container?.classList.add("active-form");
}

// Auth functions
export async function login(event) {
  event.preventDefault();
  
  const email = document.querySelector('#loginForm input[type="text"]').value;
  const password = document.querySelector('#loginForm input[type="password"]').value;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert(`Login failed: ${error.message}`);
  } else {
    document.getElementById('authSection').classList.add('hidden');
    document.getElementById('fileSection').classList.remove('hidden');
  }
}

export async function register(event) {
  event.preventDefault();
  
  const username = document.querySelector('#registerForm input[placeholder="Username"]').value;
  const email = document.querySelector('#registerForm input[placeholder="Email"]').value;
  const password = document.querySelector('#registerForm input[type="password"]').value;
  const confirmPassword = document.querySelector('#registerForm input[type="password"] + input[type="password"]').value;

  if (password !== confirmPassword) {
    alert("Passwords don't match");
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username }
    }
  });

  if (error) {
    alert(`Registration failed: ${error.message}`);
  } else {
    // Create profile after registration
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      username: username
    });

  if (profileError) {
      console.error("Profile creation error:", profileError);
    }

    alert('Registration successful! Check your email for confirmation.');
    showForm('login');
  }
}

  const { error: profileError } = await supabase.from('profiles').insert({
  id: data.user.id,
  username: username,
  storage_used: 0,
  files_uploaded: 0
});

  alert('Registration successful! Check your email for confirmation.');
  showForm('login');

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    alert("Logout error: " + error.message);
  } else {
    document.getElementById('fileSection').classList.add('hidden');
    document.getElementById('authSection').classList.remove('hidden');
    showForm('login');
  }
}

// File functions with validation
export async function handleFileUpload(e) {
  const file = e.target.files[0];

  if (!file) return;

  // File validation
  if (file.size > 10 * 1024 * 1024) {
    alert('File size exceeds 10MB limit');
    e.target.value = '';
    return;
  }

  const allowedTypes = ['image/jpeg', 'application/pdf', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    alert('File type not allowed. Only images and PDFs are supported.');
    e.target.value = '';
    return;
  }

  async function updateStorageUsage(fileSize) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    const { error } = await supabase.rpc('increment_usage', {
      user_id: user.id,
      file_size: fileSize
    });
    
    if (error) {
      console.error("Storage update failed:", error);
    } else {
      loadUserProfile(); // Refresh storage display
    }
  }
}

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    alert('Please login to upload files');
    return;
  }

  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}/${Date.now()}.${fileExt}`;
  
  // Set expiration time
  const expirySelect = document.getElementById('expiry');
  const expiryMinutes = parseInt(expirySelect.value);
  const expiresAt = new Date(Date.now() + expiryMinutes * 60000);
  await supabase.from('files').insert({
    expires_at: expiresAt.toISOString(),
});
  
  try {
    // Upload to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from('shared_files')
      .upload(fileName, file);
    
    if (uploadError) throw uploadError;

    // Save metadata
    await supabase.from('files').insert([{
      user_id: user.id,
      original_name: file.name,
      storage_path: fileName,
      file_size: file.size,
      mime_type: file.type,
      expires_at: expiresAt.toISOString()
    }]);

    // Generate public URL
    const { data: { publicUrl } } = supabase.storage
      .from('shared_files')
      .getPublicUrl(fileName);
    
    // Update UI
    document.getElementById('fileLink').value = publicUrl;
    document.getElementById('linkContainer').style.display = 'flex';
    document.getElementById('uploadMessage').style.display = 'block';
    
  } catch (error) {
    console.error("Upload failed:", error);
    alert("Upload failed: " + error.message);
  }
}

export async function downloadFile() {
  const url = document.getElementById('downloadLink').value;
  const filePath = url.split('/').pop();
  const { data: fileData } = await supabase
  .from('files')
  .select('*')
  .eq('storage_path', filePath)
  .single();

  try {
    // Get file metadata
    const { data: fileData, error } = await supabase
      .from('files')
      .select('*')
      .eq('share_token', shareToken)
      .single();
    
    if (error || !fileData) throw new Error('File not found');

    // Check expiration
    if (new Date(fileData.expires_at) < new Date()) {
      throw new Error('File has expired');
    }

    // Download file
    const { data, error: downloadError } = await supabase.storage
      .from('shared_files')
      .download(fileData.storage_path);
    
    if (downloadError) throw downloadError;

    // Create download link
    const blobUrl = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = fileData.original_name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
  } catch (error) {
    console.error("Download failed:", error);
    alert("Download failed: " + error.message);
  }
}

export function copyLink() {
  const input = document.getElementById('fileLink');
  input.select();
  input.setSelectionRange(0, 99999);
  document.execCommand('copy');
  alert("Link copied to clipboard!");
}

// Initialize event listeners
export function setupEventListeners() {
  // File input
  const fileInput = document.getElementById('fileInput');
  if (fileInput) {
    fileInput.addEventListener('change', handleFileUpload);
  }
  
  // Download button
  const downloadBtn = document.getElementById('downloadBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', downloadFile);
  }
  
  // Copy button
  const copyBtn = document.getElementById('copyBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', copyLink);
  }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  initApp();

  // Load user profile data
async function loadUserProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('username, storage_used')
    .eq('id', user.id)
    .single();
  
  if (!error && profile) {
    document.getElementById('userProfile').innerText = profile.username;
    document.getElementById('storageUsed').innerText = `${Math.round(profile.storage_used / 1024 / 1024)} MB used`;
  }
}

window.showForm = showForm;
window.login = login;
window.register = register;
window.logout = logout;
window.copyLink = copyLink;

});