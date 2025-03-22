// Function to extract main content from the page
function extractContent() {
  // Try to find the main content area
  const mainContent = document.querySelector('main, article, .content, #content, .main-content, #main-content');
  
  if (mainContent) {
    return cleanContent(mainContent.innerText);
  }
  
  // If no main content area found, get all text content
  return cleanContent(document.body.innerText);
}

// Clean up the content
function cleanContent(content) {
  return content
    .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
    .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
    .trim();              // Remove leading/trailing whitespace
}

// Initialize content script
function initialize() {
  console.log('Content script initialized');
  
  // Listen for messages from the popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getContent') {
      try {
        const content = extractContent();
        
        if (!content) {
          sendResponse({ error: 'No content found on page' });
          return;
        }
        
        sendResponse({ content });
      } catch (error) {
        console.error('Error extracting content:', error);
        sendResponse({ error: error.message });
      }
    }
    return true; // Will respond asynchronously
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
} 