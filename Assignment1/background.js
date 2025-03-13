import config from './config.js';

// Function to call OpenAI API
async function summarizeContent(content) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that creates concise summaries of web pages. Focus on the main points and key information.'
          },
          {
            role: 'user',
            content: `Please summarize the following content in 2-3 paragraphs:\n\n${content}`
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'summarize') {
    summarizeContent(request.content)
      .then(summary => sendResponse(summary))
      .catch(error => sendResponse('Error: Could not generate summary. Please try again.'));
    return true; // Will respond asynchronously
  }
}); 