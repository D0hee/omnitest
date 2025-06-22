// src/main.js

import { createClient } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';
import { formatFileSize, formatDate } from './utils';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
});

// Set up event listeners for user interactions
function setupEventListeners() {
    document.getElementById('uploadBtn').addEventListener('click', handleFileUpload);
    document.getElementById('downloadBtn').addEventListener('click', handleFileDownload);
}

// Handle file upload
async function handleFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select a file to upload.');
        return;
    }

    const { data, error } = await supabase.storage.from('uploads').upload(file.name, file);

    if (error) {
        alert('Error uploading file: ' + error.message);
    } else {
        alert('File uploaded successfully: ' + data.Key);
    }
}

// Handle file download
async function handleFileDownload() {
    const fileId = document.getElementById('fileIdInput').value.trim();

    if (!fileId) {
        alert('Please enter a file ID to download.');
        return;
    }

    const { data, error } = await supabase.storage.from('uploads').download(fileId);

    if (error) {
        alert('Error downloading file: ' + error.message);
    } else {
        const url = URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileId;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}