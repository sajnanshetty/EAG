document.addEventListener('DOMContentLoaded', function() {
  const summarizeButton = document.getElementById('summarize');
  const loadingDiv = document.getElementById('loading');
  const summaryDiv = document.getElementById('summary');

  summarizeButton.addEventListener('click', async () => {
    try {
      // Show loading state
      loadingDiv.style.display = 'block';
      summaryDiv.textContent = 'Starting summarization process...';
      summarizeButton.disabled = true;

      // Get the active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      console.log('Active tab:', tab);

      // Extract content directly using executeScript
      console.log('Extracting page content...');
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          // Remove unwanted elements
          const elementsToRemove = document.querySelectorAll('script, style, nav, header, footer, iframe, noscript');
          elementsToRemove.forEach(element => element.remove());
          
          // Get the main content
          const content = document.body.innerText;
          
          // Clean up the content
          return content
            .replace(/\s+/g, ' ')
            .trim()
            .substring(0, 4000);
        }
      });

      if (!results || !results[0] || !results[0].result) {
        throw new Error('Failed to extract page content');
      }

      const content = results[0].result;
      console.log('Content extracted successfully, length:', content.length);
      summaryDiv.textContent = 'Content extracted, sending to AI for processing...';

      // Send content to background script for AI processing
      console.log('Sending content to background script...');
      const result = await chrome.runtime.sendMessage({
        action: 'summarize',
        content: content
      });
      console.log('Background script response:', result);

      // Display the summary or error message
      if (result.success) {
        summaryDiv.textContent = result.summary;
      } else {
        const errorMessage = result.error || 'Unknown error occurred';
        summaryDiv.textContent = `Error: ${errorMessage}`;
        console.error('Error details:', errorMessage);
      }
    } catch (error) {
      const errorMessage = error.message || 'Could not generate summary. Please try again.';
      summaryDiv.textContent = `Error: ${errorMessage}`;
      console.error('Detailed error:', error);
    } finally {
      // Hide loading state
      loadingDiv.style.display = 'none';
      summarizeButton.disabled = false;
    }
  });
}); 