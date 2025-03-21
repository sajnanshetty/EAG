// Configuration
const config = {
    GEMINI_API_KEY: 'AIzaSyD5NS2L_BRhfOIvJgPZQKnG7KWcKhHzwbg'
};

// Function to call Gemini API
async function summarizeContent(content) {
  try {
    if (!content || content.trim().length === 0) {
      throw new Error('No content provided for summarization');
    }

    if (!config || !config.GEMINI_API_KEY) {
      throw new Error('Configuration not loaded. Please reload the extension.');
    }

    // Log API key (first few characters only for security)
    const apiKey = config.GEMINI_API_KEY.trim();
    console.log('API Key format check:', {
      length: apiKey.length,
      startsWith: apiKey.startsWith('AI'),
      firstChars: apiKey.substring(0, 4)
    });

    if (!apiKey.startsWith('AI')) {
      throw new Error('Invalid API key format. Gemini API keys should start with "AI"');
    }

    console.log('Sending request to Gemini API...');
    console.log('Content length:', content.length);

    // Prepare the request body for Gemini
    const requestBody = {
      contents: [{
        parts: [{
          text: `Please provide a concise summary of the following content in 2-3 paragraphs:\n\n${content}`
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 800,
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

    console.log('Request body prepared');

    // Add timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

    try {
      console.log('Making API request...');
      const headers = {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      };
      console.log('Request headers:', {
        ...headers,
        'x-goog-api-key': apiKey.substring(0, 4) + '...'
      });

      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent',
        {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(requestBody),
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Received non-JSON response:', text.substring(0, 500));
        throw new Error('Received invalid response format from API');
      }

      const responseData = await response.json();
      console.log('Response data:', JSON.stringify(responseData, null, 2));

      if (!response.ok) {
        const errorMessage = responseData.error?.message || response.statusText;
        console.error('API Error:', errorMessage);
        throw new Error(`API Error: ${errorMessage}`);
      }

      if (!responseData.candidates || !responseData.candidates[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response format from Gemini API');
      }

      // Post-process the summary to improve readability
      let summary = responseData.candidates[0].content.parts[0].text;
      
      // Ensure proper sentence spacing
      summary = summary.replace(/([.!?])\s*([A-Z])/g, '$1\n\n$2');
      
      // Remove any excessive whitespace
      summary = summary.replace(/\s+/g, ' ').trim();
      
      // Ensure proper paragraph breaks
      summary = summary.split('\n\n').map(para => para.trim()).join('\n\n');

      return summary;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out after 60 seconds');
      }
      throw error;
    }
  } catch (error) {
    console.error('Detailed error in summarizeContent:', error);
    throw error;
  }
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background script received message:', request);
  
  if (request.action === 'summarize') {
    console.log('Processing summarize request');
    console.log('Content length:', request.content?.length || 0);
    
    summarizeContent(request.content)
      .then(summary => {
        console.log('Summary generated successfully');
        sendResponse({ success: true, summary });
      })
      .catch(error => {
        console.error('Error in message listener:', error);
        sendResponse({ 
          success: false, 
          error: error.message || 'Failed to generate summary. Please try again.' 
        });
      });
    return true; // Will respond asynchronously
  }
}); 