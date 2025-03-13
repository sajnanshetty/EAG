document.addEventListener('DOMContentLoaded', function() {
  const summarizeButton = document.getElementById('summarize');
  const loadingDiv = document.getElementById('loading');
  const summaryDiv = document.getElementById('summary');

  summarizeButton.addEventListener('click', async () => {
    try {
      // Show loading state
      loadingDiv.style.display = 'block';
      summaryDiv.textContent = '';
      summarizeButton.disabled = true;

      // Get the active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      // Send message to content script to get page content
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'getPageContent' });

      // Send content to background script for AI processing
      const summary = await chrome.runtime.sendMessage({
        action: 'summarize',
        content: response.content
      });

      // Display the summary
      summaryDiv.textContent = summary;
    } catch (error) {
      summaryDiv.textContent = 'Error: Could not generate summary. Please try again.';
      console.error('Error:', error);
    } finally {
      // Hide loading state
      loadingDiv.style.display = 'none';
      summarizeButton.disabled = false;
    }
  });
}); 