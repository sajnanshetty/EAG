// Function to extract main content from the page
function extractContent() {
  // Try to find the main content area
  const mainContent = document.querySelector('main, article, .content, #content, .main-content, #main-content');
  
  if (mainContent) {
    return mainContent.innerText;
  }
  
  // If no main content area found, get all text content
  const body = document.body;
  const scripts = body.getElementsByTagName('script');
  const styles = body.getElementsByTagName('style');
  
  // Remove scripts and styles
  Array.from(scripts).forEach(script => script.remove());
  Array.from(styles).forEach(style => style.remove());
  
  // Get text content
  let content = body.innerText;
  
  // Clean up the content
  content = content
    .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
    .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
    .trim();              // Remove leading/trailing whitespace
    
  return content;
}

// Initialize content script
function initialize() {
  console.log('Content script initialized');
  
  // Listen for messages from the popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Content script received message:', request);
    
    if (request.action === 'getContent') {
      try {
        const content = extractContent();
        console.log('Content extracted successfully');
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