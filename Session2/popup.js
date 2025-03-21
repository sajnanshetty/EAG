document.addEventListener('DOMContentLoaded', function() {
  const summarizeButton = document.getElementById('summarize');
  const summaryDiv = document.getElementById('summary');
  const loadingDiv = document.getElementById('loading');
  const errorDiv = document.getElementById('error');

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
          await handleContent(response.content);
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

      await handleContent(response.content);
    } catch (error) {
      console.error('Error:', error);
      errorDiv.textContent = error.message;
      errorDiv.style.display = 'block';
    } finally {
      summarizeButton.disabled = false;
      loadingDiv.style.display = 'none';
    }
  });

  // Helper function to handle content and get summary
  async function handleContent(content) {
    // Send message to background script for summarization
    const summaryResponse = await chrome.runtime.sendMessage({
      action: 'summarize',
      content: content
    });

    if (!summaryResponse.success) {
      throw new Error(summaryResponse.error || 'Failed to generate summary');
    }

    // Display the summary
    summaryDiv.textContent = summaryResponse.summary;
  }
}); 