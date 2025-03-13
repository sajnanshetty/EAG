// Test function to verify content extraction
function testContentExtraction() {
    console.log('Testing content extraction...');
    const content = document.body.innerText;
    console.log('Content length:', content.length);
    return content.length > 0;
}

// Test function to verify message handling
function testMessageHandling() {
    console.log('Testing message handling...');
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: 'getPageContent' }, (response) => {
            console.log('Message response:', response);
            resolve(response && response.content);
        });
    });
}

// Run tests
async function runTests() {
    console.log('Starting extension tests...');
    
    // Test content extraction
    const contentTest = testContentExtraction();
    console.log('Content extraction test:', contentTest ? 'Passed' : 'Failed');
    
    // Test message handling
    try {
        const messageTest = await testMessageHandling();
        console.log('Message handling test:', messageTest ? 'Passed' : 'Failed');
    } catch (error) {
        console.error('Message handling test failed:', error);
    }
}

// Run tests when the page loads
document.addEventListener('DOMContentLoaded', runTests); 