// This file contains utility functions for the application.

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to format file size
export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Function to format date
export function formatDate(date) {
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
}

// Function to upload a file to Supabase
export async function uploadFile(file) {
    const { data, error } = await supabase.storage.from('your-bucket-name').upload(`uploads/${file.name}`, file);
    if (error) {
        throw new Error(error.message);
    }
    return data;
}

// Function to fetch files from Supabase
export async function fetchFiles() {
    const { data, error } = await supabase.storage.from('your-bucket-name').list('uploads');
    if (error) {
        throw new Error(error.message);
    }
    return data;
}