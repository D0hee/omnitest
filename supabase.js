// Auth Functions
async function signUp(email, password, username) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username }
    }
  });
  if (error) throw error;
  return data;
}

async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  return data;
}

async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// File Functions
async function uploadFile(file, expiryMinutes) {
  const token = crypto.randomUUID();
  const expiry = new Date(Date.now() + expiryMinutes * 60000);
  
  // Upload to storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('files')
    .upload(token, file);
  
  if (uploadError) throw uploadError;

  // Save to database
  const { error: dbError } = await supabase
    .from('files')
    .insert({
      user_id: supabase.auth.user().id,
      original_name: file.name,
      storage_path: uploadData.path,
      token,
      expires_at: expiry
    });
  
  if (dbError) throw dbError;
  
  return `${window.location.origin}/download.html?token=${token}`;
}

async function downloadFile(token) {
  const { data: fileData, error: fileError } = await supabase
    .from('files')
    .select()
    .eq('token', token)
    .single();
  
  if (fileError || !fileData) throw new Error('File not found');
  if (new Date(fileData.expires_at) < new Date()) throw new Error('File expired');

  // Get download URL
  const { data: urlData } = supabase.storage
    .from('files')
    .getPublicUrl(fileData.storage_path);
  
  return {
    url: urlData.publicUrl,
    name: fileData.original_name
  };
}