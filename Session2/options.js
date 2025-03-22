// Import the config module
import config from './config.js';

// Load saved API key when options page opens
document.addEventListener('DOMContentLoaded', async () => {
    const apiKey = await config.getApiKey();
    document.getElementById('apiKey').value = apiKey;
});

// Save API key when save button is clicked
document.getElementById('save').addEventListener('click', async () => {
    const apiKey = document.getElementById('apiKey').value.trim();
    const status = document.getElementById('status');
    
    // Validate API key format
    if (!apiKey.startsWith('AI')) {
        status.textContent = 'Error: API key should start with "AI"';
        status.className = 'status error';
        status.style.display = 'block';
        return;
    }

    try {
        await config.setApiKey(apiKey);
        status.textContent = 'API key saved successfully!';
        status.className = 'status success';
    } catch (error) {
        status.textContent = 'Error saving API key: ' + error.message;
        status.className = 'status error';
    }
    status.style.display = 'block';
    
    // Hide status message after 3 seconds
    setTimeout(() => {
        status.style.display = 'none';
    }, 3000);
}); 