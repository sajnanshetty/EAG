import { GEMINI_API_KEY } from './config.js';

// Store active connections
const connections = new Map();

// Listen for connection attempts from the popup
chrome.runtime.onConnect.addListener(function(port) {
  if (port.name === "popup") {
    // Add this connection to our map
    const tabId = port.sender?.tab?.id || 'popup';
    connections.set(tabId, port);
    
    // Listen for disconnection
    port.onDisconnect.addListener(function() {
      connections.delete(tabId);
    });

    // Listen for messages from the popup
    port.onMessage.addListener(async function(request) {
      if (request.action === 'summarize') {
        try {
          const summary = await summarizeContent(request.content);
          // Check if port is still connected before sending
          if (port.onMessage) {
            port.postMessage({
              type: 'summary',
              success: true,
              summary: summary
            });
          }
        } catch (error) {
          console.error('Summarization error:', error);
          // Check if port is still connected before sending
          if (port.onMessage) {
            port.postMessage({
              type: 'summary',
              success: false,
              error: error.message
            });
          }
        }
      }
    });
  }
});

async function summarizeContent(content) {
  // Validate API key
  if (!GEMINI_API_KEY) {
    throw new Error('Please check your API key in config.js');
  }

  if (!GEMINI_API_KEY.startsWith('AI')) {
    throw new Error('Invalid API key format. Key should start with "AI"');
  }

  console.log('API Key format check:', {
    length: GEMINI_API_KEY.length,
    startsWithAI: GEMINI_API_KEY.startsWith('AI')
  });

  const requestBody = {
    contents: [{
      parts: [{
        text: `Please provide a concise summary of the following text in 2-3 sentences:\n\n${content}`
      }]
    }],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      }
    ]
  };

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY
        },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API request failed: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No summary generated');
    }

    const summary = data.candidates[0].content.parts[0].text;
    return summary.trim();

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error(`Failed to generate summary: ${error.message}`);
  }
} 