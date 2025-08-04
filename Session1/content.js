// Function to extract main content from the page
function extractPageContent() {
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

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPageContent') {
    try {
      const content = extractPageContent();
      sendResponse({ content });
    } catch (error) {
      sendResponse({ error: error.message });
    }
  }
  return true;
}); 