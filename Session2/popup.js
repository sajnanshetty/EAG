import { GEMINI_API_KEY } from './config.js';

document.addEventListener('DOMContentLoaded', async function() {
  const summarizeButton = document.getElementById('summarize');
  const summaryDiv = document.getElementById('summary');
  const loadingDiv = document.getElementById('loading');
  const errorDiv = document.getElementById('error');

  // Function to establish connection with background script
  function connectToBackground() {
    const port = chrome.runtime.connect({ name: "popup" });
    
    // Listen for messages from background script
    port.onMessage.addListener((response) => {
      if (response.type === 'summary') {
        if (response.success) {
          summaryDiv.textContent = response.summary;
        } else {
          errorDiv.textContent = response.error;
          errorDiv.style.display = 'block';
        }
        summarizeButton.disabled = false;
        loadingDiv.style.display = 'none';
      }
    });

    // Handle disconnection
    port.onDisconnect.addListener(() => {
      console.log('Port disconnected, will reconnect when needed');
    });

    return port;
  }

  summarizeButton.addEventListener('click', async function() {
    try {
      // Reset UI
      summarizeButton.disabled = true;
      loadingDiv.style.display = 'block';
      errorDiv.style.display = 'none';
      summaryDiv.textContent = '';

      // Get the active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab) {
        throw new Error('No active tab found');
      }

      // First, try to send message to existing content script
      try {
        const response = await chrome.tabs.sendMessage(tab.id, { action: 'getContent' });
        if (response && response.content) {
          // Content script is already loaded and working
          // Create new port connection for this operation
          const port = connectToBackground();
          port.postMessage({
            action: 'summarize',
            content: response.content
          });
          return;
        }
      } catch (error) {
        console.log('Content script not loaded, injecting...', error);
      }

      // If we get here, content script wasn't loaded or didn't respond
      // Inject the content script
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });

      // Wait for content script to initialize
      await new Promise(resolve => setTimeout(resolve, 500));

      // Try sending message again
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'getContent' });
      if (!response || !response.content) {
        throw new Error('Could not extract content from the page');
      }

      // Create new port connection for this operation
      const port = connectToBackground();
      port.postMessage({
        action: 'summarize',
        content: response.content
      });
    } catch (error) {
      console.error('Error:', error);
      errorDiv.textContent = error.message;
      errorDiv.style.display = 'block';
      summarizeButton.disabled = false;
      loadingDiv.style.display = 'none';
    }
  });
}); 